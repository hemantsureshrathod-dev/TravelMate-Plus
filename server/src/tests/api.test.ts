import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { app, isAllowedOrigin } from '../app.js';
import { connectDB, disconnectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Trip } from '../models/Trip.js';

const TEST_TIMESTAMP = Date.now();
const USER_A_EMAIL = `testuser_a_${TEST_TIMESTAMP}@travelmate.test`;
const USER_B_EMAIL = `testuser_b_${TEST_TIMESTAMP}@travelmate.test`;
const PASSWORD = 'Password123!';

let userAToken: string;
let userBToken: string;
let createdTripId: string;

beforeAll(async () => {
  await connectDB();
  // Clean up any previous test artifacts with these emails
  await User.deleteMany({ email: { $in: [USER_A_EMAIL, USER_B_EMAIL] } });
});

afterAll(async () => {
  // Clean up test data
  await User.deleteMany({ email: { $in: [USER_A_EMAIL, USER_B_EMAIL] } });
  if (createdTripId) {
    await Trip.findByIdAndDelete(createdTripId);
  }
  await disconnectDB();
});

describe('1. Health & Discovery Endpoints', () => {
  it('GET /api/health should return 200 with status ok and connected database', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.database).toBe('connected');
  });

  it('GET /api/destinations should return curated Maharashtra destinations', async () => {
    const res = await request(app).get('/api/destinations');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.destinations)).toBe(true);
    expect(res.body.destinations.length).toBeGreaterThanOrEqual(5);

    const first = res.body.destinations[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('name');
    expect(first).toHaveProperty('region');
    expect(first).toHaveProperty('lat');
    expect(first).toHaveProperty('lng');
  });

  it('GET /api/destinations?category=heritage should filter properly', async () => {
    const res = await request(app).get('/api/destinations?category=heritage');
    expect(res.status).toBe(200);
    expect(res.body.destinations.every((d: any) => d.category === 'heritage')).toBe(true);
  });
});

describe('2. Authentication System', () => {
  it('POST /api/auth/register should fail on short password', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Tester',
      email: USER_A_EMAIL,
      password: '123',
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  it('POST /api/auth/register should successfully register User A', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Rohan Sharma',
      email: USER_A_EMAIL,
      password: PASSWORD,
    });
    expect(res.status).toBe(201);
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.email).toBe(USER_A_EMAIL);
    expect(res.body.user).not.toHaveProperty('password');
    expect(res.body).toHaveProperty('token');
    userAToken = res.body.token;
  });

  it('POST /api/auth/register should reject duplicate registration', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Duplicate',
      email: USER_A_EMAIL,
      password: PASSWORD,
    });
    expect(res.status).toBe(409);
    expect(res.body.error).toContain('already exists');
  });

  it('POST /api/auth/register should successfully register User B', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Priya Patel',
      email: USER_B_EMAIL,
      password: PASSWORD,
    });
    expect(res.status).toBe(201);
    userBToken = res.body.token;
  });

  it('POST /api/auth/login should fail with invalid password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: USER_A_EMAIL,
      password: 'wrong-password',
    });
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid email or password.');
  });

  it('POST /api/auth/login should succeed with valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: USER_A_EMAIL,
      password: PASSWORD,
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('GET /api/auth/me should reject unauthenticated requests', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('GET /api/auth/me should return current user for User A', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${userAToken}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(USER_A_EMAIL);
  });
});

