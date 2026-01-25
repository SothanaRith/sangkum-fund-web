import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import { Hospital, AlertCircle, Briefcase, Bird, GraduationCap, HandshakeIcon, Rocket, Megaphone, RefreshCw, BarChart3, Smartphone, DollarSign, Sparkles, Zap, Banknote, Shield, Users, Heart, Building2, Star, Play, Smile, Loader2, Calendar, User, Tag, ChevronRight } from 'lucide-react';
import { postsAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function Home() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  const floatingItems = [
    {
      id: 1,
      label: 'Medical',
      Icon: Hospital,
      top: '16%',
      left: '20%',
    },
    {
      id: 2,
      label: 'Emergency',
      Icon: AlertCircle,
      top: '45%',
      left: '10%',
    },
    {
      id: 3,
      label: 'Business',
      Icon: Briefcase,
      top: '16%',
      right: '18%',
    },
    {
      id: 4,
      label: 'Memorial',
      Icon: Bird,
      top: '52%',
      right: '10%',
    },
    {
      id: 5,
      label: 'Education',
      Icon: GraduationCap,
      bottom: '14%',
      left: '22%',
    },
    {
      id: 6,
      label: 'Nonprofit',
      Icon: HandshakeIcon,
      bottom: '20%',
      right: '25%',
    },
  ];

  useEffect(() => {
    setMounted(true);
    loadFeaturedPosts();
  }, []);

  const loadFeaturedPosts = async () => {
    try {
      setLoadingPosts(true);
      const posts = await postsAPI.getFeatured(3);
      setFeaturedPosts(posts || []);
    } catch (err) {
      console.error('Failed to load featured posts:', err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const featuredTopics = [
    {
      title: "Year in Help 2024",
      description: "See how communities came together",
      image: "/api/placeholder/600/400",
      large: true
    },
    {
      title: "Giving Funds",
      description: "Recurring support for causes",
      image: "/api/placeholder/300/200"
    },
    {
      title: "Disaster Relief",
      description: "Emergency response worldwide",
      image: "/api/placeholder/300/200"
    },
    {
      title: "Local Heroes",
      description: "Supporting community leaders",
      image: "/api/placeholder/300/200"
    }
  ];

  const tips = [
    {
      title: "Start strong",
      description: "Set a clear goal and tell your story authentically",
      Icon: Rocket
    },
    {
      title: "Share widely",
      description: "Reach more people with our sharing tools",
      Icon: Megaphone
    },
    {
      title: "Update often",
      description: "Keep supporters engaged with regular updates",
      Icon: RefreshCw
    }
  ];

  const trustSignals = [
    { Icon: Shield, label: "Trust & Safety", description: "Verified campaigns, secure transfers" },
    { Icon: Banknote, label: "Lowest fees", description: "One simple fee, no hidden costs" },
    { Icon: Zap, label: "Fast access", description: "Withdraw funds in 2-3 business days" },
    { Icon: HandshakeIcon, label: "24/7 support", description: "Real help when you need it" }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
      <div className="min-h-screen bg-white">
        {/* Hero Section with Social Proof */}
        <section className="relative overflow-hidden pt-12 pb-28 px-4">

          {/* 🌿 BACKGROUND ANIMATION */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            {floatingItems.map((item, index) => (
                <motion.div
                    key={item.id}
                    className="
                      absolute
                      hidden md:flex
                      w-16 h-16 md:w-20 md:h-20
                      rounded-full
                      bg-gradient-to-br from-orange-100 to-orange-200
                      border-4 border-white
                      shadow-lg
                      items-center justify-center
                      opacity-60
                      md:opacity-80
                    "
                    style={{
                      top: item.top,
                      left: item.left,
                      right: item.right,
                      bottom: item.bottom,
                    }}
                    animate={{
                      y: [0, -14, 0],
                      rotate: [0, 4, 0],
                    }}
                    transition={{
                      duration: 6 + index,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                >
                  <item.Icon className="w-8 h-8" />

                  <div className="absolute -bottom-8 px-2 py-1 bg-white rounded-md shadow text-sm font-medium">
                    {item.label}
                  </div>
                </motion.div>
            ))}
          </div>

          <section className="pt-16 px-4 md:pt-24 md:pb-28 relative overflow-hidden bg-gradient-to-b from-white ">
            <div className="max-w-6xl mx-auto relative">
              <div className="text-center mb-12">
                {/* Trust Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-8"
                >
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">Most trusted crowdfunding platform</span>
                </motion.div>

                {/* Main Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight"
                >
                  When you need help,<br />
                  <span className="text-orange-600">we're here</span>
                </motion.h1>

                {/* Subheading */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
                >
                  Join millions who've raised over $20 billion for medical bills, emergencies, dreams, and everything in between.
                </motion.p>

                {/* Primary CTA */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                  <Link
                      href="/events"
                      className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>Start your fundraiser</span>
                  </Link>
                </motion.div>

                {/* Reassurance Text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-sm text-gray-500 mt-6"
                >
                  Free to start • No obligation • Secure platform
                </motion.p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/4 left-5 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-5 w-96 h-96 bg-amber-200/10 rounded-full blur-3xl"></div>
          </section>
        </section>

        {/* How Fundraising Works */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
              Fundraising on SangkumFund is easy, powerful, and trusted
            </h2>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Phone Mockup */}
              <div className="relative">
                <div className="relative w-80 mx-auto bg-gradient-to-b from-white to-gray-50 rounded-[40px] border-8 border-gray-900 shadow-2xl p-6">
                  <div className="flex justify-center mb-6">
                    <div className="w-32 h-6 bg-gray-900 rounded-full"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-orange-50 rounded-2xl p-4">
                      <div className="text-sm text-orange-700 mb-2">Your fundraiser</div>
                      <div className="text-2xl font-bold text-gray-900 mb-2">$8,450 raised</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-600 h-2 rounded-full" style={{ width: '67%' }}></div>
                      </div>
                      <div className="text-sm text-gray-600 mt-2">of $12,500 goal</div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-xl">👏</span>
                        </div>
                        <div>
                          <div className="font-semibold">New donation!</div>
                          <div className="text-sm text-gray-600">Sarah donated $50</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-8">
                {[
                  { number: '1', title: 'Set your starting goal', desc: 'Tell your story and set a realistic fundraising goal' },
                  { number: '2', title: 'Reach donors by sharing', desc: 'Share your fundraiser with friends, family, and social networks' },
                  { number: '3', title: 'Securely receive funds', desc: 'Withdraw funds directly to your bank account as donations come in' },
                ].map((step, index) => (
                    <div key={index} className="flex items-start gap-6 group cursor-pointer">
                      <div className="flex-shrink-0 w-14 h-14 bg-orange-100 group-hover:bg-orange-200 rounded-full flex items-center justify-center transition-colors">
                        <span className="text-2xl font-bold text-orange-700">{step.number}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-700 transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-gray-600">{step.desc}</p>
                      </div>
                    </div>
                ))}

                <Link
                    href="/how-it-works"
                    className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold mt-8"
                >
                  Learn more about how it works
                  <span className="ml-2">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Topics & Campaigns */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
              Featured topics
            </h2>

            <div className="grid lg:grid-cols-3 gap-8">
              {featuredTopics.map((topic, index) => (
                  <div
                      key={index}
                      className={`${
                          topic.large ? 'lg:col-span-2' : ''
                      } bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group cursor-pointer`}
                  >
                    <div className="relative h-64 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BarChart3 className="w-32 h-32 opacity-20" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6">
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {topic.title}
                        </h3>
                        <p className="text-orange-100">
                          {topic.description}
                        </p>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust & Speed Indicators */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                More than {formatCurrency(50000000)} raised every week
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Get started in minutes, receive donations quickly, and withdraw funds easily.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Start fundraising in minutes</h3>
                <p className="text-gray-600">Easy setup with guided steps</p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Banknote className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Donations made easy</h3>
                <p className="text-gray-600">Secure payments with multiple options</p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Built-in trust & safety</h3>
                <p className="text-gray-600">Verified campaigns and secure transfers</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Illustration */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
              How SangkumFund works
            </h2>

            <div className="relative bg-gradient-to-br from-orange-100 to-amber-100 rounded-3xl p-12">
              <div className="grid grid-cols-4 gap-8 mb-12">
                {[
                  { Icon: Users, label: 'Start' },
                  { Icon: Smartphone, label: 'Share' },
                  { Icon: Heart, label: 'Receive' },
                  { Icon: Building2, label: 'Withdraw' }
                ].map((step, index) => (
                    <div key={index} className="text-center">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <step.Icon className="w-10 h-10 text-orange-600" />
                      </div>
                      <div className="font-semibold">{step.label}</div>
                    </div>
                ))}
              </div>

              <div className="relative">
                <div className="w-24 h-24 bg-orange-600 rounded-full flex items-center justify-center mx-auto shadow-2xl cursor-pointer hover:scale-110 transition-transform">
                  <Play className="w-12 h-12 text-white fill-white" />
                </div>
                <div className="text-sm text-gray-600 mt-4">Watch video explainer</div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Safety Section */}
        <section className="py-20 px-4 bg-orange-900">
          <div className="max-w-5xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              We've got you covered.
            </h2>

            <p className="text-xl text-orange-100 mb-12 max-w-2xl mx-auto">
              With SangkumFund, you can fundraise with confidence. Our dedicated Trust & Safety team,
              simple pricing, and secure platform give you peace of mind.
            </p>

            <div className="grid md:grid-cols-3 gap-8 text-left mb-12">
              <div className="p-6 bg-orange-800/50 rounded-2xl backdrop-blur-sm">
                <DollarSign className="w-12 h-12 mb-4" />
                <h4 className="font-bold text-lg mb-3">Simple pricing</h4>
                <p className="text-orange-100">One low fee with no hidden charges</p>
              </div>
              <div className="p-6 bg-orange-800/50 rounded-2xl backdrop-blur-sm">
                <Shield className="w-12 h-12 mb-4" />
                <h4 className="font-bold text-lg mb-3">Trust & Safety team</h4>
                <p className="text-orange-100">24/7 monitoring and support</p>
              </div>
              <div className="p-6 bg-orange-800/50 rounded-2xl backdrop-blur-sm">
                <Smile className="w-12 h-12 mb-4" />
                <h4 className="font-bold text-lg mb-3">Peace of mind</h4>
                <p className="text-orange-100">Secure transfers and fraud protection</p>
              </div>
            </div>

            <Link
                href="/about-us"
                className="inline-flex items-center text-white hover:text-orange-100 font-semibold text-lg"
            >
              Learn about Trust & Safety
              <span className="ml-2">→</span>
            </Link>
          </div>
        </section>

        {/* Tips & Resources */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
              Top crowdfunding tips
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {tips.map((tip, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                    <tip.Icon className="w-16 h-16 text-orange-600 mb-6" />
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {tip.title}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {tip.description}
                    </p>
                    <Link
                        href={`/tips/${index + 1}`}
                        className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
                    >
                      Read more
                      <span className="ml-2">→</span>
                    </Link>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust & Safety - Reassurance */}
        <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Fundraise with confidence
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Everything you need to feel secure and supported
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trustSignals.map((signal) => (
                  <div
                      key={signal.label}
                      className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                  >
                    <signal.Icon className="w-12 h-12 text-orange-600 mb-4" />
                    <h3 className="font-bold text-gray-900 mb-2">{signal.label}</h3>
                    <p className="text-sm text-gray-600">{signal.description}</p>
                  </div>
              ))}
            </div>

            {/* Live Support Indicator */}
            <div className="mt-12 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8 text-center">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-gray-900">Live support available 24/7</span>
              </div>
              <p className="text-gray-600 mb-6">
                Real people are here to help with your fundraiser, day or night
              </p>
              <Link
                  href="/help-center"
                  className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
              >
                Meet our support team →
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Stories Section */}
        {featuredPosts.length > 0 && (
            <section className="py-20 px-4 bg-white">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                  <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      viewport={{ once: true }}
                  >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                      Inspiring Stories from Our Community
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                      Read how individuals and communities are making a difference
                    </p>
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {featuredPosts.map((post, index) => (
                      <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          viewport={{ once: true }}
                      >
                        <Link href={`/blog/${post.slug}`}>
                          <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer h-full border border-gray-100">
                            {/* Cover Image */}
                            <div className="relative h-40 bg-gradient-to-br from-orange-400 to-amber-500 overflow-hidden">
                              {post.coverImageUrl ? (
                                  <img
                                      src={post.coverImageUrl}
                                      alt={post.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                              ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-white/50 text-4xl">📰</span>
                                  </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="p-4">
                              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                                {post.title}
                              </h3>
                              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {post.excerpt || post.content?.substring(0, 100)}
                              </p>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(post.publishedAt || post.createdAt)}
                                </div>
                                {post.tags && post.tags.length > 0 && (
                                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                                      {post.tags[0]}
                                    </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                  ))}
                </div>

                <div className="text-center">
                  <Link
                      href="/blog"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg"
                  >
                    Read All Stories
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </section>
        )}

        {/* Final Invitation - Emotional Close */}
        <section className="py-20 px-4 bg-gradient-to-br from-orange-600 via-amber-600 to-orange-700">
          <div className="max-w-3xl mx-auto text-center text-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
              <Sparkles className="w-20 h-20 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Your story matters
              </h2>
              <p className="text-xl text-orange-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                Whether it's a medical need, a dream project, or helping someone you love—your community is ready to support you.
              </p>

              <div className="space-y-6">
                <Link
                    href="/events"
                    className="inline-block w-full sm:w-auto bg-white text-orange-700 hover:bg-gray-50 px-10 py-5 rounded-2xl text-lg font-semibold transition-all shadow-2xl hover:shadow-3xl hover:scale-[1.02] active:scale-[0.98]"
                >
                  Start your fundraiser — it's free
                </Link>

                <div className="text-orange-100/80 text-sm space-y-2">
                  <p>No setup fees • Secure platform • Withdraw anytime</p>
                  <p className="text-orange-100/60">Over 2 million fundraisers started last year</p>
                </div>
              </div>

              {/* Gentle Closing */}
              <div className="mt-16 pt-8 border-t border-orange-500/30">
                <p className="text-orange-100/70">
                  Still wondering if this is right for you?
                </p>
                <Link
                    href="/guide"
                    className="inline-flex items-center text-orange-100 hover:text-white font-medium mt-4"
                >
                  Read our beginner's guide →
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
  );
}