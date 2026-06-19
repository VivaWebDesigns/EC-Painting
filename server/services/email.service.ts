import nodemailer from "nodemailer";
import { logger } from "../utils/logger";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587", 10);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || "593 EC Painting <noreply@ecpaintingcharlotte.com>";

const isSmtpConfigured = !!(SMTP_HOST && SMTP_USER && SMTP_PASS);

let transporter: nodemailer.Transporter | null = null;
if (isSmtpConfigured) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

interface MailgunConfig {
  apiKey: string;
  domain: string;
  fromAddress: string;
}

let cachedMailgunConfig: MailgunConfig | null = null;
let mailgunConfigFetched = false;
let cachedEmailLogoUrl: string | null = null;
let emailBrandingFetched = false;

export function resetMailgunConfig(): void {
  cachedMailgunConfig = null;
  mailgunConfigFetched = false;
}

export function resetEmailBrandingCache(): void {
  cachedEmailLogoUrl = null;
  emailBrandingFetched = false;
}

async function getMailgunConfig(): Promise<MailgunConfig | null> {
  if (mailgunConfigFetched) return cachedMailgunConfig;

  try {
    const { storage } = await import("../storage/index");
    const settings = await storage.settings.getDecryptedCategory("mailgun");
    const apiKey = settings["mailgun_api_key"];
    const domain = settings["mailgun_domain"];
    const fromAddress = settings["mailgun_from_address"] || SMTP_FROM;
    if (apiKey && domain) {
      cachedMailgunConfig = { apiKey, domain, fromAddress };
    }
    mailgunConfigFetched = true;
  } catch (err) {
    logger.email.warn("Failed to load Mailgun configuration", { error: err instanceof Error ? err.message : String(err) });
  }
  return cachedMailgunConfig;
}

function resolveAbsoluteAssetUrl(url: string | null | undefined) {
  const value = typeof url === "string" ? url.trim() : "";
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  const appUrl = (process.env.APP_URL || "").trim().replace(/\/$/, "");
  if (!appUrl || !value.startsWith("/")) return value;
  return `${appUrl}${value}`;
}

async function getEmailLogoUrl(): Promise<string | null> {
  if (emailBrandingFetched) return cachedEmailLogoUrl;

  try {
    const { storage } = await import("../storage/index");
    const branding = await storage.settings.getDecryptedCategory("branding");
    cachedEmailLogoUrl = resolveAbsoluteAssetUrl(branding.frontend_logo_url);
    emailBrandingFetched = true;
  } catch (err) {
    logger.email.warn("Failed to load branding for email shell", {
      error: err instanceof Error ? err.message : String(err),
    });
    emailBrandingFetched = true;
  }

  return cachedEmailLogoUrl;
}

async function sendViaMailgun(
  to: string,
  subject: string,
  html: string
): Promise<boolean> {
  const config = await getMailgunConfig();
  if (!config) return false;

  try {
    const FormData = (await import("form-data")).default;
    const Mailgun = (await import("mailgun.js")).default;
    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({ username: "api", key: config.apiKey });
    await mg.messages.create(config.domain, {
      from: config.fromAddress,
      to: [to],
      subject,
      html,
    });
    logger.email.info("Sent via Mailgun", { to, subject });
    return true;
  } catch (err) {
    logger.email.error("Mailgun send failed", err, { to, subject });
    return false;
  }
}

async function sendViaSmtp(
  to: string,
  subject: string,
  html: string
): Promise<boolean> {
  if (!transporter) return false;
  try {
    await transporter.sendMail({ from: SMTP_FROM, to, subject, html });
    logger.email.info("Sent via SMTP", { to, subject });
    return true;
  } catch (err) {
    logger.email.error("SMTP send failed", err, { to, subject });
    return false;
  }
}

function baseTemplate(title: string, body: string, options: { logoUrl?: string | null } = {}): string {
  const logoMarkup = options.logoUrl
    ? `<img src="${options.logoUrl}" alt="593 EC Painting" style="display:block;max-width:220px;max-height:52px;height:auto;width:auto;margin:0 auto;" />`
    : `<div style="color:#0f5f7a;font-size:22px;font-weight:600;text-align:center;">593 EC Painting</div>`;

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
        <tr><td style="background:#f9fafb;padding:22px 32px;border-bottom:1px solid #e5e7eb;">
          ${logoMarkup}
        </td></tr>
        <tr><td style="padding:32px;">
          ${title ? `<h2 style="margin:0 0 16px;color:#1e3a5f;font-size:20px;">${title}</h2>` : ""}
          ${body}
        </td></tr>
        <tr><td style="background:#f9fafb;padding:20px 32px;border-top:1px solid #e5e7eb;">
          <p style="margin:0;color:#6b7280;font-size:13px;">This is an automated message from 593 EC Painting. Please do not reply directly to this email.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function renderEmailShell(title: string, body: string): Promise<string> {
  const logoUrl = await getEmailLogoUrl();
  return baseTemplate(title, body, { logoUrl });
}

function renderTemplate(template: string, vars: Record<string, string | null>): string {
  let result = template;
  for (const [key, val] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), val || "");
    if (val) {
      result = result.replace(new RegExp(`\\{\\{#${key}\\}\\}`, "g"), "");
      result = result.replace(new RegExp(`\\{\\{/${key}\\}\\}`, "g"), "");
    } else {
      result = result.replace(
        new RegExp(`\\{\\{#${key}\\}\\}[\\s\\S]*?\\{\\{/${key}\\}\\}`, "g"),
        ""
      );
    }
  }
  return result;
}

