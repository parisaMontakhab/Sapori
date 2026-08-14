# Sapori 🍝

**Sapori – Italian Food Delivery**

A full-stack Italian food delivery web application with a modern frontend built using Next.js, React, TypeScript, and Tailwind CSS, connected to a real Node.js, Express, and MongoDB backend.

Sapori provides a complete food-ordering experience including authentication, product browsing, cart management, checkout and payments, orders, user profiles, product reviews, ratings, profile image uploads, and email-based password recovery.

---

## Overview

Sapori started as a learning project and evolved into a fully integrated full-stack application.

The frontend is built with **Next.js, React, TypeScript, and Tailwind CSS**, while the backend exposes a REST API built with **Node.js, Express, MongoDB, and Mongoose**.

The application uses real backend data instead of mock product, user, and order data. It includes authentication, persistent user accounts, product reviews, order management, online payments, profile management, and password recovery.

The frontend and backend are deployed separately and communicate through the production REST API.

---

## Features

### 🍕 Products & Menu

- Browse Italian dishes across multiple categories
- Pizza, Pasta, Antipasti, Dolci, Insalate, and Drinks
- Product detail pages with images, descriptions, prices, and ratings
- Search products by name
- Filter products by category
- Paginated menu
- URL-based pagination with invalid page handling
- Product average ratings and review counts
- Loading skeletons
- API error handling
- Product not-found handling

### 🛒 Shopping Cart

- Add products to the cart
- Update item quantities
- Remove products from the cart
- Persistent cart state
- Cart badge in the navigation
- Subtotal and total calculation
- Delivery fee handling
- Free-delivery progress
- Checkout flow

### 💳 Payments

- Stripe Checkout integration
- Secure payment flow
- Backend-generated Stripe Checkout sessions
- Payment success handling
- Payment cancellation handling
- Stripe webhook integration
- Order payment status synchronization

### 🔐 Authentication

- User registration
- Login
- Logout
- JWT-based authentication
- Protected user functionality
- Persistent authentication state
- Authenticated user retrieval from the backend
- Auth-aware navigation

### 🔑 Password Recovery

- Forgot password flow
- Secure password reset tokens
- Password reset links delivered by email
- SendGrid email delivery in production
- Reset token expiration handling
- Reset password page
- Change password from the user profile

### 👤 User Profile

- View account information
- Edit user information
- Upload and update profile photo
- Change password
- View order history
- Profile photo displayed across the application

### 📦 Orders

- Create orders through the backend API
- Orders persisted in MongoDB
- View authenticated user's order history
- Order numbers
- Order dates
- Ordered products and quantities
- Order totals
- Order and payment statuses
- Review purchased products from order history

### ⭐ Reviews & Ratings

- Product-specific customer reviews
- Public review listing
- Create reviews for purchased products
- Edit own reviews
- Delete own reviews
- Review ownership protection
- User avatars in reviews
- Average product rating calculation
- Review quantity tracking
- Product ratings automatically updated after review mutations
- Loading, error, and empty review states

Only users who have purchased a product can submit a review for that product. This rule is enforced by the backend rather than relying only on frontend validation.

### ⚡ Server State & Data Handling

- TanStack React Query for server-state management
- Query and mutation hooks
- Query cache invalidation after mutations
- Centralized API client
- Frontend/backend data mapping
- Loading skeletons
- Retry states
- API error handling
- Empty states
- Invalid product handling

### 📱 Responsive UI

- Mobile-first responsive design
- Responsive navigation
- Product grids
- Forms
- Cart and checkout
- Product detail pages
- Profile dashboard
- Review interfaces

---

## Tech Stack

### Frontend

| Category       | Technology                    |
| -------------- | ----------------------------- |
| Framework      | Next.js – App Router          |
| UI             | React 19                      |
| Language       | TypeScript                    |
| Styling        | Tailwind CSS v4               |
| Server State   | TanStack React Query          |
| Client State   | Custom stores + Local Storage |
| Image Handling | Next.js Image                 |
| Deployment     | Vercel                        |

