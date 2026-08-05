import { api } from './api';

export type ReportCategory = 'not_on_campus' | 'scam_or_fraud' | 'inappropriate_content' | 'impersonation' | 'harassment' | 'other';

export async function reportVendor(vendorId: string, input: {
  category: ReportCategory;
  text?: string;
}): Promise<{ report: { id: string } }> {
  return api(`/api/reports/vendor/${vendorId}`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
