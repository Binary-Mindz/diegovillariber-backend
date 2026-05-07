FROM node:24-alpine AS base

WORKDIR /app

RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

FROM base AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY prisma ./prisma
COPY prisma.config.ts ./

ENV DATABASE_URL=postgresql://postgres:postgres@db:5432/app

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm prisma generate
RUN pnpm build

FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV DATABASE_URL=postgresql://postgres:postgres@db:5432/app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./

RUN pnpm prisma generate

EXPOSE 8080

CMD ["node", "dist/src/main.js"]