### Backend

| Category          | Technology            |
| ----------------- | --------------------- |
| Runtime           | Node.js               |
| Framework         | Express               |
| Database          | MongoDB               |
| ODM               | Mongoose              |
| Authentication    | JWT                   |
| Password Security | bcrypt                |
| Email             | Nodemailer + SendGrid |
| File Uploads      | Multer                |
| Image Processing  | Sharp                 |
| Payments          | Stripe                |
| API Architecture  | REST                  |
| Deployment        | Render                |

---

## Application Architecture

Sapori separates the frontend and backend into independent applications.

```text
Browser
   │
   ▼
Next.js Frontend
   │
   │ REST API
   ▼
Node.js / Express Backend
   │
   ├──────────────► Stripe
   │
   ├──────────────► SendGrid
   │
   ▼
MongoDB
```

Production architecture:

```text
User
 │
 ▼
Vercel
Next.js Frontend
 │
 ▼
Render
Express REST API
 │
 ▼
MongoDB Atlas
```

---

## API Integration

Frontend API communication is handled through a centralized service layer.

```text
Page / Component
       │
       ▼
React Query / Service
       │
       ▼
API Client
       │
       ▼
Express REST API
       │
       ▼
MongoDB
```

Backend responses are mapped into frontend TypeScript models before being consumed by UI components.

This keeps backend-specific data structures, such as MongoDB `_id`, separate from frontend models.

---

## Authentication Flow

Sapori uses JWT-based authentication.

```text
Register / Login
      │
      ▼
Express API
      │
      ▼
JWT generated
      │
      ▼
Frontend authentication state
      │
      ▼
Authenticated API requests
```

The authenticated user's information is retrieved from the backend and used throughout the application, including the navbar, profile, orders, and review system.

---

## Password Reset Flow

Sapori includes an email-based password recovery system.

```text
Forgot Password
      │
      ▼
Backend generates reset token
      │
      ▼
Reset email sent through SendGrid
      │
      ▼
User opens reset link
      │
      ▼
New password submitted
      │
      ▼
Password updated
      │
      ▼
User authenticated
```

Password reset tokens are time-limited and securely handled by the backend.

---

## Review System

Reviews belong to both a user and a specific product.

Product detail pages retrieve only reviews associated with the current product, while the public reviews page can retrieve reviews across products.

Review creation is protected by backend purchase verification:

```text
Authenticated User
       │
       ▼
Submit Review
       │
       ▼
Backend verifies paid order
       │
       ├── Not purchased → 403
       │
       ▼
Review created
       │
       ▼
Product rating recalculated
```

Users can modify or delete only their own reviews.

After a review is created, edited, or deleted, related frontend queries are invalidated so review and product rating data can be refreshed.

---

## Payment Flow

Payments are handled through Stripe Checkout.

```text
Cart
  │
  ▼
Order Created
  │
  ▼
Backend creates Stripe Checkout Session
  │
  ▼
Stripe Checkout
  │
  ▼
Payment Completed
  │
  ▼
Stripe Webhook
  │
  ▼
Order marked as paid / confirmed
```

Payment validation and order status updates are handled by the backend.

---

## Profile Images

Users can upload and update their profile photos.

The backend handles image processing and user photo persistence, while the frontend resolves the stored photo data into a displayable image source.

Profile photos are used across:

- Navbar
- User profile
- Product reviews

Fallback initials are displayed when a user does not have a valid profile image.

---

## Screenshots

Screenshots can be stored inside `docs/screenshots/`.

|                Home Page                |                Menu Page                |
| :-------------------------------------: | :-------------------------------------: |
| ![Home Page](docs/screenshots/home.png) | ![Menu Page](docs/screenshots/menu.png) |

|                 Product Page                  |                Cart Page                |
| :-------------------------------------------: | :-------------------------------------: |
| ![Product Page](docs/screenshots/product.png) | ![Cart Page](docs/screenshots/cart.png) |

