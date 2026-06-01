import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { userAPI } from '@/lib/api';

export default function OAuth2Redirect() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!router.isReady) return;

    const { accessToken, refreshToken, error, message } = router.query;

    if (error) {
      // Clear any stale sessionStorage on error
      sessionStorage.removeItem('oauth_redirect');
      router.push({
        pathname: '/auth/login',
        query: { error: message || 'OAuth2 authentication failed' }
      });
      return;
    }

    if (accessToken && refreshToken) {
      handleOAuthSuccess(accessToken, refreshToken);
    } else {
      sessionStorage.removeItem('oauth_redirect');
      router.push({
        pathname: '/auth/login',
        query: { error: 'Authentication failed. Please try again.' }
      });
    }
  }, [router.isReady, router.query]);

  const handleOAuthSuccess = async (accessToken, refreshToken) => {
    try {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      document.cookie = `accessToken=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `refreshToken=${refreshToken}; path=/; max-age=604800; SameSite=Lax`;

      const userData = await userAPI.getProfile();
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        document.cookie = `user=${encodeURIComponent(JSON.stringify(userData))}; path=/; max-age=86400; SameSite=Lax`;
      }

      const intendedPath = sessionStorage.getItem('oauth_redirect') || '/';
      sessionStorage.removeItem('oauth_redirect');
      router.push(intendedPath);
    } catch (err) {
      setErrorMsg('Failed to complete authentication. Redirecting...');
      const intendedPath = sessionStorage.getItem('oauth_redirect') || '/';
      sessionStorage.removeItem('oauth_redirect');
      setTimeout(() => router.push(intendedPath), 1500);
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
