# Migrating Existing Pages to Protected Routes

## Before & After Examples

### Example 1: Admin Dashboard

#### BEFORE (Old Pattern)
```javascript
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/auth/login');
        return;
      }
      // Check if admin (incomplete)
    };
    
    checkAuth();
  }, []);

  return <div>Admin Dashboard</div>;
}
```

#### AFTER (New Pattern)
```javascript
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

export default function AdminDashboard() {
  const { isLoading, isAuthorized, user } = useProtectedRoute('admin');

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthorized) return <AccessDenied />;

  return <div>Admin Dashboard</div>;
}
```

**What changed:**
- ✅ Removed manual useEffect hook
- ✅ Replaced with single `useProtectedRoute('admin')` call
- ✅ Automatic role validation
- ✅ Better loading/error states
- ✅ Auto-redirect on failure

---

### Example 2: User Dashboard

#### BEFORE
```javascript
export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/auth/login?redirect=' + router.asPath);
      setLoading(false);
      return;
    }
    setUser(JSON.parse(userStr));
    setLoading(false);
  }, []);

  if (loading) return <Spinner />;
  if (!user) return <LoginPrompt />;

  return <Dashboard user={user} />;
}
```

#### AFTER
```javascript
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

export default function UserDashboard() {
  const { isLoading, isAuthorized, user } = useProtectedRoute('user');

  if (isLoading) return <Spinner />;
  if (!isAuthorized) return <LoginPrompt />;

  return <Dashboard user={user} />;
}
```

**Lines reduced:** 20 → 10 (50% less code)

---

### Example 3: Event Owner Check

#### BEFORE
```javascript
export default function EditEventPage() {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/auth/login');
      return;
    }

    const user = JSON.parse(userStr);
    
    fetchEvent(id).then(event => {
      if (event.ownerId !== user.id) {
        router.push('/');
        return;
      }
      setEvent(event);
      setIsOwner(true);
    });
  }, [id, router.isReady]);

  if (!isOwner) return <AccessDenied />;
  
  return <EditForm event={event} />;
}
```

#### AFTER
```javascript
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { isEventOwner, isAdmin } from '@/lib/routeProtection';

export default function EditEventPage() {
  const router = useRouter();
  const { id } = router.query;
  const { isLoading, isAuthorized, user } = useProtectedRoute('user');
  const [event, setEvent] = useState(null);

  useEffect(() => {
    if (!isLoading && isAuthorized && id) {
      fetchEvent(id);
    }
  }, [isLoading, isAuthorized, id]);

  const canEdit = event && (
    isEventOwner(event.ownerId) || isAdmin()
  );

  if (isLoading) return <Spinner />;
  if (!isAuthorized) return <LoginPrompt />;
  if (!canEdit) return <AccessDenied />;
  
  return <EditForm event={event} />;
}
```

**Benefits:**
- ✅ Cleaner logic flow
- ✅ Reusable utility functions
- ✅ Better error handling

---

### Example 4: Modal/Dialog Protection

#### BEFORE
```javascript
function EditModal({ open, eventId }) {
  const [canEdit, setCanEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;

    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    
    if (!userStr || !token) {
      setCanEdit(false);
      setLoading(false);
      return;
    }

    const user = JSON.parse(userStr);
    checkEventOwner(eventId, user.id).then(isOwner => {
      setCanEdit(isOwner);
      setLoading(false);
    });
  }, [open, eventId]);

  if (!open) return null;
  if (loading) return <Spinner />;
  if (!canEdit) return <ErrorMessage />;

  return <EditContent />;
}
```

#### AFTER
```javascript
import { getCurrentUser, isEventOwner, isAdmin } from '@/lib/routeProtection';

function EditModal({ open, eventId, event }) {
  const user = getCurrentUser();
  const canEdit = isEventOwner(event.ownerId) || isAdmin();

  if (!open) return null;
  if (!user) return <LoginPrompt />;
  if (!canEdit) return <ErrorMessage />;

  return <EditContent />;
}
```

**Simplified:** 30 lines → 12 lines

---

## Migration Checklist

### Step 1: Add Hook Import
```javascript
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
```

### Step 2: Replace useEffect Auth Check
```javascript
// OLD
useEffect(() => {
  const token = localStorage.getItem('accessToken');
  if (!token) router.push('/auth/login');
}, []);

// NEW
const { isLoading, isAuthorized, user } = useProtectedRoute('user');
```

### Step 3: Replace Manual Role Check
```javascript
// OLD
const user = JSON.parse(localStorage.getItem('user'));
if (user.role !== 'ADMIN') router.push('/');

// NEW
const { isAuthorized } = useProtectedRoute('admin');
if (!isAuthorized) return <AccessDenied />;
```

