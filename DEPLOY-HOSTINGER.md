# Hostinger / Production Deployment Guide
# Sharma Event Management (React + Express + MySQL / Prisma)

This project is configured as **one Node.js Web App**:
Express API + built React frontend on the same server (Hostinger Business Web App),
using Hostinger’s built-in **MySQL** database via **Prisma**.

---

## What you need before starting

| Item | Why | Free option |
|------|-----|-------------|
| Hostinger Business plan | Deploy Web App (Node.js) + MySQL | You already have this |
| Domain (optional) | Your live URL | Hostinger free subdomain works first |
| GitHub account | Deploy from repo | Free |
| Cloudinary account (optional) | Image uploads in admin | Free plan |
| Gmail / SMTP (optional) | Contact form emails | Gmail App Password |

No MongoDB Atlas account is required.

---

## STEP 1 — Create MySQL database on Hostinger

1. Log in to **hPanel** → **Databases** → **MySQL Databases** (wording may vary slightly).
2. Create a new database, e.g. `sharma_events`.
3. Create a database user with a strong password and grant that user **full access** to the database.
4. Note the connection details Hostinger shows:

| Field | Example |
|-------|---------|
| Host | `localhost` (on Hostinger) or a remote hostname if offered |
| Port | `3306` |
| Database name | `u123456789_sharma` |
| Username | `u123456789_admin` |
| Password | *(your password)* |

5. Build the Prisma connection string (URL-encode special characters in the password):

```text
mysql://DB_USER:DB_PASSWORD@localhost:3306/DB_NAME
```

Example:

```text
mysql://u123456789_admin:My%40SecurePass@localhost:3306/u123456789_sharma
```

Keep this string safe — you will set it as `DATABASE_URL`.

> If you seed from your PC against Hostinger MySQL, use the **remote/public** MySQL host Hostinger provides (not `localhost`), and allow remote access if your plan supports it.

---

## STEP 2 — Push project to GitHub

On your PC (in the project folder):

```bash
git init
git add .
git commit -m "Prepare Sharma Events for Hostinger deploy"
```

Create a new empty repo on GitHub (do **not** add README), then:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sharma-event-management.git
git push -u origin main
```

> Never commit `.env` files (already in `.gitignore`).

---

## STEP 3 — Deploy Web App on Hostinger

1. Log in to **hPanel** → **Websites** → **Add Website**.
2. Choose **Deploy Web App** (JS / Node.js).
3. Select **GitHub** → authorize Hostinger → pick your repo + `main` branch.
4. Set Node version to **20** (or 22 if offered).
5. Confirm / set these build settings:

| Setting | Value |
|---------|--------|
| **Root directory** | `.` (project root) |
| **Install command** | `npm install` |
| **Build command** | `npm run build` |
| **Start / Output / Entry** | `npm start` |

6. Click **Deploy** and wait until it finishes (first build can take several minutes).

`npm install` runs Prisma Client generation (`prisma generate`).  
`npm run build` builds the frontend, regenerates Prisma Client, then compiles the backend.

---

## STEP 4 — Add environment variables

In the Node.js Web App dashboard → **Environment Variables** (or Settings), add:

```env
NODE_ENV=production
DATABASE_URL=mysql://DB_USER:DB_PASSWORD@localhost:3306/DB_NAME
JWT_SECRET=change-this-to-a-long-random-secret-string
JWT_EXPIRES_IN=7d
CLIENT_URL=https://YOUR-DOMAIN.com
SITE_URL=https://YOUR-DOMAIN.com
ADMIN_EMAIL=admin@sharmaevents.com
ADMIN_PASSWORD=Admin@123456
```

Optional (recommended):

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_gmail_app_password
SMTP_FROM=Sharma Event Management <your@gmail.com>
```

> `CLIENT_URL` and `SITE_URL` must be your **live** HTTPS URL (same domain).  
> Hostinger also sets `PORT` automatically — do **not** override it unless support asks you to.  
> URL-encode special characters in the MySQL password inside `DATABASE_URL`.

After saving, **Redeploy / Restart** the app.

---

## STEP 5 — Create database tables (migrate / push)

After `DATABASE_URL` is set, create the schema once.

### Option A — Hostinger terminal / SSH (preferred)

