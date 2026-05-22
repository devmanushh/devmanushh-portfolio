import type { MapPlace } from "@/types/mapPlace";

export default function MapPlaceCard({ place }: { place: MapPlace }) {
  return (
    <article className="sketch-card p-5">
      <h2 className="text-2xl font-bold">{place.place}</h2>
      <p className="mt-2 text-xl text-[#4f4942]">{place.country}</p>
    </article>
  );
}
