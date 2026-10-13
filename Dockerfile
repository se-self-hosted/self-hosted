# syntax=docker/dockerfile:1

# Stages:
#   dev      - `next dev` with the source bind-mounted (docker-compose.override.yml)
#   builder  - production build; also runs the schema push and seed (migrate service)
#   runner   - the production server: standalone output only, as a non-root user

FROM node:22-bookworm-slim AS base
# ffmpeg transcodes recordings; openssl is needed by Prisma.
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl ca-certificates ffmpeg \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
COPY package.json package-lock.json prisma.config.ts ./
COPY prisma ./prisma
# prisma.config.ts requires DATABASE_URL, but generating the client never
# connects; the real URL comes from .env when a container runs (never baked in).
ARG BUILD_DATABASE_URL=postgresql://build:build@localhost:5432/build
# postinstall runs `prisma generate` into src/generated.
RUN DATABASE_URL=$BUILD_DATABASE_URL npm ci

FROM deps AS dev
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM deps AS builder
COPY . .
RUN DATABASE_URL=$BUILD_DATABASE_URL npx prisma generate && DATABASE_URL=$BUILD_DATABASE_URL npx next build

FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public
USER node
EXPOSE 3000
CMD ["node", "server.js"]
