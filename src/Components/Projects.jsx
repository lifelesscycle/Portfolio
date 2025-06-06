import React from 'react';
import './Projects.css';

const Projects = ({ images }) => {
  const defaultImages = [
    {
      src: './assets/project-img1.png',
      caption: 'Voice based chatbot'
    },
    {
      src: './assets/project-img2.png',
      caption: 'Smart nutrition scanner'
    },
    {
      src: './assets/project-img3.png',
      caption: 'Smart traffic management system'
    },
    {
      src: './assets/project-img1.png',
      caption: 'LMS for students'
    }
  ];

  const imageData = images || defaultImages;

  return (
    <div className="image-grid-container">
      <div className="image-grid">
        {imageData.map((image, index) => (
          <div key={index} className="image-item">
            <img 
              src={image.src} 
              alt={image.caption}
              className="grid-image"
            />
            <p className="image-caption">{image.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
