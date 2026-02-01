import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

/**
 * Hook to protect routes from unauthorized access
 * Checks authentication and user role before allowing access
 * 
 * @param {string} requiredRole - Required role: 'user', 'admin', 'event-owner', or null for authenticated only
 * @param {boolean} redirectToLogin - Whether to redirect to login if not authenticated
 * @returns {object} { isLoading, isAuthorized, user, error }
 */
export const useProtectedRoute = (requiredRole = null, redirectToLogin = true) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // Check if window is available (client-side only)
        if (typeof window === 'undefined') {
          setIsLoading(false);
          return;
        }

        // Get stored user and token
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('accessToken');

        // No authentication found
        if (!userStr || !token) {
          setIsAuthorized(false);
          setUser(null);
          setError('No authentication found');
          
          if (redirectToLogin) {
            router.push('/auth/login?redirect=' + router.asPath);
          }
          setIsLoading(false);
          return;
        }

        // Parse user data
        const userData = JSON.parse(userStr);
        setUser(userData);

        // Check role-based authorization
        if (requiredRole) {
          let hasAccess = false;

          switch (requiredRole) {
            case 'admin':
              hasAccess = userData.role === 'ADMIN' || userData.isAdmin === true;
              break;
            
            case 'event-owner':
              // This should be handled per-page since we need event context
              hasAccess = true; // Handled at page level
              break;
            
            case 'user':
              hasAccess = !!userData.id; // Any authenticated user
              break;
            
            default:
              hasAccess = !!userData.id;
          }

          if (!hasAccess) {
            setIsAuthorized(false);
            setError(`Insufficient permissions. Required role: ${requiredRole}`);
            
            // Redirect to home or unauthorized page
            router.push('/');
            setIsLoading(false);
            return;
          }
        }

        // Token validation (optional - can add backend call here)
        // For now, assume token validity is checked by apiClient interceptor

        setIsAuthorized(true);
        setError(null);
      } catch (err) {
        console.error('Route protection error:', err);
        setIsAuthorized(false);
        setError(err.message);
        
        if (redirectToLogin) {
          router.push('/auth/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [requiredRole, redirectToLogin, router]);

  return { isLoading, isAuthorized, user, error };
};

/**
 * HOC to wrap pages with route protection
 */
export const withProtectedRoute = (Component, requiredRole = null) => {
  return function ProtectedComponent(props) {
    const { isLoading, isAuthorized, user, error } = useProtectedRoute(requiredRole);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Verifying access...</p>
          </div>
        </div>
      );
    }

    if (!isAuthorized) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <div className="text-red-600 text-5xl mb-4">⛔</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-6">{error || 'You do not have permission to access this page.'}</p>
            <a
              href="/"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Return to Home
            </a>
          </div>
        </div>
      );
    }

    return <Component {...props} user={user} />;
  };
};

export default useProtectedRoute;
