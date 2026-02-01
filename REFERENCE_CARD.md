# 🔒 Route Protection - Reference Card

## The 3-Line Implementation

```javascript
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
const { isLoading, isAuthorized } = useProtectedRoute('admin');
if (!isAuthorized) return <AccessDenied />;
```

---

## Complete Page Template

```javascript
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

export default function AdminPage() {
  // ✅ Protect the page
  const { isLoading, isAuthorized, user } = useProtectedRoute('admin');

  // Show loading
  if (isLoading) {
    return <div className="spinner">Loading...</div>;
  }

  // Show access denied
  if (!isAuthorized) {
    return <div className="error">Access Denied</div>;
  }

  // Render protected content
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome {user?.fullName}</p>
    </div>
  );
}
```

---

## Hook Reference

```javascript
// Import
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

// Use Hook
const { isLoading, isAuthorized, user, error } = useProtectedRoute(role);

// Parameters
useProtectedRoute(
  'admin'         // Required role: null, 'user', 'admin', 'moderator'
  true            // Redirect on failure (default: true)
);

// Returns
{
  isLoading: boolean,        // Still checking auth
  isAuthorized: boolean,     // Auth check passed
  user: object,              // User data {id, email, role...}
  error: string              // Error message if failed
}

// Roles
'user'           // Any authenticated user
'admin'          // ADMIN role only
'moderator'      // MODERATOR role only
null             // Any authenticated user
```

---

## Utility Functions

```javascript
// Import all
import {
  isAuthenticated,
  getCurrentUser,
  isAdmin,
  isModerator,
  isOwner,
  isEventOwner,
  redirectToLogin,
  redirectToUnauthorized,
  validateRouteAccess,
  getRedirectUrl,
} from '@/lib/routeProtection';

// Usage Examples
isAuthenticated()              // boolean
getCurrentUser()               // user object or null
isAdmin()                      // boolean
isModerator()                  // boolean
isOwner(userId)                // boolean - is current user owner?
isEventOwner(eventOwnerId)     // boolean - is current user event owner?
redirectToLogin(router, url)   // redirect to login
redirectToUnauthorized(router) // redirect to home
validateRouteAccess(role, user)// boolean - does user have role?
getRedirectUrl(router)         // string - get ?redirect= param
```

---

## Hook Wrapper (HOC)

```javascript
import { withProtectedRoute } from '@/hooks/useProtectedRoute';

// Old way
function MyComponent(props) {
  return <div>Protected content</div>;
}
export default MyComponent;

// New way
export default withProtectedRoute(MyComponent, 'admin');

// With different role
export default withProtectedRoute(MyComponent, 'user');

// No role check
export default withProtectedRoute(MyComponent, null);
```

---

## Protected Routes

```
AUTO-PROTECTED ROUTES (Middleware)

Admin Routes
  /admin                    ← requires ADMIN
  /admin/control           ← requires ADMIN
  /admin/charities         ← requires ADMIN
  /admin/donations         ← requires ADMIN
  /admin/moderation        ← requires ADMIN
  /admin/events            ← requires ADMIN
  /admin/blog              ← requires ADMIN

User Routes
  /dashboard               ← requires auth
  /dashboard/my-events    ← requires auth
  /dashboard/my-donations ← requires auth
  /settings               ← requires auth
  /cards                  ← requires auth

Always Public
  /                        ← public
  /about-us                ← public
  /auth/login              ← public
  /auth/register           ← public
```

---

## Error States

```javascript
// Check for error
if (error) {
  return <div className="error">Error: {error}</div>;
}

// Common errors
"No authentication found"
"Insufficient permissions. Required role: admin"
"Token has expired"
"Invalid credentials"
```

---

## Common Patterns

### Pattern 1: Admin Only
```javascript
const { isLoading, isAuthorized } = useProtectedRoute('admin');
if (isLoading) return <Spinner />;
if (!isAuthorized) return null; // auto-redirects
return <AdminPanel />;
```

