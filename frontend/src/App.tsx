// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ShortenUrl from './components/ShortenUrl';
import QrCode from './components/QrCode';
import LinkHistory from './components/LinkHistory';
import Analytics from './components/Analytics';
import './styles.css';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<ShortenUrl />} />
          <Route path="/qr-code" element={<QrCode />} />
          <Route path="/history" element={<LinkHistory />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
