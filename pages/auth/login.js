import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { authAPI } from '@/lib/api';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData.email, formData.password);

      // Store token and user data
      localStorage.setItem('token', response.token);
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      // Check if there's a redirect path
      const redirectPath = router.query.redirect || '/';
      router.push(redirectPath);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');

    try {
      // For Google OAuth, we typically redirect to Google's OAuth endpoint
      // This example assumes you have a backend endpoint that handles Google OAuth
      // Adjust based on your actual implementation

      // Option 1: Redirect to your backend's Google OAuth endpoint
      // window.location.href = 'https://your-backend.com/auth/google';

      // Option 2: If using NextAuth.js or similar, trigger signIn
      // signIn('google', { callbackUrl: router.query.redirect || '/' });

      // For now, we'll simulate the process
      alert('Google login would be implemented here. In production, this would redirect to Google OAuth.');

      // Simulate successful login (remove in production)
      setTimeout(() => {
        // Simulate getting user data
        const mockUser = {
          id: 'google_123',
          name: 'Google User',
          email: formData.email || 'user@gmail.com',
          avatar: 'https://via.placeholder.com/150',
          emailVerified: true
        };

        localStorage.setItem('token', 'google_mock_token');
        localStorage.setItem('user', JSON.stringify(mockUser));
        router.push(router.query.redirect || '/');
      }, 1000);

    } catch (err) {
      setError('Google login failed. Please try again.');
      console.error('Google login error:', err);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 md:p-10 rounded-3xl shadow-2xl animate-fadeIn border border-gray-100">
          {/* Header */}
          <div>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <h2 className="text-center text-3xl font-extrabold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                SangKumFund
              </h2>
            </div>
            <h3 className="text-center text-2xl font-bold text-gray-900">
              Welcome Back
            </h3>
            <p className="mt-3 text-center text-base text-gray-600">
              Continue your journey of making a difference
            </p>
          </div>

          {/* Error Message */}
          {error && (
              <div className="rounded-xl bg-red-50 p-4 border border-red-200 animate-slideInRight">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">⚠️</span>
                  <div className="text-sm text-red-800 font-medium">{error}</div>
                </div>
              </div>
          )}

          {/* Google Login Button */}
          <div>
            <button
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="group relative w-full flex justify-center items-center gap-3 py-3 px-4 border-2 border-gray-300 text-base font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {googleLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
              ) : (
                  <>
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                    <span>Continue with Google</span>
                  </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  📧 Email Address
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none relative block w-full px-4 py-3 border-2 border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all bg-white"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                    🔑 Password
                  </label>
                  <Link
                      href="/auth/forgot-password"
                      className="text-sm font-medium text-orange-600 hover:text-orange-500 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none relative block w-full px-4 py-3 border-2 border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all bg-white"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                />
              </div>
            </div>

            {/* Login Button */}
            <div>
              <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Signing in...</span>
                    </>
                ) : (
                    <>
                      <span>🔓</span>
                      <span>Sign In</span>
                    </>
                )}
              </button>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                  href="/auth/register"
                  className="font-semibold text-orange-600 hover:text-orange-500 transition-colors"
              >
                Sign up now
              </Link>
            </p>
          </div>

          {/* Guest Login Option (for demo/testing) */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Want to try it out?</p>
            <button
                onClick={() => {
                  setFormData({
                    email: 'demo@sangkumfund.org',
                    password: 'demo123'
                  });
                }}
                className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
            >
              Fill demo credentials
            </button>
          </div>
        </div>
      </div>
  );
}