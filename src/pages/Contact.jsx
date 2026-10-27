import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email.';
    if (!form.subject.trim()) errs.subject = 'Subject is required.';
    if (!form.message.trim()) errs.message = 'Message is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      try {
        const messages = JSON.parse(localStorage.getItem('skybook_contact_messages')) || [];
        messages.push({ ...form, id: Date.now(), createdAt: new Date().toISOString() });
        localStorage.setItem('skybook_contact_messages', JSON.stringify(messages));
      } catch (err) {
        console.error(err);
      }
      setSubmitted(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 800);
  };

  const faqs = [
    { q: 'Is SkyBook a real airline booking website?', a: 'No. SkyBook is an academic project built for educational purposes. All flights, prices, and bookings are simulated demo data.' },
    { q: 'Can I book real flights through SkyBook?', a: 'No. SkyBook does not connect to any airline or travel service. All bookings are simulated within your browser.' },
    { q: 'Is my payment information safe?', a: 'SkyBook never collects real payment information. The payment process is entirely simulated. Do not enter real card details.' },
    { q: 'Where is my data stored?', a: 'All data is stored in your browser\'s Local Storage. Clearing browser data will delete all SkyBook data.' },
    { q: 'Can I use SkyBook on mobile?', a: 'Yes! SkyBook is fully responsive and works on desktop, tablet, and mobile devices.' },
    { q: 'How do I reset all demo data?', a: 'Go to your Profile page and click "Reset Demo Data" in the Danger Zone section.' },
  ];

  return (
    <>
      <Navbar />
      {/* Hero */}
      <div className="text-white text-center py-5" style={{ background: 'var(--skybook-gradient)' }}>
        <div className="container">
          <h2 className="fw-bold mb-2"><i className="bi bi-envelope me-2"></i>Contact Us</h2>
          <p className="opacity-75">Have questions? We'd love to hear from you.</p>
          <p className="small opacity-50">All contact information is demonstration content only.</p>
        </div>
      </div>

      <div style={{ background: 'var(--skybook-gray-50)' }}>
        <div className="container py-5">
          <div className="row g-4">
            {/* Contact Form */}
            <div className="col-lg-7">
              <div className="skybook-card p-4 p-md-5">
                <h4 className="fw-bold mb-4" style={{ color: 'var(--skybook-navy)' }}>Send Us a Message</h4>

                {submitted && (
                  <div className="alert alert-success">
                    <i className="bi bi-check-circle me-2"></i>
                    <strong>Message sent!</strong> Thank you for reaching out. This message has been saved locally as a demo.
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Your Name</label>
                      <input type="text" className={`form-control skybook-input ${errors.name ? 'is-invalid' : ''}`}
                        name="name" value={form.name} onChange={handleChange} placeholder="John Doe" />
                      {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Email Address</label>
                      <input type="email" className={`form-control skybook-input ${errors.email ? 'is-invalid' : ''}`}
                        name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold small">Subject</label>
                      <input type="text" className={`form-control skybook-input ${errors.subject ? 'is-invalid' : ''}`}
                        name="subject" value={form.subject} onChange={handleChange} placeholder="What's this about?" />
                      {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold small">Message</label>
                      <textarea className={`form-control skybook-input ${errors.message ? 'is-invalid' : ''}`}
                        name="message" value={form.message} onChange={handleChange} rows="5" placeholder="Your message here…"></textarea>
                      {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-skybook" disabled={loading}>
                        {loading ? (
                          <><span className="spinner-border spinner-border-sm me-2"></span>Sending…</>
                        ) : (
                          <><i className="bi bi-send me-2"></i>Send Message</>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="col-lg-5">
              <div className="skybook-card p-4 mb-3">
                <h5 className="fw-bold mb-3" style={{ color: 'var(--skybook-navy)' }}>Get in Touch</h5>
                {[
                  { icon: 'bi-envelope', label: 'Email', value: 'support@skybook.demo' },
                  { icon: 'bi-phone', label: 'Phone', value: '+91 1800-SKY-BOOK (Demo)' },
                  { icon: 'bi-geo-alt', label: 'Address', value: 'SkyBook HQ, Demo Street, India' },
                  { icon: 'bi-clock', label: 'Hours', value: 'Mon–Fri: 9 AM – 6 PM (Demo)' },
                ].map((item, i) => (
                  <div className="d-flex align-items-start gap-3 mb-3" key={i}>
                    <div className="d-flex align-items-center justify-content-center rounded-circle"
                      style={{ width: 44, height: 44, background: 'var(--skybook-gray-100)', flexShrink: 0 }}>
                      <i className={`bi ${item.icon}`} style={{ color: 'var(--skybook-blue)' }}></i>
                    </div>
                    <div>
                      <small className="text-muted d-block">{item.label}</small>
                      <span className="fw-semibold small">{item.value}</span>
                    </div>
                  </div>
                ))}
                <p className="small text-muted mt-3 mb-0">
                  <i className="bi bi-info-circle me-1"></i>All contact details are demonstration content.
                </p>
              </div>

              {/* Map Placeholder */}
              <div className="skybook-card overflow-hidden" style={{ height: 200 }}>
                <div className="w-100 h-100 d-flex align-items-center justify-content-center"
                  style={{ background: 'linear-gradient(135deg, #e0f2fe, #bae6fd)' }}>
                  <div className="text-center">
                    <i className="bi bi-geo-alt fs-2" style={{ color: 'var(--skybook-blue)' }}></i>
                    <p className="mb-0 small fw-semibold text-muted">Map Placeholder</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-5">
            <h3 className="fw-bold text-center mb-4" style={{ color: 'var(--skybook-navy)' }}>
              <i className="bi bi-question-circle me-2"></i>Frequently Asked Questions
            </h3>
            <div className="accordion mx-auto" id="faqAccordion" style={{ maxWidth: 800 }}>
              {faqs.map((faq, i) => (
                <div className="accordion-item border-0 mb-2 skybook-card" key={i}>
                  <h2 className="accordion-header">
                    <button className={`accordion-button ${i !== 0 ? 'collapsed' : ''} fw-semibold`}
                      type="button" data-bs-toggle="collapse" data-bs-target={`#faq${i}`}>
                      {faq.q}
                    </button>
                  </h2>
                  <div id={`faq${i}`} className={`accordion-collapse collapse ${i === 0 ? 'show' : ''}`}
                    data-bs-parent="#faqAccordion">
                    <div className="accordion-body text-muted">{faq.a}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
