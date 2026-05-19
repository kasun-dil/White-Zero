import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, FileText, Newspaper, Search } from 'lucide-react';
import './Features.css';

const features = [
  {
    title: "Forensic Reporting",
    description: "Generate high-authority forensic reports and incident timelines structured for law enforcement submission.",
    icon: <FileText size={20} />,
    path: "/report-crime",
    image: "https://gendermatters.in/wp-content/uploads/2018/07/Police-Surveillance-Social-Media-Monitoring.jpg"
  },
  {
    title: "OSINT Harvesting",
    description: "Deploy advanced social scrapers to harvest engagement patterns, targets, and digital footprint telemetry.",
    icon: <Search size={20} />,
    path: "/osint-trial",
    image: "https://cyesec.com/wp-content/uploads/2022/06/social-tips-min.jpg"
  },
  {
    title: "AI Security Auditor",
    description: "Execute comprehensive security diagnostic scans on target social profiles to map exposures and vulnerabilities.",
    icon: <ShieldCheck size={20} />,
    path: "/security-auditor",
    image: "https://www.socialchamp.com/blog/wp-content/uploads/2024/03/Content-Blog-Banner_Q1-2024_1125x600_063_Social-Media-Security.png"
  },
  {
    title: "Cyber Blog Feed",
    description: "Access security research, technical forensic advisories, and cyber safety manuals drafted by White Zero ops.",
    icon: <Newspaper size={20} />,
    path: "/articles",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800"
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
            whileHover={{ y: -10 }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: idx * 0.1 }}
          >
            {/* Visual Top Image Wrapper */}
            <div className="feature-card-image-wrapper">
              <img src={feature.image} alt={feature.title} className="feature-card-image" />
              <div className="feature-card-image-overlay" />

              {/* Floating lucide icon badge */}
              <div className="feature-icon-floating">
                {feature.icon}
              </div>
            </div>

            <h3>{feature.title}</h3>
            <p className="feature-card-desc">{feature.description}</p>

            <Link to={feature.path} className="btn-outline card-explore-btn" style={{ padding: '0.5rem 1.5rem', fontSize: '0.9rem', width: 'fit-content' }}>
              Explore
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;
