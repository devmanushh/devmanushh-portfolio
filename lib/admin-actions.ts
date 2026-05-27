"use server";

import { promises as fs } from "node:fs";
import { randomBytes } from "node:crypto";
import path from "node:path";

import { compare, hash } from "bcryptjs";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";
import { z } from "zod";

import { addActivity, deleteActivity, updateActivity } from "@/lib/activities-store";
import { updateContactContent } from "@/lib/contact-store";
import {
  addExperience,
  deleteExperience,
  updateExperience,
} from "@/lib/experience-store";
import { addPlace, deletePlace, updatePlace } from "@/lib/places-store";
import { getIntroContent, updateIntroContent } from "@/lib/profile-store";
import { addProject, deleteProject, updateProject } from "@/lib/projects-store";
import {
  addTechStackItem,
  deleteTechStackItem,
  replaceTechStackWithDefaults,
  updateTechStackItem,
} from "@/lib/tech-stack-store";
import {
  clearAdminAccessCookie,
  createAdminAccessToken,
  setAdminAccessCookie,
} from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import { hashAdminResetToken, withDatabase } from "@/lib/prisma";

const resumeSchema = z.object({
  resume: z.string().min(1, "Resume content is required."),
});

const introSchema = z.object({
  heading: z.string().min(1),
  lineOne: z.string().min(1),
  lineTwo: z.string().min(1),
  currentCompany: z.string().min(1),
  currentRole: z.string().min(1),
  heroImageUrl: z.string().optional(),
});

const activitySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  details: z.string().optional(),
});

const idSchema = z.object({
  id: z.coerce.number(),
});

const stringIdSchema = z.object({
  id: z.string().min(1),
});

const projectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  details: z.string().optional(),
  github: z.string().optional(),
  techStack: z.string().optional(),
});

const experienceSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  duration: z.string().min(1),
  description: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
});

const techStackSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  icon: z.string().min(1),
});

const placeSchema = z.object({
  place: z.string().min(1),
  country: z.string().min(1),
  lat: z.coerce.number(),
  lng: z.coerce.number(),
});

const contactSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  namePlaceholder: z.string().min(1),
  emailPlaceholder: z.string().min(1),
  messagePlaceholder: z.string().min(1),
  buttonLabel: z.string().min(1),
  email: z.string().min(1),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  snapchat: z.string().optional(),
  github: z.string().optional(),
  x: z.string().optional(),
  linkedin: z.string().optional(),
  website: z.string().optional(),
});

const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const adminResetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters."),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

export type AdminFormState = {
  ok: boolean;
  message: string;
};

const resumePath = path.join(process.cwd(), "public", "profile", "resume.txt");
const resumePdfPath = path.join(process.cwd(), "public", "profile", "resume.pdf");
const profileImageDir = path.join(process.cwd(), "public", "profile");
const managedHeroImagePattern = /^hero-image\.[a-z0-9]+$/iu;
const managedResumePdfPattern = /^resume(?:[-_].*)?\.pdf$/iu;

function parseCommaList(value?: string) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
}

async function getAppOrigin() {
  const configuredUrl = process.env.APP_URL?.trim();

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/u, "");
  }

  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "http";

  if (!host) {
    throw new Error("APP_URL is not configured.");
  }

  return `${protocol}://${host}`;
}

