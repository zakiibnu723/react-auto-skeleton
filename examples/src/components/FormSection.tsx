export function FormSection() {
  return (
    <div className="form-container">
      <h3 className="form-title">Contact Form</h3>
      <form className="form">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">First Name</label>
            <input type="text" className="form-input" placeholder="John" />
          </div>
          <div className="form-group">
            <label className="form-label">Last Name</label>
            <input type="text" className="form-input" placeholder="Doe" />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input type="email" className="form-input" placeholder="john@example.com" />
        </div>
        <div className="form-group">
          <label className="form-label">Subject</label>
          <select className="form-select">
            <option>General Inquiry</option>
            <option>Technical Support</option>
            <option>Sales Question</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Message</label>
          <textarea className="form-textarea" rows={4} placeholder="Your message here..." />
        </div>
        <button type="submit" className="btn-primary btn-block">
          Send Message
        </button>
      </form>
    </div>
  );
}
