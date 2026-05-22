"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import Container from "@/components/Container";
import SectionTitle from "@/components/SectionTitle";
import type { Activity } from "@/types/activity";

export default function ExtraActivities({
  activities,
}: {
  activities: Activity[];
}) {
  const [openId, setOpenId] = useState<number | null>(activities[0]?.id ?? null);

  return (
    <section id="extra" className="hand-section scroll-mt-28">
      <Container>
        <SectionTitle
          title="Extra activities."
          subtitle="everything outside engineering"
        />

        <div className="grid max-w-3xl gap-5">
          {activities.map((activity) => {
            const isOpen = openId === activity.id;

            return (
              <article key={activity.id} className="sketch-card p-5">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : activity.id)}
                  className="flex w-full items-center justify-between gap-4 text-left"
                  aria-expanded={isOpen}
                >
                  <h3 className="text-3xl font-bold">{activity.title}</h3>
                  <ChevronDown
                    className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    size={28}
                  />
                </button>

                <p className="mt-3 text-xl leading-8 text-[#4f4942]">
                  {activity.description}
                </p>

                {isOpen ? (
                  <div className="mt-5 border-t-2 border-dashed border-[#181614] pt-5 text-xl leading-8 text-[#4f4942]">
                    {activity.details ??
                      "More details can be added from the admin extra activities panel."}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
