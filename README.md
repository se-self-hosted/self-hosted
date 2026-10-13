# Web-based Real-time Voice Meeting Platform

A browser-based voice communication system designed to support real-time meetings through Progressive Web Application (PWA) technology. Users can join meeting rooms via shared links without installing an application or creating an account.

The platform supports real-time voice communication, meeting history management, audio recording, speech transcription, and AI-powered meeting summaries.

## Features

- **PWA Ready**: Works seamlessly on desktop and mobile browsers.
- **Role-based Access**: 
  - **Hosts**: Log in, create rooms, manage meetings, view history, and export data.
  - **Members**: Join simply via a non-guessable invitation link (no registration needed).
- **Real-time Voice Communication**: Powered by WebRTC and LiveKit, supporting 20-40 participants per room.
- **Meeting Logs & Analytics**: 
  - Audio recording (stored securely in MinIO/S3).
  - Real-time speech-to-text transcriptions.
  - AI-generated meeting summaries powered by GPT-4o mini.
- **Export Capabilities**: Export meeting summaries in PDF, DOCX, or Markdown.

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Real-time Communication**: WebRTC, LiveKit SFU, coturn
- **Backend**: Node.js
- **Database / Cache**: PostgreSQL, Redis
- **Storage**: MinIO / Amazon S3
- **Infrastructure**: Docker, Docker Compose, Cloudflare Tunnel

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or pnpm
- Docker and Docker Compose (for local services: PostgreSQL, Redis, MinIO, LiveKit)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd self-hosted
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start infrastructure services:**
   *Make sure you have configured your `.env` file first.*
   ```bash
   docker-compose up -d
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the App:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Running with Docker

Two stacks share `docker-compose.yml`:

| | Command | App container |
|---|---|---|
| Development | `scripts/start-server.sh` (`docker compose up`) | `next dev` with the source bind-mounted and hot reload, plus Prisma Studio on `127.0.0.1:5555`. `docker-compose.override.yml` is merged automatically. |
| Production | `scripts/start-production.sh` (`docker compose -f docker-compose.yml up -d --build --wait`) | The optimized build (`output: "standalone"`), started with `node server.js` as a non-root user. |

In both stacks, a one-shot `migrate` service pushes the Prisma schema and seeds the default host account (`z@mail.com` / `z11111`) before the app starts. **Change that password after the first login.** The app reads `.env` when the container starts; nothing from `.env` is baked into an image.

Postgres, Redis, MinIO and Prisma Studio listen on `127.0.0.1` only. The app reaches them over the compose network. If something else on the host already uses port 5432, set `POSTGRES_HOST_PORT` (e.g. `5433`) in `.env`.

### Public deployment

Set these in `.env` on the server:

- `LIVEKIT_API_KEY` / `LIVEKIT_API_SECRET`: LiveKit and the app both use this pair. Use a long random secret; the `devkey`/`secret` defaults are public.
- `LIVEKIT_NODE_IP`: the server's public IP. Audio goes straight there (UDP 7882, TCP 7881); it never passes through the Cloudflare tunnel.
- `NEXT_PUBLIC_LIVEKIT_URL`: the LiveKit websocket URL browsers use (`scripts/cloudflare-tunnel.sh` writes it). The server reads it at runtime, so changing it needs a restart, not a rebuild.
- TURN (coturn): `TURN_USER`, `TURN_PASSWORD`, `TURN_REALM`, and optionally `TURN_HOST` / `TURN_EXTERNAL_IP` (both default to `LIVEKIT_NODE_IP`). LiveKit offers this relay to every participant, for networks that block direct UDP. Open UDP/TCP 3478 and UDP 49152-49251. TURN over TLS (5349) isn't configured; it needs a certificate.

  > Because coturn and LiveKit run on the same host, coturn must be allowed to relay to the host's own IP (`--allowed-peer-ip`, already set). Relayed calls were verified up to the relay allocation, but not end to end on Docker Desktop: its port forwarding rewrites the source address of packets that loop back to the same host. On a Linux server, confirm one relayed call works, e.g. with a browser forced to `iceTransportPolicy: "relay"`.

### Scaling and Redis

Locks, cooldowns and the participant-poll cache are kept in Redis (`REDIS_URL`), so several app containers can run behind one proxy. LiveKit also registers its nodes there. Without Redis, or while it's down, the app keeps working with per-process state, which is correct for a single instance.

### Installing as an app (PWA)

The production build is installable from Chrome, Edge and Safari ("Install app" / "Add to Home Screen"). Its service worker (`public/sw.js`) caches the build's hashed assets and the RNNoise model, so reopening the app doesn't download them again. Pages and API calls always go to the network; when the server can't be reached, an offline page is shown. The service worker isn't registered under `next dev`.

## Project Structure

- `/src/app` - Next.js App Router pages and layouts.
- `/src/components` - Reusable UI and layout components.
- `/src/lib` - Utility functions, configurations, and API clients.
- `/src/hooks` - Custom React hooks.
- `/src/store` - Global state management (e.g., Zustand).
- `/src/types` - TypeScript type definitions.

## Branch Strategy & Contribution

- `main` - Production-ready code (direct commits prohibited).
- `develop` - Integration branch.
- `feature/*` - New features.
- `bugfix/*` / `hotfix/*` - Bug resolutions.

All features should be developed in `feature/*` branches and submitted via Pull Request for code review. Automated tests must pass before merging.
