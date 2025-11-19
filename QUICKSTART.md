# Quick Start Guide

## 🚀 Quick Setup Commands

### 1. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment Variables

#### Backend
```bash
cd backend
cp env.example .env
# Edit .env with your MongoDB URI, JWT secrets, and Cloudinary credentials
```

#### Frontend
```bash
cd frontend
cp .env.example .env
# Edit .env with your backend API URL (default: http://localhost:5000/api)
```

### 3. Seed Database (Create Admin User)

```bash
cd backend
npm run seed
```

This creates:
- Admin user: `admin@restaurant.com` / `Admin123!`
- Default restaurant profile

### 4. Start Development Servers

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
Backend runs on: http://localhost:5000

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:5173

## 🧪 Test Authentication

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@restaurant.com",
    "password": "Admin123!"
  }'
```

### Get Current User (with token from login)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 📝 Next Steps

1. Change the default admin password after first login
2. Create additional users via the register endpoint (admin only)
3. Configure Cloudinary for image uploads
4. Start building the frontend UI components
5. Implement remaining API endpoints

## 🔧 Available Scripts

### Backend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run seed` - Seed database

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code

## ⚠️ Important Notes

- MongoDB must be running (local or Atlas)
- Cloudinary credentials are required for image uploads (can be added later)
- Default admin credentials should be changed immediately
- All environment variables must be set before running the application

