# Feature Documentation

This document explains the main game-mechanics & supporting flows implemented in the code-base.

---

## 1. Authentication

| Aspect        | Details                                                                                                                                               |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Stack**     | NextAuth.js (`src/app/api/auth/[...nextauth]`)                                                                                                        |
| **Providers** | • Credential (username / password) • Google OAuth (via `libs/api/oauthUser.ts`)                                                                       |
| **Session**   | JWT stored in cookies, exposed through `GetServerUser.ts` helper and React-side `UserSessionProvider.tsx`.                                            |
| **UX Flow**   | 1. User visits `/log-in` or `/sign-up`. 2. Forms post to NextAuth callback. 3. After success redirects to `/` & React Query invalidates user queries. |

---

## 2. Economy

### 2.1 Coins

- Every user starts with **500 coins** (`User.coinBalance` default).
- Coins are spent on **Chests** (loot boxes) and can be purchased via Stripe.
- All transactions are stored in the `CoinTransaction` model for audit.

### 2.2 Chests

| Table / File                 | Responsibility                                          |
| ---------------------------- | ------------------------------------------------------- |
| `ChestType`                  | Static config: price, XP gain, drop-rates, artwork URLs |
| `Chest`                      | Individual chest instance belonging to a user           |
| `pickRarityFromDropRates.ts` | Rolls rarity given chest’s configured drop-rates        |
| `api/chests/open`            | Opens a chest, burns it, rewards rooms / coins / XP     |

Opening a chest triggers:

1. Deduct chest from user inventory.
2. Roll rarity.
3. Call `pickRandomRoomByRarity` to fetch a room.
4. Create `UserRoom` or extra coin reward.
5. Dispatch `Notification` rows (& SSE event) to inform the player.

### 2.3 Bundles

- **BundleType** – Preconfigured mix of coins + chests, purchasable with real money.
- Checkout session created at `api/stripe/create-checkout-session/bundle/[id]`.
- Webhook handler `handleBundlePurchase.ts` credits the user after successful payment.

### 2.4 Coin Packages

- Similar to Bundles but contain only coins (`CoinPackage`, `UserCoinPackage`).

---

## 3. Rooms

- Rooms are 3D scenes that players can inspect (`ui/3DRoom.tsx`).
- Each room has **rarity** & **category** (`Room` model).
- Players acquire rooms from chests or trades.
- Global explorer at route `/rooms` with filtering & search.

---

## 4. Achievements

- Defined in `prisma/data/achievements.ts` & `Achievement` table.
- Unlock logic lives in server actions (e.g. after room discovery, chest openings).
- Upon unlock a `Notification` row is created which surfaces in the UI & SSE.

---

## 5. Trading System

| Endpoint                        | Purpose                             |
| ------------------------------- | ----------------------------------- |
| `POST /api/trade`               | Create trade invitation             |
| `PATCH /api/trade/[id]/ready`   | Player toggles ready                |
| `PATCH /api/trade/[id]/confirm` | Final confirmation after both ready |
| `PATCH /api/trade/[id]/cancel`  | Abort trade                         |

Implementation details:

- The trade contains **sender** & **receiver** plus offered `UserRoom` / `Chest` rows.
- Real-time status is delivered through **SSE** (`api/sse/stream`).
- Front-end keeps optimistic UI via React Context `TradeContext.tsx`.

---

## 6. Notifications

- Stored in `Notification` table.
- `NotificationsProvider.tsx` subscribes to `/api/sse/stream` via `useSSE` hook.
- Unread badge count computed by `hasUnreadNotifications.ts` helper.
- Users can mark as read/shown through dedicated endpoints.

---

## 7. Payments (Stripe)

1. Checkout session is created from the client-side `BuyBundleBtn` / `BuyBtn` components.
2. User is redirected to Stripe Checkout.
3. Upon completion Stripe hits `api/stripe/webhook` which invokes
   - `handleBundlePurchase.ts` OR `handleCoinPackagePurchase.ts`.
4. `StripePayments` + domain rows are created and coins / bundles credited.
5. User is redirected back to `/payment/success` or `/payment/failed`.

---

## 8. Real-Time & SSE

- Endpoint: `GET /api/sse/stream` (server route).
- Multiplexes events for notifications & trades via Node EventEmitter (`libs/Emitter.ts`).
- Client hook `useSSE.ts` establishes EventSource and dispatches to contexts.

---

## 9. Validation & Types

- All incoming payloads are validated with **Zod** schemas at `src/schemas/*`.
- Prisma generates TypeScript types (`src/generated/prisma`).
- Shared enums imported via `$Enums` for strong client typing.

---

> Continue with `docs/data-model.md` for an overview of database entities.
