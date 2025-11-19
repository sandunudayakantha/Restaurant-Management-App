# Restaurant Management System

A full-stack MERN application for managing restaurant operations including daily expenses, inventory, roster, salaries, service charges, and income. Built with React + Vite + Tailwind (frontend) and Node/Express + MongoDB (backend).

## 🚀 Features

- **Role-Based Access Control**: Admin, Chef, Cashier, and Member roles with different permissions
- **Inventory Management**: Track products, usage, wastage with image evidence via Cloudinary
- **Expense Tracking**: Categorize expenses as cost of sales or operations with receipt uploads
- **Monthly Reports**: Generate comprehensive monthly reports with PDF export
- **Roster Management**: Schedule shifts and track employee attendance
- **Salary & Service Charges**: Track payroll and service charge distribution
- **Audit Logging**: Complete audit trail for all create/update/delete operations
- **Real-time Notifications**: Low inventory alerts and unpaid expense reminders

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Cloudinary account (for image uploads)
- npm or yarn

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd Restaurant-Management-App
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
# Server
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/restaurant-management
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/restaurant-management?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-change-this-in-production
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS
FRONTEND_URL=http://localhost:5173

# Cookie
COOKIE_SECRET=your-cookie-secret-key-change-this-in-production

# Seed Script (optional)
ADMIN_EMAIL=admin@restaurant.com
ADMIN_PASSWORD=Admin123!
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Seed Database

Run the seed script to create the default admin user and restaurant profile:

```bash
cd backend
npm run seed
```

This will create:
- Admin user (email: `admin@restaurant.com`, password: `Admin123!`)
- Default restaurant profile

**⚠️ Important**: Change the default admin password after first login!

## 🏃 Running Locally

### Backend

```bash
cd backend
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
Restaurant-Management-App/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Auth, error handling, validation
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── scripts/         # Seed scripts
│   │   ├── services/        # Business logic services
│   │   ├── utils/           # Utility functions
│   │   ├── validators/      # Zod validation schemas
│   │   └── server.ts        # Express server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── vercel.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API client services
│   │   ├── utils/          # Utility functions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── vercel.json
└── README.md
```

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication with refresh tokens stored in HTTP-only cookies.

### API Endpoints

#### Public Endpoints

- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token

#### Protected Endpoints (Require Authentication)

- `POST /api/auth/register` - Register new user (Admin only)
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Example Login Request

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@restaurant.com",
    "password": "Admin123!"
  }'
```

### Example Authenticated Request

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 📊 Database Models

- **User**: User accounts with roles (Admin, Chef, Cashier, Member)
- **Role**: Role definitions with permissions
- **RestaurantProfile**: Restaurant information and settings
- **Supplier**: Supplier information
- **Product**: Inventory products with reorder levels
- **ExpenseCategory**: Dynamic expense categories
- **Expense**: Daily expenses with receipts
- **MonthReport**: Monthly reporting periods
- **InventoryUsage**: Product usage records with evidence
- **IncomeRecord**: Daily income entries
- **Roster**: Employee shift schedules
- **SalaryRecord**: Monthly salary records
- **AuditLog**: Audit trail for all operations

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

### Linting

```bash
# Backend
cd backend
npm run lint
npm run lint:fix

# Frontend
cd frontend
npm run lint
npm run lint:fix
```

### Formatting

```bash
# Backend
cd backend
npm run format

# Frontend
cd frontend
npm run format
```

## 🚀 Deployment to Vercel

### Backend Deployment

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Navigate to backend directory:
```bash
cd backend
```

3. Deploy:
```bash
vercel
```

4. Set environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `FRONTEND_URL` (your frontend URL)
   - `COOKIE_SECRET`
   - `NODE_ENV=production`

### Frontend Deployment

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - `VITE_API_URL` (your backend API URL)

### Alternative: Deploy via Vercel Dashboard

1. Connect your GitHub repository to Vercel
2. For backend: Set root directory to `backend`, build command: `npm run build`, output directory: `dist`
3. For frontend: Set root directory to `frontend`, build command: `npm run build`, output directory: `dist`
4. Configure environment variables in both projects

## 🔧 Cloudinary Setup

1. Sign up for a free Cloudinary account at https://cloudinary.com
2. Get your credentials from the dashboard:
   - Cloud Name
   - API Key
   - API Secret
3. Add them to your `.env` file (backend)
4. For production, consider using signed uploads for security

## 📝 Environment Variables Summary

### Backend

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret for access tokens | Yes |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | Yes |
| `PORT` | Server port | No (default: 5000) |
| `NODE_ENV` | Environment | No (default: development) |

### Frontend

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | Yes |

## 🐛 Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running locally, or
- Verify MongoDB Atlas connection string is correct
- Check network connectivity

### JWT Token Issues

- Verify `JWT_SECRET` and `JWT_REFRESH_SECRET` are set
- Ensure tokens are not expired
- Check token format in Authorization header

### Cloudinary Upload Issues

- Verify Cloudinary credentials are correct
- Check image file size and format restrictions
- Ensure proper CORS configuration

## 📚 API Documentation

API documentation will be available at `/api/docs` (Swagger) once implemented. For now, refer to the route files in `backend/src/routes/`.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

ISC

## 👥 Authors

Restaurant Management System Team

## 🎯 Next Steps

- [ ] Implement remaining API endpoints (expenses, inventory, reports, etc.)
- [ ] Build frontend components and pages
- [ ] Add Cloudinary upload integration
- [ ] Implement PDF report generation
- [ ] Add comprehensive tests
- [ ] Set up CI/CD pipeline
- [ ] Add API documentation (Swagger/OpenAPI)

---

**Note**: This is the initial setup with authentication and models. Full implementation of all features is in progress.
