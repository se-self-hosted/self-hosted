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
