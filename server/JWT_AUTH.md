# JWT Authentication Implementation

## Overview
This application uses **JWT (JSON Web Tokens)** stored in **httpOnly cookies** for secure authentication.

## Features
- ✅ Access tokens (7 days expiry)
- ✅ Refresh tokens (30 days expiry)
- ✅ httpOnly cookies (XSS protection)
- ✅ Secure & SameSite flags
- ✅ Protected routes with middleware
- ✅ Account locking after failed attempts

## Endpoints

### Public Routes (No Auth Required)
- `POST /api/users/create` - Register new user
- `POST /api/users/login` - Login user
- `POST /api/users/logout` - Logout user
- `POST /api/users/verify-email` - Verify email
- `POST /api/users/forgot-password` - Request password reset
- `POST /api/users/reset-password` - Reset password with token

### Protected Routes (Auth Required)
- `GET /api/users/me` - Get current logged-in user
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/email/:email` - Get user by email
- `GET /api/users/username/:username` - Get user by username
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Usage

### 1. Register a New User
```bash
POST /api/users/create
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:** Sets `token` and `refreshToken` cookies

### 2. Login
```bash
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:** Sets `token` and `refreshToken` cookies

### 3. Access Protected Routes
Once logged in, cookies are automatically sent with requests:

```bash
GET /api/users/me
# Cookies are sent automatically by the browser
```

### 4. Logout
```bash
POST /api/users/logout
# Clears authentication cookies
```

## Authentication Methods

### Method 1: Cookies (Recommended)
Tokens are automatically included in cookies when using a browser or tools like Postman/Thunder Client with cookie support.

### Method 2: Authorization Header
For mobile apps or APIs:
```
Authorization: Bearer <your-jwt-token>
```

## Environment Variables

Add to your `.env` file:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
NODE_ENV=production
```

## Security Features

1. **httpOnly Cookies** - Prevents XSS attacks (JavaScript can't access)
2. **Secure Flag** - HTTPS only in production
3. **SameSite** - CSRF protection
4. **Password Requirements** - Min 8 chars, uppercase, lowercase, number, special char
5. **Account Locking** - Auto-lock after 5 failed login attempts
6. **Token Expiry** - Tokens expire after set time

## Testing with Postman/Thunder Client

1. **Register/Login** - Token cookies are automatically set
2. **Access Protected Routes** - Cookies are sent automatically
3. **Check Cookies** - View cookies in the response headers

## Middleware Usage

To protect a route, add the `authenticate` middleware:

```javascript
import { authenticate } from '../middleware/auth.js';

router.get('/protected', authenticate, controllerFunction);
```

The middleware adds `req.user` with:
- `userId`
- `email`
- `username`

## Token Payload

```json
{
  "userId": "uuid-here",
  "email": "user@example.com",
  "username": "johndoe",
  "iat": 1234567890,
  "exp": 1234567890
}
```

## Best Practices

1. **Never log tokens** - Keep them secret
2. **Use HTTPS** in production
3. **Rotate JWT_SECRET** regularly
4. **Set strong JWT_SECRET** (min 32 characters)
5. **Monitor failed login attempts**
6. **Implement token refresh** for long sessions

## Common Issues

### "Authentication required" error
- Make sure you're logged in first
- Check if cookies are enabled
- Verify JWT_SECRET matches in .env

### Token expired
- Login again to get a new token
- Implement refresh token logic if needed

### CORS issues with cookies
Add CORS configuration:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```
