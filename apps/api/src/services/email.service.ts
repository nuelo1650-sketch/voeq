import { Resend } from 'resend';
import { env } from '../config/env';
import { logger } from '../config/logger';

const resend = new Resend(env.RESEND_API_KEY);

interface OtpEmailParams {
  to: string;
  otp: string;
}

interface MagicLinkEmailParams {
  to: string;
  url: string;
}

export async function sendOtpEmail({ to, otp }: OtpEmailParams): Promise<void> {
  try {
    await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to,
      subject: 'Your Voeq verification code',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
          <h1 style="color: #0F3D2E; font-size: 24px; margin: 0 0 24px;">Your verification code</h1>
          <p style="color: #1A1A1A; font-size: 16px; line-height: 24px; margin: 0 0 24px;">
            Enter this code to verify your email and continue setting up your Voeq account:
          </p>
          <div style="background: #F7F5F0; border-radius: 12px; padding: 24px; text-align: center; margin: 0 0 24px;">
            <span style="color: #0F3D2E; font-size: 32px; font-weight: 600; letter-spacing: 8px; font-family: 'Geist Mono', monospace;">${otp}</span>
          </div>
          <p style="color: #666; font-size: 14px; line-height: 20px; margin: 0 0 8px;">
            This code expires in 10 minutes.
          </p>
          <p style="color: #666; font-size: 14px; line-height: 20px; margin: 0;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    });
  } catch (error) {
    logger.error({ error, to }, 'Failed to send OTP email');
    throw new Error('Failed to send verification email');
  }
}

export async function sendMagicLinkEmail({ to, url }: MagicLinkEmailParams): Promise<void> {
  try {
    await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to,
      subject: 'Sign in to Voeq',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
          <h1 style="color: #0F3D2E; font-size: 24px; margin: 0 0 24px;">Sign in to Voeq</h1>
          <p style="color: #1A1A1A; font-size: 16px; line-height: 24px; margin: 0 0 24px;">
            Click the button below to sign in. This link expires in 15 minutes and can only be used once.
          </p>
          <a href="${url}" style="display: inline-block; background: #0F3D2E; color: #F7F5F0; text-decoration: none; padding: 14px 28px; border-radius: 999px; font-size: 16px; font-weight: 500; margin: 0 0 24px;">
            Sign in to Voeq
          </a>
          <p style="color: #666; font-size: 14px; line-height: 20px; margin: 0 0 8px;">
            Or copy and paste this link:
          </p>
          <p style="color: #666; font-size: 12px; line-height: 18px; word-break: break-all; margin: 0 0 24px;">
            ${url}
          </p>
          <p style="color: #666; font-size: 14px; line-height: 20px; margin: 0;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    });
  } catch (error) {
    logger.error({ error, to }, 'Failed to send magic link email');
    throw new Error('Failed to send sign-in email');
  }
}
