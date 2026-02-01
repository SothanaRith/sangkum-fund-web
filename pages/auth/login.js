import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { authAPI } from '@/lib/api';

export default function Login() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: credentials, 2: OTP
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [isAccountLocked, setIsAccountLocked] = useState(false);

  // Check for error from OAuth redirect
  useEffect(() => {
    if (router.query.error) {
      setError(router.query.error);
    }
  }, [router.query.error]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authAPI.sendOtp(formData.email, 'login');
      setOtpSent(true);
      setStep(2);
      setResendTimer(60);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.loginWithOtp(formData.email, formData.password, formData.otp);

      // Store tokens in localStorage
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      
      // Store tokens in cookies for middleware
      document.cookie = `accessToken=${response.accessToken}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `refreshToken=${response.refreshToken}; path=/; max-age=604800; SameSite=Lax`;
      
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
        document.cookie = `user=${encodeURIComponent(JSON.stringify(response.user))}; path=/; max-age=86400; SameSite=Lax`;
      }

      // Check if there's a redirect path
      const redirectPath = router.query.redirect || '/';
      await router.push(redirectPath);
      
      // Reload page to refresh all state
      window.location.reload();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials and try again.';
      setError(errorMessage);
      
      // Check if account is locked
      if (errorMessage.includes('locked') || errorMessage.includes('too many')) {
        setIsAccountLocked(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    
    setError('');
    setLoading(true);

    try {
      await authAPI.sendOtp(formData.email, 'login');
      setResendTimer(60);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      // Redirect to backend's Google OAuth endpoint
      window.location.href = `${API_URL}/api/auth/oauth2/authorize/google`;
    } catch (err) {
      setError('Google login failed. Please try again.');
      console.error('Google login error:', err);
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
              <div className={`rounded-xl p-4 border animate-slideInRight ${
                isAccountLocked ? 'bg-red-100 border-red-300' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center">
                  <span className="text-2xl mr-2">{isAccountLocked ? '🔒' : '⚠️'}</span>
                  <div>
                    <div className={`text-sm font-medium ${
                      isAccountLocked ? 'text-red-900' : 'text-red-800'
                    }`}>
                      {error}
                    </div>
                    {isAccountLocked && (
                      <div className="text-xs text-red-700 mt-1">
                        For security reasons, your account has been temporarily locked. Please contact support if you need immediate assistance.
                      </div>
                    )}
                  </div>
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
          {step === 1 ? (
            <form className="space-y-5" onSubmit={handleSendOtp}>
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

              {/* Send OTP Button */}
              <div>
                <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Sending OTP...</span>
                      </>
                  ) : (
                      <>
                        <span>🔐</span>
                        <span>Send OTP Code</span>
                      </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleVerifyOtp}>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                <p className="text-sm text-blue-800">
                  📨 We've sent a 6-digit verification code to <strong>{formData.email}</strong>
                </p>
              </div>

              <div>
                <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 mb-2">
                  🔢 Enter OTP Code
                </label>
                <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    maxLength="6"
                    pattern="[0-9]{6}"
                    className="appearance-none relative block w-full px-4 py-3 border-2 border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 text-center text-2xl font-bold tracking-widest focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all bg-white"
                    placeholder="000000"
                    value={formData.otp}
                    onChange={handleChange}
                />
              </div>

              {/* Verify Button */}
              <div>
                <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Verifying...</span>
                      </>
                  ) : (
                      <>
                        <span>✓</span>
                        <span>Verify & Login</span>
                      </>
                  )}
                </button>
              </div>

              {/* Resend OTP */}
              <div className="text-center">
                <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0 || loading}
                    className="text-sm font-medium text-orange-600 hover:text-orange-500 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
                </button>
                <span className="mx-2 text-gray-300">|</span>
                <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Change Email
                </button>
              </div>
            </form>
          )}

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