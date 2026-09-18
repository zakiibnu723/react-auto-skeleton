const articles = [
  {
    title: "Designing resilient UI skeletons",
    excerpt: "How to keep perceived performance high while shipping complex layouts.",
    time: "8 min read"
  },
  {
    title: "Measuring skeleton accuracy",
    excerpt: "Strategies to compare rendered UI against placeholders without manual work.",
    time: "5 min read"
  },
  {
    title: "Optimizing shimmer performance",
    excerpt: "GPU-friendly gradients, reduced paints, and safe defaults for teams.",
    time: "6 min read"
  }
];

export function ArticleList() {
  return (
    <section className="panel">
      <header className="panel-header">
        <div>
          <p className="eyebrow">Knowledge</p>
          <h3>Recent articles</h3>
        </div>
        <button type="button" className="ghost">View all</button>
      </header>
      <div className="article-stack">
        {articles.map((article) => (
          <article key={article.title} className="article-card">
            <div className="thumb" aria-hidden />
            <div className="meta">
              <p className="title">{article.title}</p>
              <p className="lede">{article.excerpt}</p>
              <p className="subdued">{article.time}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
