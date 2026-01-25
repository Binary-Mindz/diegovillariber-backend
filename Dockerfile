FROM node:24-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat 
RUN corepack enable && corepack prepare pnpm@latest --activate 

# Dependencies stage
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
FROM node:24-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable

# Copy only dependency files first (better caching)
COPY pnpm-lock.yaml package.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./

ENV DATABASE_URL=postgresql://postgres:postgres@db:5432/app
# Install deps
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Generate Prisma client
RUN pnpm prisma generate

# Build NestJS
RUN pnpm build


# ========================
# Stage 2 — Production
# ========================
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Enable pnpm
RUN corepack enable

# Copy required files only
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./

ENV DATABASE_URL=postgresql://postgres:postgres@db:5432/app
# Prisma client must exist at runtime
RUN pnpm prisma generate

EXPOSE 8080

CMD ["node", "dist/main.js"]
