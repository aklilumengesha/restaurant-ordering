# RestoNext - Restaurant Ordering System

A modern, full-stack restaurant ordering and management system built with Next.js 14, featuring online ordering, table reservations, staff management, and an admin dashboard.

## Features

### Customer Features
- **Menu Browsing** - Browse menu items with category filtering and search
- **Shopping Cart** - Add items to cart with persistent storage (Zustand + localStorage)
- **Online Ordering** - Place orders with Stripe payment integration
- **Table Reservations** - Book tables with time slot availability checking
- **Order Tracking** - View order history and real-time status updates
- **AI Chat Assistant** - Get help with menu, orders, and reservations (OpenAI-powered)
- **Dark/Light Theme** - Toggle between themes with next-themes

### Staff Features
- **Staff Dashboard** - View and manage assigned orders
- **Order Management** - Update order status (Pending → Preparing → Ready → Delivered)
- **Reservation Management** - View and manage table reservations

### Admin Features
- **Analytics Dashboard** - Revenue tracking, daily sales charts, top-selling items
- **Menu Management** - CRUD operations for menu items
- **Order Management** - View all orders, assign to staff, update status
- **User Management** - Manage users, roles (Admin/Staff/Customer), and account status
- **Reservation Management** - Approve/reject reservations, view calendar
- **Staff Scheduling** - Manage staff shifts
- **Notifications** - System alerts for new orders, reservations, and errors
- **Reports** - Business analytics and reporting

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Zustand** - State management (cart)
- **TanStack Query** - Server state management
- **Lucide React** - Icons
- **next-themes** - Dark mode support

### Backend
- **Next.js API Routes** - RESTful API endpoints
- **NextAuth.js** - Authentication (Google OAuth + Credentials)
- **Prisma** - ORM for database operations
- **PostgreSQL** - Database
- **Zod** - Schema validation

### Integrations
- **Stripe** - Payment processing
- **OpenAI** - AI chat assistant (optional)
- **Nodemailer** - Email notifications
- **Twilio** - SMS notifications (optional)

## Project Structure

```
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.js            # Database seeding
│   └── migrations/        # Database migrations
├── src/
│   ├── app/
│   │   ├── (admin)/       # Admin dashboard routes
│   │   │   └── admin/
│   │   │       ├── menu/         # Menu management
│   │   │       ├── orders/       # Order management
│   │   │       ├── reports/      # Analytics reports
│   │   │       ├── reservations/ # Reservation management
│   │   │       ├── staff/        # Staff scheduling
│   │   │       └── users/        # User management
│   │   ├── (auth)/        # Authentication pages
│   │   │   └── signin/
│   │   ├── (home)/        # Public menu page
│   │   ├── api/           # API routes
│   │   │   ├── auth/           # NextAuth endpoints
│   │   │   ├── chat/           # AI chat endpoint
│   │   │   ├── checkout/       # Stripe checkout
│   │   │   ├── menu/           # Menu CRUD
│   │   │   ├── my/             # User-specific endpoints
│   │   │   ├── notifications/  # Admin notifications
│   │   │   ├── orders/         # Order management
│   │   │   ├── recommendations/# AI recommendations
│   │   │   ├── reservations/   # Reservation management
│   │   │   ├── shifts/         # Staff shifts
│   │   │   └── users/          # User management
│   │   ├── cart/          # Shopping cart page
│   │   ├── checkout/      # Checkout flow
│   │   ├── orders/        # Order history
│   │   ├── profile/       # User profile
│   │   ├── reservations/  # Table booking
│   │   └── staff/         # Staff dashboard
│   ├── components/
│   │   ├── admin/         # Admin-specific components
│   │   ├── cart-icon.tsx
│   │   ├── chat-widget.tsx
│   │   ├── footer.tsx
│   │   ├── header.tsx
│   │   ├── menu-filters.tsx
│   │   ├── menu-grid.tsx
│   │   ├── pagination.tsx
│   │   ├── providers.tsx
│   │   └── status-badge.tsx
│   ├── lib/
│   │   ├── auth.ts        # NextAuth configuration
│   │   ├── cart.ts        # Cart store (Zustand)
│   │   ├── email.ts       # Email service
│   │   ├── guard.ts       # Route protection
│   │   ├── notify.ts      # Notification service
│   │   ├── prisma.ts      # Prisma client
│   │   ├── recommend.ts   # Recommendation engine
│   │   ├── reservations.ts# Reservation utilities
│   │   └── stripe.ts      # Stripe client
│   ├── middleware.ts      # Route middleware (admin protection)
│   └── types/             # TypeScript types
├── .env.example           # Environment variables template
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind configuration
└── package.json           # Dependencies
```

