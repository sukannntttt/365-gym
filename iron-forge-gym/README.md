# Iron Forge Gym

Welcome to the Iron Forge Gym project! This is a modern, responsive web application designed to provide users with a comprehensive fitness experience. The application includes features such as a membership system, a BMI calculator, goal-based training plans, and a diet plan generator.

## Features

- **Home Page**: A welcoming landing page featuring a hero section, membership pricing cards, trainers section, testimonials, and contact information.
- **Membership System**: Users can view and select from various membership options tailored to their fitness needs.
- **BMI Calculator**: A tool for users to calculate their Body Mass Index based on their height and weight.
- **Goal-Based Training Plans**: Users can select training plans based on their fitness goals, whether it's weight loss, muscle gain, or general fitness.
- **Diet Plan Generator**: A feature that generates personalized diet plans based on user goals and preferences.
- **User Dashboard**: A personalized dashboard for users to track their goals, BMI, workout plans, and progress.
- **Admin Panel**: An interface for administrators to manage users and content effectively.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript, Prisma
- **Database**: PostgreSQL (or any other supported database)
- **State Management**: Redux (or any preferred state management library)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/iron-forge-gym.git
   ```

2. Navigate to the project directory:
   ```
   cd iron-forge-gym
   ```

3. Install dependencies for the client:
   ```
   cd client
   npm install
   ```

4. Install dependencies for the server:
   ```
   cd server
   npm install
   ```

5. Set up the environment variables:
   - Copy `.env.example` to `.env` and fill in the required values.

6. Run the application:
   - For the client:
     ```
     cd client
     npm run dev
     ```
   - For the server:
     ```
     cd server
     npm run start
     ```

## Testing

To run tests for the client and server, navigate to the respective test directories and run:
```
npm test
```

## Docker

To run the application using Docker, use the following command:
```
docker-compose up
```

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features you'd like to add.

## Contact

For any inquiries, please reach out to [your-email@example.com].