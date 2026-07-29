# Sharma Event Management

Premium event management platform for Sharma Events — Haldwani, Kathgodam, Nainital & Uttarakhand.

## Stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS, Framer Motion, React Router
- **Backend:** Node.js, Express, MySQL (Prisma), JWT, Multer, Cloudinary, Nodemailer

## Quick Start

### Prerequisites

- Node.js 20+
- MySQL 8+ running locally (or Hostinger MySQL for remote)

### Install

```bash
npm run install:all
npm install
```

### Environment

Copy `backend/.env.example` to `backend/.env` and configure:

```env
DATABASE_URL="mysql://root:password@127.0.0.1:3306/sharma_events"
JWT_SECRET=your-secret
ADMIN_EMAIL=admin@sharmaevents.com
ADMIN_PASSWORD=Admin@123456
CLIENT_URL=http://localhost:5173
SITE_URL=http://localhost:5173
```

Create the database once, then push the Prisma schema:

```bash
cd backend
npx prisma db push
# or: npx prisma migrate dev --name init
```

Optional: Cloudinary and SMTP credentials for image uploads and email.

### Seed Demo Data

```bash
npm run seed
```

Seeds admin user, 5 services, 5 SEO blogs, gallery, testimonials, and settings.

### Run Development

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Admin: http://localhost:5173/admin/login

### Admin Login

- Email: `admin@sharmaevents.com`
- Password: `Admin@123456`

## Features

### Public Site

Home, About, Services (dynamic), Gallery, Blog, Contact, Privacy, Terms, 404

### Admin Dashboard

JWT auth, analytics, Blog CRUD, Services CRUD, Gallery bulk upload, Contact management (CSV export), Settings, Testimonials

### SEO

Meta tags, Open Graph, Twitter Cards, JSON-LD (Organization, LocalBusiness, Service, Article, FAQ, Breadcrumb), `robots.txt`, dynamic `sitemap.xml`

## Project Structure

```
├── backend/          # Express API
│   ├── prisma/       # Prisma schema + migrations
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── lib/          # Prisma client
│       ├── middlewares/
│       ├── routes/
│       ├── seed/
│       └── utils/
└── frontend/         # React app
    └── src/
        ├── api/
        ├── animations/
        ├── components/
        ├── contexts/
        ├── hooks/
        ├── layouts/
        ├── pages/
        ├── types/
        └── utils/
```

## Production Build

```bash
npm run build
npm start
```

In production, Express serves the React build from `frontend/dist` (single Hostinger Web App).

## Deploy to Hostinger

See the full guide: **[DEPLOY-HOSTINGER.md](./DEPLOY-HOSTINGER.md)**  
Uses Hostinger MySQL via `DATABASE_URL` (no MongoDB Atlas).
