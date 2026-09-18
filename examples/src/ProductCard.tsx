import { Star } from "./icons";

const features = ["Waterproof", "Noise cancelling", "18h battery", "USB-C"];

export default function ProductCard() {
  return (
    <article className="card">
      <div className="image" role="img" aria-label="Wireless headphones" />
      <div className="content">
        <header className="heading">
          <p className="eyebrow">Audio</p>
          <h2>Focus Pro Wireless</h2>
          <p className="lede">Studio-grade ANC with adaptive transparency for deep work.</p>
        </header>

        <div className="rating" aria-label="4.8 out of 5 stars">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} filled={index < 4} />
          ))}
          <span className="rating-value">4.8 • 1,203 reviews</span>
        </div>

        <ul className="feature-list">
          {features.map((feat) => (
            <li key={feat}>{feat}</li>
          ))}
        </ul>

        <footer className="footer">
          <div>
            <p className="price">$249</p>
            <p className="subdued">Ships in 2-3 days</p>
          </div>
          <div className="cta-row">
            <button type="button">Add to cart</button>
            <button type="button" className="ghost">Save</button>
          </div>
        </footer>
      </div>
    </article>
  );
}
