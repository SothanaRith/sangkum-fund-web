# Route Protection - Quick Reference

## 3-Line Implementation

```javascript
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

const { isLoading, isAuthorized, user } = useProtectedRoute('admin');
```

---

## Usage Patterns

### Pattern 1: Hook-Based (Recommended)
```javascript
export default function AdminPage() {
  const { isLoading, isAuthorized, user } = useProtectedRoute('admin');
  
  if (isLoading) return <Spinner />;
  if (!isAuthorized) return <AccessDenied />;
  
  return <AdminContent user={user} />;
}
```

### Pattern 2: HOC-Based
```javascript
import { withProtectedRoute } from '@/hooks/useProtectedRoute';

export default withProtectedRoute(MyComponent, 'admin');
```

### Pattern 3: Utility Functions
```javascript
import { isAuthenticated, isAdmin, getCurrentUser } from '@/lib/routeProtection';

useEffect(() => {
  if (!isAuthenticated() || !isAdmin()) {
    router.push('/');
  }
}, []);
```

---

## Role Values

| Role | Usage | Check Function |
|------|-------|-----------------|
| `null` | Any authenticated user | `isAuthenticated()` |
| `'admin'` | Admin only | `isAdmin()` |
| `'moderator'` | Moderator or admin | `isModerator()` |
| `'user'` | Regular authenticated | `getCurrentUser()` |
| `'event-owner'` | Event owner (page-level) | `isEventOwner(id)` |

---

## Automatic Redirects

| Scenario | Redirect | Behavior |
|----------|----------|----------|
| Not authenticated | `/auth/login?redirect=...` | Saves return URL |
| No admin role | `/` | Home page |
| Token expired | `/auth/login` | Auto-refresh attempted first |

---

## Protected Routes (Auto-blocked by middleware)

**Admin Routes:**
- `/admin`
- `/admin/control`
- `/admin/charities`
- `/admin/donations`
- `/admin/moderation`
- `/admin/events`
- `/admin/blog`

**User Routes:**
- `/dashboard`
- `/settings`
- `/cards`

---

## Key Files

| File | Purpose |
|------|---------|
| `hooks/useProtectedRoute.js` | Main hook & HOC |
| `lib/routeProtection.js` | Utility functions |
| `middleware.js` | URL-level protection |

---

## Common Tasks

### Check if user is logged in
```javascript
import { isAuthenticated } from '@/lib/routeProtection';
if (!isAuthenticated()) router.push('/auth/login');
```

### Get current user
```javascript
import { getCurrentUser } from '@/lib/routeProtection';
const user = getCurrentUser();
console.log(user.id, user.role);
```

### Protect admin page
```javascript
const { isLoading, isAuthorized } = useProtectedRoute('admin');
if (isLoading) return <Spinner />;
if (!isAuthorized) return <AccessDenied />;
```

### Protect event owner page
```javascript
const { isLoading, isAuthorized, user } = useProtectedRoute('user');
const canEdit = event.ownerId === user?.id || isAdmin();
```

### Redirect after login
```javascript
// Auto-handled, returns to ?redirect= URL
```

---

## Layer Security

| Layer | Mechanism | Blocks |
|-------|-----------|--------|
| 1. Middleware | URL-level checks | Direct URL access |
| 2. Hook | Client-side validation | Component render |
| 3. API | Token validation | Server-side requests |

---

## Testing Routes

### Direct access test
1. Open DevTools → Application → Cookies/LocalStorage
2. Delete `accessToken` and `user`
3. Navigate to `/admin`
4. Should redirect to `/auth/login`

### Role test
1. Login as regular user
2. Try direct access to `/admin`
3. Should redirect to `/`

### Session test
1. Login normally
2. Wait for token expiry
3. Make API call
4. Should auto-refresh token
5. If refresh fails, redirect to login

---

## Error Handling

### In components
```javascript
const { isLoading, isAuthorized, error } = useProtectedRoute('admin');

if (error) {
  return <div className="text-red-600">{error}</div>;
}
```

### In utilities
```javascript
try {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  if (user.role !== 'ADMIN') throw new Error('Insufficient permissions');
} catch (err) {
  console.error(err);
  redirectToLogin(router, '/admin');
}
```

---

## Configuration

To add new protected routes, edit `middleware.js`:

```javascript
const PROTECTED_ROUTES = {
  '/new-admin-page': 'ADMIN',      // Admin only
  '/user-dashboard': 'USER',        // Any logged-in user
  '/my-events': 'USER',             // Any logged-in user
};
```

To add new public routes, edit `PUBLIC_ROUTES` array:

```javascript
const PUBLIC_ROUTES = [
  '/my-new-public-page',
  '/some-info',
];
```

---

## Performance Tips

1. **Use hook only once per page** - Avoid multiple auth checks
2. **Memoize user checks** - Use `useMemo` for expensive checks
3. **Lazy load protected components** - Load after auth verified
4. **Cache user data** - Don't fetch user repeatedly

```javascript
const memoizedUser = useMemo(() => getCurrentUser(), []);
const isAdmin = useMemo(() => memoizedUser?.role === 'ADMIN', [memoizedUser]);
```

---

## Debugging

### Enable debug logs
```javascript
// In useProtectedRoute hook
console.log('Auth check:', { isLoading, isAuthorized, user, error });
```

### Check localStorage
```javascript
console.log('Stored user:', localStorage.getItem('user'));
console.log('Access token:', !!localStorage.getItem('accessToken'));
```

### Check API headers
```javascript
// DevTools → Network → Any API request
// Check Authorization header is set
```
