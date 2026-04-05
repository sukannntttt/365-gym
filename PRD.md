# Product Requirements Document (PRD): KINETIC Gym

## 1. Product Overview
**KINETIC** is a high-performance, premium fitness management platform and digital ecosystem designed for elite training facilities. It embraces a "monolithic" and "brutalist" aesthetic, catering to users who demand absolute physical dominance and specialized training protocols.

### 1.1 Vision
To provide a high-intensity, distraction-free digital environment where athletes can track their evolution across training, nutrition, and recovery.

---

## 2. Target Audience
- **Elite Athletes**: Users focused on serious performance gains (Powerlifting, Combat, Endurance).
- **Performance Coaches**: Trainers who manage specialized "Operators" programs.
- **Tech-Savvy Fitness Enthusiasts**: Users who appreciate premium UI/UX and data-driven progress.

---

## 3. User Stories

### 3.1 For Athletes
- **Onboarding**: As a new user, I want to initialize my profile with my dietary preferences (Vegetarian/Non-Vegetarian) so I get personalized Indian meal plans.
- **Performance Monitoring**: As a member, I want to log my workouts and view progress charts so I can track my physical evolution.
- **Nutrition**: As a member, I want to see a daily diet breakdown with accurate macronutrient tracking for Indian foods.
- **Membership**: As a user, I want to select and pay for a "Protocol" (Membership Tier) to unlock specific facility features.

### 3.2 For Administrators/Operators
- **User Management**: As an admin, I want to view and manage all active members and their subscription statuses.
- **System Control**: As an admin, I want to update gym settings and trainer profiles (e.g., via `admin.html`).

---

## 4. Functional Requirements

### 4.1 Authentication & Authorization
- **Secure Sign-up/Login**: JWT-based authentication.
- **Email Verification**: Mandatory verification for account initialization.
- **Password Recovery**: Secure reset-password flow.

### 4.2 Membership Protocols (Tiers)
- **Protocol 01 (Basic / Free)**: Unlimited access + lockers + hydration.
- **Protocol 02 (Elite Kinetic / Pro)**: Basic features + 4 operator sessions + analysis tools + priority booking.
- **Protocol 03 (Monolith / Elite)**: Elite features + dedicated coach + biometric analysis + private recovery suite + custom supplement protocol.
> [!NOTE]
> The backend schema currently uses `Free`, `Pro`, and `Elite` for internal tier mapping, consistent with the `User` model.

### 4.3 Training & Workout Logging
- **Workout Builder**: Interface to log exercises (Name, Sets, Reps, Weight).
- **High-Performance Dashboards**: Real-time analytics of training volume and intensity.

### 4.4 Nutritional Intelligence
- **Personalized Indian Diet Plans**: Curated meal plans for Veg and Non-Veg preferences.
- **Macronutrient Tracking**: Automated breakdown of Protein, Carbs, and Fats.

### 4.5 Payment Integration
- **Manual Verification**: The system tracks `pendingTxnId` and `pendingTier` for manual or receipt-based verification as it evolves toward full payment gateway integration.

---

## 5. Non-Functional Requirements

### 5.1 UI/UX Design (The "Kinetic" Aesthetic)
- **Tactile 3D UI**: Buttons that depress, floating cards with lighting, and "carved" inputs.
- **Brutalist Dark Mode**: High-contrast, monochromatic palette with neon-glow accents.
- **Micro-animations**: Smooth transitions and 3D parallax effects for hero elements.

### 5.2 Performance
- **Optimized Asset Loading**: High-quality imagery with grayscale filters to maintain aesthetic without bloating load times.
- **Responsive Design**: Flawless experience across Mobile, Tablet, and Desktop.

### 5.3 Security
- **Data Privacy**: Encrypted passwords (Bcrypt) and secure session handling (JWT).

---

## 6. Technical Stack
- **Frontend**: 
    - HTML5 / Semantic HTML
    - Vanilla JavaScript (Modern ES6+)
    - Tailwind CSS (CDN-based v3) for layout
    - Custom CSS (`kinetic.css`) for 3D/Glassmorphism effects
- **Backend**:
    - Node.js (CommonJS) & Express.js
    - MongoDB (via Mongoose ODM)
    - JWT (JSON Web Tokens) for authentication
- **Infrastructure**:
    - Deployment: Render (Backend API), Static Hosting (Frontend)
    - Version Control: Git / GitHub

---

## 7. Roadmap & Future Enhancements
- **Biometric Integration**: Connect to wearable devices (Apple Watch, Whoop, Oura).
- **Operator Portal**: Specialized mobile app for trainers to manage their athletes.
- **Supplement Store**: In-app purchase of custom supplement protocols.
- **Community "Battalions"**: Social features for group challenges and training cohorts.
