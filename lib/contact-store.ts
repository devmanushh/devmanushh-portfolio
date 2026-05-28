import { promises as fs } from "node:fs";
import path from "node:path";

import { profile } from "@/data/profile";
import { readJsonStore } from "@/lib/json-store";
import { withDatabase } from "@/lib/prisma";
import type { ContactContent } from "@/types/contact";

const storePath = path.join(process.cwd(), "data", "contact.store.json");

const defaultContact: ContactContent = {
  title: "contact me",
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
  const dbContact = await withDatabase(async (db) => {
    const existing = await db.contactContent.findUnique({ where: { id: 1 } });

    if (existing) {
      return existing;
    }

    const seedContact = await readJsonStore<ContactContent>(
      "contact.store.json",
      defaultContact,
    );

    return db.contactContent.create({
      data: {
        id: 1,
        ...defaultContact,
        ...seedContact,
      },
    });
  });

  if (dbContact) {
    return {
      ...defaultContact,
      title: dbContact.title,
      subtitle: dbContact.subtitle,
      namePlaceholder: dbContact.namePlaceholder,
      emailPlaceholder: dbContact.emailPlaceholder,
      messagePlaceholder: dbContact.messagePlaceholder,
      buttonLabel: dbContact.buttonLabel,
      email: dbContact.email,
      facebook: dbContact.facebook ?? "",
      instagram: dbContact.instagram ?? "",
      snapchat: dbContact.snapchat ?? "",
      github: dbContact.github ?? "",
      x: dbContact.x ?? "",
      linkedin: dbContact.linkedin ?? "",
      website: dbContact.website ?? "",
    };
  }

  await ensureStore();
  const raw = await fs.readFile(storePath, "utf8");

  return {
    ...defaultContact,
    ...(JSON.parse(raw) as Partial<ContactContent>),
  };
}

export async function updateContactContent(content: ContactContent) {
  const nextContact = {
    ...defaultContact,
    ...content,
  };

  const dbContact = await withDatabase((db) =>
    db.contactContent.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        ...nextContact,
      },
      update: nextContact,
    }),
  );

  if (dbContact) {
    return {
      ...nextContact,
      facebook: dbContact.facebook ?? "",
      instagram: dbContact.instagram ?? "",
      snapchat: dbContact.snapchat ?? "",
      github: dbContact.github ?? "",
      x: dbContact.x ?? "",
      linkedin: dbContact.linkedin ?? "",
      website: dbContact.website ?? "",
    };
  }

  await fs.writeFile(storePath, JSON.stringify(nextContact, null, 2), "utf8");

  return nextContact;
}
