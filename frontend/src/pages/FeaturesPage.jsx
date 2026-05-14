import React from 'react';
import { MessageSquare, ShieldCheck, Search, FileText, Cpu, Zap, Globe, ShieldAlert, Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FadeInSection from '../components/FadeInSection';
import './PageStyles.css';

const FeaturesPage = () => {
  const features = [
    {
      id: 'osint',
      title: 'OSINT Intelligence Search',
      image: 'https://cyesec.com/wp-content/uploads/2022/06/social-tips-min.jpg',
      desc: 'Deep-dive harvesting of public data from social media platforms and web repositories for high-level intelligence gathering.',
      link: '/osint-trial',
      color: '#3a7bd5',
      glow: 'rgba(58, 123, 213, 0.4)'
    },
    {
      id: 'police-report',
      title: 'Forensic Case Reporting',
      image: 'https://gendermatters.in/wp-content/uploads/2018/07/Police-Surveillance-Social-Media-Monitoring.jpg',
      desc: 'Generate professional, courtroom-ready forensic reports for law enforcement agencies and platform security teams.',
      link: '/report-crime',
      color: '#10b981',
      glow: 'rgba(16, 185, 129, 0.4)'
    },
    {
      id: 'security-audit',
      title: 'AI Security Auditor',
      image: 'https://www.socialchamp.com/blog/wp-content/uploads/2024/03/Content-Blog-Banner_Q1-2024_1125x600_063_Social-Media-Security.png',
      desc: 'Autonomous neural diagnostic of social media security posture with real-time vulnerability mapping and hardening.',
      link: '/security-auditor',
      color: '#00d2ff',
      glow: 'rgba(0, 210, 255, 0.4)'
    }
  ];

  return (
    <div className="features-page-premium" style={{ paddingTop: 0 }}>
      {/* Background Ambience */}
      <div className="tactical-grid-overlay"></div>
      <div className="glow-orb-top"></div>

      <div className="page-hero" style={{ marginTop: 0 }}>
        <img
          src="https://files.123freevectors.com/wp-content/original/164510-dark-blue-texture-background.jpg"
          alt="Features Hero"
          className="hero-bg-image"
        />
        <div className="hero-overlay"></div>
        <div className="hero-content-inner">
          <FadeInSection direction="down">
            <h1>Tactical Intelligence Suite</h1>
            <p>Deploy specialized neural modules for high-impact forensic analysis and automated data harvesting.</p>
          </FadeInSection>
        </div>
      </div>

      <div className="features-content" style={{ paddingTop: '5rem', paddingLeft: '2rem', paddingRight: '2rem' }}>

        <div className="features-grid-premium">
          {features.map((f, i) => (
            <FadeInSection key={f.id} delay={i * 0.15}>
              <Link to={f.link} className="feature-node-link">
                <div className="feature-node-card">
                  <div className="node-image-wrapper">
                    <img src={f.image} alt={f.title} className="node-banner" />
                    <div className="image-overlay" style={{ background: `linear-gradient(to top, rgba(10, 10, 20, 1), transparent)` }}></div>
                    <div className="image-glow" style={{ boxShadow: `0 0 30px ${f.glow}` }}></div>
                  </div>

                  <div className="node-info">
                    <h2 className="node-title-premium">{f.title}</h2>
                    <p>{f.desc}</p>
                  </div>

                  <div className="node-footer">
                    <span className="launch-text">INITIALIZE MODULE</span>
                    <ArrowRight size={20} className="arrow-icon" />
                  </div>

                  <div className="node-border-anim" style={{ background: `linear-gradient(90deg, transparent, ${f.color}, transparent)` }}></div>
                </div>
              </Link>
            </FadeInSection>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
