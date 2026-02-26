# Sierra Leone National Land Commission (NLC) Website

## 1) Project Overview

This repository contains the implementation plan and delivery blueprint for a **production-ready, full-stack, multi-page web application** for the **Sierra Leone National Land Commission (NLC)** using:

- **Frontend:** React + Next.js
- **Backend:** Next.js (API routes and/or separate backend service)
- **Admin Panel:** Database-driven content management for non-technical staff
- **Database:** PostgreSQL
- **Deployment:** VPS with Docker, Traefik, and Nginx
- **File Transfer:** WinSCP (SFTP preferred; WebDAV/FTP optional)
- **Primary Domain:** `nlc.gov.sl`

---

## 2) Organization Background

The Sierra Leone National Land Commission (NLC) is mandated to regulate, manage, and coordinate land administration, building a transparent, inclusive, and technology-driven land administration system that secures tenure rights, fosters peace, and drives national development.

---

## 3) Website Purpose

The website serves as:

- The official public-facing website for NLC
- A source of clear information about NLC mandate, services, and activities
- A gateway to a **Digital Land Administration Web Portal** being built by another consultant
- A platform to improve transparency, public trust, and accessibility

---

## 4) Design & UX Requirements

The website should implement a government-grade user experience with:

- Clean, minimalist, professional design language
- Neutral color palette (greens, blues, earth tones)
- Highly readable typography and spacing
- Subtle JavaScript-powered animations/transitions
- Fully responsive layouts (mobile, tablet, desktop)
- Accessibility-first implementation (WCAG-oriented)
- Performance-optimized pages with maintainable component structure

---

## 5) Site Map / Required Pages

1. **Home**
2. **About NLC**
3. **Mandate & Functions**
4. **Services**
5. **Publications & Resources**
   - Laws & Regulations
   - Policies & Strategies
   - Reports & Studies
   - Forms & Templates
   - Guidelines & Manuals
   - Downloadable files via **Download PDF** links

   > **Clarification:** Reports in **Publications & Resources** are official reference documents (e.g., studies, annual reports, policy documents). Reports in **News & Announcements** are time-based notices/updates.

6. **Services (duplicate in source requirements)**
   - Handle gracefully by maintaining **one canonical Services page** in navigation.
7. **Digital Land Portal**
   - Landing page explaining integration with external system
   - Sub-page: **Registration**
     - Describes land registration services
     - Prominent external link to portal registration page
     - Covers types: Customary, Private, State land
   - Sub-page: **Payment**
     - Describes payable NLC services
     - Prominent external link to portal payment page
     - **No on-site payment processing**

   > This NLC website stores **no registration data** and **no payment data** for portal operations.

8. **Complaints**
   - Link to existing Google Form
9. **News & Announcements**
   - Press Releases
   - Announcements
   - Events
   - Reports
   - Tenders
   - News items
   - List view with pagination
   - Details pages (e.g., “Read Full Press Release”)
   - JavaScript-powered filtering and/or pagination
10. **Contact Us**
    - Contact form with backend submission storage

---

## 6) Admin Panel Requirements

Admin users must be able to create, update, delete, publish/unpublish:

- Press Releases
- Announcements
- Events
- Reports
- Tenders
- Publications
- News items
- Other editable website sections (hero text, contact details, etc.)

Additional admin capabilities:

- View and manage **Contact form submissions**
- Upload/manage PDFs for Publications
- Manage categories and tags
- Optional media/file manager

### Role Model

- **Super Admin** (full access)
- **Admin/Editor** (content-focused permissions)

---

## 7) Content Management Approach

Use a **database-driven CMS pattern**:

- Structured content models in PostgreSQL
- Admin UI for content lifecycle management
- Slug-based public detail pages
- Pagination for long listings
- Draft/published workflow

---

## 8) Technology Stack

- **Framework:** Next.js (App Router preferred)
- **Language:** TypeScript
- **ORM:** Prisma (recommended)
- **Database:** PostgreSQL
- **Auth:** NextAuth/Auth.js or custom JWT with secure best practices
- **File Storage:** Local uploads (MVP) or object storage (recommended for scale)
- **Containerization:** Docker + Docker Compose
- **Reverse Proxy / TLS:** Traefik
- **Optional Web Layer:** Nginx

---

## 9) Security & Credentials

### Required Initial Values (for setup only)

- Super user password: `<set-via-secret-manager>`
- PostgreSQL database: `<set-via-env>`
- PostgreSQL user: `<set-via-env>`
- PostgreSQL password: `<set-via-secret-manager>`

