# Diego Motorsport Backend - Project Overview & User Profiles

## 1. Project Overview
Diego Motorsport Backend is a high-performance, robust, and scalable REST and Real-Time API built on the NestJS framework. It serves as the foundation for a comprehensive motorsport and automotive social platform. The platform powers features ranging from vehicle management (garages, cars, bikes) to social networking (posts, messaging, feeds), real-time map features, spotting requests, and competitive programs like racing challenges and lap times.

**Key Technologies:** NestJS (v11), TypeScript, Prisma ORM (v7), PostgreSQL, Redis, Socket.io, and Docker.

---

## 2. User & Authentication Architecture
The platform is built around a flexible account architecture where authentication and identity are decoupled from the specific personas a user might adopt.

### The `User` Model
The core `User` model handles authentication (Email/Password, JWT, 2FA, OAuth), account statuses, total platform points, and balances. 
Each user is assigned a base application **Role**:
- `USER`: Standard platform user.
- `ADMIN`: Administrator with access to the management panels.
- `AMBASSADOR`: Platform representatives or influencers (`AmbassadorProgram`).
- `OFFICIAL_PARTNER`: Brands or entities partnered with the platform (`OfficialPartner`).

### The `Profile` Model
A single `User` can have multiple `Profile` entities, but operates with one active profile at a time (`activeProfileId`). The `Profile` acts as the public-facing entity, holding the profile name, bio, image, and account privacy type (Public/Private).

Each profile can be specialized into one of **six distinct profile types**, each carrying its own specific scope and responsibilities on the platform.

---

## 3. Profile Types: Responsibilities & Scope

The platform defines the following distinct profile personas (represented by the `Type` enum), each supported by its own dedicated database model:

### 3.1 Owner (`OwnerProfile`)
- **Target Audience:** Real-world vehicle owners (Cars, Bikes).
- **Scope & Responsibilities:** 
  - Manage physical and virtual garages.
  - Detail vehicle specifications (chassis, drivetrain, engine, tuning, wheels).
  - Log and publish `CarStory` timelines and `CarMilestone`s (purchases, mods, track days, services).
  - Participate in real-world challenges, head-to-head battles, and log lap times.

### 3.2 Spotter (`SpotterProfile`)
- **Target Audience:** Car enthusiasts and photographers who hunt for rare or interesting vehicles.
- **Scope & Responsibilities:**
  - Create and fulfill `SpottingRequest`s.
  - Tag spotted vehicles on the platform to notify owners.
  - Publish specific `Spotter_Post` content to the discovery feed and map.

### 3.3 Sim Racing Driver (`SimRacingProfile`)
- **Target Audience:** E-sports athletes and virtual racing enthusiasts.
- **Scope & Responsibilities:**
  - Document their simulator rig: `HardwareSetup` (wheel bases, steering wheels), `DisplayAndPcSetup`, and `DrivingAssistant` configurations.
  - Track virtual racing records across various sim platforms (e.g., iRacing, Assetto Corsa Competizione, Gran Turismo).
  - Participate in virtual sim events and split-screen battles.

### 3.4 Pro Driver (`ProDriverProfile`)
- **Target Audience:** Professional or semi-pro motorsport athletes.
- **Scope & Responsibilities:**
  - Defined by their specific `racingDiscipline` (e.g., GT Touring, Rally, Drift, Karting, Formula).
  - Have a verified location and professional presence.
  - Feature prominently in global motorsport rankings and prestigious leaderboards.

### 3.5 Pro Business (`BusinessProfile`)
- **Target Audience:** Automotive and motorsport-related commercial entities.
- **Scope & Responsibilities:**
  - Operate within specific `BusinessCategory` fields (e.g., Detailing & Care, Parts & Performance, ECU & Dyno Tuning, Dealerships).
  - Manage their `businessName` and physical `location`.
  - Can manage `ProductList`ings, offering car parts, photography services, or sim racing equipment directly to other users.

### 3.6 Content Creator (`ContentCreatorProfile`)
- **Target Audience:** Media professionals, automotive vloggers, influencers, and analysts.
- **Scope & Responsibilities:**
  - Defined by their `creatorCategory` (Photography, Vlog, Analysis).
  - Link directly to external media outlets like a `youtubeChanel` or a `portfolioWebsite`.
  - Focus on creating high-engagement posts that drive discovery and trending hashtags.

---

## 4. Key Sub-Systems & Platform Features

Beyond the profile scopes, the backend powers several unified sub-systems available to users depending on their interactions:

- **Social & Community:** A full suite of social features including Posts (with specialized types per profile), Comments, Likes, Reposts, Hashtags, and Saved/Hidden posts.
- **Programs & Battles:** Users can engage in `HeadToHeadBattle`s, `RawShiftBattle`s, and `SplitScreenBattle`s. These programs feature invitations, submissions, user voting (`RacingVote`), and prizes.
- **Leaderboards & Map:** `MotorsportRanking` points system based on battle wins, post engagement, and platform activity. The `MapController` tracks dynamic discovery and spotting locations.
- **Real-Time Communication:** A Socket.io gateway manages live chat conversations, message receipts, live streaming (`Live` and `LiveReward`), and real-time notifications (Push, In-App, Email).
