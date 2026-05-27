"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import type { Activity } from "@/types/activity";
import type { ContactContent } from "@/types/contact";
import type { Experience } from "@/types/experience";
import type { MapPlace } from "@/types/map-place";
import type { Project } from "@/types/project";
import type { TechStackItem } from "@/types/tech-stack";

const NomadGlobeSection = dynamic(() => import("@/nomadglobe/NomadGlobeSection"), {
  ssr: false,
  loading: () => <SectionLoader label="nomad globe" />,
});

const EngineeringSection = dynamic(() => import("@/engineering/EngineeringSection"), {
  loading: () => <SectionLoader label="engineering stack" />,
});

const ExtraSection = dynamic(() => import("@/extra/ExtraSection"), {
  loading: () => <SectionLoader label="extra activities" />,
});

const ContactDetailsSection = dynamic(() => import("@/contactdetails/ContactDetailsSection"), {
  loading: () => <SectionLoader label="royal correspondence" />,
});

function SectionLoader({ label }: { label: string }) {
  return (
    <section className="lazy-section-shell" aria-label={`${label} loading`}>
      <div className="lazy-section-card">
        <span className="lazy-orbit" />
        <span className="lazy-orbit lazy-orbit-two" />
        <strong>{label}</strong>
        <em>assembling</em>
      </div>
    </section>
  );
}

function LazyMount({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node || shouldRender) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "520px 0px",
        threshold: 0.01,
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [shouldRender]);

  return (
    <div ref={ref} className="lazy-mount">
      {shouldRender ? children : <SectionLoader label={label} />}
    </div>
  );
}

export default function LazyPortfolioSections({
  places,
  projects,
  experience,
  techStack,
  activities,
  contact,
}: {
  places: MapPlace[];
  projects: Project[];
  experience: Experience[];
  techStack: TechStackItem[];
  activities: Activity[];
  contact: ContactContent;
}) {
  return (
    <>
      <LazyMount label="nomad globe">
        <NomadGlobeSection places={places} />
      </LazyMount>
      <LazyMount label="engineering stack">
        <EngineeringSection
          projects={projects}
          experience={experience}
          techStack={techStack}
        />
      </LazyMount>
      <LazyMount label="extra activities">
        <ExtraSection activities={activities} />
      </LazyMount>
      <LazyMount label="royal correspondence">
        <ContactDetailsSection contact={contact} />
      </LazyMount>
    </>
  );
}
