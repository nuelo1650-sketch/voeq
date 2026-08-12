import { Resend } from 'resend';
import { env } from '../config/env';
import { logger } from '../config/logger';

const resend = new Resend(env.RESEND_API_KEY);

const LOGO_URL = 'https://voeq.ng/brand/voeq-wordmark.svg';

const emailHeader = `
  <div style="text-align: center; margin: 0 0 24px;">
    <img src="${LOGO_URL}" alt="Voeq" width="140" style="height: auto; width: 140px;" />
  </div>
`;

const emailFooter = `
  <div style="border-top: 1px solid #E5E1D8; margin-top: 32px; padding-top: 20px; text-align: center;">
    <p style="color: #999; font-size: 12px; line-height: 18px; margin: 0;">
      Voeq — Find. Connect. Grow.<br/>
      © ${new Date().getFullYear()} Voeq. All rights reserved.
    </p>
  </div>
`;

interface OtpEmailParams {
  to: string;
  otp: string;
}

interface MagicLinkEmailParams {
  to: string;
  url: string;
}

interface PasswordResetEmailParams {
  to: string;
  url: string;
}

export async function sendOtpEmail({ to, otp }: OtpEmailParams): Promise<void> {
  if (!env.RESEND_API_KEY) {
    // Dev fallback: no email provider configured. Surface the OTP in logs so
    // local/onboarding flows still work without a transactional email service.
    logger.warn({ to, otp }, 'RESEND_API_KEY not set — OTP not emailed (dev fallback)');
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEV OTP] ${to} -> ${otp}`);
    }
    return;
  }
  try {
    await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to,
      subject: 'Your Voeq verification code',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
          ${emailHeader}
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
          ${emailFooter}
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
          ${emailHeader}
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
          ${emailFooter}
        </div>
      `,
    });
  } catch (error) {
    logger.error({ error, to }, 'Failed to send magic link email');
    throw new Error('Failed to send sign-in email');
  }
}

export async function sendPasswordResetEmail({ to, url }: PasswordResetEmailParams): Promise<void> {
  try {
    await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to,
      subject: 'Reset your Voeq password',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
          ${emailHeader}
          <h1 style="color: #0F3D2E; font-size: 24px; margin: 0 0 24px;">Reset your password</h1>
          <p style="color: #1A1A1A; font-size: 16px; line-height: 24px; margin: 0 0 24px;">
            Click the button below to set a new password for your Voeq account. This link expires in 15 minutes and can only be used once.
          </p>
          <a href="${url}" style="display: inline-block; background: #0F3D2E; color: #F7F5F0; text-decoration: none; padding: 14px 28px; border-radius: 999px; font-size: 16px; font-weight: 500; margin: 0 0 24px;">
            Reset password
          </a>
          <p style="color: #666; font-size: 14px; line-height: 20px; margin: 0 0 8px;">
            Or copy and paste this link:
          </p>
          <p style="color: #666; font-size: 12px; line-height: 18px; word-break: break-all; margin: 0 0 24px;">
            ${url}
          </p>
          <p style="color: #666; font-size: 14px; line-height: 20px; margin: 0;">
            If you didn't request this, you can safely ignore this email — your password won't change.
          </p>
          ${emailFooter}
        </div>
      `,
    });
  } catch (error) {
    logger.error({ error, to }, 'Failed to send password reset email');
    throw new Error('Failed to send password reset email');
  }
}
