<div align="center">

# 🍽️ RestoNext  
### Modern Full-Stack Restaurant Management & Online Ordering Platform

A production-ready restaurant system built with **Next.js 14**, **Prisma**, and **PostgreSQL**, featuring online ordering, reservations, payments, and real-time operations.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791)](https://www.postgresql.org/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF)](https://stripe.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## ✨ Overview

**RestoNext** is a modern restaurant management platform designed to handle everything from **online orders** and **table reservations** to **staff operations**, **payments**, and **analytics** — all in one system.

Built with scalability, performance, and real-world usage in mind.

## ✨ Features

**For Customers**
- Browse menu with search & filters
- Online ordering with Stripe payments
- Table reservations with availability checking
- Order tracking & history
- AI-powered chat assistant

**For Staff**
- Real-time order management dashboard
- Reservation approval system
- Shift scheduling
- Order status updates

**For Admins**
- Analytics & revenue tracking
- Menu management (CRUD)
- User & role management
- System notifications
- Business reports

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth.js (Google OAuth + Credentials)
- **Payments:** Stripe
- **Styling:** Tailwind CSS
- **State:** Zustand + TanStack Query
- **Email:** Nodemailer (Gmail SMTP)

## 📦 Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your credentials

# Setup database
npx prisma migrate deploy
npx prisma generate
npm run db:seed

# Start development server
npm run dev
```

Visit `http://localhost:3000`

**Default Admin Login:**
- Email: `admin@restonext.com`
- Password: `admin123`

## 🔑 Environment Variables

```env
# Database
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DBNAME

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Payments
STRIPE_SECRET_KEY=sk_test_...

# Email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com

# Optional
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
OPENAI_API_KEY=sk-...
```

## 📁 Project Structure

```
src/
├── app/
│   ├── (admin)/admin/     # Admin dashboard
│   ├── (auth)/signin/     # Authentication
│   ├── api/               # API routes
│   ├── cart/              # Shopping cart
│   ├── orders/            # Order history
│   ├── reservations/      # Table booking
│   └── staff/             # Staff dashboard
├── components/            # Reusable components
└── lib/                   # Utilities & config
```

## 🎯 Key Features

**Smart Reservations**
- Configurable time slots & capacity
- Overlap detection
- Email confirmations (confirm/reject)

**Order Management**
- Real-time status tracking
- Staff assignment
- Payment integration

**Role-Based Access**
- Customer: Browse, order, reserve
- Staff: Manage orders & reservations
- Admin: Full system control

## 📝 Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run db:seed      # Seed database
npx prisma studio    # Database GUI
```

## 🔐 User Roles

| Role | Access |
|------|--------|
| CUSTOMER | Menu, orders, reservations |
| STAFF | + Order management, staff dashboard |
| ADMIN | + Full system access, analytics |

## 📧 Email Setup

For Gmail:
1. Enable 2-Step Verification
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Add to `.env` as `SMTP_PASS`

## 🛠️ Built With

Next.js • TypeScript • Prisma • PostgreSQL • Stripe • Tailwind CSS • NextAuth • Zustand

---

Developed by [Aklilu Mengesha](mailto:aklilumengesha57@gmail.com)
