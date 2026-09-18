export function MediaGallery() {
  return (
    <div className="gallery-container">
      <h3 className="gallery-title">Photo Gallery</h3>
      <div className="gallery-grid">
        <div className="gallery-item large" />
        <div className="gallery-item" />
        <div className="gallery-item" />
        <div className="gallery-item" />
        <div className="gallery-item" />
        <div className="gallery-item" />
      </div>
      <div className="gallery-footer">
        <p className="gallery-info">6 photos • Last updated 2 days ago</p>
        <button className="btn-secondary">View All</button>
      </div>
    </div>
  );
}
