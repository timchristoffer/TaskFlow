import React, { useState, useEffect } from 'react';
import './Footer.css';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Kontrollera om användaren har scrollat tillräckligt långt ner
    if (scrollTop + windowHeight >= documentHeight - 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`footer ${isVisible ? 'visible' : ''}`}>
      <div className='footer-contact'>
        <p>Email: example@example.com</p>
        <p>Phone: +123 456 7890</p>
        <p>Address: 123 Example Street, City, Country</p>
      </div>
      <div className='footer-social'>
        <a href='https://facebook.com' target='_blank' rel='noopener noreferrer'>Facebook</a>
        <a href='https://twitter.com' target='_blank' rel='noopener noreferrer'>Twitter</a>
        <a href='https://linkedin.com' target='_blank' rel='noopener noreferrer'>LinkedIn</a>
      </div>
      <div className='footer-copyright'>
        <p>&copy; 2023 Your Company. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;