import React from 'react';
import { Shield, Mail, Globe, Share2, Hexagon } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', marginBottom: '1rem', justifyContent: 'inherit' }}>
            <div className="logo-icon-container" style={{ position: 'relative', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Hexagon size={36} className="logo-hexagon" style={{ position: 'absolute' }} />
              <Shield size={18} className="logo-shield" style={{ position: 'absolute', zIndex: 1 }} />
            </div>
            <div className="logo-text-wrapper">
              <span className="logo-brand" style={{ fontSize: '1.4rem' }}>WHITE ZERO</span>
              <span className="logo-sub">OSINT FRAMEWORK</span>
            </div>
          </div>
          <p style={{ textAlign: 'justify', textAlignLast: 'left', lineHeight: '1.6', fontSize: '0.95rem', color: 'var(--text-muted)', maxWidth: '450px', letterSpacing: 'normal' }}>
            White Zero is an elite, next-generation OSINT framework and comprehensive digital safety ecosystem. 
            Engineered for high-authority forensic analysis, our platform empowers investigators across Sri Lanka 
            with real-time intelligence gathering, neural threat mapping, and automated incident reporting protocols.
          </p>
          <div className="social-links">
            <a href="#"><Globe size={20} /></a>
            <a href="#"><Share2 size={20} /></a>
            <a href="#"><Mail size={20} /></a>
          </div>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/features">Features</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Resources</h4>
          <ul>
            <li><a href="#">OSINT Guide</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Documentation</a></li>
          </ul>
        </div>

        <div className="footer-newsletter">
          <h4>Stay Updated</h4>
          <p>Subscribe to get the latest cyber security news.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button className="btn-primary">Join</button>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 White Zero OSINT Framework. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