|                 Profile Page                  |
| :-------------------------------------------: |
| ![Profile Page](docs/screenshots/profile.png) |

---

## Environment Variables

Create a `.env.local` file for local frontend development.

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

Production environment variables are configured through the deployment platform.

> Never commit API keys, JWT secrets, SendGrid credentials, Stripe secrets, database credentials, or other sensitive environment variables to the repository.

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/parisaMontakhab/Sapori.git
cd Sapori
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create:

```text
.env.local
```

and configure the backend API URL.

### 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### Production build

```bash
npm run build
npm start
```

---

## Project Structure

```text
sapori/
├── app/                     # Next.js App Router routes
│   ├── page.tsx             # Home
│   ├── menu/                # Menu, search & pagination
│   ├── product/[id]/        # Product details & reviews
│   ├── reviews/             # Public reviews
│   ├── cart/                # Shopping cart
│   ├── checkout/            # Checkout
│   ├── profile/             # User profile
│   ├── login/               # Login
│   ├── register/            # Registration
│   ├── forgot-password/     # Forgot password
│   └── reset-password/      # Password reset
│
├── components/              # Reusable UI components
├── hooks/                   # React Query & application hooks
├── lib/                     # API helpers, mappers & utilities
├── services/                # REST API service layer
├── store/                   # Authentication & cart state
├── types/                   # TypeScript models
└── public/                  # Static assets
```

---

## AI-Assisted Frontend Development

The Sapori frontend was developed using an **AI-assisted development workflow**, with **Cursor AI Agent** used as a development tool throughout the frontend implementation.

Cursor AI Agent assisted with tasks including:

- Building and refining React and Next.js components
- Implementing responsive UI layouts
- Integrating the frontend with the REST API
- Implementing React Query queries and mutations
- Handling loading, error, empty, and not-found states
- Implementing frontend authentication flows
- Building product review and rating interfaces
- Refactoring frontend code
- Debugging frontend and frontend/backend integration issues

**ChatGPT** was also used during development for technical discussions, debugging, architecture decisions, code review, and understanding full-stack concepts.

AI tools were used as development assistants throughout the project. Final architecture decisions, API integration, debugging, testing, validation, and overall codebase management remained under developer review and ownership.

Working with AI agents was also treated as part of the engineering workflow: generated changes were inspected, tested, debugged, and adapted to the requirements of the application rather than accepted without validation.

---

## Learning Outcomes

Building Sapori provided practical experience with:

- Next.js App Router
- React Server and Client Components
- TypeScript
- Tailwind CSS
- TanStack React Query
- Server-state management
- REST API integration
- Node.js and Express
- MongoDB and Mongoose
- JWT authentication
- Authentication vs authorization
- Protected API routes
- Password hashing
- Password reset flows
- Transactional email with SendGrid
- File uploads and image processing
- Stripe Checkout
- Stripe webhooks
- Product reviews and ratings
- Query cache invalidation
- Search and pagination
- Error and loading-state handling
- Production environment configuration
- Frontend/backend deployment
- Debugging production-specific issues
- AI-assisted software development with Cursor AI Agent
- Reviewing, validating, and debugging AI-assisted code changes

---

## Current Status

Sapori is a functional full-stack application with:

- Deployed frontend
- Deployed backend REST API
- MongoDB database integration
- Real authentication
- Shopping cart
- Orders
- Stripe payments
- User profiles
- Profile image uploads
- Product reviews
- Product ratings
- Password recovery
- Transactional email

The project continues to evolve as additional production-oriented features are implemented.

---

## Future Improvements

Potential future improvements include:

- Live order tracking
- Admin dashboard
- Product management interface
- Order management tools
- Favorites / wishlist
- Improved transactional email deliverability
- Custom email domain
- Automated unit and integration tests
- End-to-end testing
- Accessibility improvements
- Performance monitoring

---

## Author

**Parisa Montakhabi**

---

_Built with ❤️, code, AI-assisted development, and pasta._
