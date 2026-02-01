import Layout from '@/components/Layout';
import { BookOpen, CheckCircle, UserPlus, Heart, Target, Shield, Bell, CreditCard, BarChart3, HelpCircle } from 'lucide-react';

export default function Guide() {
  const sections = [
    {
      icon: UserPlus,
      title: 'Getting Started',
      color: 'from-blue-500 to-blue-600',
      steps: [
        { title: 'Create an Account', description: 'Sign up with your email or use Google OAuth for quick registration.' },
        { title: 'Complete Your Profile', description: 'Add your personal information, profile picture, and contact details.' },
        { title: 'Verify Your Email', description: 'Check your inbox and verify your email address to unlock all features.' },
        { title: 'Explore Campaigns', description: 'Browse through various causes and find campaigns that resonate with you.' },
      ]
    },
    {
      icon: Heart,
      title: 'Making a Donation',
      color: 'from-orange-500 to-amber-500',
      steps: [
        { title: 'Find a Campaign', description: 'Search or browse campaigns by category, urgency, or location on the map.' },
        { title: 'Review Details', description: 'Read the campaign story, goals, and see how funds will be used.' },
        { title: 'Choose Amount', description: 'Select a donation amount or enter a custom amount that fits your budget.' },
        { title: 'Secure Payment', description: 'Complete your donation using our secure payment gateway.' },
        { title: 'Get Receipt', description: 'Receive an instant receipt via email and track your donation impact.' },
      ]
    },
    {
      icon: Target,
      title: 'Starting a Campaign',
      color: 'from-green-500 to-emerald-600',
      steps: [
        { title: 'Click "Create Event"', description: 'Navigate to your dashboard and click the create new event button.' },
        { title: 'Fill Campaign Details', description: 'Add title, description, category, target amount, and deadline.' },
        { title: 'Upload Images', description: 'Add compelling images that tell your story (up to 5 images).' },
        { title: 'Set Location', description: 'Use the map picker to set your campaign location for better visibility.' },
        { title: 'Submit for Review', description: 'Submit your campaign for admin verification to ensure authenticity.' },
        { title: 'Go Live', description: 'Once approved, your campaign goes live and starts receiving donations.' },
      ]
    },
    {
      icon: Shield,
      title: 'Trust & Safety',
      color: 'from-purple-500 to-purple-600',
      steps: [
        { title: 'Verification Process', description: 'All campaigns undergo thorough verification by our admin team.' },
        { title: 'Secure Payments', description: 'We use industry-standard encryption to protect your financial data.' },
        { title: 'Transparent Tracking', description: 'Track every donation and see real-time progress on campaigns.' },
        { title: 'Report System', description: 'Report suspicious campaigns or activities for immediate review.' },
      ]
    },
    {
      icon: BarChart3,
      title: 'Dashboard Features',
      color: 'from-pink-500 to-rose-600',
      steps: [
        { title: 'Donation History', description: 'View all your past donations with receipts and tax information.' },
        { title: 'Campaign Management', description: 'Manage your campaigns, update information, and respond to donors.' },
        { title: 'Analytics', description: 'Track campaign performance with detailed charts and statistics.' },
        { title: 'Notifications', description: 'Stay updated with real-time notifications about your campaigns and donations.' },
      ]
    },
    {
      icon: CreditCard,
      title: 'Payment & Withdrawals',
      color: 'from-indigo-500 to-indigo-600',
      steps: [
        { title: 'Multiple Payment Methods', description: 'Accept credit cards, debit cards, and digital wallets.' },
        { title: 'Withdrawal Requests', description: 'Campaign creators can request withdrawals once goals are met.' },
        { title: 'Processing Time', description: 'Withdrawals are typically processed within 3-5 business days.' },
        { title: 'Transaction Fees', description: 'Transparent fee structure with no hidden charges.' },
      ]
    },
  ];

  const faqs = [
    { question: 'How long does verification take?', answer: 'Campaign verification typically takes 24-48 hours. Our team reviews each campaign to ensure authenticity and compliance.' },
    { question: 'Can I edit my campaign after submission?', answer: 'Yes, you can edit campaign details, update images, and modify the description even after it goes live.' },
    { question: 'What happens if I don\'t reach my goal?', answer: 'You still receive all donations collected. There\'s no all-or-nothing requirement on our platform.' },
    { question: 'How do I get help?', answer: 'Visit our Help Center, contact support via the contact page, or reach out through live chat during business hours.' },
  ];

  return (
          <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 mb-6">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-4">
              Platform Guide
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to know about using SangKumFund - from creating your first campaign to making a difference in your community.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            {[
              { label: 'Step-by-Step Guides', value: '6', icon: Target },
              { label: 'Common Questions', value: '50+', icon: HelpCircle },
              { label: 'Video Tutorials', value: '12', icon: BookOpen },
              { label: 'Average Response Time', value: '2hrs', icon: Bell },
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-orange-500" />
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Guide Sections */}
          <div className="space-y-12">
            {sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className={`bg-gradient-to-r ${section.color} p-6`}>
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                      <section.icon className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">{section.title}</h2>
                  </div>
                </div>
                <div className="p-8">
                  <div className="space-y-6">
                    {section.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex gap-4 group hover:bg-gray-50 p-4 rounded-xl transition-colors">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 text-orange-600 font-bold border-2 border-orange-200 group-hover:scale-110 transition-transform">
                            {stepIndex + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            {step.title}
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          </h3>
                          <p className="text-gray-600 leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-gray-600">Quick answers to common questions</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl shadow-2xl p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Still Have Questions?</h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Our support team is here to help you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/help-center"
                className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                <HelpCircle className="w-5 h-5" />
                Visit Help Center
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-orange-700 text-white hover:bg-orange-800 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                <Bell className="w-5 h-5" />
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
  );
}