> ⚠️ **Critical Security Warning:** Never hardcode credentials (even in examples destined for source control). Keep all secrets in environment variables and a server-side secret manager; rotate any previously exposed credentials immediately.

### Security Controls to Implement

- Password hashing with **bcrypt** or **argon2**
- CSRF protection on state-changing routes
- HTTP-only, secure, same-site cookies
- Rate limiting for login and form endpoints
- Input validation/sanitization (e.g., Zod)
- Role-based access control for admin routes
- Audit logging for critical admin actions

---

## 10) Recommended Repository Structure

## Option A: Monorepo (Recommended)

```txt
nlc-website/
  apps/
    web/                # Public website (Next.js)
    admin/              # Admin panel (Next.js) OR admin routes in web app
  packages/
    ui/                 # Shared UI components
    db/                 # Prisma schema, migrations, seed scripts
    config/             # Shared lint/ts/prettier configs (optional)
  docker/
    nginx/
    traefik/
  docs/
  README.md
```

### Option A Tradeoffs

- ✅ Better separation of concerns
- ✅ Easier team scaling and shared packages
- ❌ Slightly higher setup complexity

## Option B: Single Next.js App

```txt
nlc-website/
  app/                  # Public pages + /admin routes
  components/
  lib/
  prisma/
  public/
  README.md
```

### Option B Tradeoffs

- ✅ Faster to start, lower complexity
- ✅ Good for small teams
- ❌ Can become harder to scale long-term

---

## 11) Data Model (PostgreSQL + Prisma)

### Core Entities

1. **User (admin users)**
   - `id`, `name`, `email`, `passwordHash`, `role`, `isActive`, timestamps

2. **Post**
   - `id`, `title`, `slug`, `excerpt`, `content`, `type`, `status`, `publishedAt`, `authorId`, timestamps
   - `type`: `PRESS_RELEASE | ANNOUNCEMENT | EVENT | REPORT | TENDER | NEWS`

3. **PublicationCategory**
   - `id`, `name`, `slug`, `description`
   - Examples: laws, policies, reports, forms, guidelines

4. **PublicationItem**
   - `id`, `title`, `slug`, `description`, `categoryId`, `pdfUrl`, `filePath`, `publishedAt`, timestamps

5. **FormSubmission**
   - `id`, `type`, `name`, `email`, `phone`, `subject`, `message`, `payload(JSONB)`, `status`, timestamps

6. **PaymentRecord**
   - If only external payment portal is used: optional minimal audit stub (no sensitive payment data)
   - Suggested fields: `id`, `reference`, `status`, `provider`, timestamps

7. **LandRegistration**
   - If registration is external-only: do **not** store registration payload
   - Optional integration log only: `id`, `externalRef`, `status`, timestamps

### Recommended Indexing

- Unique index on `Post.slug`
- Index on `Post.type`
- Index on `Post.publishedAt`
- Composite index on `(type, publishedAt DESC)`
- Index on `PublicationItem.categoryId`
- Unique index on `PublicationItem.slug`

### Prisma Schema Outline (Example)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  SUPER_ADMIN
  ADMIN
}

enum PostType {
  PRESS_RELEASE
  ANNOUNCEMENT
  EVENT
  REPORT
  TENDER
  NEWS
}

enum PublishStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

