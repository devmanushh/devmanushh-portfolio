"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Leaf, Waves } from "lucide-react";
import { useState } from "react";

import type { Activity } from "@/types/activity";

export default function ExtraSection({ activities }: { activities: Activity[] }) {
  const [openId, setOpenId] = useState<number | null>(activities[0]?.id ?? null);

  return (
    <section id="extra" className="extra-section">
      <div className="section-frame">
        <div className="section-heading-block">
          <span className="section-eyebrow">organic side channel</span>
          <h2 className="section-title">Extra activities outside the engineering console.</h2>
          <p className="section-subtitle">
            Exploring, photography, and the small human signals that make the system feel alive.
          </p>
        </div>

        <div className="activity-grid">
          {activities.map((activity, index) => {
            const isOpen = openId === activity.id;

            return (
              <motion.article
                key={activity.id}
                className="activity-card holo-panel"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.28 }}
                transition={{ delay: index * 0.07 }}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : activity.id)}
                  aria-expanded={isOpen}
                  className="activity-trigger"
                >
                  <span className="activity-icon">
                    {index % 2 ? <Waves size={20} /> : <Leaf size={20} />}
                  </span>
                  <span>
                    <strong>{activity.title}</strong>
                    <em>{activity.description}</em>
                  </span>
                  <ChevronDown className={isOpen ? "is-open" : ""} size={22} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      className="activity-details"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p>
                        {activity.details ??
                          "More details can be added from the admin extra activities panel."}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
