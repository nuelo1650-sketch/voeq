import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import { env, webAppUrl } from '../config/env';
import { logger } from '../config/logger';

const resend = new Resend(env.RESEND_API_KEY);

/**
 * SMTP transport for local dev (Mailpit). Lazily created only when SMTP_HOST
 * is set. Production uses Resend; this path is never touched there.
 */
const smtpTransport =
  env.SMTP_HOST
    ? nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_SECURE,
        auth: env.SMTP_USER
          ? { user: env.SMTP_USER, pass: env.SMTP_PASS }
          : undefined,
      })
    : null;

const sendViaSmtp = async (to: string, subject: string, html: string): Promise<void> => {
  if (!smtpTransport) return;
  await smtpTransport.sendMail({
    from: env.RESEND_FROM_EMAIL,
    to,
    subject,
    html,
  });
};

// Brand constants — single source of truth so every email looks like Voeq.
const BRAND = {
  forest: '#0F3D2E',
  cream: '#F7F5F0',
  gold: '#C9A24B',
  ink: '#1A1A1A',
  muted: '#6B6B6B',
  border: '#E5E1D8',
  logoUrl: 'https://voeq.ng/Name.png',
  siteUrl: webAppUrl,
  year: new Date().getFullYear(),
};

const emailShell = (inner: string): string => `
  <div style="background:${BRAND.cream}; padding: 32px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div style="max-width: 480px; margin: 0 auto; background: #FFFFFF; border: 1px solid ${BRAND.border}; border-radius: 18px; overflow: hidden; box-shadow: 0 12px 32px rgba(15,61,46,0.10);">
      <div style="background: linear-gradient(135deg, #0F3D2E 0%, #15503B 55%, #0F3D2E 100%); padding: 30px 28px 26px; text-align: center;">
        <img src="${BRAND.logoUrl}" alt="Voeq" width="140" style="height: auto; width: 140px;" />
        <div style="margin: 16px auto 0; height: 2px; width: 64px; background: ${BRAND.gold}; border-radius: 2px;"></div>
      </div>
      <div style="padding: 28px 28px 24px;">
        ${inner}
      </div>
      <div style="padding: 20px 28px; border-top: 1px solid ${BRAND.border}; text-align: center; background: #FCFBF8;">
        <p style="color:${BRAND.muted}; font-size: 12px; line-height: 18px; margin: 0;">
          Voeq — the campus marketplace for Nigeria.<br/>
          © ${BRAND.year} Voeq. All rights reserved.
        </p>
      </div>
    </div>
  </div>
`;

const heading = (text: string): string =>
  `<h1 style="color:${BRAND.forest}; font-size: 22px; line-height: 28px; margin: 0 0 16px; font-weight: 700;">${text}</h1>`;

const body = (text: string): string =>
  `<p style="color:${BRAND.ink}; font-size: 15px; line-height: 23px; margin: 0 0 20px;">${text}</p>`;

const button = (href: string, label: string): string =>
  `<a href="${href}" style="display:inline-block; background:${BRAND.forest}; color:${BRAND.cream}; text-decoration:none; padding:13px 28px; border-radius:999px; font-size:15px; font-weight:600; box-shadow:0 6px 18px rgba(15,61,46,0.25);">${label}</a>`;

const otpTiles = (otp: string): string => {
  const tiles = otp
    .split('')
    .map(
      (d) =>
        `<span style="display:inline-flex; align-items:center; justify-content:center; width:38px; height:48px; background:${BRAND.cream}; border:1px solid ${BRAND.gold}; border-radius:10px; color:${BRAND.forest}; font-size:24px; font-weight:700; font-family:'Geist Mono', ui-monospace, monospace;">${d}</span>`,
    )
    .join('<span style="width:8px;"></span>');
  return `<div style="display:flex; justify-content:center; gap:0; margin:0 0 8px;">${tiles}</div>`;
};

