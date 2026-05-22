import { activities } from "@/data/activities";
import { experience } from "@/data/experience";
import { mapPlaces } from "@/data/mapPlaces";
import { projects } from "@/data/projects";

export async function getPortfolioData() {
  return {
    activities,
    experience,
    mapPlaces,
    projects,
  };
}