async function getTemplateHtml(
  slug: string,
  vars: Record<string, string | null>,
  fallbackTitle: string,
  fallbackBody: string
): Promise<{ subject: string; html: string; isActive: boolean }> {
  try {
    const { storage } = await import("../storage/index");
    const template = await storage.emailTemplates.getTemplate(slug);
    if (template) {
      const renderedBody = renderTemplate(template.htmlBody, vars);
      const renderedSubject = renderTemplate(template.subject, vars);
      return {
        subject: renderedSubject,
        html: await renderEmailShell("", renderedBody),
        isActive: template.isActive,
      };
    }
  } catch (err) {
    logger.email.warn("Failed to load email template, using fallback", { slug, error: err instanceof Error ? err.message : String(err) });
  }
  return {
    subject: fallbackTitle,
    html: await renderEmailShell(fallbackTitle, fallbackBody),
    isActive: true,
  };
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<boolean> {
  const { recordEmailOutcome } = await import("../utils/metrics");

  const mailgunSent = await sendViaMailgun(to, subject, html);
  if (mailgunSent) {
    recordEmailOutcome(true);
    return true;
  }

  const smtpSent = await sendViaSmtp(to, subject, html);
  if (smtpSent) {
    recordEmailOutcome(true);
    return true;
  }

  recordEmailOutcome(false);
  logger.email.warn("No email provider configured", { to, subject });
  return false;
}

export async function sendPasswordResetEmail(
  email: string,
  firstName: string | null,
  resetUrl: string
): Promise<boolean> {
  const vars = { firstName: firstName || "there", resetUrl };
  const { subject, html, isActive } = await getTemplateHtml(
    "password-reset",
    vars,
    "Reset Your Password",
    `<p>Hi ${vars.firstName}, click here to reset your password: ${resetUrl}</p>`
  );
  if (!isActive) return false;
  return sendEmail(email, subject, html);
}

export async function sendWelcomeEmail(
  email: string,
  firstName: string | null,
  loginUrl: string,
  tempPassword: string | null
): Promise<boolean> {
  const vars = { firstName: firstName || "there", loginUrl, tempPassword };
  const { subject, html, isActive } = await getTemplateHtml(
    "welcome-new-user",
    vars,
    "Welcome to 593 EC Painting",
    `<p>Hi ${vars.firstName}, an account has been created for you.</p>`
  );
  if (!isActive) return false;
  return sendEmail(email, subject, html);
}

export async function sendContactFormEmail(
  adminEmails: string[],
  senderName: string,
  senderEmail: string,
  messageBody: string,
  dashboardUrl: string
): Promise<void> {
  const vars = { senderName, senderEmail, messageBody, dashboardUrl };
  const { subject, html, isActive } = await getTemplateHtml(
    "contact-form-submission",
    vars,
    `New Contact Form: ${senderName}`,
    `<p>New message from ${senderName} (${senderEmail}): ${messageBody}</p>`
  );
  if (!isActive) return;
  for (const email of adminEmails) {
    sendEmail(email, subject, html).catch((err) => {
      logger.email.warn("Failed to notify admin of contact form", { adminEmail: email, error: err instanceof Error ? err.message : String(err) });
    });
  }
}

export async function sendManagedFormSubmissionEmail(
  recipientEmails: string[],
  formName: string,
  submissionSummary: string,
  dashboardUrl: string
): Promise<void> {
  const vars = { formName, submissionSummary, dashboardUrl };
  const { subject, html, isActive } = await getTemplateHtml(
    "managed-form-submission",
    vars,
    `New Form Submission: ${formName}`,
    `<p>A new submission was received for ${formName}.</p><p>${submissionSummary}</p>`
  );
  if (!isActive) return;

  for (const email of recipientEmails) {
    sendEmail(email, subject, html).catch((err) => {
      logger.email.warn("Failed to send managed form submission notification", {
        recipientEmail: email,
        error: err instanceof Error ? err.message : String(err),
      });
    });
  }
}

export async function testMailgunConnection(): Promise<{
  success: boolean;
  message: string;
}> {
  const config = await getMailgunConfig();
  if (!config) {
    return { success: false, message: "Mailgun not configured" };
  }
  try {
    const FormData = (await import("form-data")).default;
    const Mailgun = (await import("mailgun.js")).default;
    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({ username: "api", key: config.apiKey });
    await mg.domains.get(config.domain);
    return { success: true, message: "Mailgun connection successful" };
  } catch (err: any) {
    return { success: false, message: err.message || "Connection failed" };
  }
}

export async function sendNewMessageEmail(
  to: string,
  recipientName: string | null,
  senderName: string,
  loginUrl: string
): Promise<boolean> {
  const firstName = recipientName || "there";
  const html = await renderEmailShell(
    "New Message in Your Message Center",
    `<p>Hi ${firstName},</p>
	    <p>You have received a new message from <strong>${senderName}</strong> in your 593 EC Painting Message Center.</p>
    <p>For your privacy, message content is not included in this email notification. Please log in to read the full message.</p>
    <p style="margin:24px 0;">
      <a href="${loginUrl}" style="display:inline-block;background:#1e3a5f;color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;">
        Go to Message Center
      </a>
    </p>
    <p style="color:#6b7280;font-size:13px;">If you did not expect this message, you can safely ignore this email.</p>`
  );
  return sendEmail(to, `New message from ${senderName} — 593 EC Painting`, html);
}

export { baseTemplate, renderTemplate };
