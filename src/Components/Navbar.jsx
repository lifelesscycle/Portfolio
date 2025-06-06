import React from 'react'
import './Navbar.css'

const Navbar = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleConnect = () => {
  
  const emailAddress = 'aaryanema2004@gmail.com';
  
  const subject = 'Hello ';
  const body = 'Hi there';
  
  const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(emailAddress)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
  window.open(gmailUrl, '_blank');
  };

  return (
    <ul className="navbar">
      <div className="navbar-links">
        <li onClick={() => scrollToSection('home')}>
          Home
        </li>
        <li onClick={() => scrollToSection('skills')}>
          Skills
        </li>
        <li onClick={() => scrollToSection('projects')}>
          Projects
        </li>
      </div>
      <li>
        <button 
          className='connect'
          onClick={handleConnect}
          type="button"
        >
          Let's Connect
        </button>
      </li>
    </ul>
  )
}

export default Navbar