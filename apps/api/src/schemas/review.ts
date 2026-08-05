import { z } from 'zod';

export const CreateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  text: z.string().min(20, 'At least 20 characters').max(500),
  listingId: z.string().min(1).optional(),
});

export const UpdateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  text: z.string().min(20).max(500).optional(),
});

export const CreateVendorResponseSchema = z.object({
  text: z.string().min(20).max(500),
});

export const UpdateVendorResponseSchema = z.object({
  text: z.string().min(20).max(500),
});

export const CreateReportSchema = z.object({
  category: z.enum(['not_on_campus', 'scam_or_fraud', 'inappropriate_content', 'impersonation', 'harassment', 'other']),
  text: z.string().max(500).optional(),
});

export type CreateReviewInput = z.infer<typeof CreateReviewSchema>;
export type UpdateReviewInput = z.infer<typeof UpdateReviewSchema>;
export type CreateVendorResponseInput = z.infer<typeof CreateVendorResponseSchema>;
export type UpdateVendorResponseInput = z.infer<typeof UpdateVendorResponseSchema>;
export type CreateReportInput = z.infer<typeof CreateReportSchema>;
