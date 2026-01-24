import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { eventsAPI } from '@/lib/api';

export default function CreateEvent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    startDate: '',
    endDate: '',
    imageUrl: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      const eventData = {
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
      };

      await eventsAPI.create(eventData);
      alert('🎉 Event created successfully!');
      router.push('/events');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <Link href="/events" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold mb-4 group">
            <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span>
            Back to Events
          </Link>
          <h1 className="text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Create Your Event
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Start a fundraising campaign and make a difference! 🌟
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-200 flex items-center animate-slideInRight">
                <span className="text-2xl mr-3">⚠️</span>
                <div className="font-medium">{error}</div>
              </div>
            )}

            {/* Event Title */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                📝 Event Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-lg"
                placeholder="e.g., Help Build Clean Water Wells in Rural Areas"
              />
              <p className="mt-2 text-sm text-gray-500">Make it compelling and descriptive</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                📖 Event Description *
              </label>
              <textarea
                name="description"
                required
                rows="6"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-lg"
                placeholder="Tell your story... Why is this cause important? What will the funds be used for? What impact will it make?"
              />
              <p className="mt-2 text-sm text-gray-500">Share the story behind your cause</p>
            </div>

            {/* Target Amount */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                💰 Fundraising Goal (USD) *
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl text-gray-400">$</span>
                <input
                  type="number"
                  name="targetAmount"
                  required
                  min="1"
                  step="0.01"
                  value={formData.targetAmount}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-lg"
                  placeholder="10000.00"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">Set a realistic target amount</p>
            </div>

            {/* Campaign Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  🚀 Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  required
                  value={formData.startDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  🏁 End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  required
                  value={formData.endDate}
                  onChange={handleChange}
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                🖼️ Campaign Image URL (Optional)
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder="https://example.com/your-image.jpg"
              />
              <p className="mt-2 text-sm text-gray-500">Add a compelling image to attract donors</p>
            </div>

            {/* Preview of image if URL is provided */}
            {formData.imageUrl && (
              <div className="rounded-xl overflow-hidden border-2 border-gray-200">
                <p className="text-sm font-semibold text-gray-700 px-4 pt-4 pb-2">Image Preview:</p>
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Info Box */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start">
                <div className="text-3xl mr-4">💡</div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-2">Tips for Success</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>✓ Be specific about how funds will be used</li>
                    <li>✓ Include a compelling image or video</li>
                    <li>✓ Set a realistic and achievable goal</li>
                    <li>✓ Share your campaign on social media</li>
                    <li>✓ Update donors regularly on progress</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all text-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl font-bold hover:from-primary-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 text-lg btn-ripple"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating...
                  </span>
                ) : (
                  '🚀 Launch Campaign'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center text-gray-600 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <p className="text-sm">
            Need help? Check out our{' '}
            <a href="#" className="text-primary-600 hover:text-primary-700 font-semibold">
              Campaign Creation Guide
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
