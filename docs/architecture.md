# Application Architecture Overview

## Technology Stack

- **Framework**: Next.js (App Router) with TypeScript & React 18
- **Database**: PostgreSQL accessed through **Prisma ORM**
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) supporting credentials & Google OAuth
- **Real-time**: Server-Sent Events (SSE) for live notifications & trade updates
- **Payments**: Stripe Checkout & Webhooks for bundles and coin packages
- **State / Data Fetching**: @tanstack/react-query, React Context & custom hooks
- **HTTP Client**: Axios wrapper in `libs/axios.ts`
- **Styling**: CSS Modules & global Tailwind-compatible styles (see `src/app/globals.css`)

## High-Level Flow

```mermaid
flowchart TD
  subgraph Client (Next.js)
    Pages["Route Segments (e.g. • /chest/[name] • /trade)"]
    Components["UI Components & Hooks"]
  end
  Client -->|HTTP / SSE| API[[Next.js Route Handlers]]
  API -->|Prisma| DB[(PostgreSQL)]
  API --> Stripe((Stripe))
  Stripe -->|Webhook| API
```

## Repository Layout

```
├─ libs/               // Shared client + server utilities
│  ├─ api/             // Axios wrappers for each API domain
│  ├─ stripe/          // Client & server helpers
│  └─ *.ts             // Business-logic helpers (drop-rates, events, etc.)
├─ prisma/             // Prisma schema, migrations & seed data
├─ src/
│  ├─ app/             // Next.js App Router routes
│  │  ├─ (routes)/     // Conventional route groups
│  │  └─ api/          // Typed route handlers (server-only)
│  ├─ components/      // Re-usable visual components & UI primitives
│  ├─ context/         // React Context providers
│  ├─ hooks/           // Custom React hooks
│  ├─ schemas/         // Zod validation schemas shared by server & client
│  └─ utils/           // Pure helpers (colors, baseUrl, etc.)
└─ public/             // Static assets (icons, images)
```

### Route Organisation (`src/app/(routes)`)

| Group       | Purpose                                             |
| ----------- | --------------------------------------------------- |
| `(auth)`    | Authentication flow (login, signup, OAuth callback) |
| `(root)`    | Home / dashboard after login                        |
| `chest`     | Chest opening & drop-rate info                      |
| `buy-coins` | Purchase in-game coins                              |
| `payment`   | Stripe success / failure landing pages              |
| `profile`   | User profile, achievements, chest & room grids      |
| `rooms`     | Global room explorer                                |
| `trade`     | Real-time trading UI                                |
| `users`     | User search & discovery                             |

### API Route Handlers (`src/app/api`)

Each domain has its own folder with REST-like endpoints. Examples:

- `api/chests/open` – Open a chest and roll for rewards
- `api/stripe/create-checkout-session/...` – Create Stripe sessions for bundles & coins
- `api/trade/[id]/ready|confirm|cancel` – Trade state transitions
- `api/sse/stream` – SSE endpoint consumed by `useSSE` hook

### Server Components vs. Client Components

The project uses Next.js **Server Components** for data-heavy pages and lightweight **Client Components** when interactivity / hooks are required (e.g. buttons, modals, providers).

---

> For a detailed breakdown of features & business logic, see `docs/features.md`.
