# ✈️ SkyBook — Flight Reservation System

> **Academic Project** — A complete, multipage flight booking web application built with React, Bootstrap 5, and browser Local Storage.

---

## 🚀 Quick Start

```bash
cd skybook
npm install
npm run dev
```

Open → **http://localhost:5173/**

Demo Login: `demo@skybook.com` / `Demo@1234`

---

## 📋 Overview

SkyBook is a fully functional **frontend-only** flight reservation system that simulates a real-world airline booking platform. All data persists in **browser Local Storage** — no backend required.

> ⚠️ **Disclaimer:** SkyBook is an academic prototype. It is **not** a real airline, travel agency, or ticketing service. All flights, prices, bookings, and payments are simulated demo data.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React.js 18 | UI library (functional components + hooks) |
| React Router DOM v6 | Client-side multipage routing |
| Bootstrap 5 | Responsive layout and UI components |
| Bootstrap Icons | Icon library |
| Vite | Build tool and dev server |
| Browser Local Storage | Client-side persistent database |
| React Context API | Global auth and booking state |
| CSS3 | Custom animations, gradients, glassmorphism |

---

## 📄 Pages & Routes

| Route | Page | Auth Required |
|---|---|---|
| `/` | Home — Hero, search widget, destinations, deals | No |
| `/flights` | Flight search results with filters & sorting | No |
| `/flight-details/:id` | Full flight itinerary | No |
| `/passenger-details` | Passenger information form | ✅ Yes |
| `/payment` | Payment simulation | ✅ Yes |
| `/booking-confirmation/:id` | Booking success + printable ticket | ✅ Yes |
| `/my-bookings` | Booking history dashboard | ✅ Yes |
| `/booking-details/:id` | Full booking details | ✅ Yes |
| `/login` | Sign in | No |
| `/signup` | Create account | No |
| `/offers` | Coupon codes and deals | No |
| `/about` | About the project | No |
| `/contact` | Contact form + FAQ | No |
| `/profile` | Edit profile, view stats | ✅ Yes |
| `/*` | 404 Not Found | No |

---

## 🔑 Features

### ✈️ Flight Search
- One-way and round-trip
- City/airport autocomplete
- Passenger count (adults, children, infants)
- Cabin class (Economy, Premium Economy, Business, First Class)
- Swap origin/destination
- Date validation

### 🔍 Search Results
- Real-time filtering (price, airline, stops, time)
- Sorting (cheapest, fastest, earliest, latest)
- Skeleton loading states
- Empty state when no results

### 🎫 Booking Flow
1. Select flight → 2. Enter passengers → 3. Apply coupon → 4. Simulate payment → 5. Get confirmed ticket

### 💳 Payment Simulation
- UPI, Credit/Debit Card, Net Banking, Wallet, Demo Payment modes
- Three outcomes: **Success**, **Failed**, **Cancelled**
- **Never stores real financial data**
- Clear disclaimer on every payment screen

### 🎟️ E-Tickets
- Unique booking reference (SKY-XXXXXX)
- E-ticket number
- Printable layout via `window.print()`
- Print-friendly CSS (hides nav, buttons)

### 📁 My Bookings
- Full booking history
- Search and filter by status
- Cancel bookings with confirmation modal
- View detailed itinerary

### 🏷️ Coupon Codes

| Code | Discount |
|---|---|
| `SKYBOOK10` | 10% off (max ₹1,500) |
| `FIRST500` | ₹500 flat off |
| `FLY20` | 20% off (max ₹3,000) |
| `WELCOME` | 15% off (max ₹2,000) |
| `SUMMER25` | 25% off (max ₹4,000) |

---

## 📁 Project Structure

