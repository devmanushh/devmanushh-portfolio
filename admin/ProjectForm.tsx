"use client";

export default function ProjectForm() {
  return (
    <form
      style={{
        display: "grid",
        gap: "16px",
        maxWidth: "700px",
        marginTop: "24px",
      }}
    >
      <input placeholder="Project title" />

      <textarea
        placeholder="Project description"
        rows={5}
      />

      <input placeholder="GitHub URL" />

      <input placeholder="Live URL" />

      <button type="submit">Save Project</button>
    </form>
  );
}