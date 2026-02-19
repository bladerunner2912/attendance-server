# Attendance Server

Deployable Node.js + MySQL attendance API for assignment submission.

## 1. Configuration

All important runtime values come from config (`config/config.js`) and environment variables.

Create `.env` from `.env.example` and set values as needed.

Key values:
- `SECRET_KEY=daisy` (used for JWT signing and as pepper input in password hashing)
- `BCRYPT_ROUNDS=10`
- `DB_HOST`, `DB_PORT`, `DB_NAME`
- `DB_USER`, `DB_PASSWORD` (optional)
- `DB_SOCKET_PATH` (optional, useful for local socket auth)

## 2. Install

```bash
npm install
```

## 3. Database Setup

Initialize schema:

```bash
npm run db:init
```

Seed data:

```bash
npm run db:seed
```

Or run both:

```bash
npm run db:setup
```

Seed guarantees:
- 20 students
- 2 instructors
- 5 classes
- 10 sessions per class (50 total)

Default seeded password (plain): `daisy123`

To generate new hash for any plain password:

```bash
npm run hash:password -- daisy123
```

## 4. Run Server

```bash
npm start
```

Development mode:

```bash
npm run dev
```

## 5. One-command Deploy

```bash
npm run deploy
```

Equivalent shell script:

```bash
./scripts/deploy.sh
```

`deploy` currently runs:
- `npm ci`
- `npm run db:setup`
- `npm run start`

## 6. Marked Section

### Credentials To Use

- Instructors:
  - `instructor1@example.com` / `daisy123` (profile name: `Arjun`)
  - `instructor2@example.com` / `daisy123` (profile name: `Meera`)
- Students:
  - `student1@example.com` to `student20@example.com` / `daisy123`
  - Example: `student1@example.com` / `daisy123` (profile name: `Aarav`)

### Assumptions Made

- All seeded users (students and instructors) share the same default password for easier testing: `daisy123`.
- Student and instructor profile names are single-word first names.
- Seed quantity remains fixed:
  - 20 students
  - 2 instructors
  - 5 classes
  - 10 sessions per class

### Design Decisions

- `npm run deploy` delegates to `./scripts/deploy.sh` as the single source of deploy behavior.
- Deploy flow is deterministic: install dependencies, reset/setup DB data, then start server.
- Single-word names in seed data were chosen to simplify UI rendering and API response readability.

## 7. No DB Username/Password Case

If your MySQL setup allows login without explicit username/password (for example local socket/auth plugin), keep:

```env
DB_USER=
DB_PASSWORD=
```

Then either:
- use normal host/port (`DB_HOST`, `DB_PORT`), or
- set socket path (example):

```env
DB_SOCKET_PATH=/var/run/mysqld/mysqld.sock
```

The DB runner and app only send `user`/`password` when provided.

## 8. Helper Scripts

- `./scripts/setup-db.sh` -> init + seed
- `./scripts/start-server.sh` -> start API
- `./scripts/deploy.sh` -> install + setup DB + run
