import Layout from '@/components/Layout';
import { Rocket, Users, Shield, TrendingUp, CheckCircle, ArrowRight, Search, Heart, FileCheck, CreditCard, Bell, BarChart3, Award, Zap, Lock, Globe } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: Search,
      title: 'Discover Campaigns',
      description: 'Browse through verified campaigns across various categories. Use our interactive map to find causes in your area or search by category and urgency.',
      features: ['Category filters', 'Map-based search', 'Verification badges', 'Real-time updates']
    },
    {
      number: '02',
      icon: Heart,
      title: 'Make a Donation',
      description: 'Choose a campaign that resonates with you. Select your donation amount and complete the secure payment process in just a few clicks.',
      features: ['Secure payments', 'Multiple payment methods', 'Instant receipts', 'Tax documentation']
    },
    {
      number: '03',
      icon: Bell,
      title: 'Track Impact',
      description: 'Stay updated on how your donation is making a difference. Receive notifications about campaign milestones and updates from creators.',
      features: ['Real-time notifications', 'Progress tracking', 'Campaign updates', 'Impact reports']
    },
    {
      number: '04',
      icon: Award,
      title: 'Build Trust',
      description: 'Our verification system ensures transparency and builds trust between donors and campaign creators through rigorous checks and balances.',
      features: ['Admin verification', 'Identity checks', 'Fund tracking', 'Donor protection']
    }
  ];

  const forDonors = [
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'Your donations are protected by bank-level encryption and secure payment gateways.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'Support causes worldwide or focus on local initiatives in your community.',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: BarChart3,
      title: 'Complete Transparency',
      description: 'See exactly where your money goes with detailed tracking and regular updates.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: CheckCircle,
      title: 'Verified Campaigns',
      description: 'Every campaign is reviewed and verified by our team before going live.',
      color: 'from-orange-500 to-amber-500'
    }
  ];

  const forCreators = [
    {
      icon: Rocket,
      title: 'Quick Setup',
      description: 'Create and launch your campaign in minutes with our intuitive campaign builder.',
      benefit: '5 min setup'
    },
    {
      icon: Users,
      title: 'Reach Donors',
      description: 'Access our community of generous donors who want to make a difference.',
      benefit: '10,000+ donors'
    },
    {
      icon: TrendingUp,
      title: 'Powerful Tools',
      description: 'Use analytics, updates, and promotional tools to maximize your campaign success.',
      benefit: 'Real-time analytics'
    },
    {
      icon: CreditCard,
      title: 'Easy Withdrawals',
      description: 'Receive funds quickly with our streamlined withdrawal process.',
      benefit: '3-5 days processing'
    }
  ];

  const platformFeatures = [
    { icon: Lock, title: 'Secure Platform', description: 'Military-grade encryption protects all transactions' },
    { icon: Zap, title: 'Instant Updates', description: 'Real-time notifications keep everyone informed' },
    { icon: FileCheck, title: 'Verification System', description: 'Multi-step verification ensures authenticity' },
    { icon: BarChart3, title: 'Analytics Dashboard', description: 'Track performance with detailed insights' },
    { icon: Bell, title: 'Smart Notifications', description: 'Stay updated without being overwhelmed' },
    { icon: Award, title: 'Achievement System', description: 'Earn badges and recognition for your impact' },
  ];

  return (
          <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-white">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-amber-600 text-white py-24">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              How SangKumFund Works
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto mb-8">
              A simple, transparent, and secure platform connecting generous donors with meaningful causes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/events"
                className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="/charities"
                className="inline-flex items-center justify-center gap-2 bg-orange-700 text-white hover:bg-orange-800 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Browse Campaigns
                <Search className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Steps Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">The Journey of a Donation</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From discovery to impact, here's how SangKumFund makes charitable giving simple and transparent
            </p>
          </div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center`}>
                <div className="flex-1 bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-6xl font-bold text-orange-200">{step.number}</span>
                    <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-4">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-lg text-gray-600 mb-6">{step.description}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {step.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-orange-200 to-amber-200 flex items-center justify-center">
                    <ArrowRight className={`w-12 h-12 text-orange-600 ${index % 2 === 0 ? '' : 'rotate-180'}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* For Donors Section */}
        <div className="bg-gradient-to-b from-white to-orange-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">For Donors</h2>
              <p className="text-xl text-gray-600">Why choose SangKumFund for your charitable giving</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {forDonors.map((item, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center mb-4`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* For Creators Section */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">For Campaign Creators</h2>
              <p className="text-xl text-gray-600">Everything you need to run a successful campaign</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {forCreators.map((item, index) => (
                <div key={index} className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-all hover:-translate-y-1">
                  <item.icon className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-orange-100 mb-4">{item.description}</p>
                  <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                    {item.benefit}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Platform Features */}
        <div className="bg-gradient-to-b from-white to-orange-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Platform Features</h2>
              <p className="text-xl text-gray-600">Built with cutting-edge technology for the best experience</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {platformFeatures.map((feature, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg p-3 flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl shadow-2xl p-12 text-center text-white">
              <h2 className="text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
              <p className="text-xl text-orange-100 mb-8">
                Join thousands of donors and creators making the world a better place
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/auth/register"
                  className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  <Heart className="w-5 h-5" />
                  Start Donating
                </a>
                <a
                  href="/events/create"
                  className="inline-flex items-center justify-center gap-2 bg-orange-700 text-white hover:bg-orange-800 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  <Rocket className="w-5 h-5" />
                  Create Campaign
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
