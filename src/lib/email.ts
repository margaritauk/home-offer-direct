import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  if (!resend) {
    console.log('[email] Resend not configured — skipping welcome email to', to);
    return;
  }
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? 'onboarding@homeofferdirect.com',
    to,
    subject: 'Welcome to HomeOfferDirect',
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; color: #0f172a; margin-bottom: 8px;">Welcome, ${name}!</h1>
        <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          Your HomeOfferDirect account is ready. You're one step closer to submitting a
          professional home offer — without the buyer's agent commission.
        </p>
        <a href="https://homeofferdirect.com/search"
           style="display: inline-block; background: #2563eb; color: #fff; font-weight: 600;
                  padding: 14px 28px; border-radius: 10px; text-decoration: none; font-size: 15px;">
          Start your offer →
        </a>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">
          HomeOfferDirect is not a law firm and does not provide legal advice.
          <a href="https://homeofferdirect.com/legal/disclaimer" style="color: #94a3b8;">Legal disclaimer</a>
        </p>
      </div>
    `,
  });
}
