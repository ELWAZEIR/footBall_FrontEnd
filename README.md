# Football Academy Management System

A comprehensive full-stack web application for managing a football academy with role-based access control, player management, and financial tracking.

## Features

### Authentication & Authorization
- Secure JWT-based authentication
- Role-based access control (Admin & Coach)
- Protected routes based on user roles

### Admin Features
- **Dashboard**: Complete overview with financial analytics and key metrics
- **Player Management**: Add, edit, delete players with birth year filtering
- **Subscription Tracking**: Monitor monthly payments and overdue notifications
- **Uniform Management**: Track uniform payments and delivery status
- **Registration Management**: Handle registration fees and document submission
- **Coach Management**: Add/edit coaches with salary and birth year assignments

### Coach Features
- **Subscription View**: Read-only access to subscriptions for assigned birth years
- **Filtered Access**: Only see players from birth years they're responsible for

### Core Functionality
- Search and filter capabilities across all data tables
- Real-time payment status tracking
- Overdue payment highlighting (30+ days)
- Responsive design for all devices
- Form validation and error handling

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Router** for navigation
- **Axios** for API calls
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **Prisma ORM** with PostgreSQL
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** enabled

### Database
- **PostgreSQL** with Prisma schema
- Comprehensive relational model
- Proper foreign key constraints
- Optimized queries

## Installation & Setup

### Prerequisites
- Node.js 16+
- PostgreSQL database
- npm or yarn

### 1. Clone and Install
```bash
git clone <repository-url>
cd football-academy-system
npm install
```

### 2. Database Setup
```bash
# Set up your PostgreSQL database
# Update DATABASE_URL in .env file

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database with sample data
node server/seed.js
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```
DATABASE_URL="postgresql://username:password@localhost:5432/football_academy"
JWT_SECRET="your-super-secret-jwt-key-here"
PORT=5000
```

### 4. Run the Application
```bash
# Start backend server
npm run server

# Start frontend (in another terminal)
npm run dev
```

## Demo Credentials

### Admin Access
- Email: admin@academy.com
- Password: admin123

### Coach Access
- Email: coach@academy.com
- Password: coach123

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Users Management
- `GET /api/users` - Get all users (Admin only)
- `POST /api/users` - Create new user (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Players Management
- `GET /api/players` - Get players (filtered by coach years)
- `POST /api/players` - Create player (Admin only)
- `PUT /api/players/:id` - Update player (Admin only)
- `DELETE /api/players/:id` - Delete player (Admin only)

### Subscriptions
- `GET /api/subscriptions` - Get subscriptions (filtered by role)
- `POST /api/subscriptions` - Create subscription
- `PUT /api/subscriptions/:id` - Update subscription

### Uniforms
- `GET /api/uniforms` - Get uniforms (Admin only)
- `POST /api/uniforms` - Create uniform (Admin only)
- `PUT /api/uniforms/:id` - Update uniform (Admin only)

### Registration
- `GET /api/registrations` - Get registrations (Admin only)
- `POST /api/registrations` - Create registration (Admin only)
- `PUT /api/registrations/:id` - Update registration (Admin only)

### Dashboard
- `GET /api/dashboard` - Get dashboard analytics (Admin only)

## Project Structure

```
football-academy-system/
├── server/
│   ├── index.js          # Express server setup
│   └── seed.js           # Database seeding
├── prisma/
│   └── schema.prisma     # Database schema
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   ├── Layout.tsx    # Main layout component
│   │   └── ProtectedRoute.tsx
│   ├── pages/            # Page components
│   ├── store/            # Zustand store
│   ├── lib/              # Utilities and API client
│   └── App.tsx           # Main app component
├── .env                  # Environment variables
└── README.md
```

## Key Features

### Role-Based Access Control
- Admins have full access to all features
- Coaches can only view subscriptions for their assigned birth years
- Protected routes prevent unauthorized access

### Financial Tracking
- Real-time income calculation
- Payment status monitoring
- Overdue payment alerts
- Comprehensive financial dashboard

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interface
- Consistent user experience

### Data Management
- Advanced search and filtering
- Bulk operations support
- Real-time updates
- Data validation

## Deployment

### Frontend Deployment
```bash
npm run build
# Deploy dist/ folder to your hosting service
```

### Backend Deployment
```bash
# Set production environment variables
# Deploy to your Node.js hosting service
# Ensure PostgreSQL database is accessible
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.