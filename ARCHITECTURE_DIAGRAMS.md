# Route Protection Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     ROUTE PROTECTION SYSTEM                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Layer 1: URL Access Control (middleware.js)                    │
├─────────────────────────────────────────────────────────────────┤
│ • Intercepts all URL requests                                  │
│ • Checks authentication tokens                                 │
│ • Validates user roles                                         │
│ • Redirects unauthorized access                                │
│ • Runs at Next.js server level                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Layer 2: Component-Level Auth (useProtectedRoute hook)         │
├─────────────────────────────────────────────────────────────────┤
│ • Verifies token in localStorage                               │
│ • Fetches user data                                            │
│ • Checks role permissions                                      │
│ • Returns loading/authorized/error states                      │
│ • Auto-redirects on failure                                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Layer 3: API Security (apiClient interceptors)                 │
├─────────────────────────────────────────────────────────────────┤
│ • Adds Authorization header                                    │
│ • Handles 401 responses                                        │
│ • Auto-refreshes expired tokens                                │
│ • Queues failed requests                                       │
│ • Redirects on final failure                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Layer 4: Data Access (Backend Validation)                      │
├─────────────────────────────────────────────────────────────────┤
│ • Spring Security validates JWT                                │
│ • Checks role on server side                                   │
│ • Validates resource ownership                                 │
│ • Returns 401/403 on failure                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Interaction Diagram

```
User Navigates to /admin/dashboard
           │
           ↓
    ┌──────────────────┐
    │ middleware.js    │
    │ URL Check        │
    └──────────────────┘
           │
      ┌────┴────┐
      │          │
   ✅ Auth      ❌ No Auth
      │          │
      │      Redirect to
      │      /auth/login
      │
      ↓
    AdminDashboard Component
    Mounted
           │
           ↓
    ┌──────────────────────────┐
    │ useProtectedRoute        │
    │ (role='admin')           │
    ├──────────────────────────┤
    │ Check localStorage       │
    │ Verify token             │
    │ Check user role          │
    └──────────────────────────┘
           │
      ┌────┼────┐
      │    │    │
   ✅ Auth │ Loading
      │    │
      ✓    ✓
      │    │
      ↓    ↓
   isAuthorized = true
   Show Component
           │
           ↓
    Component renders content
    Makes API calls
           │
           ↓
    ┌──────────────────┐
    │ apiClient        │
    │ Interceptor      │
    └──────────────────┘
           │
      Add Bearer Token
      to Authorization
      Header
           │
           ↓
    Backend validates JWT
    Checks role
    Returns data
```

---

## Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ USER AUTHENTICATION FLOW                                        │
└─────────────────────────────────────────────────────────────────┘

1. Login Page
   ├─ User enters credentials
   └─ Submits to /api/auth/login

2. Backend Response
   ├─ Returns: { accessToken, refreshToken, user }
   └─ Stores tokens (JWT)

3. Frontend Storage
   ├─ localStorage.setItem('accessToken', token)
   ├─ localStorage.setItem('refreshToken', token)
   └─ localStorage.setItem('user', JSON.stringify(user))

4. Protected Route Access
   ├─ useProtectedRoute checks tokens
   ├─ Verifies user object exists
   └─ Validates role permissions

5. API Request
   ├─ apiClient adds Authorization header
   ├─ Backend validates token (JWT)
   └─ Backend checks permissions

6. Token Expiration
   ├─ API returns 401 Unauthorized
   ├─ apiClient interceptor triggers refresh
   ├─ Sends refreshToken to /api/auth/refresh
   ├─ Gets new accessToken
   └─ Retries original request

7. Refresh Failure
   ├─ Redirect to /auth/login
   ├─ Clear localStorage
   └─ Show "Session expired" message
```

---

## Role-Based Access Matrix

```
┌──────────────┬─────────────────────────────────────────────────┐
│ Route        │ /admin │ /dashboard │ /settings │ /events/edit │
├──────────────┼────────┼────────────┼───────────┼──────────────┤
│ Guest        │  ❌    │     ❌     │     ❌    │      ❌      │
│ User         │  ❌    │     ✅     │     ✅    │      ✅*     │
│ Moderator    │  ❌    │     ✅     │     ✅    │      ✅*     │
│ Admin        │  ✅    │     ✅     │     ✅    │      ✅      │
└──────────────┴────────┴────────────┴───────────┴──────────────┘

