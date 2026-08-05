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

export type SignupWithPasswordInput = z.infer<typeof SignupWithPasswordSchema>;
export type VerifyOtpInput = z.infer<typeof VerifyOtpSchema>;
export type SignInWithPasswordInput = z.infer<typeof SignInWithPasswordSchema>;
export type RequestMagicLinkInput = z.infer<typeof RequestMagicLinkSchema>;
export type AcceptAgreementInput = z.infer<typeof AcceptAgreementSchema>;
export type SelectCampusInput = z.infer<typeof SelectCampusSchema>;