### Pattern 2: User Only
```javascript
const { isLoading, isAuthorized, user } = useProtectedRoute('user');
if (isLoading) return <Spinner />;
if (!isAuthorized) return <LoginPrompt />;
return <Dashboard user={user} />;
```

### Pattern 3: Owner Check
```javascript
const { user } = useProtectedRoute('user');
const canEdit = isEventOwner(event.ownerId) || isAdmin();
if (!canEdit) return <AccessDenied />;
```

### Pattern 4: Conditional Rendering
```javascript
const user = getCurrentUser();
return (
  <>
    {user ? <AdminLink /> : <LoginLink />}
    {isAdmin() && <AdminPanel />}
  </>
);
```

---

## API Usage

```javascript
// Auto-protected - token added automatically
const response = await apiClient.get('/api/admin/stats');

// Token refresh automatic on 401
// No special handling needed

// If token invalid/expired
// → Auto-refresh triggered
// → Request retried
// → If refresh fails → Redirect to login

// Make any API call
apiClient.get(url)
apiClient.post(url, data)
apiClient.put(url, data)
apiClient.delete(url)
```

---

## Troubleshooting

```
Problem: Stuck in loading
Solution: Check localStorage has accessToken and user

Problem: Always redirects to login
Solution: Clear localStorage and cookies, restart browser

Problem: Role check not working
Solution: Check user object has correct role field

Problem: API returns 401
Solution: Token expired, check auto-refresh working

Problem: "Cannot read property 'id' of null"
Solution: Check if (!user) before accessing user.id
```

---

## Configuration

### Add New Protected Route
```javascript
// Edit middleware.js
const PROTECTED_ROUTES = {
  '/new-route': 'ADMIN',    // Add this
  '/user-route': 'USER',    // Add this
};
```

### Add New Public Route
```javascript
// Edit middleware.js
const PUBLIC_ROUTES = [
  '/new-public-page',  // Add this
];
```

### Custom Role Check
```javascript
const { user } = useProtectedRoute('user');

if (user.isPremium && user.role === 'ADMIN') {
  // Custom logic
}
```

---

## Testing Checklist

```
Test Access Control
  □ Direct /admin access redirects
  □ Regular user can't access /admin
  □ Admin can access /admin
  □ Shows loading state
  □ Shows error message

Test Token Management
  □ Token added to requests
  □ Expired token refreshes
  □ Failed refresh redirects
  □ New token used for retries

Test Error Handling
  □ Clear error messages
  □ Proper redirects
  □ No console errors
  □ Graceful degradation

Test Performance
  □ No excessive re-renders
  □ Fast auth checks
  □ No memory leaks
  □ Smooth UX
```

---

## File Locations

```
Core Files
  frontend/hooks/useProtectedRoute.js
  frontend/middleware.js
  frontend/lib/routeProtection.js

Documentation
  frontend/START_ROUTE_PROTECTION.md
  frontend/ROUTE_PROTECTION_QUICK_REF.md
  frontend/ROUTE_PROTECTION_GUIDE.md
  frontend/MIGRATION_GUIDE.md
  frontend/ARCHITECTURE_DIAGRAMS.md
  frontend/INDEX_ROUTE_PROTECTION.md
  frontend/VISUAL_SUMMARY.md

Examples
  frontend/pages/dashboard/protected-example.js
  frontend/pages/admin/index.js
```

---

## Quick Links

```
Getting Started     → START_ROUTE_PROTECTION.md
Quick Example       → ROUTE_PROTECTION_QUICK_REF.md
Full Guide          → ROUTE_PROTECTION_GUIDE.md
Migrating Pages     → MIGRATION_GUIDE.md
System Design       → ARCHITECTURE_DIAGRAMS.md
Navigation Hub      → INDEX_ROUTE_PROTECTION.md
Visual Overview     → VISUAL_SUMMARY.md
Working Code        → pages/dashboard/protected-example.js
```

---

## Common Scenarios

### Scenario 1: Create Admin Page
```javascript
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

export default function AdminPage() {
  const { isLoading, isAuthorized } = useProtectedRoute('admin');
  if (isLoading) return <Spinner />;
  if (!isAuthorized) return null;
  return <AdminContent />;
}
```

