import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Hero.css';

const slides = [
  {
    id: 1,
    title: "Neural Intelligence Lab",
    subtitle: "Real-time threat monitoring and OSINT forensics powered by advanced machine learning models.",
    image: "/hero/lab_pro.png",
    color: "#00f2fe",
    link: "/intelligence-lab"
  },
  {
    id: 2,
    title: "Automated Crime Reporting",
    subtitle: "Guided documentation for cybercrime victims. Generate professional reports for official submission.",
    image: "/hero/reporting_pro.png",
    color: "#10b981",
    link: "/report-crime"
  },
  {
    id: 3,
    title: "AI Misinformation Detection",
    subtitle: "Identify fake news and social media manipulation with our specialized NLP engine.",
    image: "/hero/detection_pro.png",
    color: "#8b5cf6",
    link: "/fake-news-detector"
  }
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

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
                {slides[current].title}
              </h1>
              <p>{slides[current].subtitle}</p>
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
                  to="/about" 
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
