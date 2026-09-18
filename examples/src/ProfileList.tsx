type Profile = {
  name: string;
  role: string;
  status: string;
};

const profiles: Profile[] = [
  { name: "Amira Yusuf", role: "Design Lead", status: "In workshop" },
  { name: "Dio Saputra", role: "Frontend", status: "Reviewing" },
  { name: "Laras Putri", role: "Data", status: "Exploring" }
];

export function ProfileList() {
  return (
    <section className="panel">
      <header className="panel-header">
        <div>
          <p className="eyebrow">Team</p>
          <h3>Active collaborators</h3>
        </div>
        <button type="button" className="ghost">Invite</button>
      </header>
      <ul className="profile-list">
        {profiles.map((profile) => (
          <li key={profile.name} className="profile-row">
            <div className="avatar" aria-hidden />
            <div className="meta">
              <p className="title">{profile.name}</p>
              <p className="subdued">{profile.role}</p>
            </div>
            <span className="pill">{profile.status}</span>
            <div className="actions">
              <button type="button" className="ghost small">Ping</button>
              <button type="button" className="ghost small">Share</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
