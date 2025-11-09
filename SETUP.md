# Visa Evaluation Tool - Setup Guide

## Quick Start

### 1. Server Setup

\`\`\`bash
cd server
npm install
\`\`\`

### 2. Environment Configuration

Create `.env` file in `/server`:
\`\`\`
MONGODB_URI=mongodb://localhost:27017/visa-evaluator
GEMINI_API_KEY=your_gemini_free_api_key_here
PORT=5000
NODE_ENV=development
MAX_SCORE_CAP=85
\`\`\`

### 3. Start Server

\`\`\`bash
npm start

# or for development with hot reload

npm run dev
\`\`\`

### 4. Client Setup (in separate terminal)

\`\`\`bash
cd client
npm install
npm start
\`\`\`

## Connection Points to Complete

### MongoDB Connection

- Update `MONGODB_URI` in `.env`
- Server will auto-connect on startup

### Gemini API Integration

- Get free API key from: https://makersuite.google.com/app/apikey
- Add to `GEMINI_API_KEY` in `.env`
- Uncomment the Gemini API call in `server/services/evaluationService.js` (line ~30)

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/evaluations/config` - Get visa configurations
- `POST /api/evaluations/submit` - Submit evaluation (multipart form)
- `GET /api/evaluations/:id` - Get evaluation result
- `POST /api/partners/create` - Create partner
- `GET /api/partners/evaluations` - Get partner evaluations (requires x-api-key header)

## File Structure

\`\`\`
visa-evaluator/
├── server/
│ ├── models/
│ │ ├── Evaluation.js
│ │ └── Partner.js
│ ├── routes/
│ │ ├── evaluationRoutes.js
│ │ └── partnerRoutes.js
│ ├── services/
│ │ └── evaluationService.js
│ ├── server.js
│ ├── package.json
│ └── .env.example
└── client/
├── src/
│ ├── pages/
│ │ └── EvaluationForm.jsx
│ └── App.jsx
└── package.json
\`\`\`

## Ready to Connect

- ✅ Backend structure complete
- ✅ MongoDB models defined
- ✅ React form built
- ✅ API routes setup
- 🔗 Just add your MongoDB connection string
- 🔗 Just add your Gemini API key
- 🔗 Uncomment Gemini API calls when ready
