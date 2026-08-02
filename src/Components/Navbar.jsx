import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      {/* Logo & Brand Name */}
      <Link to="/" className="nav-brand">
        <div className="brand-icon">
          📦
        </div>
        <div className="brand-title">
          <span className="brand-title-top">Blind Box</span>
          <span className="brand-title-bottom">Corner</span>
        </div>
      </Link>

      {/* + New Post Button */}
      <Link to="/create" className="btn-new-post">
        + New Post
      </Link>
    </nav>
  );
}