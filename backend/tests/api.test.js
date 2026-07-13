const request = require('supertest');
const app = require('../app');

describe('BrainBytes API', () => {

  test('GET /api/health returns status ok', async () => {

    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);

    expect(response.body).toHaveProperty('status', 'ok');

  });

});