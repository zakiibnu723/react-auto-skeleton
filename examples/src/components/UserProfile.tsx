export function UserProfile() {
  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="profile-avatar" />
        <div className="profile-info">
          <h3 className="profile-name">Alexandra Chen</h3>
          <p className="profile-role">Senior Product Designer</p>
          <p className="profile-location">San Francisco, CA</p>
        </div>
      </div>
      <div className="profile-stats">
        <div className="stat-item">
          <span className="stat-value">1,234</span>
          <span className="stat-label">Followers</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">567</span>
          <span className="stat-label">Following</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">89</span>
          <span className="stat-label">Projects</span>
        </div>
      </div>
      <p className="profile-bio">
        Passionate about creating delightful user experiences. I love coffee, design systems, and open source.
      </p>
      <div className="profile-actions">
        <button className="btn-primary">Follow</button>
        <button className="btn-secondary">Message</button>
      </div>
    </div>
  );
}
