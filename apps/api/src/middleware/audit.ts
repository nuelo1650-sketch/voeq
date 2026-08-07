import type { Response, NextFunction } from 'express';
import { prisma } from '../lib/db';
import { getClientIp } from '../utils/ip';
import type { AdminRequest } from './admin';

export interface AuditOptions {
  action: string;
  targetType: string;
  getTargetId?: (req: AdminRequest) => string | undefined;
  getMetadata?: (req: AdminRequest) => Record<string, unknown>;
}

export function audit(options: AuditOptions) {
  return async (req: AdminRequest, _res: Response, next: NextFunction): Promise<void> => {
    (req as unknown as Record<string, AuditOptions>).auditOptions = options;
    next();
  };
}

export async function logAdminAction(
  req: AdminRequest,
  action: string,
  targetType: string,
  targetId: string | undefined,
  metadata: Record<string, unknown> = {},
): Promise<void> {
  if (!req.userId) return;

  await prisma.auditLog.create({
    data: {
      actorUserId: req.impersonatedBy ?? req.userId,
      action,
      targetType,
      targetId,
      metadata: {
        ...metadata,
        impersonatedBy: req.impersonatedBy ?? null,
      },
      ipAddress: getClientIp(req),
      userAgent: typeof req.headers['user-agent'] === 'string' ? (req.headers['user-agent'] as string) : undefined,
    },
  });
}
