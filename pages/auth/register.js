import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { Mail, Key, Lock, Check, AlertTriangle } from 'lucide-react';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const nameRef = useRef(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const getPasswordStrength = (password) => {
    if (!password) return null;
    if (password.length < 6) return { label: 'Too short', barColor: 'bg-red-500', textColor: 'text-red-500', width: '25%' };
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const score = [hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
    if (score >= 2 && password.length >= 8) return { label: 'Strong', barColor: 'bg-green-500', textColor: 'text-green-600', width: '100%' };
    if (score >= 1 || password.length >= 8) return { label: 'Medium', barColor: 'bg-amber-500', textColor: 'text-amber-600', width: '60%' };
    return { label: 'Weak', barColor: 'bg-red-400', textColor: 'text-red-500', width: '35%' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    else if (formData.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.agreeToTerms) newErrors.terms = 'You must agree to the Terms of Service and Privacy Policy';
    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      await authAPI.register(formData.name, formData.email, formData.password);

      // Auto login after registration
      const loginResponse = await authAPI.login(formData.email, formData.password);
      
      // Store tokens in localStorage
      localStorage.setItem('accessToken', loginResponse.accessToken);
      localStorage.setItem('refreshToken', loginResponse.refreshToken);
      
      // Store tokens in cookies for middleware
      document.cookie = `accessToken=${loginResponse.accessToken}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `refreshToken=${loginResponse.refreshToken}; path=/; max-age=604800; SameSite=Lax`;
      
      if (loginResponse.user) {
        localStorage.setItem('user', JSON.stringify(loginResponse.user));
        document.cookie = `user=${encodeURIComponent(JSON.stringify(loginResponse.user))}; path=/; max-age=86400; SameSite=Lax`;
      }

      const redirectPath = router.query.redirect || '/survey';
      router.push(redirectPath);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    setError('');

    try {
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/auth/oauth2/authorize/google`;
    } catch (err) {
      setError('Google sign-up failed. Please try again.');
      setGoogleLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = '';
    if (name === 'name') {
      if (!value.trim()) error = 'Full name is required';
      else if (value.trim().length < 2) error = 'Name must be at least 2 characters';
    } else if (name === 'email') {
      if (!value) error = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email address';
    } else if (name === 'password') {
      if (!value) error = 'Password is required';
      else if (value.length < 6) error = 'Password must be at least 6 characters';
    } else if (name === 'confirmPassword') {
      if (!value) error = 'Please confirm your password';
      else if (value !== formData.password) error = 'Passwords do not match';
    }
    if (error) setFieldErrors(prev => ({ ...prev, [name]: error }));
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
              Join Our Community
            </h3>
            <p className="mt-3 text-center text-base text-gray-600">
              Start making a difference today
            </p>
          </div>

          {/* Error Message */}
          {error && (
              <div className="rounded-xl bg-red-50 p-4 border border-red-200 animate-slideInRight">
                <div className="flex items-center">
                  <AlertTriangle className="w-6 h-6 mr-2 flex-shrink-0" />
                  <div className="text-sm text-red-800 font-medium">{error}</div>
                </div>
              </div>
          )}

          {/* Google Sign-Up Button */}
          <div>
            <button
                onClick={handleGoogleSignUp}
                disabled={googleLoading}
                className="group relative w-full flex justify-center items-center gap-3 py-3 px-4 border-2 border-gray-300 text-base font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {googleLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
              ) : (
                  <>
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                    <span>Sign up with Google</span>
                  </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or sign up with email</span>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  👤 Full Name
                </label>
                <input
                    ref={nameRef}
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className={`appearance-none relative block w-full px-4 py-3 border-2 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 transition-all bg-white ${fieldErrors.name ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-100'}`}
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                />
                {fieldErrors.name && (
                  <p id="name-error" className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="inline-flex items-center gap-1"><Mail className="w-4 h-4" /> Email Address</span>
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`appearance-none relative block w-full px-4 py-3 border-2 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 transition-all bg-white ${fieldErrors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-100'}`}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-describedby={fieldErrors.email ? 'reg-email-error' : undefined}
                />
                {fieldErrors.email && (
                  <p id="reg-email-error" className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="inline-flex items-center gap-1"><Key className="w-4 h-4" /> Password</span>
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength="6"
                    className={`appearance-none relative block w-full px-4 py-3 border-2 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 transition-all bg-white ${fieldErrors.password ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-100'}`}
                    placeholder="Create a password (min. 6 characters)"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-describedby="password-strength"
                />
                {formData.password && (() => {
                  const s = getPasswordStrength(formData.password);
                  return s ? (
                    <div id="password-strength" className="mt-2">
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${s.barColor}`} style={{ width: s.width }} />
                      </div>
                      <p className="text-xs mt-1 text-gray-500">Strength: <span className={`font-medium ${s.textColor}`}>{s.label}</span></p>
                    </div>
                  ) : null;
                })()}
                {fieldErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
                )}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  <span className="inline-flex items-center gap-1"><Lock className="w-4 h-4" /> Confirm Password</span>
                </label>
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className={`appearance-none relative block w-full px-4 py-3 border-2 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 transition-all bg-white ${fieldErrors.confirmPassword ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : formData.confirmPassword && formData.confirmPassword === formData.password ? 'border-green-400 focus:border-green-500 focus:ring-green-100' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-100'}`}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-describedby={fieldErrors.confirmPassword ? 'confirm-error' : undefined}
                />
                {fieldErrors.confirmPassword && (
                  <p id="confirm-error" className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
                )}
                {!fieldErrors.confirmPassword && formData.confirmPassword && formData.confirmPassword === formData.password && (
                  <p className="mt-1 text-sm text-green-600">Passwords match</p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="pt-2">
                <div className="flex items-start gap-3">
                  <input
                      id="agreeToTerms"
                      name="agreeToTerms"
                      type="checkbox"
                      required
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      className="h-5 w-5 text-orange-600 rounded border-gray-300 focus:ring-orange-500 focus:ring-2 mt-1"
                  />
                  <label htmlFor="agreeToTerms" className="text-sm text-gray-600">
                    I agree to the{' '}
                    <Link href="/terms-of-service" className="text-orange-600 hover:text-orange-500 font-medium">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy-policy" className="text-orange-600 hover:text-orange-500 font-medium">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {fieldErrors.terms && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.terms}</p>
                )}
              </div>
            </div>

            {/* Register Button */}
            <div>
              <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Creating account...</span>
                    </>
                ) : (
                    <>
                      <span>🚀</span>
                      <span>Create Account</span>
                    </>
                )}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                  href="/auth/login"
                  className="font-semibold text-orange-600 hover:text-orange-500 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>

          {/* Benefits of Joining */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-200">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <span>✨</span>
              <span>Why join SangKumFund?</span>
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Create fundraising campaigns for causes you care about</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Support verified charities and community projects</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Track your impact and donation history</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Join a community making real change in Cambodia</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
  );
}