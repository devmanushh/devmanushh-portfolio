"use client";

export default function ActivityForm() {
  return (
    <form
      style={{
        display: "grid",
        gap: "16px",
        maxWidth: "700px",
        marginTop: "24px",
      }}
    >
      <input placeholder="Activity title" />

      <textarea
        placeholder="Activity description"
        rows={5}
      />

      <button type="submit">Save Activity</button>
    </form>
  );
}