```
src/
├── assets/
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── FlightSearchForm.jsx
│   ├── FlightCard.jsx
│   ├── FlightFilters.jsx
│   ├── BookingSummary.jsx
│   ├── PassengerForm.jsx
│   ├── PaymentMethodSelector.jsx
│   ├── ProtectedRoute.jsx
│   ├── ToastNotification.jsx
│   ├── LoadingSkeleton.jsx
│   ├── EmptyState.jsx
│   └── ScrollToTop.jsx
├── context/
│   ├── AuthContext.jsx
│   └── BookingContext.jsx
├── data/
│   ├── flights.js        ← 30+ sample flights
│   └── coupons.js        ← Sample coupon codes
├── hooks/
│   └── useLocalStorage.js
├── pages/
│   ├── Home.jsx
│   ├── Flights.jsx
│   ├── FlightDetails.jsx
│   ├── PassengerDetails.jsx
│   ├── Payment.jsx
│   ├── BookingConfirmation.jsx
│   ├── MyBookings.jsx
│   ├── BookingDetails.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Offers.jsx
│   ├── About.jsx
│   ├── Contact.jsx
│   ├── Profile.jsx
│   └── NotFound.jsx
├── services/
│   ├── storageService.js
│   ├── flightService.js
│   ├── bookingService.js
│   └── paymentService.js
├── styles/
│   ├── global.css
│   ├── components.css
│   └── responsive.css
└── utils/
    ├── pricing.js
    ├── validation.js
    ├── bookingId.js
    └── dateUtils.js
```

---

## 🗄️ Local Storage Keys

| Key | Contents |
|---|---|
| `skybook_users` | Registered demo user accounts |
| `skybook_current_user` | Active session (without password) |
| `skybook_flights` | Seeded sample flight data |
| `skybook_bookings` | Confirmed bookings |
| `skybook_payments` | Payment simulation records |
| `skybook_coupons` | Available coupon codes |
| `skybook_search_params` | Last flight search parameters |
| `skybook_selected_flight` | Currently selected flight |
| `skybook_draft_booking` | In-progress booking draft |
| `skybook_contact_messages` | Submitted contact form messages |
| `skybook_newsletter` | Newsletter subscriptions |

---

## ⚠️ Security & Privacy Limitations

- **Authentication is demo-only.** Passwords are obfuscated with `btoa()` which is NOT cryptographic hashing. Never use this in production.
- **Local Storage is NOT a secure database.** Any script on the page can read it.
- **No real payment processing.** The payment flow is entirely simulated.
- **Clearing browser data deletes all app data.** There is no server-side backup.
- **Multiple users on the same browser are not securely isolated.**

**For production**, use a proper backend (Node.js/Express, Firebase, etc.), bcrypt for passwords, HTTPS, and an official payment gateway (Razorpay/Stripe) with server-side verification.

---

## 🧪 Testing the Full Booking Journey

1. Open http://localhost:5173/
2. Use the search widget on the Home page (e.g. Mumbai → Delhi)
3. Click **Search Flights**
4. Apply filters, sort results, click **Select Flight**
5. Review flight details → Click **Continue to Booking**
6. Log in with demo credentials (`demo@skybook.com` / `Demo@1234`) if prompted
7. Fill in passenger details
8. Apply coupon code (e.g. `SKYBOOK10`)
9. Click **Proceed to Payment**
10. Select a payment method → Click **Simulate Successful Payment**
11. View your booking confirmation and print your e-ticket
12. Check **My Bookings** to see your history

---

## 📜 Scripts

```bash
npm run dev      # Start development server (http://localhost:5173)
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
```

---

## 📸 Key Design Features

- **Animated gradient hero** with glassmorphism search card
- **Premium navy/blue brand** inspired by airline booking platforms
- **Responsive** — works on mobile, tablet, and desktop
- **Printable e-tickets** with print CSS hiding nav/buttons
- **Skeleton loaders** and empty states throughout
- **Toast notifications** for actions
- **Booking progress indicator** across the 4-step checkout

---

*SkyBook — Academic Flight Reservation System Prototype*  
*Built with React.js, Bootstrap 5, and Local Storage*  
*© 2026 — Not a real airline. All data is simulated.*
