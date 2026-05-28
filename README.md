# Bantu Khaya Website

A modern Next.js website with Strapi CMS for the Bantu Khaya Group ecosystem.

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Strapi 5 CMS
- **Database**: SQLite (development), PostgreSQL (production)

## Project Structure

```
.
├── app/              # Next.js app directory (pages and layouts)
├── components/       # React components
├── lib/             # Utility functions and Strapi API client
├── strapi/          # Strapi CMS backend
└── public/          # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/paulmacharaga/bantukhaya.git
cd bantukhaya
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install Strapi dependencies:
```bash
cd strapi
npm install
cd ..
```

4. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Strapi configuration:
```
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-api-token
```

### Running the Development Servers

1. Start Strapi CMS (port 1337):
```bash
cd strapi
npm run dev
```

2. Start Next.js frontend (port 3000):
```bash
# In a new terminal
npm run dev
```

3. Open your browser:
- Frontend: http://localhost:3000
- Strapi Admin: http://localhost:1337/admin

## Deployment

### Strapi (Backend)
Deploy to [Strapi Cloud](https://strapi.io/cloud) for easiest setup:
- Connect your GitHub repository
- Set root directory to `strapi/`
- Deploy

### Next.js (Frontend)
Deploy to [Vercel](https://vercel.com):
- Connect your GitHub repository
- Keep root directory as `/`
- Add environment variables:
  - `STRAPI_URL` - your Strapi Cloud URL
  - `STRAPI_API_TOKEN` - your Strapi API token
- Deploy

## Content Management

Access the Strapi admin panel at http://localhost:1337/admin to manage:
- Companies (sub-ventures)
- Services
- Projects
- Blog posts
- Navigation items
- Site settings
- About page content

## Features

- **Animated Orbit Network**: Interactive company nodes with curved connector patterns
- **Starfield Background**: Twinkling stars with shooting stars animation
- **Responsive Design**: Mobile-first with adaptive layouts
- **Strapi CMS**: Full content management for all site content
- **TypeScript**: Type-safe codebase
- **Tailwind CSS**: Utility-first styling

## License

MIT
