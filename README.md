# Diego Motorsport Backend

Diego Motorsport Backend is a high-performance, robust, and scalable REST and Real-Time API built on the **NestJS** framework. It uses **TypeScript** for type safety, **Prisma ORM** for database mapping, **PostgreSQL** as the primary datastore, and **Redis** for performant caching.

This backend serves as the foundation for the Diego Motorsport platform, powering user profiles, real-time messaging, map features, racing events, challenges, lap times, and admin overview panels.

---

## 🚀 Tech Stack

- **Core Framework:** [NestJS (v11)](https://nestjs.com/) — A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **Language:** [TypeScript](https://www.typescriptlang.org/) — Typed superset of JavaScript for reliable application scaling.
- **Database ORM:** [Prisma ORM (v7)](https://www.prisma.io/) — Modern database toolkit with support for multi-file schema management.
- **Primary Database:** [PostgreSQL](https://www.postgresql.org/) — Powerful open-source relational database.
- **Caching:** [Redis](https://redis.io/) — In-memory data structure store used for caching and performance boost.
- **Authentication & Authorization:**
  - [Passport.js](http://www.passportjs.org/) (Local & JWT strategies)
  - JWT Tokens (Access & Refresh tokens flow)
  - Two-Factor Authentication (2FA) support
  - OAuth2 Social Logins (Google Auth via `google-auth-library`)
- **File & Media Storage:**
  - Cloudflare R2 (via AWS S3 Client SDK) — For cost-effective object storage.
  - Cloudinary — Alternative/additional cloud-based image and video management.
- **Real-Time Communication:**
  - [Socket.io](https://socket.io/) (WebSockets) — Used for live chat features, message receipts, and active live participants tracking.
- **Services & Notifications:**
  - Nodemailer — For verification emails, OTPs, and password reset flows.
  - Firebase Admin SDK — For sending secure push notifications to mobile devices.
- **Package Manager:** [pnpm (v10)](https://pnpm.io/) — Fast, disk-space-efficient package manager.
- **Containerization:** [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) with **Caddy** as a reverse proxy.

---

## 📁 Directory Structure

```text
diegovillariber-backend/
├── prisma/                  # Database management files
│   ├── generated/           # Auto-generated Prisma client classes
│   ├── migrations/          # SQL database migration history files
│   └── schema/              # Multi-file Prisma schema configuration
│       ├── schema.prisma    # Base schema definitions (enums, datasources)
│       ├── user.prisma      # User & profile models
│       ├── post.prisma      # Social posts, likes, comments, reposts
│       ├── challenge.prisma # Platform programs and racing challenges
│       └── ...              # Other entity-specific schemas
├── src/
│   ├── main.ts              # Application bootstrap entry point
│   ├── app.module.ts        # Main root application module
│   ├── common/              # Global decorators, guards, filters, and helpers
│   │   ├── decorator/       # Custom NestJS decorators (e.g., @GetUser)
│   │   ├── firebase/        # Firebase Admin Client Initialization
│   │   ├── guards/          # JWT, Roles, and 2FA request guards
│   │   ├── helpers/         # Request handling utilities
│   │   ├── mail/            # Nodemailer SMTP configuration and services
│   │   ├── prisma/          # Prisma Client Service wrappers
│   │   ├── seed/            # Seed script to populate default data
│   │   ├── strategies/      # Passport authentication strategies
│   │   └── utils/           # Utility functions
│   └── main/                # Feature-driven modules (Core Business Logic)
│       ├── admin/           # Admin-only dashboards, management, and stats
│       ├── auth/            # Sign-up, Sign-in, 2FA, OTP, Resets
│       ├── chat/            # Real-time WebSockets & Messages
│       ├── discover/        # Search, tags, and exploration engines
│       ├── files/           # Cloudflare R2 Uploads and CDN resolution
│       ├── map/             # Location-based services & maps
│       ├── motorsport/      # Rank calculations and leaderboard management
│       ├── notification/    # In-app notification management
│       ├── posts/           # User posting, commenting, and reactions
│       ├── pro-profile/     # Special profiles (Ambassadors, Partners)
│       ├── product/         # Items and parts listings
│       ├── program/         # Events, Challenges, and Lap Times
│       ├── property/        # Car, Bike, and Garage details
│       ├── racing-vote/     # User voting for racing challenges
│       ├── sportting-request/ # Photo spotting requests
│       └── user/            # User configurations, blocking, and points
├── Dockerfile               # Multi-stage production container build definition
├── docker-compose.yml       # Production Compose services (App, DB, Redis, Caddy)
├── docker-compose.dev.yml   # Development database-only Compose services
└── Caddyfile                # Reverse proxy routing definitions
```

---

## ⚙️ Environment Variables Setup

Before running the application, copy the example environment template:

```bash
cp .env.example .env
```

Here are the key environment configurations required:

| Variable | Description | Example Value |
|---|---|---|
| `PORT` | Local port the NestJS server binds to | `5000` |
| `NODE_ENV` | Mode the app runs in | `development` / `production` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5433/diego_db` |
| `DB_USER` | Database username (for docker service initialization) | `postgres` |
| `DB_PASSWORD` | Database password (for docker service initialization) | `postgres` |
| `DB_NAME` | Database name | `diego_db` |
| `REDIS_PASSWORD` | Access password for the Redis service | `redis_secure_password` |
| `JWT_ACCESS_SECRET` | Secret key used to sign JWT Access tokens | *Random long string* |
| `JWT_ACCESS_EXPIRES` | Expiry duration for JWT Access tokens | `1d` |
| `JWT_REFRESH_SECRET`| Secret key used to sign JWT Refresh tokens | *Random long string* |
| `JWT_REFRESH_EXPIRES`| Expiry duration for JWT Refresh tokens | `7d` |
| `GOOGLE_CLIENT_ID` | OAuth2 Client ID from Google Console | `your-google-client-id.apps.googleusercontent.com` |
| `MAIL_HOST` | Host address of SMTP email service | `smtp.mailtrap.io` |
| `MAIL_PORT` | SMTP connection port | `2525` / `587` |
| `MAIL_USER` | SMTP username | *your-smtp-user* |
| `MAIL_PASS` | SMTP password | *your-smtp-password* |
| `MAIL_FROM` | Sender address shown on outgoing emails | `"Diego Motorsport" <no-reply@motorspot.app>` |
| `ADMIN_EMAIL` | Credentials for initial seeded admin account | `admin@example.com` |
| `ADMIN_PASSWORD` | Credentials for initial seeded admin account | `Admin@123` |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account hash for R2 | *your-cloudflare-account-id* |
| `CLOUDFLARE_R2_BUCKET_NAME`| Target R2 bucket name | `images` |
| `CLOUDFLARE_R2_PUBLIC_URL`| Public hostname pointing to R2 bucket files | `https://pub-xxxx.r2.dev` |
| `CLOUDFLARE_ACCESS_KEY_ID`| S3 Compatible Access Key ID for R2 | *your-r2-access-key-id* |
| `CLOUDFLARE_SECRET_ACCESS_KEY`| S3 Compatible Secret Access Key for R2 | *your-r2-secret-access-key* |
| `FIREBASE_SERVICE_ACCOUNT`| Stringified Service Account JSON file | `'{"type": "service_account", ...}'` |

---

## 🛠️ Local Development Guide

### 1. Prerequisites
Ensure you have the following installed on your machine:
- [Node.js (v20+)](https://nodejs.org/)
- [pnpm (v10+)](https://pnpm.io/)
- [Docker & Docker Compose](https://www.docker.com/)

### 2. Install Dependencies
Run the command below in the project root:
```bash
pnpm install
```

### 3. Spin Up Development Database
Use the development Docker Compose file to spin up a PostgreSQL instance running locally on port `5433`:
```bash
docker compose -f docker-compose.dev.yml up -d
```

### 4. Run Database Migrations
Run the migrations to create the required tables and generate the local Prisma Client:
```bash
pnpm run migrate
```
*(Alternative scripts)*:
- `pnpm run prisma:generate` - Generates the Prisma client.
- `pnpm run prisma:migrate` - Creates and applies local migrations.

### 5. Seed Initial Data (Admin & Settings)
Execute the seed script to set up default settings and the admin account:
```bash
pnpm run seed:dev
```

### 6. Start the Server
Start the development server with watch mode enabled:
```bash
pnpm run dev
```
The server will start, and the OpenAPI/Swagger documentation will be available at:
`http://localhost:5000/docs`

---

## 🐳 Dockerization Guide

The project is fully prepared for containerized deployments, separating development needs from production builds.

### Multi-stage Dockerfile
The `Dockerfile` consists of three stages to keep the final production image small:
1. **`base`**: Installs essential system libraries (`libc6-compat`) and enables `pnpm` workspace managers.
2. **`builder`**: Copies source code, installs development dependencies, generates the Prisma client client bindings, and compiles the TypeScript code into JavaScript (`/dist`).
3. **`runner`**: Copies only compiled code, production dependencies, and schemas into a clean, minimal container, then exposes port `8080` to run the application server.

---

### Production Deployment via Docker Compose

In production, Docker Compose spins up PostgreSQL, Redis, the compiled NestJS application, and Caddy to act as a secure reverse proxy.

#### 1. Pre-requisite Network Setup
Before running the stack, you must create the external bridge network referenced in `docker-compose.yml`:
```bash
docker network create diego_network
```

#### 2. Configure Environment variables
Ensure you have a `.env` file containing all production configurations and credentials.

#### 3. Build & Start the Container Stack
Start all services in detached mode:
```bash
docker compose up -d --build
```
This command starts:
- **Database:** PostgreSQL (`diego_postgres_prod` on port `5432` internally)
- **Cache Store:** Redis (`diego_redis_prod` on port `6379` internally)
- **Backend Server:** NestJS (`diego_app_prod` on port `8080`)
- **Web Proxy:** Caddy (`caddy` on ports `80` and `443`)

#### 4. Run Migrations & Seeds inside the Production Container
Once the container stack is active and healthy, execute the database migration and seeding commands inside the running app container:

**Apply migrations:**
```bash
docker exec -it diego_app_prod pnpm run prisma:deploy
```

**Seed the database:**
```bash
docker exec -it diego_app_prod pnpm run seed:prod
```

---

## 🔗 Route & Controller Structure

The API is divided into clean, controller-level paths representing different feature domains:

### 🔑 Authentication & Users
| Base Path | Controller | Key Endpoints / Capabilities |
|---|---|---|
| `/auth` | `AuthController` | Sign-up, Email verification (OTP), Login, Google Auth login, Two-Factor Authentication Toggle, OTP verification, Password resets, Logout |
| `/profiles` | `ProfileController` | Retrieve current/target profile details, update bio, link vehicles, profile statuses |
| `/follows` | `FollowController` | Follow and unfollow users, list active followers, list users followed |
| `/user-blocks` | `UserBlockController` | Block and unblock users, check block lists |
| `/user-points` | `UserPointController` | Fetch point histories, check active score boards |
| `/profile-share`| `ProfileShareController`| Generate dynamic links for QR sharing |
| `/reports` | `ReportController` | File moderation reports on inappropriate posts or profiles |

### 🚗 Properties & Garages
| Base Path | Controller | Key Endpoints / Capabilities |
|---|---|---|
| `/garages` | `GarageController` | Manage physical/virtual garages |
| `/virtual-garages`| `VirtualGarageController`| Manage setup parameters for virtual sim garages |
| `/cars` | `CarController` | Manage personal car specs, chassis, drivetrain, engine tuning levels |
| `/car-stories` | `CarStoryController` | Publish, edit, and retrieve timeline stories of specific cars |
| `/bikes` | `BikeController` | Manage motorcycle specifications, modifications, setups |

### 📝 Social Posts & Activity Feed
| Base Path | Controller | Key Endpoints / Capabilities |
|---|---|---|
| `/posts` | `PostController` | Manage user-specific posts (e.g. Spotting, Owner, Sim posts), ratings, details |
| `/comments` | `CommentController` | Create, list, delete comments on feeds |
| `/likes` | `LikeController` | Toggle likes on posts and comment nodes |
| `/reposts` | `RepostController` | Repost content to user timelines |
| `/saves` | `SaveController` | Save/bookmark posts |
| `/hides` | `HideController` | Hide specific posts from feeds |
| `/wishlist` | `WishListController` | Add parts or vehicles to personal wishlists |

### 🏁 Programs & Events
| Base Path | Controller | Key Endpoints / Capabilities |
|---|---|---|
| `/challenges` | `ChallengeController` | Manage racing challenges, track invite status, list participants |
| `/raw-shift` | `RawShiftController` | Manage Raw Shift head-to-head records |
| `/split-screen` | `SplitScreenController` | Set up split-screen matchups |
| `/head-to-head` | `HeadToHeadController` | Perform head-to-head racing battles |
| `/events` | `EventController` | Track and list upcoming and ongoing motorsport events |
| `/virtual-sim-events`| `VirtualSimEventController`| Manage virtual simulator tournaments |
| `/lab-times` | `LabTimeController` | List and review platform-recorded lap times |
| `/submit-lab-times`| `SubmitLabTimeController`| Let users submit new lap times |
| `/prizes` | `PrizeController` | Track challenge and campaign reward prizes |

### 📊 Leaderboards & Map Services
| Base Path | Controller | Key Endpoints / Capabilities |
|---|---|---|
| `/motorsport-rankings`| `MotorsportRankingController`| Global motorsport leaderboards and prestige lists |
| `/racing-votes` | `RacingVoteController` | Vote on user battles, challenges, and submissions |
| `/spotting-requests`| `SpottingRequestController`| Request or fulfill car spotting requests |
| `/map` | `MapController` | Get coordinates, spots, active map listings |
| `/discover` | `DiscoverController` | Dynamic discovery feed: trending hashtags, popular posts |

### 🛠️ Utilities & Storage
| Base Path | Controller | Key Endpoints / Capabilities |
|---|---|---|
| `/files` | `FileController` | Handle secure file uploads returning CDN links (S3/Cloudflare R2) |
| `/notifications` | `NotificationController` | Fetch and update in-app notifications |
| `/chat` | `ChatController` | Retrieve chat rooms, message histories, receipts |

### 👑 Admin Management Panels
| Base Path | Controller | Key Endpoints / Capabilities |
|---|---|---|
| `/admin/badges` | `AdminBadgeController` | Manage platform user badges and achievements |
| `/admin-event-management`| `AdminEventManagementController`| Manage platform events, status updates |
| `/admin-user-management`| `AdminUserManagementController` | User control panel (block, verification, partner reviews) |
| `/admin-ads` | `AdminAdController` | Create, activate, and manage platform advertisement campaigns |
| `/admin-report` | `AdminReportController` | Moderation queue: list and resolve user reports |
| `/admin-headers`| `AdminHeaderController` | Custom default header styling and settings |
| `/admin-legal-notice`| `LegalNoticeController` | Control legal disclosures |
| `/tutorials` | `AdminTutorialController` | Create and maintain app tutorial steps |
| `/hashtags` | `HashtagController` | Admin moderation of hashtags (block, tag details) |
| `/admin-prestige`| `AdminPrestigeController`| Set up point levels, prestige rates |
| `/admin-sim-racing`| `AdminSimRacingController`| Admin management of sim models, tracks, platforms |
| `/admin-overview`| `AdminOverviewController` | Admin dashboard metrics and analytics |
| `/admin-analytic`| `AdminAnalyticController`| detailed chart statistics and logs |

---

## 💬 Real-Time Gateways (WebSockets)

For real-time functionality, the application leverages the **Socket.io Gateway** located in `src/main/chat/chat.gateway.ts`.
- **Namespace:** Default (Socket.io `/`)
- **Key Actions Managed:**
  - Real-time chat messages exchange.
  - Active conversation participant tracking.
  - Read/Delivered message receipts synchronization.
  - Live interaction rewards.

Websocket connections require a valid JWT token sent in the headers for authentication.

---

## 🐳 Web Server Reverse Proxy (Caddy)

For production environments, **Caddy** serves as a reverse proxy. To route your traffic to the NestJS application container (`diego_app_prod`), update the `Caddyfile` with your domain:

```caddy
your-domain.com {
    reverse_proxy diego_app_prod:8080
}
```
Caddy will automatically provision and renew Let's Encrypt SSL certificates for your domain.
