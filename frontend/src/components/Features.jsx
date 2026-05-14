import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, MessageSquare, Newspaper, Search } from 'lucide-react';
import './Features.css';

const features = [
  {
    title: "AI Sentinel",
    description: "Verify the authenticity of social media posts using advanced AI algorithms specifically tuned for local content.",
    icon: <Newspaper size={32} />,
    path: "/content-sentinel"
  },
  {
    title: "AI Security Auditor",
    description: "Advanced diagnostic of your social media security profile with AI-driven forensic audits.",
    icon: <ShieldCheck size={32} />,
    path: "/security-auditor"
  },
  {
    title: "Cyber QA Bot",
    description: "Your 24/7 expert for all things cyber security and social media safety.",
    icon: <MessageSquare size={32} />,
    path: "/qa-bot"
  },
  {
    title: "OSINT Framework",
    description: "Comprehensive data gathering and analysis tools for deep investigation into digital entities.",
    icon: <Search size={32} />,
    path: "/osint-trial"
  }
];

const Features = () => {
  return (
    <section className="features-section">
      <div className="section-header">
        <h2 className="fade-in">Powerful Features for Digital Safety</h2>
        <p className="fade-in">Equipping you with the tools needed to navigate the Sri Lankan social media landscape safely.</p>
      </div>
      <div className="features-grid">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            className="feature-card glass"
            whileHover={{ 
              y: -15, 
              borderColor: 'rgba(0, 210, 255, 0.5)',
              boxShadow: '0 20px 40px rgba(0, 210, 255, 0.15)',
              background: 'rgba(255, 255, 255, 0.08)'
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: idx * 0.1 }}
          >
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
            <Link to={feature.path} className="btn-outline" style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}>
              Explore
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;
