"use server";

import { promises as fs } from "node:fs";
import path from "node:path";

import { revalidatePath } from "next/cache";
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
  updateTechStackItem,
} from "@/lib/tech-stack-store";
import {
  clearAdminAccessCookie,
  createAdminAccessToken,
  setAdminAccessCookie,
} from "@/lib/admin-auth";
import { redirect } from "next/navigation";

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
});

const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const resumePath = path.join(process.cwd(), "public", "profile", "resume.txt");
const resumePdfPath = path.join(process.cwd(), "public", "profile", "resume.pdf");
const profileImageDir = path.join(process.cwd(), "public", "profile");

export async function adminLogin(formData: FormData) {
  const parsed = adminLoginSchema.parse(Object.fromEntries(formData));
  const email = process.env.ADMIN_EMAIL ?? "";
  const password = process.env.ADMIN_PASSWORD ?? "";

  if (parsed.email !== email || parsed.password !== password) {
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

  await updateContactContent(parsed);

  revalidatePath("/");
  revalidatePath("/admin");
}