model User {
  id           String   @id @default(cuid())
  name         String
  email        String   @unique
  passwordHash String
  role         Role     @default(ADMIN)
  isActive     Boolean  @default(true)
  posts        Post[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Post {
  id          String        @id @default(cuid())
  title       String
  slug        String        @unique
  excerpt     String?
  content     String
  type        PostType
  status      PublishStatus @default(DRAFT)
  publishedAt DateTime?
  authorId    String?
  author      User?         @relation(fields: [authorId], references: [id])
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  @@index([type])
  @@index([publishedAt])
  @@index([type, publishedAt])
}

model PublicationCategory {
  id          String            @id @default(cuid())
  name        String
  slug        String            @unique
  description String?
  items       PublicationItem[]
}

model PublicationItem {
  id          String              @id @default(cuid())
  title       String
  slug        String              @unique
  description String?
  pdfUrl      String?
  filePath    String?
  publishedAt DateTime?
  categoryId  String
  category    PublicationCategory @relation(fields: [categoryId], references: [id])
  createdAt   DateTime            @default(now())
  updatedAt   DateTime            @updatedAt

  @@index([categoryId])
}

model FormSubmission {
  id        String   @id @default(cuid())
  type      String
  name      String?
  email     String?
  phone     String?
  subject   String?
  message   String?
  payload   Json?
  status    String   @default("new")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 12) Public-Site Functional Requirements

- News & Announcements list filters (type/category/date)
- Client-side and/or server-side pagination
- Slug-based detail pages
- SEO metadata (title, description, Open Graph, Twitter tags)
- XML sitemap + robots.txt
- Optimized images and caching headers
- Accessibility: semantic HTML, heading hierarchy, labels, aria attributes

---

## 13) HTML/CSS to Next.js Conversion Plan

If existing static HTML and CSS are already available:

1. **Inventory static pages**
   - Map each HTML file to a route (`/about`, `/services`, `/publications`, etc.)

2. **Create shared layout and components**
   - Extract repeated sections into reusable components:
     - `Header`
     - `Navbar`
     - `Footer`
     - `Hero`
     - `Card`
     - `SectionTitle`

3. **Move static assets**
   - Place images/fonts/files under `public/`
   - Update source URLs to Next.js-compatible paths

4. **Adopt styling strategy**
   - Keep global base styles in `app/globals.css`
   - Use CSS Modules per component for maintainability
   - Preserve existing visual identity while refactoring selectors gradually

5. **Introduce dynamic content**
   - Replace hardcoded HTML content blocks with database-driven queries
   - Use provided text source files to seed initial content where applicable

6. **Progressive enhancement**
   - Add subtle animations/transitions with lightweight JS/CSS
   - Keep performance and accessibility as constraints

---

## 14) Authentication & Authorization (Admin)

Recommended setup:

- **NextAuth/Auth.js** with credentials provider (or secure custom JWT)
- Password hashed with bcrypt/argon2
- Role checks on all admin routes/actions
- Middleware guard for `/admin/*`
- Session expiry + secure cookie settings
- CSRF protection for form actions

---

## 15) Environment Variables

Create `.env` (local) and `.env.production` (server secret-managed):

```env
# App
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=<set-db-name>
DB_USER=<set-db-user>
DB_PASSWORD=<set-strong-db-password>
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public

# Auth
AUTH_SECRET=replace-with-long-random-secret
AUTH_URL=http://localhost:3000

# Admin bootstrap (one-time seed)
SEED_SUPERADMIN_EMAIL=admin@nlc.gov.sl
SEED_SUPERADMIN_PASSWORD=<set-secure-random-password>

# File uploads
UPLOAD_DIR=./uploads
MAX_UPLOAD_MB=20

# External portal links
NEXT_PUBLIC_PORTAL_REGISTRATION_URL=https://portal.example.gov.sl/registration
NEXT_PUBLIC_PORTAL_PAYMENT_URL=https://portal.example.gov.sl/payment
NEXT_PUBLIC_COMPLAINTS_FORM_URL=https://forms.gle/your-google-form-id
```

> Do not commit real `.env` files. Commit `.env.example` only.

---

## 16) Local Setup & Commands

```bash
# 1) From repository root
cd nlc-website

# 2) Install dependencies (example: pnpm workspaces)
pnpm install

# 3) Create environment file
cp .env.example .env

# 4) Start PostgreSQL (if using docker compose profile)
docker compose up -d postgres

# 5) Run Prisma migrations
pnpm --filter @nlc/db prisma migrate dev

# 6) Generate Prisma client
pnpm --filter @nlc/db prisma generate

# 7) Seed initial data + super admin
pnpm --filter @nlc/db seed

# 8) Run web and admin apps
pnpm dev
```

If using single-app structure:

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npx prisma db seed
npm run dev
```

---

## 17) Dockerized Production Deployment (VPS)

### Example `docker-compose.yml`

```yaml
version: "3.9"

services:
  traefik:
    image: traefik:v3.1
    command:
      - --api.dashboard=true
      - --providers.docker=true
      - --providers.docker.exposedbydefault=false
      - --entrypoints.web.address=:80
      - --entrypoints.websecure.address=:443
      - --certificatesresolvers.letsencrypt.acme.tlschallenge=true
      - --certificatesresolvers.letsencrypt.acme.email=admin@nlc.gov.sl
      - --certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./docker/traefik/letsencrypt:/letsencrypt
    restart: unless-stopped

  web:
    build:
      context: .
      dockerfile: ./apps/web/Dockerfile
    env_file:
      - .env.production
    labels:
      - traefik.enable=true
      - traefik.http.routers.nlc-web.rule=Host(`nlc.gov.sl`,`www.nlc.gov.sl`)
      - traefik.http.routers.nlc-web.entrypoints=websecure
      - traefik.http.routers.nlc-web.tls.certresolver=letsencrypt
      - traefik.http.services.nlc-web.loadbalancer.server.port=3000
    depends_on:
      - db
    restart: unless-stopped

  nginx:
    image: nginx:1.27-alpine
    volumes:
      - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - web
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

### Example Traefik Labels (Quick Reference)

```txt
traefik.enable=true
traefik.http.routers.nlc-web.rule=Host(`nlc.gov.sl`,`www.nlc.gov.sl`)
traefik.http.routers.nlc-web.entrypoints=websecure
traefik.http.routers.nlc-web.tls.certresolver=letsencrypt
traefik.http.services.nlc-web.loadbalancer.server.port=3000
```

### Example Nginx Config Outline

```nginx
server {
    listen 80;
    server_name nlc.gov.sl www.nlc.gov.sl;

    location / {
        proxy_pass http://web:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Optional: serve static uploads if required
    location /uploads/ {
        alias /var/www/uploads/;
        autoindex off;
    }
}
```

### Production Deployment Steps

1. Provision VPS (Ubuntu LTS recommended)
2. Install Docker + Docker Compose plugin
3. Clone repository and configure `.env.production`
4. Point DNS A records (`nlc.gov.sl`, `www.nlc.gov.sl`) to VPS public IP
5. Run:

```bash
docker compose pull
docker compose build --no-cache
docker compose up -d
```

6. Verify TLS certificates issued by Traefik
7. Run migrations and seed safely in production mode
8. Enable backups and monitoring

---

## 18) DNS, SSL, and Operations

### DNS

- Create `A` record: `nlc.gov.sl -> <VPS_PUBLIC_IP>`
- Create `A` record: `www.nlc.gov.sl -> <VPS_PUBLIC_IP>`

### SSL

- Traefik obtains and renews Let’s Encrypt certificates automatically
- Ensure ports `80` and `443` are reachable

### Backups (Minimum Strategy)

- Daily PostgreSQL dumps (`pg_dump`) to encrypted storage
- Keep at least 7 daily + 4 weekly backups
- Test restore procedure regularly

Example backup command:

```bash
PGPASSWORD="$DB_PASSWORD" pg_dump -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -Fc -f "/backups/${DB_NAME}-$(date +%F).dump"
```

---

## 19) WinSCP Usage Guidance

WinSCP can be used for:

- Uploading deployment assets/configuration via **SFTP**
- Managing shared upload folders (e.g., publication PDFs)

Recommended connection method:

- Prefer **SFTP (SSH)** over FTP/WebDAV for security
- Restrict user permissions and use SSH keys where possible

Safer production alternatives:

- Upload files through authenticated admin panel
- Store files in object storage (S3-compatible) + signed URLs/CDN

---

## 20) Content Governance & Editorial Workflow

- Draft -> Review -> Publish workflow
- Role-based publishing permissions
- Slug conventions for readability and SEO
- Scheduled publishing (optional)
- Archive old notices without deletion

---

## 21) SEO, Performance, Accessibility Checklist

### SEO

- Unique metadata per page
- Open Graph and Twitter card tags
- Canonical URLs and sitemap.xml

### Performance

- Next.js image optimization
- Route-level code splitting
- Caching headers for static assets
- Lazy loading where appropriate

### Accessibility

- Proper landmarks and semantic tags
- Keyboard navigable menus/forms
- Color contrast checks
- ARIA labels for interactive components

---

## 22) Post-Deployment Checklist

- [ ] DNS resolves to VPS
- [ ] SSL certificate valid for root + www
- [ ] Admin login works securely
- [ ] Contact form submissions visible in admin
- [ ] Publication PDF downloads functional
- [ ] External portal links correct (Registration/Payment)
- [ ] Complaints Google Form link working
- [ ] Backups running and restore tested
- [ ] Error monitoring/logging enabled
- [ ] Security headers configured

---

## 23) Expected Deliverables

- Full source code (frontend + backend/admin)
- PostgreSQL schema and migrations
- Seed scripts for initial admin and baseline content
- Admin panel with role-based access
- Public website pages and dynamic listings
- Deployment configs (Docker, Traefik, Nginx)
- Technical and operational documentation
- Post-deployment validation checklist

---

## 24) Suggested Initial Implementation Milestones

1. Set up project structure and tooling
2. Implement database schema and auth
3. Build public pages and shared components
4. Build admin CRUD workflows
5. Add file upload and publication download flows
6. Integrate SEO/accessibility/performance improvements
7. Containerize and deploy to staging VPS
8. UAT, hardening, production rollout

---

## 25) License & Ownership

- All code, content, and deployment artifacts should be owned and managed by the Sierra Leone National Land Commission or its designated authority.
- Add an explicit license file based on NLC legal policy.
