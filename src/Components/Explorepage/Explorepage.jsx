import React, { useState,useEffect } from 'react';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import './index.css'
import Header from '../Header/Header';
import { Link } from 'react-router';
const Explorepage = () => {
  const [selectedTagId, setSelectedTagId] = useState('All');
  const [showMoreTags, setShowMoreTags] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [allphotos, setAllphotos] = useState([]);
  
  const [exploreTags, setExploreTags] = useState([]);
  

useEffect(() => {

  const getphotos = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/photos',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      console.log('response', response);
      if(!response.ok) {
        console.error('Network response was not ok', response.statusText);
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setAllphotos(data.photos);
      setPhotos(data.photos);
      console.log(data);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  }
getphotos();

},[])


  useEffect(() => {
    const fetchtags = async () => {
    
      try {
        const response = await fetch("http://127.0.0.1:8000/api/tags");
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched tags:", data);
          
          setExploreTags(data.tags); // ✅ store tags in state
        } else {
          console.error("Failed to fetch tags:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchtags();
  }, []);



useEffect(() => {

const fetchPhotosByTag = async (selectedTagId) => {
    try {
      if (selectedTagId === 'All') {
        setPhotos(allphotos);
        return;
      }

      const response = await fetch(`http://127.0.0.1:8000/api/photobytag/${selectedTagId}`);
      if (response.ok) {
        const data = await response.json();
        setPhotos(data.photos);
      } else {
        console.error("Failed to fetch photos by tag:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching photos by tag:", error);
    }
  };

  fetchPhotosByTag(selectedTagId);
}, [selectedTagId]);


  





  // const tags = [
  //   'All', 'Nature', 'Cityscape', 'Mountains', 'Ocean', 'Forest', 
  //   'Architecture', 'Sunset', 'Flowers', 'Wildlife', 'Travel', 
  //   'Street', 'Portrait', 'Landscape'
  // ];
const handlesearch = (e) => {
  const term = e.target.value.toLowerCase().trim();

  const filtered = allphotos.filter(photo =>
    photo.title.toLowerCase().includes(term)
  );

  setPhotos(filtered);
};

  
  const visibleTags = showMoreTags ? exploreTags : exploreTags.slice(0, 9);


  return (
    <div className="photoverse-container">
      {/* Navigation - Same as Home */}
        <Header />
      {/* Explore Content */}
      <main className="explore-main">
        <div className="explore-header">
          <h1 className="explore-title">Explore</h1>
          <p className="explore-description">
            Discover incredible new photos from the PhotoVerse community.
          </p>
            <div className='search-right'>
          <div className="search-container">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              onChange={handlesearch}
              placeholder="Search Photos, Galleries..."
              className="search-input"
            />
          </div>
          </div>

        </div>
      
        {/* Browse by Tags */}
     <section className="tags-section">
  <h2 className="tags-title">Browse by Tags</h2>
  <div className="tags-container">
    <div className="tags-list">
      <button className={`tag-btn ${selectedTagId === 'All' ? 'active' : ''}`}
       onClick={() => setSelectedTagId('All')}>All</button>
      {visibleTags.map((tag) => (
        
        <button 
          key={tag.id}
          className={`tag-btn ${selectedTagId === tag.id ? 'active' : ''}`}
          onClick={() => setSelectedTagId(tag.id)}
        >
          {tag.name}
        </button>
      ))}

      {/* Toggle More/Less */}
      <button 
        className="more-tags-btn"
        onClick={() => setShowMoreTags(!showMoreTags)}
      >
        {showMoreTags ? 'Less' : 'More'} 
        <ChevronDown className={`chevron ${showMoreTags ? 'rotated' : ''}`} size={16} />
      </button>
    </div>
  </div>
</section>

        {/* Photo Gallery */}
        <section className="gallery-section">
          <div className="gallery-grid">
            {photos.map((photo) => (
              <div key={photo.id} className="gallery-card">
                <Link to={`/photo/${photo.id}`} className="gallery-link">
                <img src={photo.path} alt={photo.alt} className="gallery-image" />
                <div className="gallery-overlay">
                  <div className="gallery-actions">
                    <button className="action-btn">♡</button>
                    <button className="action-btn">↗</button>
                  </div>
                  <div className="gallery-info">
                    <span className="gallery-title">{photo.title}</span>
                    <span className="gallery-author">{photo.author}</span>
                  </div>
                </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer - Same as Home */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="#" className="footer-link">About</a>
            <a href="#" className="footer-link">Contact</a>
            <a href="#" className="footer-link">Terms of Service</a>
            <a href="#" className="footer-link">Privacy Policy</a>
          </div>
          <div className="footer-social">
            <a href="#" className="social-link">📘</a>
            <a href="#" className="social-link">📷</a>
            <a href="#" className="social-link">🐦</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 PhotoVerse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Explorepage;