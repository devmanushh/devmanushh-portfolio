import ExtraActivities from "@/components/ExtraActivities";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WorldMapSection from "@/components/WorldMapSection";
import { getActivities } from "@/lib/activities-store";

export default async function ExtraActivitiesPage() {
  const activities = await getActivities();

  return (
    <>
      <Navbar />
      <main>
        <WorldMapSection />
        <ExtraActivities activities={activities} />
      </main>
      <Footer />
    </>
  );
}
