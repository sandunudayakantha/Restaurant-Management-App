# Troubleshooting Login Issues

## Common Issues and Solutions

### 1. Cannot Connect to Backend Server

**Symptoms:**
- Error message: "Cannot connect to server. Please ensure the backend is running on port 5000."
- Yellow warning banner on login page

**Solutions:**
1. **Check if backend is running:**
   ```bash
   cd backend
   npm run dev
   ```
   You should see: `🚀 Server running on port 5000`

2. **Check MongoDB connection:**
   - Ensure MongoDB is running locally, OR
   - Verify MongoDB Atlas connection string in `.env` file
   - Check `MONGODB_URI` in `backend/.env`

3. **Verify backend health:**
   ```bash
   curl http://localhost:5000/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

### 2. CORS Errors

**Symptoms:**
- Browser console shows CORS errors
- Network tab shows preflight request failures

**Solutions:**
1. **Check FRONTEND_URL in backend `.env`:**
   ```env
   FRONTEND_URL=http://localhost:5173
   ```

2. **Verify frontend is running on correct port:**
   - Default Vite port is 5173
   - Check `frontend/vite.config.ts` if using custom port

3. **Restart backend after changing `.env`**

### 3. Invalid Credentials

**Symptoms:**
- Error: "Invalid email or password"
- Login fails with correct credentials

**Solutions:**
1. **Check if admin user exists:**
   ```bash
   cd backend
   npm run seed
   ```
   This creates default admin: `admin@restaurant.com` / `Admin123!`

2. **Verify user in MongoDB:**
   - Check if user exists in database
   - Verify password hash is correct

3. **Check backend logs:**
   - Look for error messages in backend console
   - Check if password comparison is working

### 4. Environment Variables Not Set

**Symptoms:**
- Backend crashes on startup
- JWT errors

**Solutions:**
1. **Create `.env` file in backend:**
   ```bash
   cd backend
   cp env.example .env
   ```

2. **Fill in required variables:**
   - `MONGODB_URI` - MongoDB connection string
   - `JWT_SECRET` - Random secret string
   - `JWT_REFRESH_SECRET` - Random secret string
   - `CLOUDINARY_*` - Cloudinary credentials (optional for login)

3. **Create `.env` file in frontend:**
   ```bash
   cd frontend
   # Create .env with:
   VITE_API_URL=http://localhost:5000/api
   ```

### 5. Network/Connection Issues

**Symptoms:**
- "Network Error" in console
- Request timeout

**Solutions:**
1. **Check if ports are available:**
   - Backend: Port 5000
   - Frontend: Port 5173

2. **Check firewall settings:**
   - Ensure localhost connections are allowed

3. **Try different browser:**
   - Clear browser cache
   - Try incognito mode

### 6. Token Issues

**Symptoms:**
- Login succeeds but dashboard redirect fails
- "Unauthorized" errors

**Solutions:**
1. **Check localStorage:**
   - Open browser DevTools → Application → Local Storage
   - Verify `accessToken` is stored

2. **Check token format:**
   - Token should start with `eyJ...`
   - Should be a long string

3. **Verify JWT_SECRET:**
   - Backend `.env` must have valid `JWT_SECRET`
   - Restart backend after changing

## Testing Steps

### Step 1: Test Backend Health
```bash
curl http://localhost:5000/health
```

### Step 2: Test Login Endpoint
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@restaurant.com",
    "password": "Admin123!"
  }'
```

### Step 3: Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for error messages
4. Check Network tab for failed requests

### Step 4: Check Backend Logs
- Look at terminal where backend is running
- Check for error messages
- Verify database connection

## Quick Checklist

- [ ] Backend is running (`npm run dev` in backend folder)
- [ ] MongoDB is running or Atlas connection is valid
- [ ] Backend `.env` file exists and has all required variables
- [ ] Frontend `.env` file has `VITE_API_URL=http://localhost:5000/api`
- [ ] Admin user exists (run `npm run seed` in backend)
- [ ] No port conflicts (5000 for backend, 5173 for frontend)
- [ ] Browser console shows no CORS errors
- [ ] Network tab shows successful API calls

## Still Having Issues?

1. **Check backend logs** for detailed error messages
2. **Check browser console** for frontend errors
3. **Verify all environment variables** are set correctly
4. **Restart both servers** after making changes
5. **Clear browser cache** and localStorage

## Default Credentials

After running seed script:
- **Email:** `admin@restaurant.com`
- **Password:** `Admin123!`

⚠️ **Change these credentials after first login!**

