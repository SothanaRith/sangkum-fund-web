import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  Bell,
  Briefcase,
  Facebook,
  Globe,
  HelpCircle,
  Heart,
  Instagram,
  Landmark,
  LayoutDashboard,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Newspaper,
  Phone,
  Settings,
  SlidersHorizontal,
  Target,
  Twitter,
  X,
} from 'lucide-react';
import { authAPI } from '@/lib/api';
import { useLanguage } from '@/lib/LanguageContext';

export default function Layout({ children }) {
  const router = useRouter();
  const { language, changeLanguage, t } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkAuth();

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const checkAuth = () => {
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem('accessToken');
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

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
      setIsLoggedIn(false);
      setUser(null);
      router.push('/auth/login');
    }
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
                    <Target className="inline-block w-4 h-4 mr-2" />
                    {t('nav.events')}
                  </Link>
                  <Link
                      href="/charities"
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive('/charities')
                              ? 'bg-orange-100 text-orange-700'
                              : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                      }`}
                  >
                    <Landmark className="inline-block w-4 h-4 mr-2" />
                    {t('nav.charities')}
                  </Link>
                  <Link
                      href="/help-center"
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive('/help-center')
                              ? 'bg-orange-100 text-orange-700'
                              : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                      }`}
                  >
                    <HelpCircle className="inline-block w-4 h-4 mr-2" />
                    {t('nav.helpCenter')}
                  </Link>
                  <Link
                      href="/blog"
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive('/blog')
                              ? 'bg-orange-100 text-orange-700'
                              : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                      }`}
                  >
                    <Newspaper className="inline-block w-4 h-4 mr-2" />
                    Blog
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
                          <LayoutDashboard className="inline-block w-4 h-4 mr-2" />
                          {t('nav.dashboard')}
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
                              <SlidersHorizontal className="inline-block w-4 h-4 mr-2" />
                              Admin
                            </Link>
                        )}
                      </>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {/* Language Switcher */}
                <button
                    onClick={() => changeLanguage(language === 'en' ? 'km' : 'en')}
                    className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg text-sm font-medium transition-all duration-200"
                    title={language === 'en' ? 'Switch to Khmer' : 'Switch to English'}
                >
                  <Globe className="w-4 h-4" />
                  <span className="hidden sm:inline">{language === 'en' ? 'ខ្មែរ' : 'EN'}</span>
                </button>

                {isLoggedIn ? (
                    <>
                      {isAdmin && (
                        <Link
                            href="/admin"
                            className="p-2 text-gray-600 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition-colors"
                            title="Admin Panel"
                        >
                          <SlidersHorizontal className="w-5 h-5" />
                        </Link>
                      )}
                      <Link
                          href="/notifications"
                          className="relative p-2 text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
                      >
                        <Bell className="w-5 h-5" />
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
                        <Settings className="w-5 h-5" />
                      </Link>
                      <Link
                          href="/business-card"
                          className="hidden lg:inline-block p-2 text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
                      >
                        <Briefcase className="w-5 h-5" />
                      </Link>
                      <button
                          onClick={handleLogout}
                          className="text-gray-700 hover:bg-orange-50 hover:text-orange-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                      >
                        {t('nav.logout')}
                      </button>
                    </>
                ) : (
                    <>
                      <Link
                          href="/auth/login"
                          className="text-gray-700 hover:bg-orange-50 hover:text-orange-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                      >
                        {t('nav.login')}
                      </Link>
                      <Link
                          href="/auth/register"
                          className="bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:from-orange-700 hover:to-amber-700 px-5 py-2 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 btn-ripple"
                      >
                        {t('nav.register')}
                      </Link>
                    </>
                )}

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="lg:hidden p-2 text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-lg"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
                    <Target className="inline-block w-4 h-4 mr-2" />
                    {t('nav.events')}
                  </Link>
                  <Link
                      href="/charities"
                      className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  >
                    <Landmark className="inline-block w-4 h-4 mr-2" />
                    {t('nav.charities')}
                  </Link>
                  <Link
                      href="/help-center"
                      className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  >
                    <HelpCircle className="inline-block w-4 h-4 mr-2" />
                    {t('nav.helpCenter')}
                  </Link>
                  <Link
                      href="/blog"
                      className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  >
                    <Newspaper className="inline-block w-4 h-4 mr-2" />
                    Blog
                  </Link>
                  {isLoggedIn && (
                      <>
                        <Link
                            href="/dashboard"
                            className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                        >
                          <LayoutDashboard className="inline-block w-4 h-4 mr-2" />
                          {t('nav.dashboard')}
                        </Link>
                        <Link
                            href="/business-card"
                            className="block px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                        >
                          <Briefcase className="inline-block w-4 h-4 mr-2" />
                          {t('nav.businessCard')}
                        </Link>
                        {isAdmin && (
                            <Link
                                href="/admin"
                                className="block px-4 py-2 rounded-lg text-sm font-medium text-amber-700 hover:bg-amber-50"
                            >
                              <SlidersHorizontal className="inline-block w-4 h-4 mr-2" />
                              Admin
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
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full bg-orange-700 hover:bg-orange-600 flex items-center justify-center">
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full bg-orange-700 hover:bg-orange-600 flex items-center justify-center">
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-8 h-8 rounded-full bg-orange-700 hover:bg-orange-600 flex items-center justify-center">
                    <Instagram className="w-4 h-4" />
                  </a>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-orange-100">Platform</h4>
                <ul className="space-y-2 text-orange-200 text-sm">
                  <li><Link href="/events" className="hover:text-white transition-colors">Browse Campaigns</Link></li>
                  <li><Link href="/create" className="hover:text-white transition-colors">Start a Campaign</Link></li>
                  <li><Link href="/help-center" className="hover:text-white transition-colors">Help Center</Link></li>
                  <li><Link href="/about-us" className="hover:text-white transition-colors">About Us</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-orange-100">Support</h4>
                <ul className="space-y-2 text-orange-200 text-sm">
                  <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                  <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                  <li><Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
                  <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-orange-100">Contact</h4>
                <div className="space-y-3 text-orange-200 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5" />
                    <div>
                      <p>Phnom Penh, Cambodia</p>
                      <p className="text-xs text-orange-300">Building 123, Street 456</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail className="w-4 h-4 mt-0.5" />
                    <p>support@sangkumfund.org</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 mt-0.5" />
                    <p>+855 23 456 789</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-orange-700 pt-6 text-center">
              <p className="text-sm text-orange-300">
                © {new Date().getFullYear()} SangKumFund. All rights reserved.
              </p>
              <p className="text-xs text-orange-400 mt-2 flex items-center justify-center gap-2">
                Made with <Heart className="w-3 h-3" /> for Cambodia
              </p>
            </div>
          </div>
        </footer>
      </div>
  );
}