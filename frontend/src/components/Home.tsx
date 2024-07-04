import React, { useEffect, useState } from 'react';
import { getLinkHistory } from '../services/api';
import { IUrl } from '../interfaces/IUrl';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const [urls, setUrls] = useState<Partial<IUrl>[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const result = await getLinkHistory();
      setUrls(result);
    };
    fetchHistory();
  }, []);

  return (
    <div>
      <h2>URL History</h2>
      <ul>
        {urls.map((url, index) => (
          <li key={index}>
            <p>Long URL: {url.longUrl}</p>
            <p>Short URL: {url.shortUrl}</p>
            {url.customUrl && <p>Custom URL: {url.customUrl}</p>}
            <Link to={`/analytics/${url.shortUrl}`}>View Analytics</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
