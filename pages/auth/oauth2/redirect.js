import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { userAPI } from '@/lib/api';

export default function OAuth2Redirect() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');

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
      handleOAuthSuccess(accessToken, refreshToken);
    } else {
      // Missing tokens, redirect to login
      router.push({
        pathname: '/auth/login',
        query: { error: 'Authentication failed. Please try again.' }
      });
    }
  }, [router.query]);

  const handleOAuthSuccess = async (accessToken, refreshToken) => {
    try {
      // Store tokens in localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      // Store tokens in cookies for middleware access
      document.cookie = `accessToken=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `refreshToken=${refreshToken}; path=/; max-age=604800; SameSite=Lax`;
      
      // Fetch user data using the access token
      const userData = await userAPI.getProfile();
      
      // Store user data in localStorage and cookies
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        document.cookie = `user=${encodeURIComponent(JSON.stringify(userData))}; path=/; max-age=86400; SameSite=Lax`;
      }
      
      // Redirect to home or intended destination
      const intendedPath = sessionStorage.getItem('oauth_redirect') || '/';
      sessionStorage.removeItem('oauth_redirect');
      
      router.push(intendedPath).then(() => {
        // Reload page to refresh all state
        window.location.reload();
      });
    } catch (err) {
      console.error('Error fetching user data:', err);
      setErrorMsg('Failed to complete authentication. Redirecting...');
      
      // Even if user fetch fails, try to redirect anyway
      setTimeout(() => {
        const intendedPath = sessionStorage.getItem('oauth_redirect') || '/';
        sessionStorage.removeItem('oauth_redirect');
        router.push(intendedPath).then(() => {
          window.location.reload();
        });
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600">
      <div className="bg-white p-8 rounded-3xl shadow-2xl">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-600 mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Completing Sign In</h2>
          <p className="text-gray-600">{errorMsg || 'Please wait while we redirect you...'}</p>
        </div>
      </div>
    </div>
  );
}
