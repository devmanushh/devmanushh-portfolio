export default function AdminSettingsPage() {
  return (
    <div>
      <h1>Settings</h1>

      <form>
        <input placeholder="Your name" />
        <input placeholder="Email" />
        <input placeholder="GitHub URL" />
        <input placeholder="LinkedIn URL" />
        <button type="submit">Save Settings</button>
      </form>
    </div>
  );
}