const comments = [
  { author: "Michael Ross", time: "2 hours ago", text: "This is exactly what I've been looking for!" },
  { author: "Sara Kim", time: "5 hours ago", text: "Great work! Does it support TypeScript?" },
  { author: "Tom Brady", time: "1 day ago", text: "Amazing library, saved me so much time." }
];

export function CommentList() {
  return (
    <div className="comment-section">
      <h3 className="comment-header">Comments ({comments.length})</h3>
      <div className="comment-list">
        {comments.map((comment) => (
          <div key={comment.author} className="comment-item">
            <div className="comment-avatar" />
            <div className="comment-content">
              <div className="comment-meta">
                <span className="comment-author">{comment.author}</span>
                <span className="comment-time">{comment.time}</span>
              </div>
              <p className="comment-text">{comment.text}</p>
              <div className="comment-actions">
                <button className="comment-action">Reply</button>
                <button className="comment-action">Like</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