Legend:
  ✅ = Full access
  ✅* = Only own resources
  ❌ = Redirected to login/home
```

---

## Data Flow Diagram

```
┌──────────────┐
│ Browser      │
│ localStorage │
├──────────────┤
│ accessToken  │◄─── Checked by middleware
│ refreshToken │◄─── Used for token refresh
│ user         │◄─── Validated by hook
└──────────────┘
       │
       │ On every protected route
       ↓
┌──────────────────────┐
│ useProtectedRoute    │
│ Hook                 │
├──────────────────────┤
│ 1. Check tokens      │
│ 2. Verify user data  │
│ 3. Validate role     │
│ 4. Return state      │
└──────────────────────┘
       │
       ├─► isLoading = true/false
       ├─► isAuthorized = true/false
       ├─► user = { id, role, ... }
       └─► error = error message
       
       Trigger rendering:
       - Show spinner (isLoading)
       - Show error (error)
       - Render content (isAuthorized)
```

---

## State Machine Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ useProtectedRoute State Machine                                 │
└─────────────────────────────────────────────────────────────────┘

         ┌─────────┐
         │ Initial │
         └────┬────┘
              │ Component Mount
              ↓
         ┌──────────────┐
         │ isLoading=T  │◄─┐
         │ Checking...  │  │ Retry
         └────┬─────────┘  │
              │            │
              ├────────────┴─ Error Check
              │
         ┌────┴──────────────────────┐
         │                           │
      ✅ Auth Valid         ❌ Auth Failed
         │                           │
         ↓                           ↓
    ┌─────────────┐          ┌──────────────┐
    │ isAuth=T    │          │ isAuth=F     │
    │ isLoad=F    │          │ isLoad=F     │
    │ Render Page │          │ Redirect     │
    └─────────────┘          │ or Error     │
         │                   └──────────────┘
         │
         └─► Show Component Content
             Available for interaction
```

---

## Security Decision Tree

```
User accesses /admin/dashboard
         │
         ↓
    ┌─────────────────┐
    │ Has accessToken │
    │ in localStorage?│
    └────┬────────────┘
         │
      Yes│  No
         │  └─────────────→ Redirect to /auth/login
         ↓
    ┌─────────────────┐
    │ Has user data   │
    │ in localStorage?│
    └────┬────────────┘
         │
      Yes│  No
         │  └─────────────→ Redirect to /auth/login
         ↓
    ┌─────────────────┐
    │ User role is    │
    │ ADMIN?          │
    └────┬────────────┘
         │
      Yes│  No
         │  └─────────────→ Redirect to /
         ↓
    ┌─────────────────┐
    │ Render Admin    │
    │ Dashboard       │
    └─────────────────┘
         │
         ↓
    Make API Calls
         │
         ↓
    ┌─────────────────┐
    │ Add Authorization│
    │ header          │
    └────┬────────────┘
         │
      ✅ │  401
         │  └──→ Refresh Token
         │       │
         │       ├─→ Success: Retry
         │       └─→ Failure: Redirect to login
         ↓
    ┌─────────────────┐
    │ Backend validates│
    │ JWT             │
    └────┬────────────┘
         │
      ✅ │  ❌
         │  └──→ 401 Unauthorized
         ↓
    ┌─────────────────┐
    │ Check role on   │
    │ server         │
    └────┬────────────┘
         │
      ✅ │  ❌
         │  └──→ 403 Forbidden
         ↓
    Return Data
         │
         ↓
    Update UI
```

---

## File Dependency Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ DEPENDENCIES                                                    │
└─────────────────────────────────────────────────────────────────┘

middleware.js
  ├─ Runs at URL access time
  └─ Blocks unauthorized URLs

useProtectedRoute.js (Hook)
  ├─ Uses: routeProtection utilities
  ├─ Uses: useRouter from next/router
  ├─ Uses: useEffect, useState
  └─ Used by: All protected pages

routeProtection.js (Utilities)
  ├─ localStorage access
  ├─ User role checks
  ├─ Router navigation
  └─ Used by: Components, hooks, utilities

api.js (API Client)
  ├─ axios for HTTP requests
  ├─ Token management
  ├─ Auto-refresh logic
  └─ Used by: All data fetching

Protected Pages
  ├─ Import useProtectedRoute
  ├─ Import routeProtection utilities
  ├─ Use apiClient for requests
  └─ Render conditionally based on auth state