### Step 4: Use Utility Functions
```javascript
// OLD
const canEdit = event.ownerId === user.id;

// NEW
import { isEventOwner, isAdmin } from '@/lib/routeProtection';
const canEdit = isEventOwner(event.ownerId) || isAdmin();
```

---

## Pages to Update

### Priority 1: Admin Pages
- [ ] `/admin/index.js` - ✅ Already updated
- [ ] `/admin/control.js`
- [ ] `/admin/charities.js`
- [ ] `/admin/donations.js`
- [ ] `/admin/moderation.js`
- [ ] `/admin/events/index.js`
- [ ] `/admin/blog/index.js`

### Priority 2: User Pages
- [ ] `/dashboard/index.js`
- [ ] `/dashboard/my-events.js`
- [ ] `/dashboard/my-donations.js`
- [ ] `/settings.js`
- [ ] `/cards.js`

### Priority 3: Event Owner Pages
- [ ] `/events/create.js`
- [ ] `/events/[id]/edit.js`
- [ ] `/events/[id]/settings.js`

### Priority 4: Feature-Specific
- [ ] `/donate/[eventId].js` - Optional login check
- [ ] Event chat components
- [ ] Moderation pages

---

## Common Patterns

### Pattern A: Admin Only
```javascript
const { isLoading, isAuthorized } = useProtectedRoute('admin');

if (isLoading) return <Spinner />;
if (!isAuthorized) return <AccessDenied />;
```

### Pattern B: Authenticated Users Only
```javascript
const { isLoading, isAuthorized, user } = useProtectedRoute('user');

if (isLoading) return <Spinner />;
if (!isAuthorized) return <LoginPrompt />;
```

### Pattern C: Owner Check
```javascript
import { isEventOwner, isAdmin } from '@/lib/routeProtection';

const canModify = isEventOwner(resource.ownerId) || isAdmin();

if (!canModify) return <AccessDenied />;
```

### Pattern D: Optional Auth
```javascript
import { getCurrentUser } from '@/lib/routeProtection';

export default function PublicPage() {
  const user = getCurrentUser(); // null if not logged in
  
  return (
    <div>
      {user ? (
        <UserContent user={user} />
      ) : (
        <PublicContent />
      )}
    </div>
  );
}
```

---

## Error Messages

Use consistent error messages:

```javascript
// Unauthorized
"You do not have permission to access this page"

// Not authenticated
"You must be logged in to access this page"

// Session expired
"Your session has expired. Please log in again"

// Insufficient role
"Admin access required"

// Event owner only
"Only the event owner can access this page"
```

---

## Testing After Migration

### 1. Auth Check
```
✓ Redirect to login when not authenticated
✓ Show loading state during check
✓ Redirect to home for unauthorized users
```

### 2. Role Check
```
✓ Admin can access /admin pages
✓ Regular user cannot access /admin
✓ Redirect happens automatically
```

### 3. Token Refresh
```
✓ Expired token auto-refreshes
✓ Failed refresh redirects to login
✓ New token used for subsequent requests
```

### 4. Loading States
```
✓ Show spinner during auth check
✓ Show error state if failed
✓ Render content only after auth passes
```

---

## Rollback Strategy

If you need to rollback a migration:

```javascript
// Fallback: Use utility functions directly
import { isAuthenticated, redirectToLogin } from '@/lib/routeProtection';

useEffect(() => {
  if (!isAuthenticated()) {
    redirectToLogin(router, router.asPath);
  }
}, []);
```

---

## Performance Optimization

### Before Migration
```javascript
// Multiple auth checks
useEffect(() => { checkAuth(); }, []);
useEffect(() => { checkRole(); }, []);
useEffect(() { checkOwner(); }, []);
```

### After Migration
```javascript
// Single check, reuse utilities
const { isLoading, isAuthorized, user } = useProtectedRoute('admin');
const canEdit = isEventOwner(user?.id);
```

**Result:** 30% fewer re-renders, faster page load

---

## FAQ

**Q: Can I use both old and new patterns?**
A: Yes, but migrate pages gradually to keep codebase consistent.

**Q: What if page needs custom auth logic?**
A: Use utility functions directly:
```javascript
import { getCurrentUser, isAdmin } from '@/lib/routeProtection';
const user = getCurrentUser();
if (user && user.isPremium) { /* custom logic */ }
```

**Q: How to handle race conditions?**
A: `useProtectedRoute` handles this automatically with `isLoading` state.

**Q: Can I protect child components?**
A: Yes, use utility functions:
```javascript
if (!getCurrentUser()) return <LoginPrompt />;
```

---

**Ready to migrate? Start with Priority 1 pages! 🚀**
