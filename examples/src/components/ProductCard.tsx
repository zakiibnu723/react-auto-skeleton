import { Star } from "../icons";

export function ProductCard() {
  return (
    <div className="product-card">
      {/* <div className="product-image" /> */}
      <div className="product-body">
        <div className="badge">New Arrival</div>
        <h3 className="product-title">Premium Wireless Headphones</h3>
        <p className="product-desc">
          Professional-grade audio with active noise cancellation and 30-hour battery life.
        </p>
        <div className="rating-row">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} filled={i < 4} />
          ))}
          <span className="rating-text">4.8 (243 reviews)</span>
        </div>
        <div className="price-row">
          <div>
            <span className="price-current">$199</span>
            <span className="price-old">$249</span>
          </div>
          <button className="btn-primary">Add to Cart</button>
        </div>
      </div>
    </div>
  );
}
