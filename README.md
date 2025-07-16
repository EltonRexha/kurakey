# Kurakey

Collect, trade, and explore unique **3D Rooms** in a web-based gacha economy. Earn coins, open chests of varying rarities, unlock achievements

---

## ✨ What’s Inside?

| Feature             | Description                                                                       |
| ------------------- | --------------------------------------------------------------------------------- |
| Chests & Drop-Rates | Purchase or win chests, open them to roll for rooms, coins, or XP.                |
| 3D Room Collection  | Each room has rarity & category; view them in an interactive WebGL viewer.        |
| Trading             | Invite other players, offer rooms/chests, confirm & complete trades live via SSE. |
| Achievements & XP   | Level up and showcase rare achievement badges.                                    |
| Payments            | Stripe Checkout for coin packages & bundles.                                      |
| Notifications       | Real-time updates delivered over Server-Sent Events.                              |

Under the hood we use **Next.js App Router**, **Prisma + PostgreSQL**, **NextAuth**, **Stripe**, **React Query**, and **Zod** for validation.

---

## 🗂 Documentation

- Architecture overview – [`docs/architecture.md`](docs/architecture.md)
- Feature deep-dives – [`docs/features.md`](docs/features.md)
- Database model – [`docs/data-model.md`](docs/data-model.md)
- Hosting & deployment guide – [`InstructionsHosting.md`](InstructionsHosting.md)

> If you’re new to the codebase, start with the architecture doc, then skim the feature breakdowns.

---

## 🛠 Running Locally

1. **Clone & Install**
   ```bash
   git clone https://github.com/your-org/kurakey.git
   cd kurakey
   npm install   # or yarn / pnpm
   ```
2. **Configure Environment**
   - Copy `.env.example` (or create a new `.env`) and fill in the required variables:
     ```env
     DATABASE_URL=postgres://user:pass@localhost:5432/kurakey
     NEXTAUTH_SECRET=your_jwt_secret
     NEXTAUTH_URL=http://localhost:3000
     NEXT_PUBLIC_APP_URL=http://localhost:3000
     ...
     ```
3. **Database Setup**
   ```bash
   npx prisma migrate deploy
   npx prisma db seed   # seeds default data (rooms, chests, etc.)
   ```
4. **Start the Dev Server**
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000) and create an account.

---

## 🔋 Useful Scripts

| Script                   | Purpose                                    |
| ------------------------ | ------------------------------------------ |
| `npm run dev`            | Run Next.js in development with hot-reload |
| `npm run build`          | Production build                           |
| `npm run start`          | Start the built app                        |
| `npm run prisma:migrate` | Apply new Prisma migrations                |
| `npm run prisma:studio`  | Open Prisma Studio GUI                     |

