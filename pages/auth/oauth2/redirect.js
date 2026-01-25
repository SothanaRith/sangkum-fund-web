import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function OAuth2Redirect() {
  const router = useRouter();

  useEffect(() => {
    const { accessToken, refreshToken, tokenType, expiresIn, error, message } = router.query;

    if (error) {
      // Redirect to login with error message
      router.push({
        pathname: '/auth/login',
        query: { error: message || 'OAuth2 authentication failed' }
      });
      return;
    }

    if (accessToken && refreshToken) {
      // Store tokens
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      // Redirect to home or intended destination
      const intendedPath = sessionStorage.getItem('oauth_redirect') || '/';
      sessionStorage.removeItem('oauth_redirect');
      
      router.push(intendedPath);
    } else {
      // Missing tokens, redirect to login
      router.push({
        pathname: '/auth/login',
        query: { error: 'Authentication failed. Please try again.' }
      });
    }
  }, [router.query]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600">
      <div className="bg-white p-8 rounded-3xl shadow-2xl">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-600 mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Completing Sign In</h2>
          <p className="text-gray-600">Please wait while we redirect you...</p>
        </div>
      </div>
    </div>
  );
}