const note = (text: string): string =>
  `<p style="color:${BRAND.muted}; font-size: 13px; line-height: 19px; margin: 16px 0 0;">${text}</p>`;

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
  const html = emailShell(`
    ${heading('Your verification code')}
    ${body('Enter this code to verify your email and finish setting up your Voeq account.')}
    ${otpTiles(otp)}
    ${note('This code expires in 10 minutes. If you didn’t request this, you can safely ignore the email.')}
  `);
  // 1) Production: Resend
  if (env.RESEND_API_KEY) {
    try {
      await resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to,
        subject: 'Your Voeq verification code',
        html,
      });
      return;
    } catch (error) {
      logger.error({ error, to }, 'Failed to send OTP email');
      throw new Error('Failed to send verification email');
    }
  }
  // 2) Local dev: Mailpit SMTP sink
  if (smtpTransport) {
    await sendViaSmtp(to, 'Your Voeq verification code', html);
    logger.info({ to }, 'OTP sent via local SMTP (Mailpit)');
    return;
  }
  // 3) Last resort: console (no email provider configured)
  logger.warn({ to, otp }, 'No email provider configured — OTP not emailed (dev fallback)');
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[DEV OTP] ${to} -> ${otp}`);
  }
}

export async function sendMagicLinkEmail({ to, url }: MagicLinkEmailParams): Promise<void> {
  const html = emailShell(`
    ${heading('Sign in to Voeq')}
    ${body('Tap the button below to sign in. The link expires in 15 minutes and can only be used once.')}
    <div style="text-align:center; margin:4px 0 12px;">${button(url, 'Sign in to Voeq')}</div>
    ${note('Or paste this link into your browser:')}
    <p style="color:${BRAND.muted}; font-size:12px; line-height:18px; word-break:break-all; margin:0 0 4px;">${url}</p>
    ${note('If you didn’t request this, you can safely ignore the email.')}
  `);
  if (env.RESEND_API_KEY) {
    try {
      await resend.emails.send({ from: env.RESEND_FROM_EMAIL, to, subject: 'Sign in to Voeq', html });
      return;
    } catch (error) {
      logger.error({ error, to }, 'Failed to send magic link email');
      throw new Error('Failed to send sign-in email');
    }
  }
  if (smtpTransport) {
    await sendViaSmtp(to, 'Sign in to Voeq', html);
    return;
  }
  logger.warn({ to }, 'No email provider configured — magic link not emailed (dev fallback)');
  if (process.env.NODE_ENV !== 'production') console.log(`[DEV MAGIC LINK] ${to} -> ${url}`);
}

export async function sendWelcomeEmail({ to, name }: { to: string; name?: string | null }): Promise<void> {
  const html = emailShell(`
    ${heading(`Welcome to Voeq${name ? `, ${name}` : ''}`)}
    ${body('Your account is verified. Voeq is the campus marketplace where Nigerian students and locals find trusted vendors for food, fashion, tech repairs, laundry, and more — and chat with them directly on WhatsApp.')}
    <div style="text-align:center; margin:4px 0 12px;">${button(`${BRAND.siteUrl}/browse`, 'Browse vendors')}</div>
    ${note('Need a hand? Reply to this email or reach us at ')}
    <p style="color:${BRAND.muted}; font-size:13px; line-height:19px; margin:0;"><a href="mailto:support@voeq.ng" style="color:${BRAND.forest};">support@voeq.ng</a></p>
  `);
  if (env.RESEND_API_KEY) {
    try {
      await resend.emails.send({ from: env.RESEND_FROM_EMAIL, to, subject: 'Welcome to Voeq', html });
      return;
    } catch (error) {
      logger.error({ error, to }, 'Failed to send welcome email');
    }
  }
  if (smtpTransport) {
    await sendViaSmtp(to, 'Welcome to Voeq', html);
  }
}

export async function sendPasswordResetEmail({ to, url }: PasswordResetEmailParams): Promise<void> {
  const html = emailShell(`
    ${heading('Reset your password')}
    ${body('Tap the button below to choose a new password. The link expires in 15 minutes and can only be used once.')}
    <div style="text-align:center; margin:4px 0 12px;">${button(url, 'Reset password')}</div>
    ${note('Or paste this link into your browser:')}
    <p style="color:${BRAND.muted}; font-size:12px; line-height:18px; word-break:break-all; margin:0 0 4px;">${url}</p>
    ${note('If you didn’t request this, your password stays the same — you can ignore this email.')}
  `);
  if (env.RESEND_API_KEY) {
    try {
      await resend.emails.send({ from: env.RESEND_FROM_EMAIL, to, subject: 'Reset your Voeq password', html });
      return;
    } catch (error) {
      logger.error({ error, to }, 'Failed to send password reset email');
      throw new Error('Failed to send password reset email');
    }
  }
  if (smtpTransport) {
    await sendViaSmtp(to, 'Reset your Voeq password', html);
    return;
  }
  logger.warn({ to }, 'No email provider configured — password reset not emailed (dev fallback)');
  if (process.env.NODE_ENV !== 'production') console.log(`[DEV RESET] ${to} -> ${url}`);
}
