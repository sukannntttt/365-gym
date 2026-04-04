# Gym Website Backend

This document provides an overview of the backend setup for the Gym Website project, which is built using Node.js and Express. The backend is responsible for user authentication, diet plan management, and workout tracking, utilizing a MongoDB database for data storage.

## Project Structure

The backend is organized as follows:

```
server
├── src
│   ├── index.js              # Entry point of the application
│   ├── app.js                # Express app configuration
│   ├── config
│   │   └── db.js            # MongoDB connection logic
│   ├── controllers
│   │   ├── authController.js # User authentication logic
│   │   ├── dietController.js # Diet-related operations
│   │   └── workoutController.js # Workout-related operations
│   ├── routes
│   │   ├── auth.routes.js    # Authentication routes
│   │   ├── diet.routes.js     # Diet plan routes
│   │   └── workout.routes.js  # Workout plan routes
│   ├── models
│   │   ├── User.js           # User schema
│   │   ├── DietPlan.js       # Diet schema
│   │   └── Workout.js        # Workout schema
│   ├── middleware
│   │   └── auth.js           # Authentication middleware
│   └── utils
│       └── validators.js      # Input validation utilities
├── package.json               # Backend dependencies
├── .env.example               # Example environment variables
└── README.md                  # Backend documentation
```

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd gym-website/server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` and fill in the required values.

### Running the Application

To start the backend server, run:
```
npm start
```

The server will be running on `http://localhost:5000` (or the port specified in your environment variables).

### API Endpoints

- **Authentication**
  - `POST /api/auth/register`: Register a new user.
  - `POST /api/auth/login`: Log in an existing user.
  - `GET /api/auth/me`: Get the current user's details.

- **Diet Plans**
  - `GET /api/diet/:goal`: Get diet plans based on user goals.
  - `GET /api/diet`: Get all available diet plans.

- **Workout Plans**
  - `GET /api/workout/:goal`: Get workout plans based on user goals.
  - `GET /api/workout`: Get all available workout plans.

### Contributing

Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

### License

This project is licensed under the MIT License. See the LICENSE file for details.