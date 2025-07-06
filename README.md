# Monster Maker

A modern web application for creating and exporting custom monsters for FoundryVTT. Built with React, Node.js, and Supabase.

## Features

- 🔐 **User Authentication** - Secure login and registration with Supabase Auth
- 🐉 **Monster Creation** - Comprehensive monster builder with Pathfinder 2e stats
- 📊 **Dashboard** - Manage and organize your monster collection
- 📤 **FoundryVTT Export** - Export monsters as JSON files compatible with FoundryVTT
- 🎨 **Modern UI** - Beautiful, responsive interface built with Tailwind CSS
- 🔒 **Secure** - Row-level security and proper authentication

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React Icons
- **Backend**: Node.js, Express, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Deployment**: Ready for Vercel, Netlify, or similar platforms

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone the Repository

```bash
git clone <repository-url>
cd monsterMaker
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and keys
3. Run the database schema:

```sql
-- Copy and paste the contents of database/schema.sql into your Supabase SQL editor
```

### 3. Configure Environment Variables

#### Server Configuration
Copy `server/env.example` to `server/.env`:

```bash
cd server
cp env.example .env
```

Edit `server/.env`:
```env
PORT=3001
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Client Configuration
Copy `client/env.example` to `client/.env`:

```bash
cd client
cp env.example .env
```

Edit `client/.env`:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Install Dependencies

```bash
# Install all dependencies (root, server, and client)
npm run install:all
```

### 5. Start Development Servers

```bash
# Start both server and client in development mode
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Project Structure

```
monsterMaker/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── lib/           # Utility libraries
│   │   ├── pages/         # Page components
│   │   └── main.jsx       # App entry point
│   ├── package.json
│   └── vite.config.js
├── server/                # Node.js backend
│   ├── index.js          # Express server
│   ├── package.json
│   └── .env
├── database/
│   └── schema.sql        # Database schema
└── package.json          # Root package.json
```

## API Endpoints

### Authentication Required
All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Monsters
- `GET /api/monsters` - Get user's monsters
- `GET /api/monsters/:id` - Get specific monster
- `POST /api/monsters` - Create new monster
- `PUT /api/monsters/:id` - Update monster
- `DELETE /api/monsters/:id` - Delete monster
- `GET /api/monsters/:id/export` - Export monster for FoundryVTT

### User Profile
- `GET /api/profile` - Get user profile

## Monster Data Structure

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "Dragon",
  "level": 10,
  "size": "huge",
  "rarity": "rare",
  "hp": 200,
  "ac": 25,
  "perception": 15,
  "fortitude": 18,
  "reflex": 16,
  "will": 20,
  "description": "A fearsome dragon...",
  "private_notes": "GM notes...",
  "image_url": "https://example.com/dragon.jpg",
  "skills": {},
  "attacks": [],
  "items": [],
  "spells": {},
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

## FoundryVTT Export Format

The export endpoint generates JSON files compatible with FoundryVTT's NPC format:

```json
{
  "name": "Dragon",
  "type": "npc",
  "img": "https://example.com/dragon.jpg",
  "data": {
    "level": { "value": 10 },
    "details": {
      "level": { "value": 10 },
      "publicNotes": "A fearsome dragon...",
      "privateNotes": "GM notes..."
    },
    "traits": {
      "size": { "value": "huge" },
      "rarity": { "value": "rare" }
    },
    "saves": {
      "fortitude": { "value": 18 },
      "reflex": { "value": 16 },
      "will": { "value": 20 }
    },
    "attributes": {
      "hp": { "value": 200, "max": 200 },
      "ac": { "value": 25 },
      "perception": { "value": 15 }
    }
  },
  "flags": {
    "monster-maker": {
      "exported": true,
      "exportDate": "2024-01-01T00:00:00Z"
    }
  }
}
```

## Development

### Available Scripts

```bash
# Root level
npm run dev              # Start both server and client
npm run dev:server       # Start server only
npm run dev:client       # Start client only
npm run build            # Build client for production
npm run start            # Start production server
npm run install:all      # Install all dependencies

# Server
cd server
npm run dev              # Start with nodemon
npm start                # Start production

# Client
cd client
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
```

### Environment Variables

#### Server (.env)
- `PORT` - Server port (default: 3001)
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `SUPABASE_ANON_KEY` - Supabase anonymous key

#### Client (.env)
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

## Deployment

### Frontend (Vercel/Netlify)

1. Build the client:
```bash
cd client
npm run build
```

2. Deploy the `dist` folder to your preferred platform

### Backend (Railway/Render/Heroku)

1. Set environment variables
2. Deploy the `server` folder
3. Update the frontend API proxy configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, please open an issue on GitHub or contact the maintainers.
