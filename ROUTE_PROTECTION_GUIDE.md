# Route Protection Documentation

## Overview

This route protection system provides multiple layers of security to prevent unauthorized URL access:

1. **Middleware** - Blocks protected routes at the URL level
2. **Custom Hook** - Validates access before rendering pages
3. **Utility Functions** - Helper methods for route checks

---

## Implementation Guide

### 1. Using the `useProtectedRoute` Hook

For page-level protection with automatic role validation:

```javascript
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

export default function AdminPage() {
  const { isLoading, isAuthorized, user, error } = useProtectedRoute('admin');

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthorized) {
    return <AccessDenied message={error} />;
  }

  return <YourAdminContent user={user} />;
}
```

### 2. Using the HOC for Class Components

Wrap components with automatic protection:

```javascript
import { withProtectedRoute } from '@/hooks/useProtectedRoute';

function MyPage({ user }) {
  return <div>Protected content</div>;
}

export default withProtectedRoute(MyPage, 'admin');
```

### 3. Using Utility Functions

For custom logic in your pages:

```javascript
import {
  isAuthenticated,
  getCurrentUser,
  isAdmin,
  isEventOwner,
  redirectToLogin,
} from '@/lib/routeProtection';

export default function DashboardPage() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      redirectToLogin(router, router.asPath);
      return;
    }

    const user = getCurrentUser();
    if (!isAdmin() && !user.isPremium) {
      redirectToUnauthorized(router);
      return;
    }

    setIsReady(true);
  }, []);

  if (!isReady) return <LoadingSpinner />;
  
  return <YourContent />;
}
```

---

## Protected Routes

### Admin Routes (ADMIN role required)
- `/admin` - Admin dashboard
- `/admin/control` - Control center
- `/admin/charities` - Charity management
- `/admin/donations` - Donation tracking
- `/admin/moderation` - Moderation panel
- `/admin/events` - Event management
- `/admin/blog` - Blog management

### Authenticated Routes (Logged-in users)
- `/dashboard` - User dashboard
- `/dashboard/my-events` - My events
- `/dashboard/my-donations` - Donation history
- `/settings` - User settings
- `/cards` - Business cards

### Public Routes (No login required)
- `/` - Home
- `/about-us` - About
- `/how-it-works` - How it works
- `/events` - Events list
- `/charities` - Charities list
- `/auth/login` - Login page
- `/auth/register` - Registration page

---

## Role-Based Access Control (RBAC)

### Supported Roles
- **ADMIN** - Full access, can manage all resources
- **MODERATOR** - Can moderate content, view analytics
- **USER** - Regular authenticated user
- **GUEST** - Public/unauthenticated access

### Checking User Role

```javascript
import { getCurrentUser, isAdmin, isModerator } from '@/lib/routeProtection';

const user = getCurrentUser();

if (isAdmin()) {
  // Admin access
}

if (isModerator()) {
  // Moderator access
}

if (user && user.isPremium) {
  // Premium user access
}
```

---

## Event Ownership Checks

For event-specific pages:

```javascript
import { isEventOwner, isAdmin } from '@/lib/routeProtection';

export default function EditEventPage() {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetchEvent(id);
  }, [id]);

  const canEdit = () => {
    const user = getCurrentUser();
    return isAdmin() || isEventOwner(event.ownerId);
  };

  if (!event) return <LoadingSpinner />;

  if (!canEdit()) {
    return <AccessDenied message="Only event owner can edit" />;
  }

  return <EditEventForm event={event} />;
}
```

---

## API Request Protection

The API client automatically:
1. Adds authorization token to all requests
2. Handles 401 unauthorized responses
3. Refreshes expired tokens
4. Redirects to login on auth failure

```javascript
import apiClient from '@/lib/api';

// Token automatically added to request headers
const response = await apiClient.get('/api/admin/stats');
// If token expired, automatically refreshed
// If no token, request fails and user redirected to login
```

---

## Middleware Configuration

The middleware (Next.js 12+) provides URL-level protection:

```javascript
// middleware.js
export const config = {
  matcher: [
    // Protected routes
    '/admin/:path*',
    '/dashboard/:path*',
    '/settings/:path*',
    // Excludes
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
```

---

## Complete Example: Protected Admin Page

```javascript
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { isAdmin, getRedirectUrl } from '@/lib/routeProtection';

export default function AdminCharities() {
  const router = useRouter();
  const { isLoading, isAuthorized, user } = useProtectedRoute('admin', true);
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only load data after auth check passes
    if (isLoading) return;
    if (!isAuthorized) return;

    loadCharities();
  }, [isLoading, isAuthorized]);

  const loadCharities = async () => {
    try {
      const response = await apiClient.get('/api/admin/charities');
      setCharities(response.data);
    } catch (error) {
      console.error('Failed to load charities:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Show access denied - useProtectedRoute will redirect but show error state
  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600 mt-2">You do not have admin permissions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Charity Management</h1>
      {/* Your admin content here */}
    </div>
  );
}
```

---

## Security Best Practices

1. **Always validate on backend** - Client-side protection can be bypassed
2. **Use HTTPS** - Tokens should only be transmitted over encrypted connections
3. **Implement CSRF protection** - For state-changing operations
4. **Set secure cookies** - Use `HttpOnly` and `Secure` flags
5. **Regular token refresh** - Implement token expiration and refresh logic
6. **Validate JWT claims** - Check `exp`, `iat`, `nbf` claims on token refresh
7. **Audit access logs** - Log all protected route access attempts

---

## Troubleshooting

### User stuck in loading state
- Check if token exists in localStorage
- Verify API endpoint is responding
- Check browser console for CORS errors

### Redirect loop
- Clear browser localStorage and cookies
- Check if middleware matcher is too broad
- Verify auth endpoints are responding

### Token expiration
- API client automatically refreshes tokens
- If refresh fails, user redirected to login
- Check refresh endpoint configuration

### Roles not working
- Verify user object has correct role field
- Check RBAC configuration in utility functions
- Ensure backend returns correct role in user response

---

## Files Created/Modified

### New Files
- `/frontend/hooks/useProtectedRoute.js` - Hook and HOC for route protection
- `/frontend/middleware.js` - Next.js middleware for URL-level protection
- `/frontend/lib/routeProtection.js` - Utility functions for route checks

### Modified Files
- `/frontend/pages/admin/index.js` - Updated to use `useProtectedRoute` hook

---

## API Integration

All protected API calls should validate user before making requests:

```javascript
// lib/api.js interceptor ensures:
// 1. Token added to Authorization header
// 2. Failed requests trigger token refresh
// 3. Unauth (401) redirects to login
// 4. All protected endpoints validated

const response = await apiClient.get('/api/admin/events');
// ✅ Automatically protected
```
