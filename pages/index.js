import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/LanguageContext';
import { Hospital, AlertCircle, Briefcase, Bird, GraduationCap, HandshakeIcon, Rocket, Megaphone, RefreshCw, BarChart3, Smartphone, DollarSign, Sparkles, Zap, Banknote, Shield, Users, Heart, Building2, Star, Play, Smile, Loader2, Calendar, User, Tag, ChevronRight, Quote, ArrowUpRight, CheckCircle2, Globe2, PhoneCall, Mail } from 'lucide-react';
import { postsAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default function Home() {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  const tr = (en, km) => (language === 'km' ? km : en);

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

  const successStories = [
    {
      title: 'Community Health Drive',
      category: 'Medical Relief',
      amount: '$82,400 raised',
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
    },
    {
      title: 'School Library Rebuild',
      category: 'Education',
      amount: '$46,200 raised',
      image: 'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80'
    },
    {
      title: 'Local Flood Relief',
      category: 'Disaster Response',
      amount: '$103,000 raised',
      image: 'https://images.unsplash.com/photo-1509099836639-18ba02e2e1ba?auto=format&fit=crop&w=1200&q=80'
    }
  ];

  const testimonials = [
    {
      name: 'Sophea K.',
      role: 'Campaign Organizer',
      quote: 'We reached our goal in days. The donor updates and withdrawals were seamless.',
      avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Daniel R.',
      role: 'Repeat Donor',
      quote: 'I trust the verification badges and love how transparent every fundraiser is.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Chanthou M.',
      role: 'Community Volunteer',
      quote: 'The map view and local causes make it easy to help neighbors first.',
      avatar: 'https://images.unsplash.com/photo-1504595403659-9088ce801e29?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const faqs = [
    {
      question: 'How fast can I withdraw funds?',
      answer: 'Most withdrawals arrive in 2-3 business days once your identity and destination are verified.'
    },
    {
      question: 'Do donors pay extra fees?',
      answer: 'No hidden fees. Donors can optionally add a small tip to keep the platform running.'
    },
    {
      question: 'Can I fundraise from overseas?',
      answer: 'Yes. International card donations are supported, and payouts go to your verified local account.'
    }
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
                  {tr('When you need help,', 'នៅពេលអ្នកត្រូវការជំនួយ,')}<br />
                  <span className="text-orange-600">{tr("we're here", 'យើងនៅទីនេះ')}</span>
                </motion.h1>

                {/* Subheading */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
                >
                  {tr("Join millions who've raised over $20 billion for medical bills, emergencies, dreams, and everything in between.", 'ចូលរួមជាមួយអ្នករាប់លាននាក់ដែលបាន筹 $20 ពាន់លាន ដើម្បីថ្លៃពេទ្យ ការបន្ទាន់ សុបិន និងគ្រប់យ៉ាងចន្លោះមក។')}
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
                    <span>{tr('Start your fundraiser', 'ចាប់ផ្តើមយុទ្ធនាការរបស់អ្នក')}</span>
                  </Link>
                </motion.div>

                {/* Reassurance Text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-sm text-gray-500 mt-6"
                >
                  {tr('Free to start • No obligation • Secure platform', 'ចាប់ផ្តើមឥតគិតថ្លៃ • គ្មានការបង្ខិតបង្ខំ • វេទិកាសុវត្ថិភាព')}
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
              {tr('Fundraising on SangkumFund is easy, powerful, and trusted', 'ការប្រមូលថវិកាលើ SangkumFund គឺស្រួល មានប្រសិទ្ធភាព និងទុកចិត្តបាន')}
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
                  { number: '1', title: tr('Set your starting goal', 'កំណត់គោលដៅចាប់ផ្តើម'), desc: tr('Tell your story and set a realistic fundraising goal', 'ប្រាប់រឿងរបស់អ្នក ហើយកំណត់គោលដៅប្រមូលថវិកាដែលមានភាពពិតប្រាកដ') },
                  { number: '2', title: tr('Reach donors by sharing', 'ឈានដល់អ្នកបរិច្ចាគតាមការចែករំលែក'), desc: tr('Share your fundraiser with friends, family, and social networks', 'ចែករំលែកយុទ្ធនាការរបស់អ្នកជាមួយមិត្តភក្ដិ គ្រួសារ និងបណ្ដាញសង្គម') },
                  { number: '3', title: tr('Securely receive funds', 'ទទួលប្រាក់ដោយសុវត្ថិភាព'), desc: tr('Withdraw funds directly to your bank account as donations come in', 'ដកប្រាក់ដោយផ្ទាល់ទៅគណនីធនាគាររបស់អ្នកពេលមានការបរិច្ចាគ') },
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
              {tr('Featured topics', 'ប្រធានបទពិសេស')}
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
                {tr('More than', 'លើសពី')} {formatCurrency(50000000)} {tr('raised every week', 'ត្រូវបានប្រមូលប្រាក់រៀងរាល់សប្តាហ៍')}
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {tr('Get started in minutes, receive donations quickly, and withdraw funds easily.', 'ចាប់ផ្តើមក្នុងពេលប៉ុន្មាននាទី ទទួលបានការបរិច្ចាគរហ័ស និងដកប្រាក់បានងាយស្រួល។')}
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

        {/* Impact Snapshots */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-orange-500 font-semibold mb-3">{tr('Real impact', 'ផលប៉ះពាល់ពិតប្រាកដ')}</p>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{tr('Stories fueled by the crowd', 'រឿងរ៉ាវដែលបានគាំទ្រដោយសហគមន៍')}</h2>
                <p className="text-gray-600 max-w-2xl mt-3">{tr('Every contribution moves a story forward. See how organizers turned urgent needs into funded realities.', 'ការរួមចំណែករាល់មួយ បង្កើនរឿងរ៉ាវទៅមុខ។ មើលថាតើអ្នករៀបចំបានបម្លែងតម្រូវការបន្ទាន់ទៅជាការគាំទ្រប្រាក់ដូចម្តេច។')}</p>
              </div>
              <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-orange-200 text-orange-700 hover:bg-orange-50 transition-all"
              >
                {tr('Explore community stories', 'ស្វែងយល់ពីរឿងសហគមន៍')}
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {successStories.map((story) => (
                  <div key={story.title} className="group relative overflow-hidden rounded-3xl shadow-lg bg-gray-900">
                    <img
                        src={story.image}
                        alt={story.title}
                        className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white flex flex-col gap-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm font-medium">{story.category}</span>
                      </div>
                      <h3 className="text-xl font-bold leading-snug">{story.title}</h3>
                      <p className="text-orange-200 font-semibold">{story.amount}</p>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Illustration */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
              {tr('How SangkumFund works', 'របៀបដែល SangkumFund ដំណើរការ')}
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
                <div className="text-sm text-gray-600 mt-4">{tr('Watch video explainer', 'មើលវីដេអូពន្យល់')}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Safety Section */}
        <section className="py-20 px-4 bg-orange-900">
          <div className="max-w-5xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              {tr("We've got you covered.", 'យើងគាំទ្រអ្នក។')}
            </h2>

            <p className="text-xl text-orange-100 mb-12 max-w-2xl mx-auto">
              {tr('With SangkumFund, you can fundraise with confidence. Our dedicated Trust & Safety team, simple pricing, and secure platform give you peace of mind.', 'ជាមួយ SangkumFund អ្នកអាចប្រមូលថវិកាដោយទំនុកចិត្ត។ ក្រុម Trust & Safety របស់យើង តម្លៃសាមញ្ញ និងវេទិកាសុវត្ថិភាព នឹងផ្តល់សេចក្តីស្ងប់ចិត្ត។')}
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
              {tr('Top crowdfunding tips', 'គន្លឹះប្រមូលថវិកាដ៏ល្អបំផុត')}
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

        {/* Voices from the community */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-sm uppercase tracking-[0.25em] text-orange-500 font-semibold mb-3">{tr('Testimonials', 'មតិយោបល់')}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{tr('What our donors and organizers say', 'អ្វីដែលអ្នកបរិច្ចាគ និងអ្នករៀបចំបាននិយាយ')}</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">{tr('Built for trust, speed, and clarity—so every fundraiser can focus on impact, not paperwork.', 'បង្កើតឡើងសម្រាប់ការទុកចិត្ត ល្បឿន និងភាពច្បាស់លាស់—ដូច្នេះអ្នករៀបចំអាចផ្តោតលើផលប៉ះពាល់ មិនមែនលើការងារឯកសារ')}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((person) => (
                  <div key={person.name} className="relative bg-white rounded-3xl shadow-lg border border-gray-100 p-6 flex flex-col gap-4 hover:shadow-xl transition-shadow">
                    <Quote className="w-8 h-8 text-orange-500" />
                    <p className="text-gray-700 leading-relaxed">“{person.quote}”</p>
                    <div className="flex items-center gap-3 mt-auto">
                      <img src={person.avatar} alt={person.name} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <div className="font-semibold text-gray-900">{person.name}</div>
                        <div className="text-sm text-gray-500">{person.role}</div>
                      </div>
                    </div>
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
                {tr('Fundraise with confidence', 'ប្រមូលថវិកាដោយទំនុកចិត្ត')}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {tr('Everything you need to feel secure and supported', 'គ្រប់យ៉ាងដែលអ្នកត្រូវការដើម្បីមានសុវត្ថិភាព និងទទួលការគាំទ្រ')}
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

        {/* FAQs & Support */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 items-start">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-orange-500 font-semibold mb-3">{tr('We’re here', 'យើងនៅទីនេះ')}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{tr('Questions, answered fast', 'សំណួរទទួលបានចម្លើយរហ័ស')}</h2>
              <p className="text-gray-600 mb-6">{tr('From onboarding to payouts, our support team and help center keep you moving without friction.', 'ចាប់ពីការចុះឈ្មោះដល់ការទូទាត់ ក្រុមគាំទ្រ និងមជ្ឈមណ្ឌលជំនួយរបស់យើង រក្សាឱ្យអ្នកដំណើរការដោយគ្មានឧបសគ្គ។')}</p>
              <div className="space-y-3">
                <Link href="/help-center" className="inline-flex items-center gap-2 text-orange-600 font-semibold">
                  {tr('Visit help center', 'ចូលទស្សនាមជ្ឈមណ្ឌលជំនួយ')}
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <div className="flex items-center gap-3 text-gray-700">
                  <PhoneCall className="w-4 h-4 text-orange-600" />
                  <span>24/7 hotline: +855 92 000 000</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="w-4 h-4 text-orange-600" />
                  <span>support@sangkumfund.com</span>
                </div>
              </div>
            </div>
            <div className="md:col-span-2 space-y-4">
              {faqs.map((item) => (
                  <div key={item.question} className="border border-gray-200 rounded-2xl p-4 hover:border-orange-200 transition-colors bg-white shadow-sm">
                    <div className="flex items-start gap-3">
                      <Globe2 className="w-5 h-5 text-orange-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.question}</h3>
                        <p className="text-gray-600 mt-1">{item.answer}</p>
                      </div>
                    </div>
                  </div>
              ))}
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
                      {tr('Inspiring Stories from Our Community', 'រឿងរ៉ាវលើកទឹកចិត្តពីសហគមន៍របស់យើង')}
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                      {tr('Read how individuals and communities are making a difference', 'អានពីរបៀបដែលបុគ្គល និងសហគមន៍កំពុងបង្កើតភាពខុសគ្នា')}
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
                    {tr('Read All Stories', 'អានរឿងទាំងអស់')}
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
                {tr('Your story matters', 'រឿងរបស់អ្នកសំខាន់')}
              </h2>
              <p className="text-xl text-orange-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                {tr('Whether it\'s a medical need, a dream project, or helping someone you love—your community is ready to support you.', 'មិនថាជាការទាមទារពេទ្យ គម្រោងសុបិន ឬជួយមនុស្សដែលអ្នកស្រឡាញ់—សហគមន៍របស់អ្នកត្រៀមខ្លួនរួចរាល់ដើម្បីគាំទ្រអ្នក។')}
              </p>

              <div className="space-y-6">
                <Link
                    href="/events"
                    className="inline-block w-full sm:w-auto bg-white text-orange-700 hover:bg-gray-50 px-10 py-5 rounded-2xl text-lg font-semibold transition-all shadow-2xl hover:shadow-3xl hover:scale-[1.02] active:scale-[0.98]"
                >
                  {tr('Start your fundraiser — it\'s free', 'ចាប់ផ្តើមយុទ្ធនាការរបស់អ្នក — ឥតគិតថ្លៃ')}
                </Link>

                <div className="text-orange-100/80 text-sm space-y-2">
                  <p>{tr('No setup fees • Secure platform • Withdraw anytime', 'គ្មានថ្លៃដើម • វេទិកាសុវត្ថិភាព • ដកប្រាក់បានគ្រប់ពេល')}</p>
                  <p className="text-orange-100/60">{tr('Over 2 million fundraisers started last year', 'ជាង 2 លានយុទ្ធនាការបានចាប់ផ្តើមនៅឆ្នាំមុន')}</p>
                </div>
              </div>

              {/* Gentle Closing */}
              <div className="mt-16 pt-8 border-t border-orange-500/30">
                <p className="text-orange-100/70">
                  {tr('Still wondering if this is right for you?', 'នៅតែសង្ស័យថាវាសមស្របសម្រាប់អ្នកទេ?')}
                </p>
                <Link
                    href="/guide"
                    className="inline-flex items-center text-orange-100 hover:text-white font-medium mt-4"
                >
                  {tr("Read our beginner's guide", 'អានមគ្គុទ្ទេសក៍សម្រាប់អ្នកដំបូង')} →
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
  );
}