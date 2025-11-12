# Authentication setup with Backend

## Architecture overview

Your project uses **two different JWT token systems**:

1. **NextAuth.js JWT** (Frontend) - uses `AUTH_SECRET`

- Signs and encrypts user sessions on the frontend
- Stored in cookies
- Contains OAuth tokens and user data

2. **Backend JWT** (NestJS + Passport) - uses `JWT_SECRET`

- Verifies authentication on the backend
- Creates users in the database
- Returns backend user ID and profile data

## Environment variables setup

### 1. Create a `.env.local` file with the following variables:

```bash
# NextAuth.js - for signing JWT tokens on the frontend
AUTH_SECRET="your-random-secret-for-nextauth"

# Google OAuth
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# Backend API URL
NEXT_PUBLIC_API_URL="http://localhost:3200/api"
```

### 2. Generate secure secrets:

```bash
# For AUTH_SECRET
openssl rand -base64 32
```

## How it works

### Authentication flow:

1. **User signs in via Google OAuth**

```
User → Google OAuth → NextAuth.js
```

2. **NextAuth receives OAuth tokens and triggers the `jwt` callback**

```typescript
// auth.ts - jwt callback
if (account) {
  // 1. Store OAuth tokens in NextAuth JWT
  const customToken = extendToken(account, token)

  // 2. Send OAuth token to backend to create/validate the user
  const response = await fetch('/auth/validate-token', {
    body: JSON.stringify({
      token: customToken.idToken,
      provider: 'google',
    }),
  })

  // 3. Backend returns its user with _id
  const backendUserData = await response.json()

  // 4. Store backend user ID in the NextAuth JWT token
  customToken.backendUserId = backendUserData._id
  customToken.backendUserData = backendUserData

  return customToken
}
```

3. **Session callback adds user data to the session**

```typescript
// auth.ts - session callback
if (token.backendUserId && token.backendUserData) {
  // Use data from the JWT token (faster, no extra requests)
  const userData = token.backendUserData as UserAI
  session.user.id = userData._id
  session.user.name = userData.name
  session.user.email = userData.email
  session.user.role = userData.role
}
```

### NextAuth JWT token structure:

```typescript
{
  // OAuth tokens from Google
  accessToken: "ya29.a0...",
  idToken: "eyJhbGciOi...",
  refreshToken: "1//0...",

  // Backend user data
  backendUserId: "507f1f77bcf86cd799439011",
  backendUserData: {
   _id: "507f1f77bcf86cd799439011",
   email: "user@example.com",
   name: "User Name",
   role: "user",
   avatarUrl: "...",
   providers: [...]
  },

  // Metadata
  provider: "google",
  expiresAt: 1699564800
}
```

## Backend API expectations

Your NestJS backend should have an endpoint `/auth/validate-token`:

```typescript
// Backend: POST /auth/validate-token
// Request:
{
  "token": "Google OAuth ID Token",
  "provider": "google"
}

// Response:
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "name": "User Name",
  "avatarUrl": "https://...",
  "role": "user",
  "providers": [
   {
    "type": "google",
    "id": "google-user-id",
    "_id": "..."
   }
  ],
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### The backend must:

1. **Verify the Google OAuth token**

- Use Google APIs to validate the `idToken`
- Extract email, name, picture from the token

2. **Find or create a user**

```typescript
// Pseudocode
const googleProfile = await verifyGoogleToken(token)

let user = await User.findOne({
  'providers.type': 'google',
  'providers.id': googleProfile.sub,
})

if (!user) {
  user = await User.create({
    email: googleProfile.email,
    name: googleProfile.name,
    avatarUrl: googleProfile.picture,
    providers: [
      {
        type: 'google',
        id: googleProfile.sub,
      },
    ],
  })
}

return user
```

3. **Return the user data** with `_id` for storing in the JWT

## Usage in components

### Server Components:

```typescript
import { auth } from '@/auth'

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user) {
   redirect('/signin')
  }

  // Backend user ID is available
  const userId = session.user.id // "507f1f77bcf86cd799439011"
  const userRole = session.user.role // "user" | "admin"

  return <div>User ID: {userId}</div>
}
```

### Client Components:

```typescript
'use client'
import { useSession } from 'next-auth/react'

export default function ProfileClient() {
  const { data: session } = useSession()

  if (!session?.user) return null

  return (
   <div>
    <p>Backend User ID: {session.user.id}</p>
    <p>Role: {session.user.role}</p>
    <p>OAuth Token: {session.OAuthToken}</p>
   </div>
  )
}
```

### API Routes:

```typescript
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Use backend user ID for requests
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${session.user.id}`, {
    headers: {
      Authorization: `Bearer ${session.OAuthToken}`,
    },
  })

  return NextResponse.json(await response.json())
}
```

## Security

### ⚠️ Important notes:

1. **AUTH_SECRET** - keep secret, used only on the NextAuth server
2. **Never commit secrets to git** - add `.env.local` to `.gitignore`
3. Backend validates OAuth tokens independently using Google's verification API

### Recommendations:

- Use different secrets for dev/staging/production
- Rotate secrets regularly
- Use secret management services (AWS Secrets Manager, Vault)
- Limit token lifetime

## Testing

```bash
# Start the dev server
npm run dev

# Check console logs on sign-in
# You should see:
# ✓ Google OAuth success
# ✓ Backend user created/validated
# ✓ JWT token contains backendUserId
```

## Troubleshooting

### Backend user ID is not stored in the token:

1. Check that the backend endpoint `/auth/validate-token` is working
2. Verify that the backend returns `_id` in the response
3. Check logs in the `auth.ts` jwt callback

### Session does not contain user.id:

1. Sign out and sign in again (JWT token will refresh)
2. Verify that `backendUserData` is stored in the token
3. Check typings in `types/auth.ts`

### Backend receives an invalid token:

1. Check that you send the correct token (`idToken` or `accessToken`)
2. Use Google Token Verification API on the backend
