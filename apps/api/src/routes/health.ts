import { Router, type Router as ExpressRouter } from 'express';
import { HealthResponseSchema, VOEQ_VERSION } from '@voeq/shared';
import { API_VERSION } from '../lib/version';

export const healthRouter: ExpressRouter = Router();

healthRouter.get('/', (_req, res) => {
  const body = HealthResponseSchema.parse({
    status: 'ok',
    service: 'voeq-api',
    version: VOEQ_VERSION,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
  res.status(200).json(body);
});

// Also expose under /api/health for parity with frontend route
healthRouter.get('/api/health', (_req, res) => {
  const body = HealthResponseSchema.parse({
    status: 'ok',
    service: 'voeq-api',
    version: VOEQ_VERSION,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
  res.status(200).json(body);
});

// Suppress unused warning for API_VERSION
void API_VERSION;