### Scenario 2: Create User Dashboard
```javascript
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

export default function Dashboard() {
  const { isLoading, isAuthorized, user } = useProtectedRoute('user');
  if (isLoading) return <Spinner />;
  if (!isAuthorized) return <LoginPrompt />;
  return <UserDashboard user={user} />;
}
```

### Scenario 3: Check if User is Admin
```javascript
import { isAdmin } from '@/lib/routeProtection';

function AdminButton() {
  if (!isAdmin()) return null;
  return <button>Admin Panel</button>;
}
```

### Scenario 4: Protect Child Component
```javascript
import { getCurrentUser } from '@/lib/routeProtection';

function ChildComponent() {
  const user = getCurrentUser();
  if (!user) return <LoginPrompt />;
  return <Content />;
}
```

---

## Migration Steps

```
Step 1: Import Hook
  import { useProtectedRoute } from '@/hooks/useProtectedRoute';

Step 2: Replace useEffect
  OLD: useEffect(() => { checkAuth(); }, []);
  NEW: const { isLoading, isAuthorized } = useProtectedRoute('admin');

Step 3: Replace Manual Checks
  OLD: const token = localStorage.getItem('accessToken');
  NEW: const { user } = useProtectedRoute('admin');

Step 4: Update Rendering
  OLD: if (!token) return <LoginPrompt />;
  NEW: if (!isAuthorized) return <AccessDenied />;
```

---

## Performance Tips

```
1. Use hook only once per page
   ✅ Good: const { ... } = useProtectedRoute('admin');
   ❌ Bad: Call multiple times

2. Memoize user checks
   ✅ Good: useMemo(() => getCurrentUser(), [])
   ❌ Bad: Call every render

3. Lazy load protected content
   ✅ Good: Load after auth verified
   ❌ Bad: Load before auth check

4. Cache utility results
   ✅ Good: useMemo with getDependencies
   ❌ Bad: Compute every render
```

---

## Security Notes

1. **Always validate on backend** - Client-side can be bypassed
2. **Use HTTPS** - Tokens only over encrypted connections
3. **Set secure cookies** - HttpOnly and Secure flags
4. **Implement CSRF** - For state-changing operations
5. **Audit logs** - Track all access attempts
6. **Token expiration** - Automatic via system
7. **Regular refresh** - Handled automatically

---

## Role Reference

```
USER Role
  ├─ Authenticate only
  ├─ Create own events
  ├─ Donate to events
  └─ View own donations

MODERATOR Role
  ├─ All USER permissions
  ├─ Moderate content
  ├─ View analytics
  └─ Manage reports

ADMIN Role
  ├─ All permissions
  ├─ Manage users
  ├─ Manage charities
  ├─ Manage events
  ├─ View all analytics
  └─ System configuration
```

---

## Response Codes

```
200 OK
  ✓ Request successful, data returned

401 Unauthorized
  ✗ Token invalid or expired
  → Auto-refresh triggered
  → If refresh fails → Redirect to login

403 Forbidden
  ✗ User authenticated but insufficient permissions
  → Redirect to home

500 Server Error
  ✗ Backend error
  → Show error message, offer retry
```

---

## Browser DevTools Tips

```
Check Token
  Application → LocalStorage → find 'accessToken'

Check User Data
  Application → LocalStorage → find 'user'

Check Headers
  Network → Any API call → Request Headers → Authorization

Check Errors
  Console → Look for route protection errors

Check Network
  Network → Requests with 401
```

---

## Summary

```
✅ WHAT YOU HAVE
   • Production-ready protection
   • 4-layer security
   • Automatic token management
   • Comprehensive documentation
   • Working examples

✅ HOW TO USE
   1. Import hook
   2. Call with role
   3. Check isAuthorized

✅ TIME REQUIRED
   • Setup: 2 minutes per page
   • Learning: 5-30 minutes
   • Migration: Ongoing

✅ NEXT STEP
   → Read START_ROUTE_PROTECTION.md
```

---

**🔒 You're all set! Start protecting your routes now!**

*Last Updated: 2026-01-31*
