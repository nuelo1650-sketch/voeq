import type { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

interface TurnstileResponse {
  success: boolean;
  'error-codes'?: string[];
}

export async function verifyTurnstile(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (env.NODE_ENV !== 'production' || !env.TURNSTILE_SECRET_KEY) {
    next();
    return;
  }

  const token = req.body?.turnstileToken as string | undefined;
  if (!token) {
    res.status(400).json({ error: 'MissingTurnstileToken' });
    return;
  }

  try {
    const params = new URLSearchParams();
    params.append('secret', env.TURNSTILE_SECRET_KEY);
    params.append('response', token);
    if (req.ip) params.append('remoteip', req.ip);

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data = (await response.json()) as TurnstileResponse;
    if (!data.success) {
      res.status(400).json({ error: 'TurnstileFailed', codes: data['error-codes'] });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
}
