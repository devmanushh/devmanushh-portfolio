import Navbar from "@/components/Navbar";
import IntroSection from "@/components/IntroSection";
import WorldMapSection from "@/components/WorldMapSection";
import FeaturedProjects from "@/components/FeaturedProjects";
import ExtraActivities from "@/components/ExtraActivities";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { getActivities } from "@/lib/activities-store";

export default async function HomePage() {
  const activities = await getActivities();

  return (
    <>
      <Navbar />

      <main>
        <IntroSection />
        <WorldMapSection />
        <FeaturedProjects />
        <ExtraActivities activities={activities} />
        <ContactSection />
      </main>

      <Footer />
    </>
  );
}
