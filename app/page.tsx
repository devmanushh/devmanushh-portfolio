import AdminAccessToast from "@/admin/AdminAccessToast";
import LazyPortfolioSections from "@/app/LazyPortfolioSections";
import AmbientSignalCanvas from "@/components/AmbientSignalCanvas";
import HeroSection from "@/herosection/HeroSection";
import { getActivities } from "@/lib/activities-store";
import { getContactContent } from "@/lib/contact-store";
import { getExperience } from "@/lib/experience-store";
import { getPlaces } from "@/lib/places-store";
import { getIntroContent } from "@/lib/profile-store";
import { getProjects } from "@/lib/projects-store";
import { getTechStack } from "@/lib/tech-stack-store";
import { Footer, Navbar } from "@/navfoot/NavFoot";

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
      <AmbientSignalCanvas />
      <AdminAccessToast denied={adminDenied} />
      <Navbar />
      <main className="app-main">
        <HeroSection intro={intro} />
        <LazyPortfolioSections
          places={places}
          projects={projects}
          experience={experience}
          techStack={techStack}
          activities={activities}
          contact={contact}
        />
      </main>
      <Footer />
    </div>
  );
}
