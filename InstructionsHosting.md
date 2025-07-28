# 🚀 App Hosting & Setup Guide

Welcome to the setup guide for hosting this application! This document walks you through the full deployment process, from cloning the code to setting up databases, authentication, image hosting, and payments.

---

## 📁 1. Upload Code to GitHub

1. Create a GitHub repository.
2. Push your local code to GitHub.

---

## ☁️ 2. Choose a Hosting Provider (SSE Support Required)

This app uses **Server-Sent Events (SSE)**. You must use a host that supports long-lived HTTP connections.

❌ **Not Supported**:
- Vercel
- Netlify

✅ **Supported Options**:
- [Render](https://render.com/)
- [Railway](https://railway.app/)
- Self-hosting (e.g., VPS, AWS, DigitalOcean)

---

## 🗄️ 3. Set Up the Database

1. Create a PostgreSQL database using your host or a service like Supabase or Railway.
2. Get the **connection string**.
3. Add it to your `.env` file:

```env
DATABASE_URL=your_connection_string_here
```

---

## 🔐 4. Generate `NEXTAUTH_SECRET`

Generate a random secret:

```bash
openssl rand -hex 32
```

Add to `.env`:

```env
NEXTAUTH_SECRET=your_generated_secret
```

---

## 🔑 5. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project and OAuth 2.0 credentials.
3. Use this as your **redirect URI**:

```
https://your-app-url.com/api/auth/callback/google
```

4. Add the following to your `.env`:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

## 🌐 6. Add App URL

```env
NEXTAUTH_URL=https://your-app-url.com
NEXT_PUBLIC_APP_URL=https://your-app-url.com
```

---

## ☁️ 7. Set Up Cloudinary for Image Hosting

1. Create a free account at [Cloudinary](https://cloudinary.com/).
3. Add the credentials to `.env`:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 💳 8. Set Up Stripe for Payments

1. Create a [Stripe](https://stripe.com/) account.
2. Get your **publishable** and **secret** keys.
3. Create a webhook with this URL:

```
https://your-app-url.com/api/webhooks/stripe
```

4. Add to `.env`:

```env
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_publishable_key
STRIPE_SECRET_KEY=your_secret_key
STRIPE_WEBHOOK_SIGNING_SECRET=your_webhook_secret
```

---

## 🚀 9. Deploy the App

- Set environment variables via your host dashboard using values from your `.env` file.
- On the first deployment, the **database seeder** will run to populate default data.

---

## 🛍️ 10. Final Stripe Setup: Add Products

1. The seeder creates for you:
   - Coin packages
   - Bundles

2. Copy the `price_id` for each product from Stripe.

3. Insert them into the appropriate database tables:

- `CoinPackage`
- `BundleType`

> ⚠️ These IDs are not added by the seeder — you must add them manually after deployment.

---

## ✅ All Done!

Your app should now be fully deployed with:

- Google login
- Stripe payments
- Cloudinary for image hosting
- Real-time features powered by Server-Sent Events

Happy hosting! 🎉
