# Gym Website Project

This project is a comprehensive gym website that includes both a frontend and a backend. The frontend is built with React, while the backend is powered by Node.js and Express. The application provides user authentication, diet planning, and workout tracking functionalities.

## Project Structure

```
gym-website
├── client                # Frontend application
│   ├── public
│   │   └── index.html    # Main HTML file
│   ├── src
│   │   ├── index.jsx      # Entry point for React
│   │   ├── App.jsx        # Main application component
│   │   ├── components      # React components
│   │   └── styles         # Stylesheets
│   ├── package.json       # Frontend dependencies
│   └── README.md          # Frontend documentation
├── server                # Backend application
│   ├── src
│   │   ├── index.js       # Entry point for backend
│   │   ├── app.js         # Express app configuration
│   │   ├── config
│   │   │   └── db.js      # MongoDB connection logic
│   │   ├── controllers
│   │   │   ├── authController.js  # User authentication logic
│   │   │   ├── dietController.js  # Diet-related operations
│   │   │   └── workoutController.js # Workout-related operations
│   │   ├── routes
│   │   │   ├── auth.routes.js  # Authentication routes
│   │   │   ├── diet.routes.js   # Diet routes
│   │   │   └── workout.routes.js # Workout routes
│   │   ├── models
│   │   │   ├── User.js          # User schema
│   │   │   ├── DietPlan.js      # Diet schema
│   │   │   └── Workout.js       # Workout schema
│   │   ├── middleware
│   │   │   └── auth.js          # Authentication middleware
│   │   └── utils
│   │       └── validators.js     # Input validation utilities
│   ├── package.json             # Backend dependencies
│   ├── .env.example              # Example environment variables
│   └── README.md                 # Backend documentation
├── .gitignore                   # Git ignore file
└── README.md                    # Overall project documentation
```

## Features

- **User Authentication**: Users can register, log in, and access their profile.
- **Diet Plan System**: Users can view diet plans based on their fitness goals.
- **Workout Tracking**: Users can access workout plans tailored to their goals.

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the server directory and install dependencies:
   ```
   cd server
   npm install
   ```

3. Navigate to the client directory and install dependencies:
   ```
   cd ../client
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd server
   npm start
   ```

2. Start the frontend application:
   ```
   cd ../client
   npm start
   ```

### Environment Variables

Create a `.env` file in the `server` directory based on the `.env.example` file to configure your database connection and JWT secrets.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.