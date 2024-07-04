import React, { useState } from 'react';
import { shortenUrl } from '../services/api';

const ShortenUrl: React.FC = () => {
  const [longUrl, setLongUrl] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await shortenUrl(longUrl, customUrl);
    setShortUrl(result.shortUrl);
    console.log(shortUrl)
  };

  return (
    <div>
      <h2>Shorten URL</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter long URL"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter custom URL (optional)"
          value={customUrl}
          onChange={(e) => setCustomUrl(e.target.value)}
        />
        <button type="submit">Shorten</button>
      </form>
      {shortUrl && (
        <div>
          <h3>Shortened URL</h3>
          <p>{shortUrl}</p>
        </div>
      )}
    </div>
  );
};

export default ShortenUrl;
