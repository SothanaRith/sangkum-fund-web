import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { charitiesAPI } from '@/lib/api';

export default function EditCharity() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
    registrationNumber: '',
    address: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
  });

  useEffect(() => {
    if (id) {
      fetchCharity();
    }
  }, [id]);

  const fetchCharity = async () => {
    try {
      setFetchLoading(true);
      const charity = await charitiesAPI.getById(id);
      setFormData({
        name: charity.name || '',
        description: charity.description || '',
        logo: charity.logo || '',
        registrationNumber: charity.registrationNumber || '',
        address: charity.address || '',
        contactEmail: charity.contactEmail || '',
        contactPhone: charity.contactPhone || '',
        website: charity.website || '',
      });
    } catch (err) {
      setError('Failed to load charity details');
      console.error('Error fetching charity:', err);
    } finally {
      setFetchLoading(false);
    }
  };

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

    try {
      await charitiesAPI.update(id, formData);
      alert('✅ Charity updated successfully!');
      router.push(`/charities/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update charity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <Link href={`/charities/${id}`} className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold mb-4 group">
            <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span>
            Back to Charity
          </Link>
          <h1 className="text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Edit Your Charity
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Update your charity organization details 🏛️
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

            {/* Charity Name */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                🏢 Charity Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-lg"
                placeholder="e.g., Hope Foundation"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                📄 Description *
              </label>
              <textarea
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows="6"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder="Describe your charity's mission and activities..."
              />
            </div>

            {/* Registration Number */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                🆔 Registration Number *
              </label>
              <input
                type="text"
                name="registrationNumber"
                required
                value={formData.registrationNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder="e.g., REG-12345"
              />
            </div>

            {/* Logo URL */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                🖼️ Logo URL
              </label>
              <input
                type="url"
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder="https://example.com/logo.png"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                📍 Address *
              </label>
              <textarea
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder="Full address of your charity organization"
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  📧 Contact Email *
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  required
                  value={formData.contactEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  placeholder="contact@charity.org"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  📱 Contact Phone *
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  required
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                🌐 Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder="https://yourcharity.org"
              />
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start">
                <div className="text-3xl mr-4">💡</div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-2">Keep Information Updated</h4>
                  <p className="text-sm text-blue-800">
                    Accurate and up-to-date information helps donors trust and connect with your organization.
                  </p>
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
                className="flex-1 px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl font-bold hover:from-primary-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 text-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Updating...
                  </span>
                ) : (
                  '💾 Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
