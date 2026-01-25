import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { eventsAPI } from '@/lib/api';
import { useLanguage } from '@/lib/LanguageContext';
import MapPicker from '@/components/MapPicker';
import {
  FileText,
  DollarSign,
  Rocket,
  Calendar,
  MapPin,
  Lightbulb,
  Image as ImageIcon,
  Camera,
  Trophy,
  Hospital,
  GraduationCap,
  Heart,
  Users,
  AlertCircle,
  Briefcase,
  Palette,
} from 'lucide-react';

export default function CreateEvent() {
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [showMapPicker, setShowMapPicker] = useState(false);
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

    // Limit to 10 images
    if (selectedImages.length + files.length > 10) {
      alert('You can upload a maximum of 10 images');
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return true;
    });

    setSelectedImages([...selectedImages, ...validFiles]);

    // Create previews
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

  const handleMapSelect = (lat, lng) => {
    setFormData({
      ...formData,
      latitude: lat.toString(),
      longitude: lng.toString(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Check if user is logged in
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      const eventData = {
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
      };

      const createdEvent = await eventsAPI.create(eventData);
      
      // Upload images if any selected
      if (selectedImages.length > 0) {
        try {
          await eventsAPI.uploadImages(createdEvent.id, selectedImages);
        } catch (imgErr) {
          console.error('Failed to upload images:', imgErr);
          // Event created but images failed, still show success
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <Link href="/events" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold mb-4 group">
            <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span>
            {t('common.back')}
          </Link>
          <h1 className="text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              {t('createEvent.title')}
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            {t('createEvent.subtitle')}
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
              <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5" /> {t('createEvent.eventTitle')} *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-lg"
                placeholder={t('createEvent.eventTitlePlaceholder')}
              />
              <p className="mt-2 text-sm text-gray-500">Make it compelling and descriptive</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5" /> {t('createEvent.description')} *
              </label>
              <textarea
                name="description"
                required
                rows="6"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-lg"
                placeholder={t('createEvent.descriptionPlaceholder')}
              />
              <p className="mt-2 text-sm text-gray-500">Share the story behind your cause</p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Trophy className="w-5 h-5" /> {t('createEvent.category')} *
              </label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-lg"
              >
                <option value="">{t('createEvent.selectCategory')}</option>
                <option value="Education">{t('categories.Education')}</option>
                <option value="Healthcare">{t('categories.Healthcare')}</option>
                <option value="Environment">{t('categories.Environment')}</option>
                <option value="Animal Welfare">{t('categories.Animal Welfare')}</option>
                <option value="Community Development">{t('categories.Community Development')}</option>
                <option value="Disaster Relief">{t('categories.Disaster Relief')}</option>
                <option value="Arts & Culture">{t('categories.Arts & Culture')}</option>
                <option value="Sports">{t('categories.Sports')}</option>
                <option value="Technology">{t('categories.Technology')}</option>
                <option value="Human Rights">{t('categories.Human Rights')}</option>
                <option value="Other">{t('categories.Other')}</option>
              </select>
              <p className="mt-2 text-sm text-gray-500">Choose the category that best fits your event</p>
            </div>

            {/* Target Amount */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <DollarSign className="w-5 h-5" /> {t('createEvent.targetAmount')} *
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
                <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Rocket className="w-5 h-5" /> {t('createEvent.startDate')} *
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
                <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Calendar className="w-5 h-5" /> {t('createEvent.endDate')} *
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

            {/* Location */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <MapPin className="w-5 h-5" /> {t('createEvent.location')}
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                placeholder={t('createEvent.locationPlaceholder')}
              />
              <p className="mt-2 text-sm text-gray-500">Where will this event take place?</p>
            </div>

            {/* Coordinates (Optional) */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5" /> {t('createEvent.latitude')} / {t('createEvent.longitude')}
                </label>
                <button
                  type="button"
                  onClick={() => setShowMapPicker(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Pick on Map
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    {t('createEvent.latitude')}
                  </label>
                  <input
                    type="number"
                    name="latitude"
                    step="any"
                    value={formData.latitude}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    placeholder="11.5564"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    {t('createEvent.longitude')}
                  </label>
                  <input
                    type="number"
                    name="longitude"
                    step="any"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    placeholder="104.9282"
                  />
                </div>
              </div>
              {(formData.latitude || formData.longitude) && (
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <Lightbulb className="w-4 h-4" /> Tip: You can get coordinates from Google Maps by right-clicking on a location
                </p>
              )}
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <ImageIcon className="w-5 h-5" /> {t('createEvent.images')}
              </label>
              
              <div className="space-y-4">
                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-500 transition-all">
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
                      {t('createEvent.uploadImages')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t('createEvent.maxImages')}
                    </p>
                  </label>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                          <div className="absolute bottom-2 left-2 bg-primary-500 text-white text-xs px-2 py-1 rounded">
                            Primary
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Or URL Input */}
                <div>
                  <p className="text-sm text-gray-500 mb-2 text-center">or provide an image URL</p>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    placeholder="https://example.com/your-image.jpg"
                  />
                </div>
              </div>

              <p className="mt-2 text-sm text-gray-500">
                {selectedImages.length > 0 
                  ? `${selectedImages.length} image(s) selected` 
                  : 'Add compelling images to attract donors'}
              </p>
            </div>

            {/* Preview of URL image if provided and no files selected */}
            {formData.imageUrl && selectedImages.length === 0 && (
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
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6 mb-4">
              <div className="flex items-start">
                <div className="text-3xl mr-4">⏳</div>
                <div>
                  <h4 className="font-bold text-yellow-900 mb-2">Admin Verification Required</h4>
                  <p className="text-sm text-yellow-800">
                    Your event will be submitted for admin approval before it becomes visible to the public. 
                    This helps ensure quality and compliance with our community guidelines.
                  </p>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start">
                <Lightbulb className="w-12 h-12 mr-4 text-blue-600" />
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
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl font-bold hover:from-primary-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 text-lg btn-ripple"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {t('common.loading')}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Rocket className="w-5 h-5" />
                    {t('common.submit')}
                  </span>
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
      {/* Map Picker Modal */}
      <MapPicker
        isOpen={showMapPicker}
        onClose={() => setShowMapPicker(false)}
        onSelectLocation={handleMapSelect}
        initialLat={parseFloat(formData.latitude) || null}
        initialLng={parseFloat(formData.longitude) || null}
      />    </div>
  );
}
