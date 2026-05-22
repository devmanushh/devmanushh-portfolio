"use client";

export default function MapPlaceForm() {
  return (
    <form
      style={{
        display: "grid",
        gap: "16px",
        maxWidth: "700px",
        marginTop: "24px",
      }}
    >
      <input placeholder="Place" />
      <input placeholder="Country" />
      <textarea placeholder="Activity story" rows={5} />
      <button type="submit">Save Map Place</button>
    </form>
  );
}
