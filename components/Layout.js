import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Layout({ children }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    checkAuth();

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    setIsLoggedIn(!!token);
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Failed to parse user data');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    router.push('/auth/login');
  };

  const isActive = (path) => router.pathname === path || router.pathname.startsWith(path + '/');
  const isAdmin = user?.roles?.includes('ADMIN');

  return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50 via-amber-50 to-white">
        <nav className={`fixed w-full z-50 transition-all duration-300 ${
            scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm shadow-md'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="flex items-center space-x-2 group">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 flex items-center justify-center">
                        <span className="text-white font-bold">S</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                      SangKumFund
                    </div>
                  </div>
                </Link>
                <div className="ml-10 hidden lg:flex space-x-2">
                  <Link
                      href="/events"
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive('/events')
                              ? 'bg-orange-100 text-orange-700'
                              : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                      }`}
                  >
                    🎯 Events
                  </Link>
                  <Link
                      href="/charities"
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive('/charities')
                              ? 'bg-orange-100 text-orange-700'
                              : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                      }`}
                  >
                    🏛️ Charities
                  </Link>
                  <Link
                      href="/help-center"
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive('/help-center')
                              ? 'bg-orange-100 text-orange-700'
                              : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                      }`}
                  >
                    ❓ Help
                  </Link>
                  {isLoggedIn && (
                      <>
                        <Link
                            href="/dashboard"
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                isActive('/dashboard')
                                    ? 'bg-orange-100 text-orange-700'
                                    : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                            }`}
                        >
                          📊 Dashboard
                        </Link>
                        {isAdmin && (
                            <Link
                                href="/admin"
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    isActive('/admin')
                                        ? 'bg-amber-100 text-amber-700'
                                        : 'text-gray-700 hover:bg-amber-50 hover:text-amber-600'
                                }`}
                            >
                              🎛️ Admin
                            </Link>
                        )}
                      </>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {isLoggedIn ? (
                    <>
                      <Link
                          href="/notifications"
                          className="relative p-2 text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
                      >
                        🔔
                        {notificationCount > 0 && (
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {notificationCount}
                      </span>
                        )}
                      </Link>
                      <Link
                          href="/settings"
                          className="p-2 text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
                      >
                        ⚙️
                      </Link>
                      <Link
                          href="/business-card"
                          className="hidden lg:inline-block p-2 text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
                      >
                        💼
                      </Link>
                      <button
                          onClick={handleLogout}
                          className="text-gray-700 hover:bg-orange-50 hover:text-orange-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                      >
                        Logout
                      </button>
                    </>
                ) : (
                    <>
                      <Link
                          href="/auth/login"
                          className="text-gray-700 hover:bg-orange-50 hover:text-orange-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                      >
                        Login
                      </Link>
                      <Link
                          href="/auth/register"
                          className="bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:from-orange-700 hover:to-amber-700 px-5 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 btn-ripple"
                      >
                        Sign Up
                      </Link>
                    </>
                )}

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="lg:hidden p-2 text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-lg"
                >
                  {mobileMenuOpen ? '✕' : '☰'}
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t border-gray-200 py-4 space-y-2 animate-fadeIn">
                  <Link
                      href="/events"
                      className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  >
                    🎯 Events
                  </Link>
                  <Link
                      href="/charities"
                      className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  >
                    🏛️ Charities
                  </Link>
                  <Link
                      href="/help-center"
                      className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  >
                    ❓ Help Center
                  </Link>
                  {isLoggedIn && (
                      <>
                        <Link
                            href="/dashboard"
                            className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                        >
                          📊 Dashboard
                        </Link>
                        <Link
                            href="/business-card"
                            className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                        >
                          💼 Business Card
                        </Link>
                        {isAdmin && (
                            <Link
                                href="/admin"
                                className="block px-4 py-2 rounded-lg text-sm font-medium text-amber-700 hover:bg-amber-50"
                            >
                              🎛️ Admin
                            </Link>
                        )}
                      </>
                  )}
                </div>
            )}
          </div>
        </nav>

        <main className="flex-grow pt-16">{children}</main>

        <footer className="bg-gradient-to-r from-orange-800 to-amber-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 flex items-center justify-center">
                    <span className="text-white font-bold">S</span>
                  </div>
                  <h3 className="text-xl font-bold">SangKumFund</h3>
                </div>
                <p className="text-orange-200 text-sm">Building a more compassionate Cambodia together.</p>
                <div className="flex gap-3 mt-4">
                  <a href="#" className="w-8 h-8 rounded-full bg-orange-700 hover:bg-orange-600 flex items-center justify-center">
                    f
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full bg-orange-700 hover:bg-orange-600 flex items-center justify-center">
                    𝕏
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full bg-orange-700 hover:bg-orange-600 flex items-center justify-center">
                    in
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full bg-orange-700 hover:bg-orange-600 flex items-center justify-center">
                    📷
                  </a>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-orange-100">Platform</h4>
                <ul className="space-y-2 text-orange-200 text-sm">
                  <li><Link href="/events" className="hover:text-white transition-colors">Browse Campaigns</Link></li>
                  <li><Link href="/create" className="hover:text-white transition-colors">Start a Campaign</Link></li>
                  <li><Link href="/help-center" className="hover:text-white transition-colors">Help Center</Link></li>
                  <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-orange-100">Support</h4>
                <ul className="space-y-2 text-orange-200 text-sm">
                  <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                  <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                  <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                  <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-orange-100">Contact</h4>
                <div className="space-y-3 text-orange-200 text-sm">
                  <div className="flex items-start gap-2">
                    <span>📍</span>
                    <div>
                      <p>Phnom Penh, Cambodia</p>
                      <p className="text-xs text-orange-300">Building 123, Street 456</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>📧</span>
                    <p>support@sangkumfund.org</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>📞</span>
                    <p>+855 23 456 789</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-orange-700 pt-6 text-center">
              <p className="text-sm text-orange-300">
                © {new Date().getFullYear()} SangKumFund. All rights reserved.
              </p>
              <p className="text-xs text-orange-400 mt-2">
                Made with ❤️ for Cambodia
              </p>
            </div>
          </div>
        </footer>
      </div>
  );
}