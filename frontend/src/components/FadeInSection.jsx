import React from 'react';
import { motion } from 'framer-motion';

const FadeInSection = ({ children, delay = 0, direction = 'up' }) => {
  const directions = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 }
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...(directions[direction] || directions.up) 
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        x: 0 
      }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.8, 
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1.0]
      }}
    >
      {children}
    </motion.div>
  );
};

export default FadeInSection;
