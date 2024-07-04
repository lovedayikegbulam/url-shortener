// src/components/Analytics.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getLinkAnalytics } from '../services/api';
import { IUrl } from '../interfaces/IUrl';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Analytics: React.FC = () => {
  const { shortUrl } = useParams<{ shortUrl: string }>();
  const [data, setData] = useState<IUrl | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (shortUrl) {
        const result = await getLinkAnalytics(shortUrl);
        setData(result);
      }
    };
    fetchAnalytics();
  }, [shortUrl]);

  return (
    <div>
      <h2>Analytics for {shortUrl}</h2>
      {data ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={[data]} // Wrapping data in an array to match recharts expected data structure
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="shortUrl" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="clicks" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Analytics;