## Database Schema

### Models
- **User** - Customers, staff, and admins with role-based access
- **MenuItem** - Menu items with categories (Appetizers, Mains, Desserts, Drinks)
- **Order** - Customer orders with status tracking
- **OrderItem** - Individual items in an order
- **Reservation** - Table reservations with time slots
- **Shift** - Staff work schedules
- **Notification** - System notifications for admins
- **Account/Session** - NextAuth authentication models

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Stripe account (for payments)
- Google OAuth credentials (optional)
- OpenAI API key (optional, for chat)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd restaurant-ordering-system
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Database
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DBNAME

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
APP_URL=http://localhost:3000

# Reservations
RES_OPEN=11:00
RES_CLOSE=22:00
RES_SLOT_MINUTES=30
RES_CAPACITY=1

# OpenAI (optional)
OPENAI_API_KEY=sk-...

# SMTP (optional)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password
FROM_EMAIL=noreply@example.com
ADMIN_EMAIL=admin@example.com
```

5. Set up the database:
```bash
npx prisma migrate deploy
npx prisma generate
```

6. Seed the database (creates admin user):
```bash
npm run db:seed
```

Default admin credentials:
- Email: `admin@restonext.com`
- Password: `admin123`

7. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed the database |

## API Endpoints

### Public
- `GET /api/menu` - Get active menu items
- `GET /api/reservations/availability` - Check slot availability

### Authenticated (Customer)
- `POST /api/orders` - Create new order
- `GET /api/my/orders` - Get user's orders
- `GET /api/my/profile` - Get user profile
- `PUT /api/my/profile` - Update user profile
- `POST /api/reservations` - Create reservation
- `POST /api/checkout` - Create Stripe checkout session
- `POST /api/chat` - Chat with AI assistant
- `GET /api/recommendations` - Get personalized recommendations

### Staff/Admin
- `GET /api/orders` - Get all orders
- `PUT /api/orders` - Update order status
- `GET /api/reservations` - Get all reservations
- `PUT /api/reservations/:id` - Update reservation
- `POST /api/reservations/:id/approve` - Approve reservation
- `POST /api/reservations/:id/reject` - Reject reservation

### Admin Only
- `POST /api/menu` - Create menu item
- `PUT /api/menu` - Update menu item
- `DELETE /api/menu` - Delete menu item
- `GET /api/users` - Get all users
- `PUT /api/users` - Update user role/status
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications` - Mark notification as read
- `GET /api/shifts` - Get staff shifts
- `POST /api/shifts` - Create shift

## User Roles

| Role | Permissions |
|------|-------------|
| **CUSTOMER** | Browse menu, place orders, make reservations, view own orders |
| **STAFF** | All customer permissions + manage assigned orders, view staff dashboard |
| **ADMIN** | Full access to admin dashboard, user management, analytics, all orders |

## Authentication

The system supports two authentication methods:
1. **Credentials** - Email/password login
2. **Google OAuth** - Sign in with Google

Session management uses JWT strategy with role-based access control enforced via middleware.

## Key Features Implementation

### Cart System
- Uses Zustand for state management
- Persisted to localStorage
- Supports quantity updates and item removal
- Calculates subtotal with 8% tax

### Reservation System
- Configurable business hours (RES_OPEN, RES_CLOSE)
- Configurable slot duration (RES_SLOT_MINUTES)
- Overlap detection with capacity limits
- Email confirmation on booking

### Order Assignment
- Auto-assigns orders to staff with least active orders
- Real-time status updates
- Notification system for new orders

### Recommendation Engine
- Combines user purchase history with global popularity
- Boosts items from categories user has ordered
- Falls back to recent items if insufficient data

## License

This project is private and proprietary.
