import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Hero.css';

const slides = [
  {
    id: 1,
    title: "Neural Intelligence Lab",
    subtitle: "Real-time threat monitoring and OSINT forensics powered by advanced machine learning models.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1920&q=80",
    color: "#00d2ff",
    link: "/intelligence-lab"
  },
  {
    id: 2,
    title: "Automated Crime Reporting",
    subtitle: "Guided documentation for cybercrime victims. Generate professional reports for official submission.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1920&q=80",
    color: "#10b981",
    link: "/report-crime"
  },
  {
    id: 3,
    title: "AI Misinformation Detection",
    subtitle: "Identify fake news and social media manipulation with our specialized NLP engine.",
    image: "https://traversals.com/wp-content/uploads/2020/05/AdobeStock_164586542-1024x576.jpeg",
    color: "#f59e0b",
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
    <div className="hero">
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
              <h1 style={{
                background: `linear-gradient(to right, #ffffff, ${slides[current].color})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                {slides[current].title}
              </h1>
              <p>{slides[current].subtitle}</p>
              <div className="hero-btns">
                <Link to={slides[current].link} className="btn-primary">
                  Launch Platform
                </Link>
                <Link to="/about" className="btn-outline">
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
            style={idx === current ? { backgroundColor: slides[current].color, boxShadow: `0 0 15px ${slides[current].color}` } : {}}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
