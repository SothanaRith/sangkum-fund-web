/**
 * Route Protection Utilities
 * Helper functions for checking route access and redirects
 */

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('accessToken');
  const user = localStorage.getItem('user');
  return !!token && !!user;
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (e) {
    console.error('Failed to parse user:', e);
    return null;
  }
};

/**
 * Check if user is admin
 */
export const isAdmin = () => {
  const user = getCurrentUser();
  return user && (user.role === 'ADMIN' || user.isAdmin === true);
};

/**
 * Check if user is moderator
 */
export const isModerator = () => {
  const user = getCurrentUser();
  return user && (user.role === 'MODERATOR' || user.isModerator === true);
};

/**
 * Check if user owns a resource
 */
export const isOwner = (userId) => {
  const user = getCurrentUser();
  return user && user.id === userId;
};

/**
 * Check if user is event owner
 */
export const isEventOwner = (eventOwnerId) => {
  const user = getCurrentUser();
  return user && user.id === eventOwnerId;
};

/**
 * Redirect to login page with return URL
 */
export const redirectToLogin = (router, currentPath) => {
  router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
};

/**
 * Redirect to unauthorized page
 */
export const redirectToUnauthorized = (router) => {
  router.push('/');
};

/**
 * Validate route access
 * @param {string} requiredRole - 'admin', 'moderator', 'user', or null
 * @param {object} user - User object
 * @returns {boolean}
 */
export const validateRouteAccess = (requiredRole, user) => {
  if (!user) return false;

  switch (requiredRole) {
    case 'admin':
      return user.role === 'ADMIN' || user.isAdmin === true;
    
    case 'moderator':
      return user.role === 'MODERATOR' || user.isModerator === true || user.role === 'ADMIN';
    
    case 'user':
      return !!user.id;
    
    default:
      return !!user.id;
  }
};

/**
 * Get redirect URL from query params
 */
export const getRedirectUrl = (router) => {
  const redirect = router.query.redirect;
  return redirect ? decodeURIComponent(redirect) : '/dashboard';
};

/**
 * Create protected route config
 */
export const createProtectedRoute = (requiredRole, component) => {
  return {
    requiredRole,
    component,
    protected: true,
  };
};

export default {
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
  createProtectedRoute,
};
