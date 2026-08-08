import { z } from 'zod';

export const CreateVendorSchema = z.object({
  businessName: z.string().min(3).max(100).optional(),
  ownerName: z.string().min(1).max(100).optional(),
  description: z.string().min(100).max(500).optional(),
  whatsappNumber: z.string().regex(/^\+?[1-9]\d{6,14}$/, 'Invalid phone number (E.164 format)').optional(),
  publicPhone: z.string().regex(/^\+?[1-9]\d{6,14}$/).optional().nullable(),
  institutionId: z.string().min(1).optional(),
  campusId: z.string().min(1).optional(),
  profilePhotoPublicId: z.string().optional().nullable(),
  profilePhotoUrl: z.string().url().optional().nullable(),
  operatingHours: z.any().optional().nullable(),
  isAlwaysOpen: z.boolean().optional().nullable(),
  timezone: z.string().optional().nullable(),
  instagramHandle: z.string().max(50).optional().nullable(),
  tiktokHandle: z.string().max(50).optional().nullable(),
  twitterHandle: z.string().max(50).optional().nullable(),
  facebookPage: z.string().url().max(200).optional().nullable(),
  linkedinProfile: z.string().url().max(200).optional().nullable(),
  websiteUrl: z.string().url().max(200).optional().nullable(),
});

export const UpdateVendorSchema = CreateVendorSchema.partial();

export const CreateListingSchema = z.object({
  categoryId: z.string().min(1),
  title: z.string().min(3).max(60),
  description: z.string().min(50).max(500),
  priceMin: z.coerce.number().nonnegative(),
  priceMax: z.coerce.number().nonnegative().optional().nullable(),
  section: z.string().max(50).optional().nullable(),
  photos: z.array(
    z.object({
      publicId: z.string(),
      url: z.string().url(),
      width: z.number().int().positive(),
      height: z.number().int().positive(),
      altText: z.string().max(200).optional().nullable(),
      displayOrder: z.number().int().nonnegative(),
    }),
  ).min(1).max(8),
});

export const UpdateListingSchema = CreateListingSchema.partial();

export const AcceptVendorAgreementSchema = z.object({
  version: z.string().min(1),
});

export const SaveDraftSchema = z.object({
  data: z.record(z.unknown()),
});

export type CreateVendorInput = z.infer<typeof CreateVendorSchema>;
export type UpdateVendorInput = z.infer<typeof UpdateVendorSchema>;
export type CreateListingInput = z.infer<typeof CreateListingSchema>;
export type UpdateListingInput = z.infer<typeof UpdateListingSchema>;
