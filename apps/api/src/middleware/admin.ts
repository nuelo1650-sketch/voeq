import type { Request, Response, NextFunction } from 'express';
import { jwtVerify } from 'jose';
import { prisma } from '../lib/db';
import { env } from '../config/env';
import { logAdminAction } from './audit';

const secret = new TextEncoder().encode(env.AUTH_SECRET);

export interface AdminRequest extends Request {
  userId?: string;
  userRole?: string;
  userStatus?: string;
  impersonatedBy?: string;
}

/**
 * Capability matrix. Least-privilege by default:
 *  - super_admin: everything, including managing staff and true erasure.
 *  - admin: broad moderation/management, but cannot manage other staff or erase accounts.
 *  - moderator: scoped content/user moderation only (suspend/ban, verify, resolve reports), no destructive or staffing powers.
 */
export const PERMISSIONS: Record<string, string[]> = {
  super_admin: ['*'],
  admin: [
    'user.moderate',
    'user.ban',
    'vendor.moderate',
    'vendor.verify',
    'vendor.feature',
    'listing.moderate',
    'institution.moderate',
    'campus.moderate',
    'category.moderate',
    'report.moderate',
    'review.moderate',
    'featured.moderate',
    'press.moderate',
    'email.send',
    'settings.manage',
    'analytics.view',
    'audit.view',
    'impersonate',
  ],
  moderator: [
    'user.moderate',
    'user.ban',
    'vendor.moderate',
    'vendor.verify',
    'listing.moderate',
    'report.moderate',
    'review.moderate',
  ],
};

const STAFF_ROLES = new Set(['admin', 'moderator', 'super_admin']);

function hasPermission(role: string | undefined, permission: string): boolean {
  if (!role) return false;
  const grants = PERMISSIONS[role];
  if (!grants) return false;
  return grants.includes('*') || grants.includes(permission);
}

async function resolveActor(req: AdminRequest, res: Response): Promise<boolean> {
  const token = req.cookies?.['voeq_session'];
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    if (typeof payload.sub !== 'string') {
      res.status(401).json({ error: 'Unauthorized' });
      return false;
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, role: true, status: true },
    });

    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return false;
    }

    if (user.status === 'banned') {
      res.status(403).json({ error: 'Banned', message: 'This account has been banned.' });
      return false;
    }
    if (user.status === 'suspended') {
      res.status(403).json({ error: 'Suspended', message: 'This account is suspended.' });
      return false;
    }

    if (!STAFF_ROLES.has(user.role)) {
      res.status(403).json({ error: 'Forbidden', message: 'Admin access required' });
      return false;
    }

    req.userId = user.id;
    req.userRole = user.role;
    req.userStatus = user.status;
    if (typeof payload.impersonatedBy === 'string') {
      req.impersonatedBy = payload.impersonatedBy;
    }
    return true;
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
}

/** Any authenticated staff member (admin, moderator, super_admin). */
export async function requireAdmin(req: AdminRequest, res: Response, next: NextFunction): Promise<void> {
  if (!(await resolveActor(req, res))) return;
  await logAdminAction(req, 'admin.accessed', 'admin', undefined, { path: req.path, method: req.method });
  next();
}

/** Moderator OR admin OR super_admin. */
export async function requireModerator(req: AdminRequest, res: Response, next: NextFunction): Promise<void> {
  if (!(await resolveActor(req, res))) return;
  await logAdminAction(req, 'admin.accessed', 'admin', undefined, { path: req.path, method: req.method });
  next();
}

/** Super-admin only. */
export function requireSuperAdmin(req: AdminRequest, res: Response, next: NextFunction): void {
  if (req.userRole !== 'super_admin') {
    res.status(403).json({ error: 'Forbidden', message: 'Super-admin access required' });
    return;
  }
  next();
}

/** Capability-gated guard. Usage: requirePermission('user.ban'). */
export function requirePermission(permission: string) {
  return async (req: AdminRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!(await resolveActor(req, res))) return;
    if (!hasPermission(req.userRole, permission)) {
      res.status(403).json({ error: 'Forbidden', message: `Missing permission: ${permission}` });
      return;
    }
    await logAdminAction(req, 'admin.accessed', 'admin', undefined, { path: req.path, method: req.method, permission });
    next();
  };
}

/** Helper for handlers to check permission inline (post-guard). */
export function can(req: AdminRequest, permission: string): boolean {
  return hasPermission(req.userRole, permission);
}

/** True if the actor may act on a target user (protects staff from lower-ranked actors). */
export function canActOnUser(actorRole: string | undefined, targetRole: string | undefined): boolean {
  if (actorRole === 'super_admin') return true;
  if (actorRole === 'admin') return targetRole !== 'admin' && targetRole !== 'super_admin';
  // moderators cannot act on other staff
  return !targetRole || (targetRole !== 'admin' && targetRole !== 'super_admin' && targetRole !== 'moderator');
}
