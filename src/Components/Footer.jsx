import React from 'react';
import './Footer.css';

import GitHubIcon from './../assets/github-svgrepo-com.svg';
import LinkedInIcon  from './../assets/linkedin-linked-in-svgrepo-com.svg';
import LeetcodeIcon  from './../assets/leetcode-svgrepo-com.svg';


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="social-links">
          <a href="https://github.com/lifelesscycle" target="_blank" rel="noopener noreferrer" className="social-link">
            <img src={GitHubIcon} alt="GitHub" className="icon" />
          </a>
          <a href="https://linkedin.com/in/aarya-nema-690296244" target="_blank" rel="noopener noreferrer" className="social-link">
            <img src={LinkedInIcon} alt="LinkedIn" className="icon" />
          </a>
          <a href="https://leetcode.com/u/5D3vfDtiJJ/" target="_blank" rel="noopener noreferrer" className="social-link">
            <img src={LeetcodeIcon} alt="Leetcode" className="icon" />
          </a>
        </div>
        <div className="footer-text">
          <p>&copy; 2025 Aarya Nema. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;