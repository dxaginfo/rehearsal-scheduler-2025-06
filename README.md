# Rehearsal Scheduler

A web application for bands to schedule rehearsals, track attendance, and optimize rehearsal times based on member availability.

## Features

- **User Authentication**: Secure login and registration system with role-based access control
- **Band Management**: Create and manage multiple bands with different members and roles
- **Availability Tracking**: Let members set their regular availability and specific unavailable dates
- **Smart Scheduling**: Suggest optimal rehearsal times based on member availability
- **Attendance Tracking**: RSVP system and attendance statistics
- **Notifications**: Automated email and push notifications for upcoming rehearsals
- **Repertoire Management**: Create a song library and assign songs to specific rehearsals
- **Resource Sharing**: Upload and share sheet music, audio files, and rehearsal notes
- **Mobile Responsive**: Fully functional on all devices

## Technology Stack

### Frontend
- React.js with TypeScript
- Material-UI
- Redux Toolkit
- Formik with Yup
- FullCalendar.js

### Backend
- Node.js with Express
- JWT Authentication
- PostgreSQL Database
- Prisma ORM
- Redis for caching

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- npm or yarn
- PostgreSQL (v13+)
- Redis

### Local Development Setup

1. **Clone the repository**
   ```
   git clone https://github.com/dxaginfo/rehearsal-scheduler-2025-06.git
   cd rehearsal-scheduler-2025-06
   ```

2. **Set up the backend**
   ```
   cd backend
   npm install
   cp .env.example .env  # Update with your database credentials
   npx prisma migrate dev
   npm run dev
   ```

3. **Set up the frontend**
   ```
   cd frontend
   npm install
   cp .env.example .env  # Update with your API endpoint
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Environment Variables

#### Backend (.env)
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/rehearsal_scheduler
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password
```

#### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Deployment

### Backend Deployment (Heroku)

1. Create a new Heroku application
2. Add PostgreSQL and Redis add-ons
3. Configure environment variables
4. Deploy using the Heroku CLI or GitHub integration

### Frontend Deployment (Vercel)

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy with default settings

## Project Structure

```
rehearsal-scheduler/
├── backend/                # Express.js server
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   └── app.js          # Express app setup
│   ├── prisma/             # Database schema and migrations
│   └── package.json
├── frontend/               # React.js client
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── redux/          # Redux store, actions, reducers
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   ├── App.tsx         # Main component
│   │   └── index.tsx       # Entry point
│   └── package.json
└── README.md
```

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request