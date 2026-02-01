import { useState } from 'react';
import { useRouter } from 'next/router';
import { charitiesAPI } from '@/lib/api';

export default function CreateCharity() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 2;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
    registrationNumber: '',
    address: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    category: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === 'logo') {
      setImagePreview(value);
    }
  };

  const handleNext = () => {
    setError('');
    if (!formData.name || !formData.description || !formData.category) {
      setError('Please fill in all required fields on this step.');
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

    if (!formData.registrationNumber || !formData.address || !formData.contactEmail || !formData.contactPhone) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      await charitiesAPI.create(formData);
      router.push('/charities?submitted=true');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register charity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-[360px_1fr]">
        <aside className="hidden lg:flex flex-col justify-between bg-blue-50 border-r border-blue-100 p-10">
          <div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <div className="mt-10">
              <div className="text-sm text-gray-500">{step} of {totalSteps}</div>
              <h1 className="mt-4 text-3xl font-semibold text-gray-900">
                {step === 1 ? 'Register Your Charity' : 'Organization Details'}
              </h1>
              <p className="mt-4 text-gray-600">
                {step === 1
                  ? 'Help us understand your organization'
                  : 'Provide your contact and verification information'}
              </p>
            </div>
          </div>
          <div className="text-xs text-gray-400">SangKumFund</div>
        </aside>

        <main className="flex flex-col">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <div className="lg:hidden flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-sm text-gray-600">{step} of {totalSteps}</span>
            </div>
            <button
              type="button"
              onClick={() => router.push('/charities')}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
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

            {step === 1 && (
              <div className="max-w-2xl">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Organization Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Global Charity Foundation"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Organization Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Select a category...</option>
                      <option value="Education">📚 Education</option>
                      <option value="Healthcare">🏥 Healthcare</option>
                      <option value="Environment">🌱 Environment</option>
                      <option value="Animal Welfare">🐾 Animal Welfare</option>
                      <option value="Community Development">🏘️ Community Development</option>
                      <option value="Disaster Relief">🚨 Disaster Relief</option>
                      <option value="Arts & Culture">🎨 Arts & Culture</option>
                      <option value="Sports">⚽ Sports</option>
                      <option value="Technology">💻 Technology</option>
                      <option value="Human Rights">⚖️ Human Rights</option>
                      <option value="Other">📋 Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mission & Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows="5"
                      placeholder="Describe your organization's mission, vision, and the causes you support..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.description.length} characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Logo URL (Optional)
                    </label>
                    <input
                      type="url"
                      name="logo"
                      value={formData.logo}
                      onChange={handleChange}
                      placeholder="https://example.com/logo.png"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                    {imagePreview && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">Preview:</p>
                        <img
                          src={imagePreview}
                          alt="Logo preview"
                          className="w-24 h-24 object-cover rounded-xl border-2 border-gray-200"
                          onError={() => setImagePreview('')}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="max-w-2xl">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Contact & Verification</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Registration/Tax ID Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                      required
                      placeholder="e.g., 501(c)(3) or equivalent"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Official Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      rows="2"
                      placeholder="Full street address, city, state/province, postal code, country"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Contact Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        required
                        placeholder="contact@charity.org"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Contact Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        required
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Website (Optional)
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://www.yourcharity.org"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
                    <p className="text-sm text-blue-800">
                      ℹ️ <strong>Verification Required:</strong> Your charity registration will be reviewed by our admin team. You'll receive a notification once verified.
                    </p>
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
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Continue
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => router.push('/charities')}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit for Verification'}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
