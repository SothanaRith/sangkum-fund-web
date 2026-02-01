import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { ArrowLeft, ArrowRight, Lightbulb, Heart, Target, Users, Sparkles } from 'lucide-react';
import Link from 'next/link';

const tipsData = {
  '1': {
    title: 'Tips #1: Smart Donating Basics',
    subtitle: 'Make confident donations with clarity and impact.',
    accent: 'from-orange-500 to-amber-500',
    icon: Heart,
    sections: [
      {
        title: 'Verify the Campaign',
        items: [
          'Look for the verified badge and admin approval.',
          'Check campaign updates and engagement from the creator.',
          'Review how funds will be used before donating.',
        ],
      },
      {
        title: 'Donate with Confidence',
        items: [
          'Start with a comfortable amount—every contribution helps.',
          'Save receipts for your records and future reference.',
          'Enable notifications to track campaign milestones.',
        ],
      },
      {
        title: 'Help Beyond the Donation',
        items: [
          'Share the campaign to increase visibility.',
          'Leave supportive comments and questions when needed.',
          'Encourage friends and family to join you.',
        ],
      },
    ],
  },
  '2': {
    title: 'Tips #2: Creating a Successful Campaign',
    subtitle: 'Tell a compelling story and reach your goals faster.',
    accent: 'from-green-500 to-emerald-600',
    icon: Target,
    sections: [
      {
        title: 'Build a Clear Story',
        items: [
          'Explain who you are and why this cause matters.',
          'Be specific about how the funds will be used.',
          'Use a warm, human tone that connects emotionally.',
        ],
      },
      {
        title: 'Visuals Matter',
        items: [
          'Use high-quality images that show real impact.',
          'Add multiple photos for trust and transparency.',
          'Keep the cover image clean and focused.',
        ],
      },
      {
        title: 'Engage Your Community',
        items: [
          'Share your campaign regularly across social channels.',
          'Post updates at least once a week.',
          'Thank donors publicly to build trust and momentum.',
        ],
      },
    ],
  },
  '3': {
    title: 'Tips #3: Growing Your Reach',
    subtitle: 'Use smart tactics to expand visibility and support.',
    accent: 'from-blue-500 to-indigo-600',
    icon: Users,
    sections: [
      {
        title: 'Leverage Networks',
        items: [
          'Start with close friends for early traction.',
          'Ask supporters to share in their own words.',
          'Collaborate with local groups or communities.',
        ],
      },
      {
        title: 'Create Momentum',
        items: [
          'Set mini-goals and celebrate milestones.',
          'Use progress updates to encourage repeat shares.',
          'Highlight impact stories or beneficiary quotes.',
        ],
      },
      {
        title: 'Optimize Timing',
        items: [
          'Post updates during peak social hours.',
          'Align with events or relevant awareness days.',
          'Keep your campaign active with fresh content.',
        ],
      },
    ],
  },
};

export default function TipsDetail() {
  const router = useRouter();
  const { id } = router.query;
  const tip = tipsData[id];

  if (!tip) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-white py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 mb-6">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tips not found</h1>
            <p className="text-gray-600 mb-6">Please choose one of the available tips pages.</p>
            <Link
              href="/tips"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-amber-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Tips
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const Icon = tip.icon || Lightbulb;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-white py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/tips"
              className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Tips
            </Link>
            <div className="flex items-center gap-3">
              {id !== '1' && (
                <Link
                  href={`/tips/${Number(id) - 1}`}
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-white border border-gray-200 hover:border-orange-300 hover:text-orange-600"
                >
                  Previous
                </Link>
              )}
              {id !== '3' && (
                <Link
                  href={`/tips/${Number(id) + 1}`}
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-white border border-gray-200 hover:border-orange-300 hover:text-orange-600"
                >
                  Next
                </Link>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className={`bg-gradient-to-r ${tip.accent} p-8 text-white`}>
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur rounded-2xl p-3">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold">{tip.title}</h1>
                  <p className="text-white/90 mt-1">{tip.subtitle}</p>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {tip.sections.map((section, index) => (
                <div key={index} className="bg-orange-50/50 border border-orange-100 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-orange-600" />
                    <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                  </div>
                  <ul className="space-y-2">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700">
                        <span className="mt-1 w-2 h-2 rounded-full bg-orange-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/tips"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-200 hover:border-orange-300 hover:text-orange-600 font-semibold"
            >
              <Lightbulb className="w-4 h-4" />
              View All Tips
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold hover:from-orange-700 hover:to-amber-700"
            >
              Explore Campaigns
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
