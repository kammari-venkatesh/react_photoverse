import { Search, Menu, X } from 'lucide-react';
import './index.css';
import Header from '../Header/Header';

const Home = () => {
  const featuredPhotos = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      alt: "Sunset landscape",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      alt: "Portrait photography",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
      alt: "Road photography",
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      alt: "Ocean view",
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
      alt: "Modern architecture",
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
      alt: "Seascape",
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      alt: "Mountain landscape",
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      alt: "City skyline",
    },
    {
      id: 9,
      src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
      alt: "Forest road",
    },
    {
      id: 10,
      src: "https://images.unsplash.com/photo-1521208919411-44a8b8c3f4e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      alt: "Snowy mountains",
    },
  ];

  return (
    <div className="home-container">
      <Header />

      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero-background"></div>
        <div className="home-hero-content">
          <h1 className="home-hero-title">
            Discover and Share Your<br />
            World Through<br />
            Photography
          </h1>
          <p className="home-hero-description">
            Join a vibrant community of photographers and enthusiasts. Explore 
            stunning visuals, share your unique perspective, and connect with 
            fellow creators.
          </p>
          <div className="home-hero-buttons">
            <button className="home-btn-primary">Explore Now</button>
            <button className="home-btn-secondary">Learn More</button>
          </div>
        </div>
      </section>

      {/* Featured Photos Section */}
      <section className="home-featured-section">
        <div className="home-section-header">
          <h2 className="home-section-title">Featured Photos</h2>
          <a href="#" className="home-view-all-link">View All →</a>
        </div>
        
        <div className="home-photo-grid">
          {featuredPhotos.map((photo) => (
            <div key={photo.id} className="home-photo-card">
              <img src={photo.src} alt={photo.alt} className="home-photo-image" />
              <div className="home-photo-overlay">
                <div className="home-photo-actions">
                  <button className="home-action-btn">♡</button>
                  <button className="home-action-btn">↗</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="home-footer-content">
          <div className="home-footer-links">
            <a href="#" className="home-footer-link">About</a>
            <a href="#" className="home-footer-link">Contact</a>
            <a href="#" className="home-footer-link">Terms of Service</a>
            <a href="#" className="home-footer-link">Privacy Policy</a>
          </div>
          <div className="home-footer-social">
            <a href="#" className="home-social-link">📘</a>
            <a href="#" className="home-social-link">📷</a>
            <a href="#" className="home-social-link">🐦</a>
          </div>
        </div>
        <div className="home-footer-bottom">
          <p>© 2024 PhotoVerse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