describe('3. Trip Management & Cross-User Security', () => {
  it('POST /api/trips should reject unauthenticated requests', async () => {
    const res = await request(app).post('/api/trips').send({
      title: 'Lonavala Weekend',
      destination: 'Lonavala',
      durationDays: 2,
      budget: 10000,
      days: [],
    });
    expect(res.status).toBe(401);
  });

  it('POST /api/trips should allow User A to create a trip', async () => {
    const tripPayload = {
      title: 'Lonavala Monsoon Escape',
      destination: 'Lonavala & Khandala',
      startDate: '2026-08-15',
      endDate: '2026-08-17',
      durationDays: 2,
      travellers: 2,
      budget: 12000,
      currency: 'INR',
      interests: ['Nature', 'Waterfalls', 'Heritage'],
      pace: 'moderate',
      transport: 'Self Drive Car',
      summary: 'A refreshing 2-day monsoon trip to Sahyadri hills and ancient Karla caves.',
      days: [
        {
          dayNumber: 1,
          theme: 'Misty Waterfalls and Viewpoints',
          dayNotes: 'Leave Mumbai/Pune early to beat Ghat traffic.',
          activities: [
            {
              id: 'act-1',
              time: '10:00 AM',
              title: 'Bhushi Dam & Waterfalls',
              description: 'Enjoy scenic overflow steps and hot spiced tea.',
              location: 'Bhushi Dam',
              estimatedDuration: '2.5 hours',
              estimatedCost: 500,
              category: 'nature',
              notes: 'Wear sturdy non-slip footwear.',
            },
          ],
        },
      ],
      estimatedTotalCost: 11500,
      notes: ['Keep raincoats handy', 'Check tyre pressures before Ghat climb'],
      status: 'planned',
    };

    const res = await request(app)
      .post('/api/trips')
      .set('Authorization', `Bearer ${userAToken}`)
      .send(tripPayload);

    expect(res.status).toBe(201);
    expect(res.body.trip).toHaveProperty('id');
    expect(res.body.trip.title).toBe(tripPayload.title);
    createdTripId = res.body.trip.id;
  });

  it('GET /api/trips should return User A’s trip for User A', async () => {
    const res = await request(app)
      .get('/api/trips')
      .set('Authorization', `Bearer ${userAToken}`);
    expect(res.status).toBe(200);
    expect(res.body.count).toBeGreaterThanOrEqual(1);
    const found = res.body.trips.find((t: any) => t.id === createdTripId);
    expect(found).toBeDefined();
  });

  it('GET /api/trips for User B should NOT list User A’s trips', async () => {
    const res = await request(app)
      .get('/api/trips')
      .set('Authorization', `Bearer ${userBToken}`);
    expect(res.status).toBe(200);
    const found = res.body.trips.find((t: any) => t.id === createdTripId);
    expect(found).toBeUndefined();
  });

  it('Cross-User Protection: User B should be FORBIDDEN from viewing User A’s trip', async () => {
    const res = await request(app)
      .get(`/api/trips/${createdTripId}`)
      .set('Authorization', `Bearer ${userBToken}`);
    expect(res.status).toBe(403);
    expect(res.body.error).toContain('Forbidden');
  });

  it('Cross-User Protection: User B should be FORBIDDEN from updating User A’s trip', async () => {
    const res = await request(app)
      .put(`/api/trips/${createdTripId}`)
      .set('Authorization', `Bearer ${userBToken}`)
      .send({ title: 'Hacked Title' });
    expect(res.status).toBe(403);
  });

  it('Cross-User Protection: User B should be FORBIDDEN from deleting User A’s trip', async () => {
    const res = await request(app)
      .delete(`/api/trips/${createdTripId}`)
      .set('Authorization', `Bearer ${userBToken}`);
    expect(res.status).toBe(403);
  });

  it('User A can successfully update their own trip', async () => {
    const res = await request(app)
      .put(`/api/trips/${createdTripId}`)
      .set('Authorization', `Bearer ${userAToken}`)
      .send({ title: 'Lonavala Monsoon Escape - Updated' });
    expect(res.status).toBe(200);
    expect(res.body.trip.title).toBe('Lonavala Monsoon Escape - Updated');
  });

  it('User A can successfully delete their own trip', async () => {
    const res = await request(app)
      .delete(`/api/trips/${createdTripId}`)
      .set('Authorization', `Bearer ${userAToken}`);
    expect(res.status).toBe(200);

    // Verify it is gone
    const verifyRes = await request(app)
      .get(`/api/trips/${createdTripId}`)
      .set('Authorization', `Bearer ${userAToken}`);
    expect(verifyRes.status).toBe(404);
  });
});

