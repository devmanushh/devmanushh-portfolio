"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { addActivity, deleteActivity } from "@/lib/activities-store";

const activitySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  details: z.string().optional(),
});

export async function createActivity(formData: FormData) {
  const parsed = activitySchema.parse(Object.fromEntries(formData));

  await addActivity({
    title: parsed.title,
    description: parsed.description,
    details: parsed.details?.trim() || undefined,
  });

  revalidatePath("/");
  revalidatePath("/extraactivities");
  revalidatePath("/admin/extraactivities");
}

export async function removeActivity(formData: FormData) {
  const id = Number(formData.get("id"));

  if (Number.isFinite(id)) {
    await deleteActivity(id);
  }

  revalidatePath("/");
  revalidatePath("/extraactivities");
  revalidatePath("/admin/extraactivities");
}
