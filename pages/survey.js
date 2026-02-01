import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { surveyAPI } from '@/lib/api';

const INTEREST_OPTIONS = [
  'Disaster Relief',
  'Education',
  'Healthcare',
  'Community Development',
  'Environment',
  'Animal Welfare',
  'Arts & Culture',
  'Technology for Good',
];

export default function Survey() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 2;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    role: '',
    primaryGoal: '',
    hearAbout: '',
    interests: [],
    nonprofit: false,
    organizationName: '',
    newsletterOptIn: true,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.replace('/auth/login');
      return;
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const toggleInterest = (interest) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((item) => item !== interest)
          : [...prev.interests, interest],
      };
    });
  };

  const handleNext = () => {
    setError('');
    if (!formData.role || !formData.primaryGoal) {
      setError('Please answer the required questions.');
      return;
    }
    setStep(2);
  };

  const handleBack = () => {
    setError('');
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.role || !formData.primaryGoal) {
      setError('Please answer the required questions.');
      return;
    }

    setLoading(true);
    try {
      await surveyAPI.submit(formData);
      setSuccess('Thanks for sharing! Your responses were saved.');
      setTimeout(() => {
        const redirectPath = router.query.redirect || '/';
        router.push(redirectPath);
      }, 800);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit survey. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-[360px_1fr]">
        <aside className="hidden lg:flex flex-col justify-between bg-orange-50 border-r border-orange-100 p-10">
          <div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <div className="mt-10">
              <div className="text-sm text-gray-500">{step} of {totalSteps}</div>
              <h1 className="mt-4 text-3xl font-semibold text-gray-900">
                {step === 1 ? "Let's begin your fundraising journey" : 'Pick up to 3 causes you support'}
              </h1>
              <p className="mt-4 text-gray-600">
                {step === 1
                  ? "We're here to guide you every step of the way."
                  : 'Showcase the causes you care about on your profile.'}
              </p>
            </div>
          </div>
          <div className="text-xs text-gray-400">SangKumFund</div>
        </aside>

        <main className="flex flex-col">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <div className="lg:hidden flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-sm text-gray-600">{step} of {totalSteps}</span>
            </div>
            <button
              type="button"
              onClick={() => router.push('/auth/login')}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Sign in
            </button>
          </div>

          <div className="flex-1 px-6 py-10 sm:px-10">
            {error && (
              <div className="mb-6 rounded-xl bg-red-50 p-4 border border-red-200">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">⚠️</span>
                  <div className="text-sm text-red-800 font-medium">{error}</div>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-6 rounded-xl bg-green-50 p-4 border border-green-200">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">✅</span>
                  <div className="text-sm text-green-800 font-medium">{success}</div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="max-w-2xl">
                <h2 className="text-lg font-semibold text-gray-900">Tell us who you're fundraising for</h2>
                <p className="mt-2 text-sm text-gray-500">This helps us tailor your setup.</p>

                <div className="mt-6 space-y-4">
                  {[
                    { value: 'Donor', title: 'Yourself', description: 'Funds are delivered to your account for your own use.' },
                    { value: 'Organizer', title: 'Someone else', description: 'Invite a beneficiary or distribute funds yourself.' },
                    { value: 'Nonprofit', title: 'Charity', description: 'Funds are delivered to your chosen nonprofit.' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, role: option.value }))}
                      className={`w-full text-left border rounded-2xl p-4 transition-all ${
                        formData.role === option.value
                          ? 'border-orange-400 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{option.title}</div>
                      <div className="text-sm text-gray-500 mt-1">{option.description}</div>
                    </button>
                  ))}
                </div>

                <div className="mt-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    🎯 What is your primary goal? <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="primaryGoal"
                    value={formData.primaryGoal}
                    onChange={handleChange}
                    placeholder="E.g., start a fundraiser, donate, volunteer"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    required
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">📣 How did you hear about us?</label>
                  <input
                    type="text"
                    name="hearAbout"
                    value={formData.hearAbout}
                    onChange={handleChange}
                    placeholder="Friends, social media, search, etc."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="max-w-3xl">
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-gray-900">Pick up to 3 causes you support</h2>
                  <p className="mt-2 text-sm text-gray-500">Showcase on your profile</p>
                </div>

                <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {INTEREST_OPTIONS.map((interest) => {
                    const selected = formData.interests.includes(interest);
                    return (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => {
                          if (!selected && formData.interests.length >= 3) return;
                          toggleInterest(interest);
                        }}
                        className={`rounded-2xl border px-4 py-3 text-sm font-medium transition-all ${
                          selected
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-gray-200 text-gray-600 hover:border-orange-300'
                        } ${!selected && formData.interests.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 space-y-4 max-w-xl mx-auto">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="nonprofit"
                      name="nonprofit"
                      checked={formData.nonprofit}
                      onChange={handleChange}
                      className="h-5 w-5 text-orange-600 rounded border-gray-300 focus:ring-orange-500 focus:ring-2 mt-1"
                    />
                    <label htmlFor="nonprofit" className="text-sm text-gray-600">
                      I represent a nonprofit organization.
                    </label>
                  </div>

                  {formData.nonprofit && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        🏢 Organization name
                      </label>
                      <input
                        type="text"
                        name="organizationName"
                        value={formData.organizationName}
                        onChange={handleChange}
                        placeholder="Your organization"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                      />
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="newsletterOptIn"
                      name="newsletterOptIn"
                      checked={formData.newsletterOptIn}
                      onChange={handleChange}
                      className="h-5 w-5 text-orange-600 rounded border-gray-300 focus:ring-orange-500 focus:ring-2 mt-1"
                    />
                    <label htmlFor="newsletterOptIn" className="text-sm text-gray-600">
                      Email me updates, tips, and stories.
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 px-6 py-4 sm:px-10 flex items-center justify-between">
            <div>
              {step === 2 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  ← Back
                </button>
              ) : (
                <span className="text-sm text-gray-400">&nbsp;</span>
              )}
            </div>

            {step === 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                Continue
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Skip
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Finish'}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
