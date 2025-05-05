import { useState, useEffect, useRef } from 'react';

// HeartPulse component for the hero section
const HeartPulse = () => {
  return (
    <div className="heart-pulse-container">
      <svg className="heart-pulse" viewBox="0 0 400 100">
        <polyline
          className="pulse-line"
          points="0,50 30,50 45,50 60,20 75,80 90,50 105,50 120,50 135,20 150,80 165,50 180,50 195,50 210,20 225,80 240,50 270,50 400,50"
          fill="none"
          stroke="#ff4d6d"
          strokeWidth="3"
        />
      </svg>
    </div>
  );
};

// Enhanced HeroSection
const HeroSection = () => (
  <div className="hero">
    <div className="hero-content">
      <h1>Heart<span className="care-text">CARE</span></h1>
      <HeartPulse />
      <p>
        With the help of AI and machine learning, we're building a model to monitor your vitals 
        and predict the chances of heart attack and heart problems.
      </p>
      <button className="learn-more-btn">Learn More</button>
    </div>
  </div>
);

export default HeroSection;