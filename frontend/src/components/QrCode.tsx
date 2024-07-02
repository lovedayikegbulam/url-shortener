import React, { useState } from 'react';
import { generateQrCode } from '../services/api';

const QrCode: React.FC = () => {
  const [shortUrl, setShortUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await generateQrCode(shortUrl);
    setQrCodeUrl(result.qrCodeUrl);
  };

  return (
    <div>
      <h2>Generate QR Code</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter short URL"
          value={shortUrl}
          onChange={(e) => setShortUrl(e.target.value)}
        />
        <button type="submit">Generate QR Code</button>
      </form>
      {qrCodeUrl && (
        <div>
          <h3>QR Code</h3>
          <img src={qrCodeUrl} alt="QR Code" />
        </div>
      )}
    </div>
  );
};

export default QrCode;
