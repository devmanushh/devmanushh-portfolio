"use server";

import nodemailer from "nodemailer";
import { z } from "zod";

export type ContactFormState = {
  ok: boolean;
  message: string;
};

const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name."),
  email: z.string().trim().email("Please enter a valid email address."),
  message: z.string().trim().min(1, "Please enter a message."),
});

const initialError =
  "Message could not be sent. Please try again or use the email icon.";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
}

export async function sendContactEmail(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const parsed = contactFormSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? initialError,
    };
  }

  try {
    const smtpHost = getRequiredEnv("SMTP_HOST");
    const smtpPort = Number(process.env.SMTP_PORT ?? "587");
    const smtpUser = getRequiredEnv("SMTP_USER");
    const smtpPass = getRequiredEnv("SMTP_PASS");
    const to = process.env.CONTACT_TO_EMAIL?.trim() || getRequiredEnv("ADMIN_EMAIL");
    const from = process.env.MAIL_FROM?.trim() || smtpUser;
    const secure = process.env.SMTP_SECURE === "true" || smtpPort === 465;
    const { name, email, message } = parsed.data;

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from,
      to,
      replyTo: email,
      subject: `Portfolio message from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        "",
        message,
      ].join("\n"),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>New portfolio message</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message).replaceAll("\n", "<br />")}</p>
        </div>
      `,
    });

    return {
      ok: true,
      message: "sealed and sent",
    };
  } catch (error) {
    console.error("Contact email failed:", error);

    return {
      ok: false,
      message:
        error instanceof Error && error.message.includes("configured")
          ? error.message
          : initialError,
    };
  }
}
