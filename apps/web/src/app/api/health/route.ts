import { NextResponse } from 'next/server';
import { HealthResponseSchema, VOEQ_VERSION } from '@voeq/shared';

export const dynamic = 'force-dynamic';

export function GET(): NextResponse {
  const body = HealthResponseSchema.parse({
    status: 'ok',
    service: 'voeq-web',
    version: VOEQ_VERSION,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });

  return NextResponse.json(body);
}
