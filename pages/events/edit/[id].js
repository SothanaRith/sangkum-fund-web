import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { eventsAPI } from '@/lib/api';
import { decryptId } from '@/lib/encryption';
import MapPicker from '@/components/MapPicker';
import { FileText, Calendar, DollarSign, MapPin, Image as ImageIcon, Camera, Lightbulb, CheckCircle, AlertCircle } from 'lucide-react';

export default function EditEvent() {
  const router = useRouter();
  const { id } = router.query;
  const [plainId, setPlainId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    targetAmount: '',
    startDate: '',
    endDate: '',
    location: '',
    latitude: '',
    longitude: '',
    imageUrl: '',
    visibility: 'PUBLIC',
  });

  useEffect(() => {
    if (id) {
      // Decrypt ID if it's encrypted
      const decrypted = decryptId(id);
      const actualId = decrypted || id;
      setPlainId(actualId);
    }
  }, [id]);

  useEffect(() => {
    if (plainId) {
      fetchEvent();
    }
  }, [plainId]);

  const fetchEvent = async () => {
    if (!plainId) return;
    
    try {
      setFetchLoading(true);
      const event = await eventsAPI.getById(plainId);
      setFormData({
        title: event.title || '',
        description: event.description || '',
        category: event.category || '',
        targetAmount: event.goalAmount || '',
        startDate: event.startDate || '',
        endDate: event.endDate || '',
        location: event.location || '',
        latitude: event.latitude || '',
        longitude: event.longitude || '',
        imageUrl: event.imageUrl || '',
        visibility: event.visibility || 'PUBLIC',
      });
      // Reset any pending uploads when loading a new event
      setSelectedImages([]);
      setImagePreviews([]);
      
      // Fetch existing images
      try {
        const images = await eventsAPI.getImages(id);
        setExistingImages(images || []);
      } catch (imgErr) {
        console.error('Failed to load existing images:', imgErr);
        setExistingImages([]);
      }
    } catch (err) {
      setError('Failed to load event details');
      console.error('Error fetching event:', err);
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

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (selectedImages.length + files.length > 10) {
      alert('You can upload a maximum of 10 images');
      return;
    }

    const validFiles = files.filter((file) => {
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

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageId) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    try {
      await eventsAPI.deleteImage(id, imageId);
      setExistingImages(existingImages.filter(img => img.id !== imageId));
    } catch (err) {
      console.error('Failed to delete image:', err);
      alert('Failed to delete image. Please try again.');
    }
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

    try {
      const eventData = {
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
      };

      await eventsAPI.update(plainId, eventData);

      if (selectedImages.length > 0) {
        try {
          await eventsAPI.uploadImages(plainId, selectedImages);
        } catch (imgErr) {
          console.error('Image upload failed:', imgErr);
        }
      }
      alert('Event updated successfully! It may need admin re-approval if it was previously rejected.');
      router.push(`/events/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update event. Please try again.');
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <Link href={`/events/${id}`} className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold mb-4 group">
            <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span>
            Back to Event
          </Link>
          <h1 className="text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Edit Your Event
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Update your fundraising campaign details
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-orange-100 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-200 flex items-center animate-slideInRight">
                <AlertCircle className="w-6 h-6 mr-3 flex-shrink-0" />
                <div className="font-medium">{error}</div>
              </div>
            )}

            {/* Event Title */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5" /> Event Title *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-lg"
                placeholder="e.g., Help Build Clean Water Wells in Rural Areas"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5" /> Description *
              </label>
              <textarea
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows="6"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="Describe your event and how the funds will be used..."
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5" /> Category *
              </label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-lg"
              >
                <option value="">Select a category</option>
                <option value="Education">Education</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Environment">Environment</option>
                <option value="Animal Welfare">Animal Welfare</option>
                <option value="Community Development">Community Development</option>
                <option value="Disaster Relief">Disaster Relief</option>
                <option value="Arts & Culture">Arts & Culture</option>
                <option value="Sports">Sports</option>
                <option value="Technology">Technology</option>
                <option value="Human Rights">Human Rights</option>
                <option value="Other">📋 Other</option>
              </select>
              <p className="mt-2 text-sm text-gray-500">Choose the category that best fits your event</p>
            </div>

            {/* Target Amount */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <DollarSign className="w-5 h-5" /> Target Amount (USD) *
              </label>
              <input
                type="number"
                name="targetAmount"
                required
                min="1"
                step="0.01"
                value={formData.targetAmount}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-lg"
                placeholder="10000"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Calendar className="w-5 h-5" /> Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  required
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Calendar className="w-5 h-5" /> End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  required
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <MapPin className="w-5 h-5" /> Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="e.g., Phnom Penh, Cambodia"
              />
              <p className="mt-2 text-sm text-gray-500">Where will this event take place?</p>
            </div>

            {/* Coordinates (Optional) */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-gray-900">
                  🌐 Event Coordinates
                </label>
                <button
                  type="button"
                  onClick={() => setShowMapPicker(true)}
                  className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg font-semibold hover:from-orange-700 hover:to-amber-700 transition-all flex items-center gap-2"
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
                    Latitude
                  </label>
                  <input
                    type="number"
                    name="latitude"
                    step="any"
                    value={formData.latitude}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="11.5564"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    name="longitude"
                    step="any"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="104.9282"
                  />
                </div>
              </div>
              {(formData.latitude || formData.longitude) && (
                <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-2">
                  <Lightbulb className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-orange-700">Tip: You can also get coordinates from Google Maps by right-clicking on a location</p>
                </div>
              )}
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                <ImageIcon className="w-5 h-5" /> Event Images
              </label>

              <div className="space-y-4">
                {/* Existing Images from Database */}
                {existingImages.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Current Images:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {existingImages.map((image) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.imageUrl}
                            alt="Event image"
                            className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(image.id)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete image"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          {image.isPrimary && (
                            <div className="absolute bottom-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                              Primary
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload New Images */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-500 transition-all">
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
                      {existingImages.length > 0 ? 'Add more photos' : 'Upload event photos'}
                    </p>
                    <p className="text-xs text-gray-500">Max 10 images, 5MB each</p>
                  </label>
                </div>

                {/* New Image Previews */}
                {imagePreviews.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">New Images to Upload:</p>
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
                          {index === 0 && existingImages.length === 0 && (
                            <div className="absolute bottom-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                              Primary
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-500 mb-2 text-center">or provide an image URL</p>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="https://example.com/your-image.jpg"
                  />
                </div>
              </div>

              <p className="mt-2 text-sm text-gray-500">
                {existingImages.length > 0 && `${existingImages.length} existing image(s)`}
                {existingImages.length > 0 && selectedImages.length > 0 && ' • '}
                {selectedImages.length > 0 && `${selectedImages.length} new image(s) to upload`}
                {existingImages.length === 0 && selectedImages.length === 0 && 'Add compelling images to attract donors'}
              </p>
            </div>

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

            {/* Visibility */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                👁️ Visibility
              </label>
              <select
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              >
                <option value="PUBLIC">Public - Anyone can see</option>
                <option value="PRIVATE">Private - Invite only</option>
              </select>
            </div>

            {/* Warning Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Calendar className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-900 mb-2">Update Notice</h4>
                  <p className="text-sm text-amber-800">
                    If your event was previously rejected, updating it will resubmit it for admin approval with PENDING status.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-8 py-4 border-2 border-orange-600 text-orange-600 rounded-xl font-bold hover:bg-orange-50 transition-all text-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-bold hover:from-orange-700 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 text-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Updating...
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Map Picker Modal */}
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
