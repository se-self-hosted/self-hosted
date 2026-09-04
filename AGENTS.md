<goldenrule>
1. NEVER run: git reset --hard, git checkout ., git restore ., git clean -fd
2. ALWAYS ask permission before any destructive git operation
3. If you need the original file: use git show HEAD:filename
4. Back up before overwrite: cp file file.bak
</goldenrule>

<nextjs-agent-rules>
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
</nextjs-agent-rules>


# AGENTS.md

# Web-based Real-time Voice Meeting Platform

## Project Overview

The Web-based Real-time Voice Meeting Platform is a browser-based voice communication system designed to support real-time meetings through Progressive Web Application (PWA) technology. Users can join meeting rooms via shared links without installing an application or creating an account.

The platform supports real-time voice communication, meeting history management, audio recording, speech transcription, and AI-powered meeting summaries.

---

# Project Goals

- Build a real-time voice meeting platform accessible through web browsers.
- Support Progressive Web Application (PWA) on desktop and mobile devices.
- Allow participants to join meetings through invitation links without registration.
- Store meeting records and audio files.
- Generate meeting summaries using artificial intelligence.
- Support exporting meeting data in multiple formats.

---

# User Roles

## Host

Permissions:

- Log in using email and password.
- Create multiple meeting rooms.
- Edit meeting room information.
- Set the maximum number of participants.
- View all meeting histories.
- Replay recorded meetings.
- View and edit meeting summaries.
- Export meeting data.

---

## Member

Permissions:

- Join meetings through invitation links.
- No registration required.
- Enter a display name before joining.
- Enable or disable their microphone.

---

# Functional Requirements

## Authentication

### FR-01: Login

- The system shall allow Hosts to log in using email and password.

### FR-02: Logout

- The system shall support user logout.

---

## Meeting Room Management

### FR-03: Create Room

- Hosts shall be able to create multiple meeting rooms.
- The system shall generate non-guessable meeting URLs.
- Hosts shall be able to specify the meeting room name.
- Hosts shall be able to define the maximum number of participants.

### FR-04: Edit Room

- Hosts shall be able to modify meeting room information.

### FR-05: Join Room

- Members shall be able to join meetings through invitation links without registration.
- Members shall enter a display name before joining.
- The system shall validate room capacity before allowing entry.

---

## Real-time Voice Communication

### FR-06: Voice Communication

- The system shall support real-time voice communication using WebRTC and LiveKit.
- The system shall support 20–40 participants per room.
- Participants shall be able to mute and unmute their microphones.

### FR-07: Participant Status

- The system shall display the participant list in real time.
- The system shall display microphone status.
- The system shall indicate the active speaker.

---

## Role Management

### FR-08: User Roles

The system shall support the following roles:

- Host
- Member

---

## Meeting Logging

### FR-09: Participant Logging

The system shall record:

- Participant name
- Join time
- Leave time
- Participation duration

### FR-10: Speech Logging

The system shall record:

- Speaker name
- Transcript text
- Timestamp

### FR-11: Audio Recording

- The system shall support meeting audio recording.
- Audio files shall be stored in object storage.

---

## Meeting History

### FR-12: Meeting History

Hosts shall be able to access all previous meetings, including:

- Meeting date
- Start time
- Meeting duration
- Participant list

### FR-13: Playback

- Hosts shall be able to replay recorded audio.
- Hosts shall be able to view meeting transcripts.

---

## AI Summary

### FR-14: Meeting Summary

- The system shall send meeting transcripts to GPT-4o mini to generate summaries.

### FR-15: Edit Summary

- Hosts shall be able to edit meeting summaries.

### FR-16: Export Summary

The system shall support exporting meeting data in:

- PDF
- DOCX
- Markdown

---

# Non-Functional Requirements

## Performance

- The system shall support at least 40 participants per room.
- The system shall support multiple concurrent meeting rooms.
- Voice communication shall operate with low latency.

---

## Availability

- The system shall provide 24/7 availability.
- The system shall support recovery from server failures.

---

## Security

- The system shall use HTTPS/TLS.
- Access tokens shall be encrypted.
- Passwords shall be stored using secure hashing algorithms.
- Meeting URLs shall be difficult to guess.

---

## Scalability

- The system shall support future expansion in the number of meeting rooms.
- The infrastructure shall support horizontal scaling.

---

## Compatibility

### Browser Support

- Google Chrome
- Microsoft Edge
- Safari
- Firefox

### Platform Support

- Desktop
- Mobile
- Progressive Web Application (PWA)

---

# Technology Stack

| Category | Technology |
|----------|----------|
| Frontend | Next.js, React |
| Language | TypeScript, JavaScript |
| Real-time Communication | WebRTC |
| SFU | LiveKit |
| TURN/STUN | coturn |
| Backend | Node.js |
| Database | PostgreSQL |
| Cache | Redis |
| File Storage | MinIO / Amazon S3 |
| Containerization | Docker |
| Tunnel | Cloudflare Tunnel |

---

# System Constraints

- The maximum number of participants per room is defined by the Host.
- Audio quality depends on users' network conditions.
- Meeting summary quality depends on GPT-4o mini capabilities.
- WebRTC functionality requires TURN/STUN servers.

---

# Suggested Architecture

## Frontend

- Next.js (PWA)
- React
- Zustand / Context API
- Tailwind CSS

## Backend Services

- Authentication Service
- Meeting Service
- Transcript Service
- AI Summary Service

---

## Infrastructure

- LiveKit SFU
- coturn
- PostgreSQL
- Redis
- MinIO
- Docker Compose

---

# Future Enhancements

- Video calls
- Screen sharing
- Support for multiple LLM providers
- Automatic requirement extraction from meetings
- AI-generated action items
- AI-powered meeting analytics