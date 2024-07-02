import request from 'supertest';
import { app } from '../src/app';

describe('URL Shortening', () => {
  it('should shorten a valid URL', async () => {
    const res = await request(app).post('/api/shorten').send({ longUrl: 'http://example.com' });
    expect(res.status).toBe(200);
    expect(res.body.shortUrl).toBeDefined();
  });
});
