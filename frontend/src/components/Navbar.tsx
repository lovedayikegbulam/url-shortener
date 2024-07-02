// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <Link to="/">Shorten URL</Link>
      <Link to="/qr-code">Generate QR Code</Link>
      <Link to="/history">Link History</Link>
      <Link to="/analytics">Analytics</Link>
    </nav>
  );
};

export default Navbar;
