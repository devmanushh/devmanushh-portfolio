"use client";

import { motion } from "framer-motion";
import { Globe, Mail, Send } from "lucide-react";
import {
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaSnapchat,
  FaXTwitter,
} from "react-icons/fa6";
import { useActionState } from "react";

import { SectionHeader } from "@/components/PortfolioChrome";
import { sendContactEmail } from "@/lib/contact-actions";
import type { ContactContent } from "@/types/contact";

export default function ContactDetailsSection({
  contact,
}: {
  contact: ContactContent;
}) {
  const [formState, formAction, isPending] = useActionState(sendContactEmail, {
    ok: false,
    message: "",
  });
  const contactLinks = [
    {
      label: "Email",
      href: `mailto:${contact.email}`,
      Icon: Mail,
    },
    { label: "Facebook", href: contact.facebook, Icon: FaFacebookF },
    { label: "Instagram", href: contact.instagram, Icon: FaInstagram },
    { label: "Snapchat", href: contact.snapchat, Icon: FaSnapchat },
    { label: "GitHub", href: contact.github, Icon: FaGithub },
    { label: "X", href: contact.x, Icon: FaXTwitter },
    { label: "LinkedIn", href: contact.linkedin, Icon: FaLinkedinIn },
    { label: "Website", href: contact.website, Icon: Globe },
  ];

  return (
    <section id="contact" className="contact-section">
      <div className="section-frame contact-grid">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.72 }}
        >
          <SectionHeader
            eyebrow="royal correspondence..."
            subtitle={contact.subtitle}
          />

          <div className="contact-socials" aria-label="Contact links">
            {contactLinks.map(({ label, href, Icon }) => {
              const isLinked = Boolean(href);
              const isExternal = href && !href.startsWith("mailto:");
              const content = (
                <>
                  <Icon size={20} />
                  <span>{label}</span>
                </>
              );

              return isLinked ? (
                <a
                  key={label}
                  href={href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noreferrer" : undefined}
                  aria-label={label}
                  title={label}
                >
                  {content}
                </a>
              ) : (
                <span
                  key={label}
                  className="contact-social-link is-disabled"
                  aria-label={`${label} link not added`}
                  title={label}
                >
                  {content}
                </span>
              );
            })}
          </div>
        </motion.div>

        <motion.form
          className="contact-letter"
          action={formAction}
          initial={{ opacity: 0, y: 28, rotateX: 5 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.72, delay: 0.08 }}
        >
          <span className="letter-aura" aria-hidden="true" />
          <span className="letter-sparkles" aria-hidden="true" />
          <div className="letter-crown" aria-hidden="true" />
          <label>
            <span>name</span>
            <input name="name" placeholder={contact.namePlaceholder} required />
          </label>
          <label>
            <span>email</span>
            <input
              name="email"
              type="email"
              placeholder={contact.emailPlaceholder}
              required
            />
          </label>
          <label>
            <span>message</span>
            <textarea name="message" placeholder={contact.messagePlaceholder} required />
          </label>
          {formState.message ? (
            <p className={`contact-form-status ${formState.ok ? "is-success" : "is-error"}`}>
              {formState.message}
            </p>
          ) : null}
          <button type="submit" className="holo-button">
            <Send size={18} />
            {isPending ? "sealing..." : formState.ok ? formState.message : contact.buttonLabel}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
