// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ShortenUrl from './components/ShortenUrl';
import QrCode from './components/QrCode';
import LinkHistory from './components/LinkHistory';
import Analytics from './components/Analytics';
import Home from './components/Home';
import './styles.css';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/shorten" element={<ShortenUrl />} />
          <Route path="/qr-code" element={<QrCode />} />
          <Route path="/history" element={<LinkHistory />} />
          <Route path="/analytics/:shortUrl" element={<Analytics />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
