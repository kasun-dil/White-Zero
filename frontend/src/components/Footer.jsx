import React from 'react';
import { Shield, Mail, Globe, Share2, Hexagon } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', marginBottom: '1.5rem' }}>
            <div style={{ position: 'relative', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Hexagon size={36} className="text-[#00d2ff]" style={{ position: 'absolute' }} />
              <Shield size={18} color="white" style={{ position: 'absolute', zIndex: 1 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.1' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '1px', background: 'linear-gradient(90deg, #fff, #00d2ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                WHITE ZERO
              </span>
              <span style={{ fontSize: '0.6rem', color: '#00d2ff', letterSpacing: '2px', fontWeight: '600' }}>OSINT FRAMEWORK</span>
            </div>
          </div>
          <p>The next generation OSINT framework and digital safety platform for Sri Lanka.</p>
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
