import Layout from '@/components/Layout';
import { Lightbulb, Heart, Target, TrendingUp, Users, Shield, Camera, MessageSquare, Clock, Award, Sparkles, CheckCircle, AlertTriangle, Star, Gift, Share2, Zap } from 'lucide-react';

export default function Tips() {
  const donorTips = [
    {
      icon: Heart,
      title: 'Research Before Donating',
      description: 'Take time to read the campaign story, check verification badges, and review the creator\'s profile before making a donation.',
      color: 'from-red-500 to-pink-600'
    },
    {
      icon: Shield,
      title: 'Verify Campaign Authenticity',
      description: 'Look for the verified badge and admin approval. Check if the campaign has updates and engagement from the creator.',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Gift,
      title: 'Start Small',
      description: 'Don\'t feel pressured to donate large amounts. Every contribution, no matter how small, makes a difference.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Clock,
      title: 'Monitor Progress',
      description: 'Follow campaigns you\'ve donated to. Enable notifications to stay updated on milestones and how your contribution is being used.',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: MessageSquare,
      title: 'Ask Questions',
      description: 'Don\'t hesitate to comment on campaigns if you need clarification. Engaged creators will respond to donor inquiries.',
      color: 'from-orange-500 to-amber-600'
    },
    {
      icon: Share2,
      title: 'Amplify Impact',
      description: 'Share campaigns you believe in on social media. Your network might help reach the campaign goal faster.',
      color: 'from-indigo-500 to-purple-600'
    },
  ];

  const creatorTips = [
    {
      icon: Camera,
      title: 'Use High-Quality Images',
      description: 'Upload clear, well-lit photos that tell your story. Include multiple images showing different aspects of your cause.',
      color: 'from-pink-500 to-rose-600',
      badge: 'Essential'
    },
    {
      icon: Target,
      title: 'Set Realistic Goals',
      description: 'Research similar campaigns and set achievable funding goals. Break down exactly how funds will be used.',
      color: 'from-blue-500 to-blue-600',
      badge: 'Important'
    },
    {
      icon: MessageSquare,
      title: 'Tell Your Story',
      description: 'Write a compelling, honest narrative. Explain why this cause matters and how donations will make a difference.',
      color: 'from-purple-500 to-violet-600',
      badge: 'Essential'
    },
    {
      icon: Users,
      title: 'Engage Your Community',
      description: 'Share your campaign with friends, family, and social networks. Personal connections are your strongest supporters.',
      color: 'from-green-500 to-teal-600',
      badge: 'Key'
    },
    {
      icon: TrendingUp,
      title: 'Post Regular Updates',
      description: 'Keep donors informed with progress updates, milestones reached, and how their contributions are being used.',
      color: 'from-orange-500 to-amber-600',
      badge: 'Essential'
    },
    {
      icon: Clock,
      title: 'Set a Reasonable Timeline',
      description: 'Choose an end date that creates urgency but gives enough time to reach your goal. 30-60 days works well for most campaigns.',
      color: 'from-red-500 to-pink-600',
      badge: 'Important'
    },
    {
      icon: Award,
      title: 'Thank Your Donors',
      description: 'Acknowledge every donation, no matter the size. Gratitude goes a long way in building lasting supporter relationships.',
      color: 'from-yellow-500 to-orange-600',
      badge: 'Essential'
    },
    {
      icon: Sparkles,
      title: 'Create Early Momentum',
      description: 'Reach out to close contacts first to build initial momentum. Campaigns with early donations attract more supporters.',
      color: 'from-cyan-500 to-blue-600',
      badge: 'Pro Tip'
    },
  ];

  const quickTips = [
    { icon: Zap, text: 'Campaigns with videos get 114% more donations', color: 'text-orange-600' },
    { icon: Star, text: 'Personal stories resonate 3x more than general appeals', color: 'text-purple-600' },
    { icon: Users, text: 'Campaigns shared 5+ times reach goals 40% faster', color: 'text-blue-600' },
    { icon: CheckCircle, text: 'Regular updates increase donor retention by 60%', color: 'text-green-600' },
    { icon: Heart, text: 'Thank you messages boost repeat donations by 45%', color: 'text-pink-600' },
    { icon: Camera, text: '5+ images increase campaign views by 80%', color: 'text-indigo-600' },
  ];

  const commonMistakes = [
    {
      icon: AlertTriangle,
      title: 'Vague Campaign Details',
      mistake: 'Not explaining exactly how funds will be used',
      solution: 'Create a detailed breakdown of expenses and goals'
    },
    {
      icon: AlertTriangle,
      title: 'No Updates After Launch',
      mistake: 'Creating a campaign and forgetting about it',
      solution: 'Post updates weekly, even if just to say "still working on it"'
    },
    {
      icon: AlertTriangle,
      title: 'Unrealistic Goals',
      mistake: 'Setting extremely high funding targets without justification',
      solution: 'Research similar campaigns and set achievable, justified goals'
    },
    {
      icon: AlertTriangle,
      title: 'Poor Image Quality',
      mistake: 'Using blurry, dark, or irrelevant photos',
      solution: 'Use high-resolution, well-lit images that showcase your cause'
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 mb-6">
              <Lightbulb className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-4">
              Tips & Best Practices
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert advice to maximize your impact - whether you're donating to causes or creating campaigns
            </p>
          </div>

          {/* Quick Tips Stats */}
          <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl shadow-2xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-8">📊 Platform Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickTips.map((tip, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-start gap-4">
                    <div className="bg-white/20 rounded-lg p-3 flex-shrink-0">
                      <tip.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-white font-semibold leading-relaxed">{tip.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* For Donors Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
                <Heart className="w-10 h-10 text-red-500" />
                Tips for Donors
              </h2>
              <p className="text-xl text-gray-600">Make informed decisions and maximize your charitable impact</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donorTips.map((tip, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${tip.color} flex items-center justify-center mb-4`}>
                    <tip.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{tip.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{tip.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* For Campaign Creators Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
                <Target className="w-10 h-10 text-orange-500" />
                Tips for Campaign Creators
              </h2>
              <p className="text-xl text-gray-600">Launch and manage successful fundraising campaigns</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {creatorTips.map((tip, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${tip.color} flex items-center justify-center flex-shrink-0`}>
                      <tip.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{tip.title}</h3>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          tip.badge === 'Essential' ? 'bg-red-100 text-red-700' :
                          tip.badge === 'Important' ? 'bg-orange-100 text-orange-700' :
                          tip.badge === 'Pro Tip' ? 'bg-purple-100 text-purple-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {tip.badge}
                        </span>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{tip.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Common Mistakes to Avoid */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
                <AlertTriangle className="w-10 h-10 text-yellow-500" />
                Common Mistakes to Avoid
              </h2>
              <p className="text-xl text-gray-600">Learn from others and set yourself up for success</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {commonMistakes.map((item, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500">
                  <div className="flex items-start gap-4">
                    <div className="bg-red-100 rounded-xl p-3 flex-shrink-0">
                      <item.icon className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="text-red-600 font-semibold text-sm">❌ Mistake:</span>
                          <p className="text-gray-600 text-sm">{item.mistake}</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-green-600 font-semibold text-sm">✅ Solution:</span>
                          <p className="text-gray-600 text-sm">{item.solution}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Tips Section */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 md:p-12 border border-purple-200">
            <div className="text-center mb-8">
              <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Pro Tips for Maximum Success</h2>
              <p className="text-gray-600">Advanced strategies used by top performers</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="font-bold text-lg text-purple-900 mb-2">🎯 Create Urgency</h3>
                <p className="text-gray-600">Use limited-time matching donations or milestone rewards to encourage immediate action.</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="font-bold text-lg text-purple-900 mb-2">📱 Mobile-First Approach</h3>
                <p className="text-gray-600">70% of donors use mobile. Ensure your story is easy to read on small screens.</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="font-bold text-lg text-purple-900 mb-2">🤝 Partner with Influencers</h3>
                <p className="text-gray-600">Reach out to micro-influencers in your niche for authentic campaign promotion.</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="font-bold text-lg text-purple-900 mb-2">📈 Leverage Analytics</h3>
                <p className="text-gray-600">Track which traffic sources bring donors and focus your efforts there.</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl shadow-2xl p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">Ready to Put These Tips into Action?</h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Start your campaign or find causes to support today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/events/create"
                className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                <Target className="w-5 h-5" />
                Start a Campaign
              </a>
              <a
                href="/events"
                className="inline-flex items-center justify-center gap-2 bg-orange-700 text-white hover:bg-orange-800 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                <Heart className="w-5 h-5" />
                Browse Campaigns
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
