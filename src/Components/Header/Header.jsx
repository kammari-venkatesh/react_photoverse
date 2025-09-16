import React, { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { Link } from "react-router";
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="nav">
      <div className="nav-container">
        {/* Brand */}
        <div className="nav-brand">
          <div className="logo-icon"></div>
          <span className="brand-text">PhotoVerse</span>
        </div>

        {/* Desktop Nav */}
        <div className="nav-links desktop-nav">
          <Link to="/home" className="nav-link active">Home</Link>
          <Link to="/explore" className="nav-link">Explore</Link>
          <Link to="/upload" className="nav-link">Upload</Link>
          <Link to="/profile" className="nav-link">My Profile</Link>
        </div>

        {/* Right Side: Search + Mobile Menu Toggle */}
        <div className="nav-right">
          <div className="search-container">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search Photos, Galleries..."
              className="search-input"
            />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <Link to="/home" className="mobile-nav-link active">Home</Link>
          <Link to="/explore" className="mobile-nav-link">Explore</Link>
          <Link to="/upload" className="mobile-nav-link">Upload</Link>
          <Link to="/profile" className="mobile-nav-link">My Profile</Link>
        </div>
      )}
    </nav>
  );
};

export default Header;
