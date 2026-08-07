import { prisma } from '../lib/db';
import type { ReportCategory } from '@prisma/client';

const REPORT_THRESHOLD = 3;
const REPORT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

export async function createReport(
  submitterId: string,
  vendorId: string,
  input: { category: string; text?: string },
): Promise<{ report: { id: string } }> {
  const report = await prisma.report.create({
    data: {
      submitterId,
      targetId: vendorId,
      category: input.category as ReportCategory,
      text: input.text,
      status: 'open',
    },
  });

  const recentReports = await prisma.report.count({
    where: {
      targetId: vendorId,
      status: 'open',
      createdAt: { gte: new Date(Date.now() - REPORT_WINDOW_MS) },
    },
  });

  if (recentReports >= REPORT_THRESHOLD) {
    await prisma.vendor.update({
      where: { id: vendorId },
      data: { status: 'pending_review' },
    });
  }

  return { report: { id: report.id } };
}

export async function markReportFalse(reportId: string, adminId: string): Promise<void> {
  await prisma.report.update({
    where: { id: reportId },
    data: {
      status: 'dismissed',
      resolvedAt: new Date(),
      resolvedBy: adminId,
    },
  });
}
