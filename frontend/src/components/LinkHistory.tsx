import React, { useEffect, useState } from 'react';
import { getLinkHistory } from '../services/api';

const LinkHistory: React.FC = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const result = await getLinkHistory();
      setHistory(result);
    };
    fetchHistory();
  }, []);

  return (
    <div>
      <h2>Link History</h2>
      <ul>
        {history.map((link: any) => (
          <li key={link.shortUrl}>
            <a href={link.longUrl} target="_blank" rel="noopener noreferrer">
              {link.shortUrl}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LinkHistory;