Example:
  AdminPage.js
    ├─ imports useProtectedRoute
    ├─ imports apiClient
    ├─ checks isAuthorized
    └─ makes protected API calls
```

---

## Deployment Architecture

```
┌────────────────────────────────────────────────────────────────┐
│ PRODUCTION DEPLOYMENT                                          │
└────────────────────────────────────────────────────────────────┘

Browser (User Device)
├─ localStorage (secure token storage)
├─ middleware.js (client-side route interception)
├─ useProtectedRoute (component-level auth)
└─ apiClient (HTTP requests with auth)

    │
    │ HTTPS
    ↓

Next.js Server
├─ middleware.js (server-level route protection)
├─ API routes (if using Next.js API routes)
├─ Static pages
└─ Dynamic routes

    │
    │ HTTPS
    ↓

Spring Boot Backend (Java)
├─ JWT Validation (Spring Security)
├─ Role-Based Access Control
├─ Resource Authorization
└─ Data Persistence

    │
    ↓

Database (MySQL)
├─ User data
├─ Role information
└─ Resource ownership
```

---

## Token Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│ TOKEN LIFECYCLE                                                 │
└─────────────────────────────────────────────────────────────────┘

1. USER LOGIN
   ├─ POST /api/auth/login
   ├─ Backend generates JWT tokens
   ├─ Returns: { accessToken, refreshToken }
   └─ Frontend stores both in localStorage

2. TOKEN STORAGE
   ├─ accessToken (short-lived, ~15 min)
   ├─ refreshToken (long-lived, ~7 days)
   └─ user (user metadata)

3. NORMAL USAGE
   ├─ Every API request adds accessToken
   ├─ Header: Authorization: Bearer {accessToken}
   └─ Backend validates JWT signature

4. TOKEN EXPIRATION CHECK
   ├─ Backend returns 401 Unauthorized
   ├─ Detected by apiClient interceptor
   └─ Triggers refresh flow

5. TOKEN REFRESH
   ├─ Send refreshToken to /api/auth/refresh
   ├─ Backend validates and issues new accessToken
   ├─ Frontend stores new accessToken
   └─ Retries original request

6. REFRESH FAILURE
   ├─ Refresh token expired or invalid
   ├─ Clear all stored tokens
   ├─ Redirect to /auth/login
   └─ User must login again

7. LOGOUT
   ├─ Clear localStorage
   ├─ Optional: POST /api/auth/logout
   ├─ Redirect to /
   └─ All protected routes now blocked
```

---

## Error Handling Flow

```
┌────────────────────────────────────────────────────────────────┐
│ ERROR HANDLING FLOW                                            │
└────────────────────────────────────────────────────────────────┘

Error Type: No Authentication
  └─ User: "Please log in"
  └─ Action: Redirect to /auth/login?redirect={url}

Error Type: Insufficient Permissions
  └─ User: "Access denied"
  └─ Action: Redirect to /

Error Type: Token Expired
  └─ Action 1: Auto-refresh token
  └─ Action 2: If refresh fails → Redirect to /auth/login

Error Type: Invalid Token
  └─ Action: Clear localStorage
  └─ Action: Redirect to /auth/login

Error Type: API Server Error (500)
  └─ Action: Show error message
  └─ Action: Retry button

Error Type: Network Error
  └─ Action: Show offline message
  └─ Action: Retry button
```

---

## Performance Optimization Strategies

```
┌────────────────────────────────────────────────────────────────┐
│ PERFORMANCE OPTIMIZATIONS                                      │
└────────────────────────────────────────────────────────────────┘

1. Middleware Level
   ├─ Fast URL checks (no database calls)
   ├─ Token validation from JWT (no auth server call)
   └─ Early redirect before rendering

2. Component Level
   ├─ Single useProtectedRoute call per page
   ├─ Memoize utility function results
   ├─ Lazy load protected components
   └─ Avoid multiple re-renders

3. API Level
   ├─ Token refresh queue (prevent multiple refreshes)
   ├─ Cache user data in localStorage
   ├─ Batch API requests
   └─ Retry failed requests

4. Browser Level
   ├─ Cache authenticated responses
   ├─ Use service workers for offline support
   ├─ Optimize localStorage access
   └─ Minimize re-renders
```

This architecture ensures:
- ✅ Multiple layers of security
- ✅ Fast authorization checks
- ✅ Seamless user experience
- ✅ Automatic token refresh
- ✅ Graceful error handling