describe('4. AI Itinerary Generation Validation', () => {
  it('POST /api/ai/generate-itinerary should fail when duration exceeds 14 days', async () => {
    const res = await request(app).post('/api/ai/generate-itinerary').send({
      destination: 'Mahabaleshwar',
      durationDays: 20, // exceeds max 14
      travellers: 2,
      budget: 20000,
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  it('POST /api/ai/generate-itinerary should fail when budget is negative', async () => {
    const res = await request(app).post('/api/ai/generate-itinerary').send({
      destination: 'Mahabaleshwar',
      durationDays: 3,
      travellers: 2,
      budget: -500,
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  it('POST /api/ai/generate-itinerary returns graceful error when GEMINI_API_KEY is not configured or empty', async () => {
    // If no GEMINI_API_KEY is provided in current test environment, it should return 503 or 401 with structured error code
    const res = await request(app).post('/api/ai/generate-itinerary').send({
      destination: 'Alibaug',
      durationDays: 2,
      travellers: 2,
      budget: 15000,
      currency: 'INR',
      interests: ['Beaches', 'Seafood'],
      pace: 'relaxed',
    });

    // Should return either 200 (if real key exists in environment) or 503/502/401 with a clean JSON error, NOT an unhandled 500 crash!
    expect([200, 401, 429, 502, 503]).toContain(res.status);
    if (res.status !== 200) {
      expect(res.body).toHaveProperty('error');
    }
  }, 40000);
});

describe('5. Security & Pre-Deployment Hardening', () => {
  it('Express trust proxy should be set to 1 for reverse-proxy architectures', () => {
    expect(app.get('trust proxy')).toBe(1);
  });

  it('CORS preflight from allowed production Vercel domain should succeed with 204 and Access-Control-Allow-Origin header', async () => {
    const res = await request(app)
      .options('/api/health')
      .set('Origin', 'https://travel-mate-plus.vercel.app')
      .set('Access-Control-Request-Method', 'GET');
    expect(res.status).toBe(204);
    expect(res.headers['access-control-allow-origin']).toBe('https://travel-mate-plus.vercel.app');
  });

  it('CORS request from allowed production Vercel domain should receive Access-Control-Allow-Origin header', async () => {
    const res = await request(app)
      .get('/api/health')
      .set('Origin', 'https://travel-mate-plus.vercel.app');
    expect(res.status).toBe(200);
    expect(res.headers['access-control-allow-origin']).toBe('https://travel-mate-plus.vercel.app');
  });

  it('CORS request from untrusted origin should NOT receive Access-Control-Allow-Origin header and NOT cause a 500 error', async () => {
    const res = await request(app)
      .get('/api/health')
      .set('Origin', 'https://unauthorized-attacker-site.com');
    // Endpoint executes normally without 500 crash
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    // Access-Control-Allow-Origin header MUST be omitted for disallowed origin
    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('isAllowedOrigin should enforce tight allowlist for production and legitimate preview domains', () => {
    // Missing origin (curl, mobile, server-to-server) is allowed
    expect(isAllowedOrigin(undefined)).toBe(true);

    // Exact production domain is allowed in production
    expect(isAllowedOrigin('https://travel-mate-plus.vercel.app', 'production')).toBe(true);

    // Project preview deployments are allowed in production
    expect(isAllowedOrigin('https://travel-mate-plus-preview-123.vercel.app', 'production')).toBe(true);
    expect(isAllowedOrigin('https://travel-mate-plus-git-main.vercel.app', 'production')).toBe(true);

    // Arbitrary third-party Vercel subdomains MUST be rejected in production
    expect(isAllowedOrigin('https://malicious-attacker.vercel.app', 'production')).toBe(false);
    expect(isAllowedOrigin('https://another-app.vercel.app', 'production')).toBe(false);

    // Completely untrusted domains MUST be rejected
    expect(isAllowedOrigin('https://unauthorized-attacker-site.com', 'production')).toBe(false);
    expect(isAllowedOrigin('https://evil.com', 'development')).toBe(false);

    // Localhost development server is allowed in non-production
    expect(isAllowedOrigin('http://localhost:5173', 'development')).toBe(true);
    expect(isAllowedOrigin('http://127.0.0.1:5173', 'development')).toBe(true);
  });
});
