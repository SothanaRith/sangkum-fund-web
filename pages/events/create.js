import { useState } from 'react';
import { useRouter } from 'next/router';
import { eventsAPI } from '@/lib/api';
import { useLanguage } from '@/lib/LanguageContext';
import MapPicker from '@/components/MapPicker';
import {
  FileText,
  DollarSign,
  Rocket,
  Calendar,
  MapPin,
  Image as ImageIcon,
  Camera,
  Trophy,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';

export default function CreateEventNew() {
  const router = useRouter();
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [khqrFile, setKhqrFile] = useState(null);
  const [khqrPreview, setKhqrPreview] = useState(null);
  const [khqrInputMode, setKhqrInputMode] = useState('upload'); // 'upload' or 'url'
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    startDate: '',
    endDate: '',
    imageUrl: '',
    location: '',
    latitude: '',
    longitude: '',
    category: '',
    khqrImage: '',
    bakongAccountId: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (selectedImages.length + files.length > 10) {
      alert('You can upload a maximum of 10 images');
      return;
    }

    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return true;
    });

    setSelectedImages([...selectedImages, ...validFiles]);

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleKhqrFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file for KHQR.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('KHQR image must be less than 5MB.');
      return;
    }
    setKhqrFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setKhqrPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleMapSelect = (lat, lng) => {
    setFormData({
      ...formData,
      latitude: lat.toString(),
      longitude: lng.toString(),
    });
  };

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!formData.title || !formData.description || !formData.category) {
        setError('Please fill in all required fields.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.targetAmount || !formData.startDate || !formData.endDate) {
        setError('Please fill in all required fields.');
        return;
      }
      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        setError('End date must be after start date.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      // If KHQR file was uploaded, upload it first to get a URL
      let khqrImageUrl = formData.khqrImage;
      if (khqrInputMode === 'upload' && khqrFile) {
        try {
          const uploadFormData = new FormData();
          uploadFormData.append('file', khqrFile);
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/upload/image`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: uploadFormData,
          });
          if (response.ok) {
            const result = await response.json();
            khqrImageUrl = result.url || result.imageUrl || result.path || '';
          }
        } catch (uploadErr) {
          console.warn('KHQR image upload failed, using data URL as fallback:', uploadErr);
          khqrImageUrl = khqrPreview; // Use base64 as fallback
        }
      }

      const eventData = {
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        khqrImage: khqrImageUrl,
      };

      const createdEvent = await eventsAPI.create(eventData);
      
      if (selectedImages.length > 0) {
        try {
          await eventsAPI.uploadImages(createdEvent.id, selectedImages);
        } catch (imgErr) {
          console.error('Failed to upload images:', imgErr);
        }
      }
      
      alert('Event created successfully! It has been submitted for admin approval.');
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event. Please try again.');
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
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <div className="mt-10">
              <div className="text-sm text-gray-500">{step} of {totalSteps}</div>
              <h1 className="mt-4 text-3xl font-semibold text-gray-900">
                {step === 1 ? 'Create Your Event' : step === 2 ? 'Set Details' : step === 3 ? 'Add Media' : 'Payment Setup'}
              </h1>
              <p className="mt-4 text-gray-600">
                {step === 1
                  ? 'Tell your story and describe your cause'
                  : step === 2
                  ? 'Set fundraising goals and timeline'
                  : step === 3
                  ? 'Upload images and finalize'
                  : 'Setup Bakong KHQR for donations'}
              </p>
            </div>
          </div>
          <div className="text-xs text-gray-400">SangKumFund</div>
        </aside>

        <main className="flex flex-col">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <div className="lg:hidden flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-sm text-gray-600">{step} of {totalSteps}</span>
            </div>
            <button
              type="button"
              onClick={() => router.push('/events')}
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
              <div className="max-w-2xl space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FileText className="w-5 h-5" /> Event Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="E.g., Build a School in Rural Cambodia"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                  <p className="text-sm text-gray-500 mt-2">Make it compelling and descriptive</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FileText className="w-5 h-5" /> Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    required
                    rows="6"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Share the story behind your cause. Why is this important? How will the funds help?"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 resize-none"
                  />
                  <p className="text-sm text-gray-500 mt-2">{formData.description.length} characters</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Trophy className="w-5 h-5" /> Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
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
              </div>
            )}

            {step === 2 && (
              <div className="max-w-2xl space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" /> Target Amount <span className="text-red-500">*</span>
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
                      placeholder="10000.00"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Set a realistic and achievable goal</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Rocket className="w-5 h-5" /> Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      required
                      value={formData.startDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar className="w-5 h-5" /> End Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      required
                      value={formData.endDate}
                      onChange={handleChange}
                      min={formData.startDate || new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin className="w-5 h-5" /> Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, Country or venue name"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <MapPin className="w-5 h-5" /> Coordinates (Optional)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowMapPicker(true)}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700"
                    >
                      Pick on Map
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="number"
                      name="latitude"
                      step="any"
                      value={formData.latitude}
                      onChange={handleChange}
                      placeholder="Latitude (11.5564)"
                      className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                    <input
                      type="number"
                      name="longitude"
                      step="any"
                      value={formData.longitude}
                      onChange={handleChange}
                      placeholder="Longitude (104.9282)"
                      className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="max-w-2xl space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" /> Images
                  </label>

                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-500 transition-all">
                    <input
                      type="file"
                      id="image-upload"
                      multiple
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Camera className="w-16 h-16 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm font-semibold text-gray-700 mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB. Max 10 images.
                      </p>
                    </label>
                  </div>

                  {imagePreviews.length > 0 && (
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          {index === 0 && (
                            <div className="absolute bottom-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                              Primary
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="mt-4 text-sm text-gray-500">
                    {selectedImages.length > 0 
                      ? `${selectedImages.length} image(s) selected` 
                      : 'Add compelling images to attract more donors'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Or provide image URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/your-image.jpg"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                {formData.imageUrl && selectedImages.length === 0 && (
                  <div className="rounded-xl overflow-hidden border-2 border-gray-200">
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
              </div>
            )}

            {step === 4 && (
              <div className="max-w-2xl space-y-6">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
                  <h3 className="text-lg font-semibold text-emerald-800 mb-2">🏦 Bakong KHQR Integration</h3>
                  <p className="text-sm text-emerald-700">
                    We exclusively support Bakong KHQR for secure, instant, and transparent donations directly to your account. Upload your personal KHQR image so donors can scan it.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bakong Account ID
                  </label>
                  <input
                    type="text"
                    name="bakongAccountId"
                    value={formData.bakongAccountId}
                    onChange={handleChange}
                    placeholder="e.g., sokkha@aclb"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                  <p className="text-sm text-gray-500 mt-2">Your Bakong ID ensures payments are verified correctly.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    KHQR Image
                  </label>
                  {/* Toggle between upload and URL */}
                  <div className="flex gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setKhqrInputMode('upload')}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all border-2 ${
                        khqrInputMode === 'upload'
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      📤 Upload Image
                    </button>
                    <button
                      type="button"
                      onClick={() => setKhqrInputMode('url')}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all border-2 ${
                        khqrInputMode === 'url'
                          ? 'border-orange-500 bg-orange-50 text-orange-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      🔗 Paste URL
                    </button>
                  </div>

                  {khqrInputMode === 'upload' ? (
                    <div>
                      <label
                        htmlFor="khqr-upload"
                        className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all"
                      >
                        {khqrPreview ? (
                          <img src={khqrPreview} alt="KHQR Preview" className="h-full object-contain p-2 rounded-xl" />
                        ) : (
                          <div className="text-center">
                            <div className="text-4xl mb-2">📷</div>
                            <p className="text-sm text-gray-600 font-medium">Click to upload your KHQR image</p>
                            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                          </div>
                        )}
                        <input
                          id="khqr-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleKhqrFileSelect}
                        />
                      </label>
                      {khqrFile && (
                        <div className="mt-2 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                          <span className="text-sm text-green-700 font-medium">✓ {khqrFile.name}</span>
                          <button
                            type="button"
                            onClick={() => { setKhqrFile(null); setKhqrPreview(null); }}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <input
                        type="url"
                        name="khqrImage"
                        value={formData.khqrImage}
                        onChange={handleChange}
                        placeholder="https://example.com/your-khqr.jpg"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                      />
                      <p className="text-sm text-gray-500 mt-2">Paste a direct link to your KHQR image.</p>
                      {formData.khqrImage && (
                        <div className="rounded-xl overflow-hidden border-2 border-gray-200 mt-4 max-w-xs">
                          <img
                            src={formData.khqrImage}
                            alt="KHQR Preview"
                            className="w-full h-auto"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-2">
                  <p className="text-sm text-amber-800">
                    <strong>ℹ️ Admin Verification:</strong> Your event will be reviewed by our admin team before it becomes visible to the public. Once approved, donors can scan your KHQR to send payments that are verified via Bakong's API.
                  </p>
                </div>
              </div>
            )}

          </div>

          <div className="border-t border-gray-100 px-6 py-4 sm:px-10 flex items-center justify-between">
            <div>
              {step > 1 ? (
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

            {step < totalSteps ? (
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
                  onClick={() => router.push('/events')}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4" />
                      <span>Create Event</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      <MapPicker
        isOpen={showMapPicker}
        onClose={() => setShowMapPicker(false)}
        onSelectLocation={handleMapSelect}
        initialLat={parseFloat(formData.latitude) || null}
        initialLng={parseFloat(formData.longitude) || null}
      />
    </div>
  );
}
