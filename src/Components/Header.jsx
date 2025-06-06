import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = ({ 
  text = " I'm a Artificial Intelligence dev", 
  speed = 250, 
  imageSrc = "./assets/img/header-img.svg",
  imageAlt = "image" 
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);
      
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);
  
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    
    return () => clearInterval(cursorTimer);
  }, []);

  return (
    <div className="animated-header">
      <div className="header-content">
        <div className="text-section">
          <div className="welcome-box">
            Welcome to my portfolio
          </div>
          
          <h1 className="animated-text">
            Aarya here,
            {displayText}
            <span className={`cursor ${showCursor ? 'visible' : 'hidden'}`}>|</span>
          </h1>
        </div>
        
        <div className="image-section">
          {imageSrc ? (
            <img 
              src={imageSrc} 
              alt={imageAlt}
              className="floating-image"
            />
          ) : (
            <div className="placeholder-image">
              <div className="placeholder-icon">🚀</div>
              <p>Add your image here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
