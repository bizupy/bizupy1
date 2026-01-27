# Google OAuth Setup Guide for Bizupy

## Overview
Bizupy now uses **Emergent-managed Google OAuth** for secure, hassle-free authentication. Users click "Continue with Google", select their account, and are instantly logged in.

## How It Works

### Authentication Flow
1. User clicks "Continue with Google" button
2. Redirected to `https://auth.emergentagent.com` with return URL
3. User authenticates with Google (sees all their Google accounts)
4. Emergent Auth returns user to app with `session_id` in URL fragment
5. Frontend exchanges `session_id` for user data via backend API
6. Backend verifies with Emergent Auth API and creates local session
7. Session stored in httpOnly cookie (7 days expiry)
8. User redirected to dashboard

### Security Features
- **httpOnly cookies**: Session tokens not accessible via JavaScript
- **Server-side validation**: All requests validated against database
- **Timezone-aware expiry**: Proper UTC handling for session expiration
- **Custom user IDs**: MongoDB `_id` separated from application `user_id`

## Configuration

### Environment Variables
No additional configuration needed! The system uses:
- `MONGO_URL` - Already configured in backend/.env
- `DB_NAME` - Already configured in backend/.env
- Dynamic redirect URLs - Automatically derived from `window.location.origin`

### CORS Settings
Ensure backend CORS allows credentials:
```python
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],  # Configure for production
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Database Schema

### users collection
```javascript
{
  user_id: "user_abc123xyz",  // Custom UUID, not MongoDB _id
  email: "user@example.com",
  name: "User Name",
  picture: "https://...",
  language_preference: "en",
  subscription_plan: "free",
  bill_count: 0,
  created_at: "2025-01-27T12:00:00+00:00"
}
```

### user_sessions collection
```javascript
{
  user_id: "user_abc123xyz",  // References users.user_id
  session_token: "token_xyz...",
  expires_at: "2025-02-03T12:00:00+00:00",  // 7 days from creation
  created_at: "2025-01-27T12:00:00+00:00"
}
```

## API Endpoints

### POST /api/auth/google-session
Exchange session_id for user data and session_token
```bash
curl -X POST http://localhost:3000/api/auth/google-session \
  -H "Content-Type: application/json" \
  -d '{"session_id": "session_xyz..."}'
```

**Response:**
```json
{
  "user": {
    "user_id": "user_abc123",
    "email": "user@example.com",
    "name": "User Name",
    "picture": "https://...",
    "subscription_plan": "free"
  },
  "session_token": "token_xyz..."
}
```

### GET /api/auth/me
Get current authenticated user
```bash
curl -X GET http://localhost:3000/api/auth/me \
  --cookie "session_token=token_xyz..."
```

### POST /api/auth/logout
Logout and clear session
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  --cookie "session_token=token_xyz..."
```

## Frontend Implementation

### Login Button
```javascript
// REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS
const handleGoogleLogin = () => {
  const redirectUrl = window.location.origin + '/dashboard';
  window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
};
```

### Auth Callback Processing
```javascript
// AuthCallback.js handles session_id exchange
// Automatically processes URL fragment and navigates to dashboard
```

### Protected Routes
```javascript
// Uses cookie-based authentication
// Server validates on every request via /api/auth/me
```

## Testing

### Manual Testing
1. Open http://localhost:3000
2. Click "Continue with Google"
3. Select Google account
4. Should redirect to dashboard
5. Check cookies in DevTools (session_token should be present)

### Database Testing
```bash
# Check user was created
mongosh --eval "use('bizupy_db'); db.users.find().pretty()"

# Check session was created
mongosh --eval "use('bizupy_db'); db.user_sessions.find().pretty()"
```

### API Testing (with session_token)
```bash
# Get session token from browser cookies
curl -X GET http://localhost:3000/api/auth/me \
  --cookie "session_token=YOUR_SESSION_TOKEN"
```

## Production Deployment

### Required Changes
1. **Cookie Security**: Set `secure=True` for HTTPS
```python
response.set_cookie(
    key="session_token",
    value=session_token,
    httponly=True,
    secure=True,  # Enable for production
    samesite="none",  # Required for cross-domain
    path="/",
    max_age=7 * 24 * 60 * 60
)
```

2. **CORS Origins**: Specify exact origins
```python
allow_origins=["https://yourdomain.com"],
```

3. **Database Indexes**: Add for performance
```javascript
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "user_id": 1 }, { unique: true })
db.user_sessions.createIndex({ "session_token": 1 }, { unique: true })
db.user_sessions.createIndex({ "expires_at": 1 }, { expireAfterSeconds: 0 })
```

## Troubleshooting

### "Not authenticated" error
- Check if session_token cookie is set
- Verify cookie domain matches your app domain
- Check session hasn't expired (7 days from creation)

### Session not persisting
- Ensure `withCredentials: true` in axios calls
- Verify CORS allows credentials
- Check cookie `sameSite` setting

### "User not found" error
- Verify user_id field exists (not just _id)
- Check all queries use `{"_id": 0}` projection
- Ensure user_sessions.user_id matches users.user_id

## Migration from Old System

Old email OTP system has been completely removed. All authentication now goes through Google OAuth.

If you need email/password login as a fallback:
1. Keep the new Google OAuth (primary method)
2. Add SendGrid for email delivery
3. Store hashed passwords in users collection
4. Add /api/auth/email-login endpoint

## Support

For issues with Emergent Auth:
- Check /app/auth_testing.md for testing playbook
- Verify redirect URL is dynamic (not hardcoded)
- Ensure backend calls Emergent API correctly
- Check MongoDB indexes are created
