"use client";

import { motion } from "framer-motion";
import { Send, SignalHigh } from "lucide-react";
import { useState } from "react";

import type { ContactContent } from "@/types/contact";

export default function ContactDetailsSection({
  contact,
}: {
  contact: ContactContent;
}) {
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" className="contact-section">
      <div className="section-frame contact-grid">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.72 }}
        >
          <span className="section-eyebrow">deep-space communication</span>
          <h2 className="section-title">{contact.title}</h2>
          <p className="section-subtitle">{contact.subtitle}</p>
          <div className="contact-frequency">
            <SignalHigh size={20} />
            <span>{contact.email}</span>
          </div>
        </motion.div>

        <motion.form
          className="contact-terminal holo-panel"
          onSubmit={(event) => {
            event.preventDefault();
            setSent(true);
          }}
          initial={{ opacity: 0, y: 28, rotateX: 5 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.72, delay: 0.08 }}
        >
          <label>
            <span>name</span>
            <input placeholder={contact.namePlaceholder} />
          </label>
          <label>
            <span>email</span>
            <input placeholder={contact.emailPlaceholder} />
          </label>
          <label>
            <span>message</span>
            <textarea placeholder={contact.messagePlaceholder} />
          </label>
          <button type="submit" className="holo-button">
            <Send size={18} />
            {sent ? "signal queued" : contact.buttonLabel}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
