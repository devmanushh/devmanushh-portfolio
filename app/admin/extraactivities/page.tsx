import { createActivity, removeActivity } from "@/app/admin/extraactivities/actions";
import { getActivities } from "@/lib/activities-store";

export default async function AdminExtraActivitiesPage() {
  const activities = await getActivities();

  return (
    <div>
      <h1>Manage Extra Activities</h1>

      <form
        action={createActivity}
        style={{
          display: "grid",
          gap: "16px",
          maxWidth: "700px",
          marginTop: "24px",
        }}
      >
        <input name="title" placeholder="Activity title" required />
        <input name="description" placeholder="Short description" required />
        <textarea name="details" placeholder="More details" rows={5} />
        <button type="submit">Add Extra Activity</button>
      </form>

      <div style={{ display: "grid", gap: "16px", marginTop: "32px" }}>
        {activities.map((activity) => (
          <article
            key={activity.id}
            style={{
              border: "1px solid #1a1a1a",
              borderRadius: "16px",
              padding: "20px",
            }}
          >
            <h2>{activity.title}</h2>
            <p style={{ color: "#777", marginTop: "8px" }}>
              {activity.description}
            </p>
            {activity.details ? (
              <p style={{ marginTop: "12px" }}>{activity.details}</p>
            ) : null}

            <form action={removeActivity} style={{ marginTop: "16px" }}>
              <input type="hidden" name="id" value={activity.id} />
              <button type="submit">Delete</button>
            </form>
          </article>
        ))}
      </div>
    </div>
  );
}
