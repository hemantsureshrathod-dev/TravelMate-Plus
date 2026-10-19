# TravelMate+

TravelMate+ is a travel-planning web app built around trips in Maharashtra and across India. It helps you explore destinations, generate an AI-assisted itinerary, and save trips to your account.

**Live app:** https://travel-mate-plus.vercel.app/  
**Backend API:** https://travelmate-plus-api.onrender.com  
**Repository:** https://github.com/hemantsureshrathod-dev/TravelMate-Plus

## What you can do

- **Explore destinations** — browse places by region and travel style, with an interactive map.
- **Create an itinerary with AI** — enter your destination, dates, group size, and budget to get a day-by-day plan with activity ideas, estimated travel times, local food suggestions, and an INR budget breakdown.
- **Edit your plan** — change activities and timings, adjust costs, or add and remove stops.
- **Save trips** — register or log in to keep itineraries in your account and manage them later.
- **Plan with some context** — the app focuses on Maharashtra and Indian travel, including hill stations, the Konkan coast, heritage sites, wildlife, and spiritual destinations.

AI-generated plans are suggestions, not verified bookings or guaranteed travel advice. Check current opening hours, transport, prices, weather, and local advisories before travelling.

## Tech stack

| Part | Tools |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS, React Router, Lucide, Leaflet |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB Atlas with Mongoose |
| AI | Google Gemini API |
| Validation and security | Zod, Helmet, bcryptjs, JWT, Express rate limiting |
| Tests | Vitest and Supertest |

The interface uses a restrained Scandinavian-inspired palette, with soft off-white surfaces, muted blue accents, and DM Sans/Inter typography.

## Run it locally

### Requirements

- Node.js 20 or later
- MongoDB locally or a MongoDB Atlas connection string
- A Google Gemini API key for AI itinerary generation

### 1. Clone the repository

```bash
git clone https://github.com/hemantsureshrathod-dev/TravelMate-Plus.git
cd TravelMate-Plus
```

### 2. Configure the backend

Create `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/travelmate
JWT_SECRET=replace_with_a_long_random_secret
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=your_available_gemini_model
CLIENT_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=30
AI_RATE_LIMIT_MAX=15
```

Use a Gemini model currently available to your API key. Keep real credentials in local environment files or your hosting provider's environment settings—never commit them to Git.

### 3. Configure the frontend

Create `client/.env`:

```env
VITE_API_URL=/api
```

### 4. Install dependencies

From the repository root, run:

```bash
cd server
npm install
cd ../client
npm install
```

### 5. Start the app

Open two terminals from the repository root.

Terminal 1 — backend:

```bash
cd server
npm run dev
```

Terminal 2 — frontend:

```bash
cd client
npm run dev
```

Then open http://localhost:5173.

## Tests and builds

Run the backend tests:

```bash
cd server
npm test
```

Build the backend and frontend from the repository root:

```bash
npm --prefix server run build
npm --prefix client run build
```

The backend tests cover key API behavior, including health checks, authentication, protected routes, trip ownership, and AI request validation.

## Security notes

- Passwords are hashed with bcrypt rather than stored as plain text.
- Protected API routes use JWT authentication.
- Trip operations check ownership so one account cannot manage another account's trips.
- API inputs are validated, and rate limits are applied to help reduce abuse.
- Keep server secrets on the backend. Only expose frontend variables intended to be public, such as `VITE_API_URL`.

## Deployment

The frontend is hosted on Vercel and the API is hosted on Render. The backend connects to MongoDB Atlas and uses a Gemini API key configured in Render's environment settings.

For production, set `VITE_API_URL` in Vercel to the backend API base URL, for example:

```env
VITE_API_URL=https://travelmate-plus-api.onrender.com/api
```

After changing a Vercel environment variable, redeploy the frontend for the change to take effect.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).
