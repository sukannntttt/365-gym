# Technical Design Document: KINETIC

## 1. System Architecture
**KINETIC** follows a decoupled multi-tier architecture designed for performance, scalability, and high-fidelity rendering.

### 1.1 High-Level Components
- **Client Tier**: Standard Semantic HTML5, Tailwind CSS, and Modern ES6+ JavaScript. Utilizes `fetch` for asynchronous state management.
- **API Tier**: Node.js / Express server providing RESTful JSON endpoints.
- **Data Tier**: MongoDB (Atlas/Local) via Mongoose ODM for persistence.
- **Authentication**: Stateless JWT-based authentication with Bcrypt password hashing.

---

## 2. Visual Design System ("Technical Monolithism")

### 2.1 Core Palette
- **Primary**: `#FFFFFF` (Pure white for high-contrast visibility).
- **Surface/Background**: `#131313` (Deep grey-black for industrial depth).
- **Accent/Glow**: `rgba(255, 255, 255, 0.4)` (Subtle neon radiance).
- **Secondary Surface**: `#1B1B1B` (For layered UI components).
- **Standard Border**: `rgba(71, 71, 71, 0.15)` (Subtle brutalist separation).

### 2.2 Typography
- **Headlines**: `Lexend` (Black Italic, All Caps) – High-performance, aggressive display font.
- **Body & Labels**: `Inter` – Clean, technical, and readable for data-heavy sections.

### 2.3 Tactile Components (The "Kinetic" Feel)
- **3D Buttons (`.btn-3d`)**: Implemented via `box-shadow` depth and `translateY` on active state to simulate physical depression.
- **Glassmorphism (`.glass-nav`)**: High-blur background filters for a premium modern feel.
- **Monochromatic Bento-Grids**: Strict layout hierarchies using varying tones of grey to separate operational data.
- **Vertical Overlays**: 90-degree rotated labels and coordination coordinates for a tactical monitoring aesthetic.

---

## 3. Database Schema Mapping

### 3.1 User Model (`models/User.js`)
| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | String | Full name of the athlete. |
| `email` | String | Unique identifier (Verified via token). |
| `password` | String | Hashed (Bcrypt) training credentials. |
| `dietPreference` | Enum | `veg`, `non-veg`. |
| `membershipTier` | Enum | `Free`, `Pro`, `Elite` (Maps to Protocol 01, 02, 03). |
| `pendingTier` | String | Tier awaiting payment verification. |
| `feeDueDate` | Date | Next billing cycle. |

### 3.2 Performance Models
- **Diet**: Stores daily meal plans with macros (P, C, F, Calories).
- **WorkoutLog**: Tracks individual training sessions (Exercises, Sets, Reps).
- **Progress**: Stores biometric timeline data (Weight, BMI).

---

## 4. API Ecosystem

### 4.1 Authentication Protocols (`routes/auth.js`)
- `POST /api/auth/register`: Initialize new athlete profile.
- `POST /api/auth/login`: Authenticate and return JWT.
- `GET /api/auth/verify/:token`: Finalize email-based account activation.

### 4.2 Membership & Payments (`routes/payment.js`)
- `POST /api/payment/request`: Submit a payment transaction ID for tier upgrade (`pendingTxnId`).
- `GET /api/admin/verify-payment/:id`: (Admin Only) Approve manual transaction.

### 4.3 Analytics & Intelligence (`routes/analytics.js`)
- `GET /api/analytics/summary`: Aggregate data for dashboard visualizations.
- `GET /api/bmi/calculate`: Health calculation engine.

---

## 5. Security Protocols
- **JWT Authorization Middleware**: Every sensitive endpoint requires a valid `x-auth-token` header.
- **CORS Configuration**: Restricted to verified frontend domains.
- **Data sanitization**: Server-side validation of all user-generated health metrics.

---

## 6. Frontend Execution Logic
The frontend avoids heavy framework overhead to maximize core performance:
1. **Dynamic Rendering**: JavaScript modules (`client/js/`) iterate over JSON responses to inject HTML components into the DOM.
2. **State Persistence**: JWT is stored in `localStorage` for session maintenance.
3. **Responsive Scaling**: Tailwind container queries ensure tactical data remains legible on all device classes.
4. **Hero Parallax**: `mousemove` events drive a 3D `rotateX`/`rotateY` effect on the monolithic hero container.

---
© 2024 KINETIC PERFORMANCE MONOLITH. ALL PROTOCOLS ENFORCED.
