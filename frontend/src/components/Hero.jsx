import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Hero.css';

const slides = [
  {
    id: 1,
    title: "OSINT Intelligence Search",
    subtitle: "Deploy our advanced OSINT harvesting engine to extract public posts, engagement metrics, and verified search index patterns.",
    image: "/hero/lab_pro.png",
    color: "#00f2fe",
    link: "/osint-trial"
  },
  {
    id: 2,
    title: "Forensic Case Reporting",
    subtitle: "Guided incident reporting wizard to generate legal-grade forensic cases and sync timelines directly to active police officers.",
    image: "/hero/reporting_pro.png",
    color: "#10b981",
    link: "/report-crime"
  },
  {
    id: 3,
    title: "AI Security Auditor",
    subtitle: "Audit source code, file integrity, and social metadata layers for malicious exploits using advanced SecOps models.",
    image: "/hero/detection_pro.png",
    color: "#8b5cf6",
    link: "/content-sentinel"
  }
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch('/api/articles');
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        console.error('Failed to fetch articles for hero links', err);
      }
    };
    fetchArticles();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const getMethodologyLink = (slideTitle) => {
    let targetTitle = "";
    if (slideTitle === "OSINT Intelligence Search") {
      targetTitle = "How-To: Deploying OSINT Intelligence Search";
    } else if (slideTitle === "Forensic Case Reporting") {
      targetTitle = "How-To: Generating Forensic Incident Reports";
    } else if (slideTitle === "AI Security Auditor") {
      targetTitle = "How-To: Executing Security Posture Audits";
    }

    const found = articles.find(a => a.title === targetTitle);
    return found ? `/articles/${found._id}` : "/articles";
  };

  return (
    <div className="hero" style={{ '--slide-color': slides[current].color }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[current].id}
          className="hero-slide"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ backgroundImage: `url(${slides[current].image})` }}
        >
          <div className="hero-overlay" />
          <div className="hero-content">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <h1 className="hero-title" style={{
                background: `linear-gradient(to right, #ffffff, ${slides[current].color})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                {slides[current].title.split('').map((char, index) => (
                  <motion.span
                    key={`${slides[current].id}-${index}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.05, duration: 0.05 }}
                  >
                    {char}
                  </motion.span>
                ))}
              </h1>
              <p>
                {slides[current].subtitle.split('').map((char, index) => (
                  <motion.span
                    key={`${slides[current].id}-sub-${index}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 + index * 0.008, duration: 0.02 }}
                  >
                    {char}
                  </motion.span>
                ))}
              </p>
              <div className="hero-btns">
                <Link 
                  to={slides[current].link} 
                  className="btn-primary"
                  style={{ 
                    background: slides[current].color,
                    boxShadow: `0 0 35px ${slides[current].color}66`,
                    color: '#000'
                  }}
                >
                  Launch Platform
                </Link>
                <Link 
                  to={getMethodologyLink(slides[current].title)} 
                  className="btn-outline"
                  style={{ 
                    borderColor: slides[current].color,
                    color: '#fff'
                  }}
                >
                  Our Methodology
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="hero-dots">
        {slides.map((_, idx) => (
          <div
            key={idx}
            className={`hero-dot ${idx === current ? 'active' : ''}`}
            onClick={() => setCurrent(idx)}
            style={idx === current ? { 
              backgroundColor: slides[current].color, 
              boxShadow: `0 0 20px ${slides[current].color}aa` 
            } : {}}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
