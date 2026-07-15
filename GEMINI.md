# Project Context: Diego Motorsport Backend

Diego Motorsport Backend is a high-performance, robust, and scalable REST and Real-Time API built on the **NestJS** framework, designed for the Diego Motorsport platform.

## 🚀 Tech Stack

- **Core Framework:** [NestJS (v11)](https://nestjs.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Database ORM:** [Prisma ORM (v7)](https://www.prisma.io/) with multi-file schema management.
- **Primary Database:** [PostgreSQL](https://www.postgresql.org/)
- **Caching:** [Redis](https://redis.io/)
- **Authentication:** Passport.js (JWT/Local), 2FA, OAuth2 (Google).
- **Storage:** Cloudflare R2 (AWS S3 SDK), Cloudinary.
- **Real-Time:** [Socket.io](https://socket.io/)
- **Package Manager:** [pnpm (v10)](https://pnpm.io/)
- **Containerization:** Docker & Docker Compose with Caddy (reverse proxy).

## 📁 Key Directories

- `prisma/`: Database management, migrations, and modularized schema definitions.
- `src/`:
  - `main/`: Core business logic modules (Feature-driven architecture).
  - `common/`: Shared decorators, guards, filters, utilities, mail service, and Prisma client wrappers.
- `test/`: End-to-end (E2E) testing configurations and specs.

## ⚙️ Development Conventions

- **Feature-Driven Architecture:** Code is organized by functional domain (e.g., `src/main/auth`, `src/main/posts`).
- **Typing:** Strict TypeScript typing is required.
- **Formatting/Linting:** Managed via ESLint and Prettier (`npm run lint`, `npm run format`).
- **API Documentation:** Swagger/OpenAPI documentation is available at `/docs`.

## 🛠️ Commands

| Task | Command |
| :--- | :--- |
| **Install Dependencies** | `pnpm install` |
| **Run Dev Server** | `pnpm run dev` |
| **Build Project** | `pnpm run build` |
| **Start Prod** | `pnpm run start:prod` |
| **Run Migrations** | `pnpm run migrate` |
| **Seed Dev DB** | `pnpm run seed:dev` |
| **Run Tests (Unit)** | `pnpm run test` |
| **Run Tests (E2E)** | `pnpm run test:e2e` |

## 🐳 Docker Deployment

- **Dev:** `docker compose -f docker-compose.dev.yml up -d` (PostgreSQL/Redis)
- **Prod:** `docker compose up -d --build` (App + DB + Redis + Caddy)
