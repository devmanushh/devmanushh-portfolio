import { promises as fs } from "node:fs";
import path from "node:path";

import { profile } from "@/data/profile";
import type { ContactContent } from "@/types/contact";

const storePath = path.join(process.cwd(), "data", "contact.store.json");

const defaultContact: ContactContent = {
  title: "Contact details.",
  subtitle: "say hello",
  namePlaceholder: "your name",
  emailPlaceholder: "your email",
  messagePlaceholder: "your message",
  buttonLabel: "send message",
  email: profile.email,
  facebook: "",
  instagram: "",
  snapchat: "",
  github: "",
  x: "",
  linkedin: "",
  website: "",
};

async function ensureStore() {
  try {
    await fs.access(storePath);
  } catch {
    await fs.writeFile(storePath, JSON.stringify(defaultContact, null, 2), "utf8");
  }
}

export async function getContactContent(): Promise<ContactContent> {
  await ensureStore();
  const raw = await fs.readFile(storePath, "utf8");

  return {
    ...defaultContact,
    ...(JSON.parse(raw) as Partial<ContactContent>),
  };
}

export async function updateContactContent(content: ContactContent) {
  await fs.writeFile(storePath, JSON.stringify(content, null, 2), "utf8");

  return content;
}
