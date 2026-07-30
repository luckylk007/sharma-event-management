# Hostinger Static Deploy Guide
# Sharma Event Management (Vite — no backend)

This is a **static Vite website**. No Node server, no MySQL, no Prisma.

---

## Build on your PC

```powershell
cd "E:\projects\sharma event management"
npm install
npm run build
```

Output folder: `dist/`

---

## Upload to Hostinger

### Option A — File Manager (simplest)

1. hPanel → **Files → File Manager**
2. Open `public_html` for `sharma.lacebylennox.in` (or your domain)
3. Delete old Node app files if present (optional backup first)
4. Upload **everything inside** `dist` (not the `dist` folder itself)
5. Confirm `index.html` is in `public_html`

### Option B — Git static deploy

| Setting | Value |
|---------|--------|
| Framework | **Vite** (or Static / Other) |
| Root directory | `.` (repo root) |
| Install | `npm install` |
| Build | `npm run build` |
| Output directory | `dist` |
| Start command | *(leave empty — static only)* |

No environment variables required.

---

## SPA routing (important)

For React Router paths like `/services/wedding-planning` to work, Hostinger must serve `index.html` for unknown routes.

A `.htaccess` is already included in `public/` and copied into `dist` on build:

```apache
Options -MultiViews
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

---

## After upload checklist

- [ ] Homepage loads
- [ ] `/services`, `/blog`, `/gallery` work (refresh on those URLs)
- [ ] Images under `/images/...` load
- [ ] Contact form opens WhatsApp
- [ ] `/admin` redirects home

---

## Content updates

1. Edit `src/data/*.ts`
2. `npm run build`
3. Re-upload `dist` contents