async function sendAdminResetEmail(resetUrl: string) {
  const smtpHost = getRequiredEnv("SMTP_HOST");
  const smtpPort = Number(process.env.SMTP_PORT ?? "587");
  const smtpUser = getRequiredEnv("SMTP_USER");
  const smtpPass = getRequiredEnv("SMTP_PASS");
  const to = getRequiredEnv("ADMIN_EMAIL");
  const from = process.env.MAIL_FROM?.trim() || smtpUser;
  const secure = process.env.SMTP_SECURE === "true" || smtpPort === 465;
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
    subject: "Portfolio admin password reset",
    text: [
      "Use this link to reset your portfolio admin password:",
      resetUrl,
      "",
      "This link expires in 30 minutes. Ignore this email if you did not request it.",
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Portfolio admin password reset</h2>
        <p>Use this link to reset your portfolio admin password:</p>
        <p><a href="${resetUrl}">Reset admin password</a></p>
        <p>This link expires in 30 minutes. Ignore this email if you did not request it.</p>
      </div>
    `,
  });
}

export async function requestAdminPasswordReset(
  _previousState: AdminFormState,
): Promise<AdminFormState> {
  try {
    const email = getRequiredEnv("ADMIN_EMAIL");
    const token = randomBytes(32).toString("base64url");
    const tokenHash = hashAdminResetToken(token);
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    const origin = await getAppOrigin();
    const resetUrl = `${origin}/admin/reset-password?token=${encodeURIComponent(token)}`;

    const createdReset = await withDatabase((db) =>
      db.adminPasswordResetToken.create({
        data: {
          email,
          tokenHash,
          expiresAt,
        },
      }),
    );

    if (!createdReset) {
      throw new Error("Password reset storage is unavailable.");
    }

    await sendAdminResetEmail(resetUrl);

    return {
      ok: true,
      message: "Reset link sent to the admin email.",
    };
  } catch (error) {
    console.error("Admin password reset email failed:", error);

    return {
      ok: false,
      message:
        error instanceof Error && error.message.includes("configured")
          ? error.message
          : "Reset email could not be sent. Check SMTP settings and try again.",
    };
  }
}

export async function resetAdminPassword(
  _previousState: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  const parsed = adminResetSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Password could not be reset.",
    };
  }

  const tokenHash = hashAdminResetToken(parsed.data.token);
  const passwordHash = await hash(parsed.data.password, 12);
  const updated = await withDatabase(async (db) => {
    const resetToken = await db.adminPasswordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!resetToken || resetToken.usedAt) {
      return false;
    }

    if (new Date(resetToken.expiresAt).getTime() <= Date.now()) {
      return false;
    }

    await db.adminUser.upsert({
      where: { email: resetToken.email },
      create: {
        email: resetToken.email,
        passwordHash,
      },
      update: {
        passwordHash,
      },
    });
    await db.adminPasswordResetToken.update({
      where: { tokenHash },
      data: {
        usedAt: new Date().toISOString(),
      },
    });

    return true;
  });

  if (!updated) {
    return {
      ok: false,
      message: "Reset link is invalid or expired.",
    };
  }

  await clearAdminAccessCookie();
  revalidatePath("/admin");

  return {
    ok: true,
    message: "Password reset. You can sign in with the new password.",
  };
}

export async function adminLogin(formData: FormData) {
  const parsed = adminLoginSchema.parse(Object.fromEntries(formData));
  const dbAdminResult = await withDatabase(async (db) => {
    const adminUser = await db.adminUser.findUnique({
      where: { email: parsed.email },
    });

    if (!adminUser) {
      return {
        exists: false,
        matches: false,
      };
    }

    return {
      exists: true,
      matches: await compare(parsed.password, adminUser.passwordHash),
    };
  });

  const email = process.env.ADMIN_EMAIL ?? "";
  const password = process.env.ADMIN_PASSWORD ?? "";
  const canUseEnvFallback = !dbAdminResult || !dbAdminResult.exists;
  const envAdminMatches =
    canUseEnvFallback && parsed.email === email && parsed.password === password;

  if (!dbAdminResult?.matches && !envAdminMatches) {
    redirect("/?admin=denied");
  }

  const token = createAdminAccessToken();
  await setAdminAccessCookie(token);

  redirect("/admin");
}

export async function adminLogout() {
  await clearAdminAccessCookie();
  redirect("/");
}

function getImageExtension(file: File) {
  const extension = path.extname(file.name).toLowerCase();

  if (extension) {
    return extension;
  }

  if (file.type === "image/png") {
    return ".png";
  }

  if (file.type === "image/webp") {
    return ".webp";
  }

  return ".jpg";
}

function isInsideDirectory(directory: string, target: string) {
  const relativePath = path.relative(directory, target);

  return Boolean(relativePath) && !relativePath.startsWith("..") && !path.isAbsolute(relativePath);
}

async function removeFileIfInside(directory: string, target: string) {
  const resolvedDirectory = path.resolve(directory);
  const resolvedTarget = path.resolve(target);

  if (!isInsideDirectory(resolvedDirectory, resolvedTarget)) {
    return;
  }

  await fs.rm(resolvedTarget, { force: true });
}

async function removeManagedProfileFiles(
  pattern: RegExp,
  keepPath?: string,
) {
  try {
    const files = await fs.readdir(profileImageDir, { withFileTypes: true });
    const resolvedKeepPath = keepPath ? path.resolve(keepPath) : "";

    await Promise.all(
      files
        .filter((file) => file.isFile() && pattern.test(file.name))
        .map(async (file) => {
          const target = path.join(profileImageDir, file.name);

          if (resolvedKeepPath && path.resolve(target) === resolvedKeepPath) {
            return;
          }

          await removeFileIfInside(profileImageDir, target);
        }),
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
}

async function removeLocalProfileAsset(assetUrl?: string) {
  if (!assetUrl?.startsWith("/profile/")) {
    return;
  }

  const target = path.join(process.cwd(), "public", assetUrl);

  await removeFileIfInside(profileImageDir, target);
}

export async function updateResume(formData: FormData) {
  const parsed = resumeSchema.parse(Object.fromEntries(formData));

  await fs.mkdir(path.dirname(resumePath), { recursive: true });
  await fs.writeFile(resumePath, parsed.resume, "utf8");

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateResumePdf(formData: FormData) {
  const file = formData.get("resumePdf");

  if (!(file instanceof File) || file.size === 0) {
    return;
  }

  if (file.type !== "application/pdf") {
    throw new Error("Resume upload must be a PDF file.");
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  await fs.mkdir(path.dirname(resumePdfPath), { recursive: true });
  await removeManagedProfileFiles(managedResumePdfPattern);
  await fs.writeFile(resumePdfPath, bytes);

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateIntro(formData: FormData) {
  const parsed = introSchema.parse(Object.fromEntries(formData));

  await updateIntroContent({
    ...parsed,
    heroImageUrl: parsed.heroImageUrl?.trim() || "",
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateHeroImage(formData: FormData) {
  const file = formData.get("heroImage");

  if (!(file instanceof File) || file.size === 0) {
    return;
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Hero image must be an image file.");
  }

  const extension = getImageExtension(file);
  const filename = `hero-image${extension}`;
  const imagePath = path.join(profileImageDir, filename);
  const bytes = Buffer.from(await file.arrayBuffer());
  const intro = await getIntroContent();

  await fs.mkdir(profileImageDir, { recursive: true });
  await removeManagedProfileFiles(managedHeroImagePattern);
  await removeLocalProfileAsset(intro.heroImageUrl);
  await fs.writeFile(imagePath, bytes);
  await updateIntroContent({
    ...intro,
    heroImageUrl: `/profile/${filename}`,
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function createActivity(formData: FormData) {
  const parsed = activitySchema.parse(Object.fromEntries(formData));

  await addActivity({
    title: parsed.title,
    description: parsed.description,
    details: parsed.details?.trim() || undefined,
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function editActivity(formData: FormData) {
  const id = idSchema.parse(Object.fromEntries(formData)).id;
  const parsed = activitySchema.parse(Object.fromEntries(formData));

  await updateActivity(id, {
    title: parsed.title,
    description: parsed.description,
    details: parsed.details?.trim() || undefined,
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function removeActivity(formData: FormData) {
  const id = Number(formData.get("id"));

  if (Number.isFinite(id)) {
    await deleteActivity(id);
  }

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function createProject(formData: FormData) {
  const parsed = projectSchema.parse(Object.fromEntries(formData));

  await addProject({
    title: parsed.title,
    description: parsed.description,
    details: parsed.details?.trim() || undefined,
    github: parsed.github?.trim() || undefined,
    techStack: parseCommaList(parsed.techStack),
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function editProject(formData: FormData) {
  const id = idSchema.parse(Object.fromEntries(formData)).id;
  const parsed = projectSchema.parse(Object.fromEntries(formData));

  await updateProject(id, {
    title: parsed.title,
    description: parsed.description,
    details: parsed.details?.trim() || undefined,
    github: parsed.github?.trim() || undefined,
    techStack: parseCommaList(parsed.techStack),
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function removeProject(formData: FormData) {
  const id = Number(formData.get("id"));

  if (Number.isFinite(id)) {
    await deleteProject(id);
  }

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function createExperience(formData: FormData) {
  const parsed = experienceSchema.parse(Object.fromEntries(formData));

  await addExperience({
    company: parsed.company,
    role: parsed.role,
    duration: parsed.duration,
    description: parsed.description?.trim() || undefined,
    github: parsed.github?.trim() || undefined,
    linkedin: parsed.linkedin?.trim() || undefined,
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function editExperience(formData: FormData) {
  const id = idSchema.parse(Object.fromEntries(formData)).id;
  const parsed = experienceSchema.parse(Object.fromEntries(formData));

  await updateExperience(id, {
    company: parsed.company,
    role: parsed.role,
    duration: parsed.duration,
    description: parsed.description?.trim() || undefined,
    github: parsed.github?.trim() || undefined,
    linkedin: parsed.linkedin?.trim() || undefined,
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function removeExperience(formData: FormData) {
  const id = Number(formData.get("id"));

  if (Number.isFinite(id)) {
    await deleteExperience(id);
  }

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function createTechStackItem(formData: FormData) {
  const parsed = techStackSchema.parse(Object.fromEntries(formData));

  await addTechStackItem(parsed);

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function editTechStackItem(formData: FormData) {
  const currentId = stringIdSchema.parse({
    id: formData.get("currentId"),
  }).id;
  const parsed = techStackSchema.parse(Object.fromEntries(formData));

  await updateTechStackItem(currentId, parsed);

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function removeTechStackItem(formData: FormData) {
  const id = String(formData.get("id") ?? "");

  if (id) {
    await deleteTechStackItem(id);
  }

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function syncResumeTechStack() {
  await replaceTechStackWithDefaults();

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function createPlace(formData: FormData) {
  const parsed = placeSchema.parse(Object.fromEntries(formData));

  await addPlace(parsed);

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function editPlace(formData: FormData) {
  const id = idSchema.parse(Object.fromEntries(formData)).id;
  const parsed = placeSchema.parse(Object.fromEntries(formData));

  await updatePlace(id, parsed);

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function removePlace(formData: FormData) {
  const id = Number(formData.get("id"));

  if (Number.isFinite(id)) {
    await deletePlace(id);
  }

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateContact(formData: FormData) {
  const parsed = contactSchema.parse(Object.fromEntries(formData));

  await updateContactContent({
    ...parsed,
    facebook: parsed.facebook?.trim() || "",
    instagram: parsed.instagram?.trim() || "",
    snapchat: parsed.snapchat?.trim() || "",
    github: parsed.github?.trim() || "",
    x: parsed.x?.trim() || "",
    linkedin: parsed.linkedin?.trim() || "",
    website: parsed.website?.trim() || "",
  });

  revalidatePath("/");
  revalidatePath("/admin");
}
