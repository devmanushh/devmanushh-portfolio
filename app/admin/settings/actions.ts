"use server";

import { promises as fs } from "node:fs";
import path from "node:path";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { updateIntroContent } from "@/lib/profile-store";

const resumeSchema = z.object({
  resume: z.string().min(1, "Resume content is required."),
});

const introSchema = z.object({
  heading: z.string().min(1),
  lineOne: z.string().min(1),
  lineTwo: z.string().min(1),
  currentCompany: z.string().min(1),
  currentRole: z.string().min(1),
});

const resumePath = path.join(process.cwd(), "public", "profile", "resume.txt");

export async function updateResume(formData: FormData) {
  const parsed = resumeSchema.parse(Object.fromEntries(formData));

  await fs.mkdir(path.dirname(resumePath), { recursive: true });
  await fs.writeFile(resumePath, parsed.resume, "utf8");

  revalidatePath("/");
  revalidatePath("/resume");
  revalidatePath("/admin/settings");
}

export async function updateIntro(formData: FormData) {
  const parsed = introSchema.parse(Object.fromEntries(formData));

  await updateIntroContent(parsed);

  revalidatePath("/");
  revalidatePath("/admin/settings");
}