```bash
cd domains/YOUR-DOMAIN/public_html
# or the path shown in your Web App file manager
cd backend
npx prisma migrate deploy
# If you have not committed migrations yet, first launch can use:
# npx prisma db push
```

### Option B — From your PC (remote MySQL host)

```bash
cd backend
# Use Hostinger remote MySQL host in DATABASE_URL
npx prisma migrate deploy
# or: npx prisma db push
```

---

## STEP 6 — Seed demo content (one time)

After tables exist, run the seed once.

### Option A — Hostinger terminal / SSH

```bash
npm run seed
```

### Option B — Seed from your PC against Hostinger MySQL

1. On your PC, set `backend/.env` with the same `DATABASE_URL` (remote host).
2. Run:

```bash
cd backend
npm run seed
```

This fills services, blogs, gallery, settings, and creates admin:

- Email: `admin@sharmaevents.com` (or your `ADMIN_EMAIL`)
- Password: `Admin@123456` (or your `ADMIN_PASSWORD`)

**Change the admin password after first login.**

---

## STEP 7 — Point your domain + SSL

1. In hPanel → **Domains** → attach your domain to this Web App.
2. Enable **SSL** (Let's Encrypt) — usually automatic.
3. Update env again if the final URL changed:

```env
CLIENT_URL=https://yourdomain.com
SITE_URL=https://yourdomain.com
```

4. Redeploy / Restart.

---

## STEP 8 — Test the live site

Open:

- `https://yourdomain.com` — homepage  
- `https://yourdomain.com/api/health` — should return JSON `{ success: true, ... }`  
- `https://yourdomain.com/admin/login` — admin login  
- `https://yourdomain.com/services` — services  
- `https://yourdomain.com/blog` — blogs  

Checklist:

- [ ] Homepage loads with images  
- [ ] Services / Gallery / Blog load from MySQL  
- [ ] Contact form submits  
- [ ] Admin login works  
- [ ] `/sitemap.xml` opens  

---

## How the deploy works (this project)

```text
npm install          → installs root + backend + frontend (postinstall)
                     → prisma generate (backend)
npm run build        → builds Vite frontend → frontend/dist
                     → prisma generate + tsc → backend/dist
npm start            → node backend/dist/index.js
                     → API on /api/*
                     → React SPA served from frontend/dist
```

Local images in `frontend/public/images/` are copied into `frontend/dist/images/` during the Vite build.

---

## Updating the site later

```bash
# make changes locally, then:
git add .
git commit -m "Update site content"
git push origin main
```

Hostinger (GitHub deploy) will rebuild automatically, or click **Redeploy** in hPanel.

If you change `prisma/schema.prisma`, create/apply a migration before or during deploy:

```bash
cd backend
npx prisma migrate dev --name your_change   # locally
npx prisma migrate deploy                   # on Hostinger
```

---

## Common problems & fixes

| Problem | Fix |
|---------|-----|
| App builds but site is blank | Check `NODE_ENV=production` and that `npm run build` finished without errors |
| `/api/health` fails | Check logs in Web App dashboard; verify `DATABASE_URL` |
| MySQL connection error | Confirm DB user/password/host; URL-encode special password characters; on Hostinger Web App use `localhost` |
| Tables missing / Prisma errors | Run `npx prisma migrate deploy` or `npx prisma db push` once |
| Admin login fails | Run seed again; confirm `ADMIN_EMAIL` / `ADMIN_PASSWORD` |
| Images missing | Confirm `frontend/public/images` exists and build includes them; or set Cloudinary |
| Contact emails not sending | Fill SMTP vars or use Hostinger email SMTP |
| CORS / cookie issues | `CLIENT_URL` and `SITE_URL` must match the exact live HTTPS domain |

---

## Quick Hostinger settings summary (copy this)

- **Plan:** Business Web Hosting → Deploy Web App  
- **Node:** 20.x  
- **Install:** `npm install`  
- **Build:** `npm run build`  
- **Start:** `npm start`  
- **DB:** Hostinger MySQL + Prisma (`DATABASE_URL`)  
- **Env:** `NODE_ENV`, `DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL`, `SITE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`

---

## Optional next upgrades

- Custom domain + email on Hostinger  
- Cloudinary for admin image uploads  
- Stronger rate limits / captcha on contact form  
