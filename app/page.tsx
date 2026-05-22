import Navbar from "@/components/Navbar";
import IntroSection from "@/components/IntroSection";
import WorldMapSection from "@/components/WorldMapSection";
import FeaturedProjects from "@/components/FeaturedProjects";
import ExtraActivities from "@/components/ExtraActivities";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { getActivities } from "@/lib/activities-store";
import { getIntroContent } from "@/lib/profile-store";

export default async function HomePage() {
  const [activities, intro] = await Promise.all([
    getActivities(),
    getIntroContent(),
  ]);

  return (
    <>
      <Navbar />

      <main>
        <IntroSection intro={intro} />
        <WorldMapSection />
        <FeaturedProjects />
        <ExtraActivities activities={activities} />
        <ContactSection />
      </main>

      <Footer />
    </>
  );
}
