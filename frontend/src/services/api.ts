import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export const shortenUrl = async (longUrl: string, customUrl?: string) => {
  const response = await api.post('/shorten', { longUrl, customUrl });
  return response.data;
};

export const generateQrCode = async (shortUrl: string) => {
  const response = await api.post('/generate-qr', { shortUrl });
  return response.data;
};

export const getLinkHistory = async () => {
  const response = await api.get('/history');
  return response.data;
};
