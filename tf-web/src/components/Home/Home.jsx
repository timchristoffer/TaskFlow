import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer/Footer';
import './Home.css'; // Importera CSS-filen

const Home = () => {
  const navigate = useNavigate();

  const handleAuthButtonClick = () => {
    navigate('/auth');
  };

  useEffect(() => {
    const handleScroll = () => {
      const parallaxElements = document.querySelectorAll('.parallax');
      parallaxElements.forEach(element => {
        const speed = element.getAttribute('data-speed');
        const yPos = -(window.scrollY * speed / 100);
        element.style.transform = `translateY(${yPos}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const images = [
    { src: '#', alt: 'Image 1', title: 'Title 1', description: 'Description 1', link: 'https://example.com/link1' },
    { src: '#', alt: 'Image 2', title: 'Title 2', description: 'Description 2', link: 'https://example.com/link2' },
    { src: '#', alt: 'Image 3', title: 'Title 3', description: 'Description 3', link: 'https://example.com/link3' },
    { src: '#', alt: 'Image 4', title: 'Title 4', description: 'Description 4', link: 'https://example.com/link4' },
  ];

  return (
    <div className='home-container'>
      <div className='home-header'>
        <h1 className='title'>Home</h1>
        <button className='auth-button' onClick={handleAuthButtonClick}>Sign In / Sign Up</button>
      </div>
      <div className='home-content'>
        <div className='home-description'>
          <h2>Welcome . . .</h2>
          <p>To this website . . . </p>
        </div>
        <div className='home-image-container'>
          {images.map((image, index) => (
            <div className={`image-item parallax ${index % 2 === 0 ? 'left' : 'right'}`} data-speed='5' key={index}>
              {index % 2 === 0 ? (
                <>
                  <a href={image.link}>
                    <img src={image.src} alt={image.alt} />
                  </a>
                  <div className='image-info'>
                    <h3>{image.title}</h3>
                    <p>{image.description}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className='image-info'>
                    <h3>{image.title}</h3>
                    <p>{image.description}</p>
                  </div>
                  <a href={image.link}>
                    <img src={image.src} alt={image.alt} />
                  </a>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className='home-footer'>
        <Footer />
      </div>
    </div>
  );
}

export default Home;