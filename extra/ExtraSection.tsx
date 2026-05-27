"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Brush,
  Camera,
  ChevronDown,
  Compass,
  Leaf,
  Sparkles,
  Waves,
} from "lucide-react";
import { useState } from "react";

import { SectionHeader } from "@/components/PortfolioChrome";
import type { Activity } from "@/types/activity";

const activityIcons = [Leaf, Waves, Camera, Brush, Compass, Sparkles];
const initialVisibleActivities = 4;
const activityEntrance = [
  { x: -34, y: 20, rotateZ: -1.5 },
  { x: 34, y: 20, rotateZ: 1.5 },
  { x: 0, y: -34, rotateZ: 0.8 },
  { x: 0, y: 34, rotateZ: -0.8 },
];

export default function ExtraSection({ activities }: { activities: Activity[] }) {
  const [openIds, setOpenIds] = useState<number[]>([]);
  const [showAllActivities, setShowAllActivities] = useState(false);
  const visibleActivities = showAllActivities
    ? activities
    : activities.slice(0, initialVisibleActivities);
  const hasHiddenActivities = activities.length > initialVisibleActivities;

  function toggleActivity(id: number) {
    setOpenIds((current) =>
      current.includes(id)
        ? current.filter((openId) => openId !== id)
        : [...current, id],
    );
  }

  return (
    <section id="extra" className="extra-section">
      <div className="section-frame">
        <div className="extra-heading-row">
          <SectionHeader
            eyebrow="organic side channel..."
            subtitle="Exploring, making, moving, and collecting the human sparks that live outside the console."
          />

          <div className="activity-controls" aria-label="Extra activity controls">
              <button
                type="button"
                onClick={() => setShowAllActivities(true)}
                disabled={!hasHiddenActivities || showAllActivities}
              >
                Expand
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAllActivities(false);
                  setOpenIds((current) =>
                    current.filter((id) =>
                      activities
                        .slice(0, initialVisibleActivities)
                        .some((activity) => activity.id === id),
                    ),
                  );
                }}
                disabled={!hasHiddenActivities || !showAllActivities}
              >
                Hide
              </button>
            </div>
          </div>

        <div className="activity-grid">
          <AnimatePresence initial={false}>
          {visibleActivities.map((activity, index) => {
            const isOpen = openIds.includes(activity.id);
            const Icon = activityIcons[index % activityIcons.length];
            const entrance = activityEntrance[index % activityEntrance.length];

            return (
              <motion.article
                key={activity.id}
                className={`activity-card holo-panel ${isOpen ? "is-open" : ""}`}
                initial={{ opacity: 0, filter: "blur(10px)", ...entrance }}
                whileInView={{ opacity: 1, x: 0, y: 0, rotateZ: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.28 }}
                whileHover={{ y: -7 }}
                transition={{ delay: index * 0.07, type: "spring", stiffness: 180, damping: 18 }}
                exit={{ opacity: 0, y: 22, scale: 0.96 }}
              >
                <span className="activity-card-glow" />
                <button
                  type="button"
                  onClick={() => toggleActivity(activity.id)}
                  aria-expanded={isOpen}
                  className="activity-trigger"
                >
                  <span className="activity-icon">
                    <Icon size={21} />
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
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
