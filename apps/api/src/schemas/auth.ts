import { z } from 'zod';

export const SignupWithPasswordSchema = z.object({
  email: z.string().email().toLowerCase(),
  name: z.string().min(1).max(100),
  password: z.string().min(8).max(128),
});

export const VerifyOtpSchema = z.object({
  email: z.string().email().toLowerCase(),
  otp: z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
});

export const SignInWithPasswordSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(1),
});

export const RequestMagicLinkSchema = z.object({
  email: z.string().email().toLowerCase(),
});

export const AcceptAgreementSchema = z.object({
  version: z.string().min(1),
});

export const SelectCampusSchema = z.object({
  campusId: z.string().min(1),
});

export const RequestPasswordResetSchema = z.object({
  email: z.string().email().toLowerCase(),
});

export const ConsumePasswordResetSchema = z.object({
  token: z.string().min(1),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128)
    .regex(/[A-Za-z]/, 'Password must contain a letter')
    .regex(/[0-9]/, 'Password must contain a number'),
});

export type SignupWithPasswordInput = z.infer<typeof SignupWithPasswordSchema>;
export type VerifyOtpInput = z.infer<typeof VerifyOtpSchema>;
export type SignInWithPasswordInput = z.infer<typeof SignInWithPasswordSchema>;
export type RequestMagicLinkInput = z.infer<typeof RequestMagicLinkSchema>;
export type AcceptAgreementInput = z.infer<typeof AcceptAgreementSchema>;
export type SelectCampusInput = z.infer<typeof SelectCampusSchema>;
export type RequestPasswordResetInput = z.infer<typeof RequestPasswordResetSchema>;
export type ConsumePasswordResetInput = z.infer<typeof ConsumePasswordResetSchema>;
