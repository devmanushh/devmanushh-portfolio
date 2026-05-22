"use client";

export default function ExperienceForm() {
  return (
    <form
      style={{
        display: "grid",
        gap: "16px",
        maxWidth: "700px",
        marginTop: "24px",
      }}
    >
      <input placeholder="Company name" />

      <input placeholder="Role" />

      <input placeholder="Duration" />

      <textarea
        placeholder="Work description"
        rows={5}
      />

      <button type="submit">Save Experience</button>
    </form>
  );
}