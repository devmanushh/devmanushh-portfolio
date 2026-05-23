import AdminAccessToast from "@/admin/AdminAccessToast";
import ContactDetailsSection from "@/contactdetails/ContactDetailsSection";
import EngineeringSection from "@/engineering/EngineeringSection";
import ExtraSection from "@/extra/ExtraSection";
import HeroSection from "@/herosection/HeroSection";
import { getActivities } from "@/lib/activities-store";
import { getContactContent } from "@/lib/contact-store";
import { getExperience } from "@/lib/experience-store";
import { getPlaces } from "@/lib/places-store";
import { getIntroContent } from "@/lib/profile-store";
import { getProjects } from "@/lib/projects-store";
import { getTechStack } from "@/lib/tech-stack-store";
import { Footer, Navbar } from "@/navfoot/NavFoot";
import NomadGlobeSection from "@/nomadglobe/NomadGlobeSection";

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{ admin?: string }>;
}) {
  const params = await searchParams;
  const adminDenied = params?.admin === "denied";
  const [activities, intro, projects, experience, techStack, places, contact] =
    await Promise.all([
      getActivities(),
      getIntroContent(),
      getProjects(),
      getExperience(),
      getTechStack(),
      getPlaces(),
      getContactContent(),
    ]);

  return (
    <div className="app-shell">
      <AdminAccessToast denied={adminDenied} />
      <Navbar />
      <main className="app-main">
        <HeroSection intro={intro} />
        <NomadGlobeSection places={places} />
        <EngineeringSection
          projects={projects}
          experience={experience}
          techStack={techStack}
        />
        <ExtraSection activities={activities} />
        <ContactDetailsSection contact={contact} />
      </main>
      <Footer />
    </div>
  );
}
