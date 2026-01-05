import React from 'react';

const About = () => {
  return (
    <div 
      className="container my-5 py-5"
      style={{ maxWidth: '900px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
    >
      <header className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary" style={{ letterSpacing: '3px' }}>
          About QuitQ
        </h1>
        <p className="lead text-muted fst-italic">
          Your trusted destination for smart shopping and amazing deals.
        </p>
        <div
          style={{
            height: '4px',
            width: '80px',
            backgroundColor: '#0d6efd',
            margin: '0 auto',
            borderRadius: '2px',
          }}
        />
      </header>

      <section className="mb-5" style={{ lineHeight: '1.8', fontSize: '1.1rem' }}>
        <p>
          Welcome to <span className="fw-bold text-primary">QuitQ</span>, where innovation meets a seamless shopping experience. Founded in 2025, we’re passionate about delivering quality products, unbeatable prices, and customer-centric services that empower you to shop smart and save big.
        </p>
        <p>
          Our platform is designed to bring you the best from trusted sellers worldwide, combined with fast delivery and friendly support.
        </p>
      </section>

      <section className="row align-items-center mb-5">
        <div className="col-md-6 mb-4 mb-md-0">
          <img
            src="/images/about.webp"
            alt="Shopping experience"
            className="img-fluid rounded shadow"
            style={{ border: '5px solid #0d6efd' }}
          />
        </div>
        <div className="col-md-6">
          <h3 className="fw-semibold text-primary mb-3">Our Mission</h3>
          <p>
            To empower every shopper with top-quality products and personalized deals, transforming the way you shop online through trust, transparency, and technology.
          </p>
          <ul className="list-unstyled fw-semibold" style={{ color: '#333' }}>
            <li className="mb-2">✔ Customer Satisfaction First</li>
            <li className="mb-2">✔ Transparent Pricing & Secure Payments</li>
            <li className="mb-2">✔ Innovation in Every Click</li>
            <li className="mb-2">✔ Building a Vibrant Seller-Community</li>
          </ul>
        </div>
      </section>

      <section className="mb-4 text-center">
        <h3 className="fw-bold text-primary mb-3">Get in Touch</h3>
        <p className="fs-5">
          Questions? Reach us via email at{' '}
          <a href="mailto:support@quitq.com" style={{ color: '#0d6efd', textDecoration: 'underline' }}>
            support@quitq.com
          </a>{' '}
          or call 1-800-QUITQ for personalized assistance.
        </p>
      </section>

      <section
        className="bg-primary bg-opacity-10 p-4 rounded text-center"
        style={{ fontWeight: '500', fontSize: '1.2rem', color: '#0d6efd' }}
      >
        “At QuitQ, we don't just sell products — we create smarter shopping journeys.”
      </section>
    </div>
  );
};

export default About;
