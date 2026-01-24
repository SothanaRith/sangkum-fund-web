import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { businessCardsAPI, userAPI } from '@/lib/api';
import QRCode from 'qrcode.react';

const templates = [
  { id: 'modern', name: 'Modern', gradient: 'from-blue-500 to-purple-600', icon: '🚀' },
  { id: 'elegant', name: 'Elegant', gradient: 'from-gray-800 to-gray-600', icon: '💎' },
  { id: 'vibrant', name: 'Vibrant', gradient: 'from-pink-500 to-orange-500', icon: '🌈' },
  { id: 'nature', name: 'Nature', gradient: 'from-green-500 to-teal-500', icon: '🌿' },
  { id: 'ocean', name: 'Ocean', gradient: 'from-cyan-500 to-blue-600', icon: '🌊' },
  { id: 'sunset', name: 'Sunset', gradient: 'from-orange-400 to-red-600', icon: '🌅' },
  { id: 'royal', name: 'Royal', gradient: 'from-purple-600 to-pink-600', icon: '👑' },
  { id: 'midnight', name: 'Midnight', gradient: 'from-indigo-900 to-purple-900', icon: '🌙' },
];

const cardStyles = [
  { id: 'gradient', name: 'Gradient', description: 'Smooth color blend' },
  { id: 'solid', name: 'Solid', description: 'Single color background' },
  { id: 'pattern', name: 'Pattern', description: 'Geometric pattern overlay' },
  { id: 'glassmorphism', name: 'Glass', description: 'Frosted glass effect' },
];

const cardLayouts = [
  { id: 'centered', name: 'Centered', icon: '📍' },
  { id: 'left-aligned', name: 'Left', icon: '◀️' },
  { id: 'minimal', name: 'Minimal', icon: '⚪' },
  { id: 'creative', name: 'Creative', icon: '🎨' },
];

const fontStyles = [
  { id: 'sans', name: 'Sans-serif', font: 'font-sans' },
  { id: 'serif', name: 'Serif', font: 'font-serif' },
  { id: 'mono', name: 'Monospace', font: 'font-mono' },
];

const borderStyles = [
  { id: 'none', name: 'None' },
  { id: 'thin', name: 'Thin' },
  { id: 'thick', name: 'Thick' },
  { id: 'double', name: 'Double' },
];

export default function BusinessCardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [card, setCard] = useState(null);
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    template: 'modern',
    title: '',
    bio: '',
    cardStyle: 'gradient',
    layout: 'centered',
    fontStyle: 'sans',
    borderStyle: 'none',
    showShadow: true,
    animationEnabled: true,
    contactInfo: {
      email: '',
      phone: '',
      website: '',
      linkedin: '',
      twitter: '',
      github: '',
      instagram: '',
      facebook: '',
      whatsapp: '',
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userData, cardData] = await Promise.all([
        userAPI.getProfile(),
        businessCardsAPI.getMy().catch(() => null),
      ]);
      
      setUser(userData);
      
      if (cardData) {
        setCard(cardData);
        const parsedContactInfo = JSON.parse(cardData.contactInfo || '{}');
        setFormData({
          template: cardData.template || 'modern',
          title: cardData.title || '',
          bio: cardData.bio || '',
          cardStyle: parsedContactInfo.cardStyle || 'gradient',
          layout: parsedContactInfo.layout || 'centered',
          fontStyle: parsedContactInfo.fontStyle || 'sans',
          borderStyle: parsedContactInfo.borderStyle || 'none',
          showShadow: parsedContactInfo.showShadow !== false,
          animationEnabled: parsedContactInfo.animationEnabled !== false,
          contactInfo: {
            email: parsedContactInfo.email || '',
            phone: parsedContactInfo.phone || '',
            website: parsedContactInfo.website || '',
            linkedin: parsedContactInfo.linkedin || '',
            twitter: parsedContactInfo.twitter || '',
            github: parsedContactInfo.github || '',
            instagram: parsedContactInfo.instagram || '',
            facebook: parsedContactInfo.facebook || '',
            whatsapp: parsedContactInfo.whatsapp || '',
          },
        });
      } else {
        setEditing(true);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Merge all settings into contactInfo for storage
      const contactInfoWithSettings = {
        ...formData.contactInfo,
        cardStyle: formData.cardStyle,
        layout: formData.layout,
        fontStyle: formData.fontStyle,
        borderStyle: formData.borderStyle,
        showShadow: formData.showShadow,
        animationEnabled: formData.animationEnabled,
      };
      
      const payload = {
        template: formData.template,
        title: formData.title,
        bio: formData.bio,
        contactInfo: JSON.stringify(contactInfoWithSettings),
      };
      
      if (card) {
        await businessCardsAPI.update(payload);
      } else {
        await businessCardsAPI.create(payload);
      }
      
      await loadData();
      setEditing(false);
    } catch (err) {
      alert('Failed to save business card');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContactChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, [field]: value },
    }));
  };

  const shareUrl = card ? `${window.location.origin}/cards/${card.shareSlug}` : '';

  const downloadVCard = () => {
    const contact = formData.contactInfo;
    const vCard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${user?.name || 'Name'}`,
      formData.title ? `TITLE:${formData.title}` : '',
      contact.email ? `EMAIL:${contact.email}` : '',
      contact.phone ? `TEL:${contact.phone}` : '',
      contact.website ? `URL:${contact.website}` : '',
      formData.bio ? `NOTE:${formData.bio}` : '',
      'END:VCARD',
    ].filter(Boolean).join('\n');

    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${user?.name || 'contact'}.vcf`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">💼</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeIn">
          <h1 className="text-4xl font-bold mb-3 gradient-text">
            💼 Digital Business Card
          </h1>
          <p className="text-gray-600">
            Create and share your professional digital business card
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor */}
          <div className="bg-white rounded-2xl shadow-lg p-8 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editing ? '✏️ Edit Card' : '👁️ View Mode'}
              </h2>
              <button
                onClick={() => setEditing(!editing)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
              >
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {editing ? (
              <div className="space-y-6">
                {/* Template Selection */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-3">Card Template</label>
                  <div className="grid grid-cols-2 gap-3">
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleChange('template', template.id)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.template === template.id
                            ? 'border-primary-600 bg-primary-50 shadow-lg'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }`}
                      >
                        <div className={`h-12 rounded-lg bg-gradient-to-r ${template.gradient} mb-2 flex items-center justify-center text-2xl`}>
                          {template.icon}
                        </div>
                        <p className="font-semibold text-sm">{template.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card Style */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-3">Card Style</label>
                  <div className="grid grid-cols-2 gap-3">
                    {cardStyles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => handleChange('cardStyle', style.id)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          formData.cardStyle === style.id
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className="font-semibold text-sm">{style.name}</p>
                        <p className="text-xs text-gray-500">{style.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Layout */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-3">Layout</label>
                  <div className="grid grid-cols-4 gap-2">
                    {cardLayouts.map((layout) => (
                      <button
                        key={layout.id}
                        onClick={() => handleChange('layout', layout.id)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          formData.layout === layout.id
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-1">{layout.icon}</div>
                        <p className="text-xs font-semibold">{layout.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Style */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-3">Font Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {fontStyles.map((font) => (
                      <button
                        key={font.id}
                        onClick={() => handleChange('fontStyle', font.id)}
                        className={`p-3 rounded-lg border-2 transition-all ${font.font} ${
                          formData.fontStyle === font.id
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className="text-sm font-semibold">Aa</p>
                        <p className="text-xs">{font.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Border & Effects */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-3">Border & Effects</label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Border Style</span>
                      <select
                        value={formData.borderStyle}
                        onChange={(e) => handleChange('borderStyle', e.target.value)}
                        className="px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                      >
                        {borderStyles.map((border) => (
                          <option key={border.id} value={border.id}>{border.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Shadow Effect</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.showShadow}
                          onChange={(e) => handleChange('showShadow', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Hover Animation</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.animationEnabled}
                          onChange={(e) => handleChange('animationEnabled', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="e.g., Software Engineer, Entrepreneur"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    rows="4"
                    placeholder="Brief professional bio..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none resize-none"
                  />
                </div>

                {/* Contact Info */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-3">Contact Information</label>
                  <div className="space-y-3">
                    <input
                      type="email"
                      value={formData.contactInfo.email || ''}
                      onChange={(e) => handleContactChange('email', e.target.value)}
                      placeholder="📧 Email"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                    />
                    <input
                      type="tel"
                      value={formData.contactInfo.phone || ''}
                      onChange={(e) => handleContactChange('phone', e.target.value)}
                      placeholder="📞 Phone"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                    />
                    <input
                      type="url"
                      value={formData.contactInfo.website || ''}
                      onChange={(e) => handleContactChange('website', e.target.value)}
                      placeholder="🌐 Website"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={formData.contactInfo.linkedin || ''}
                      onChange={(e) => handleContactChange('linkedin', e.target.value)}
                      placeholder="💼 LinkedIn"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={formData.contactInfo.twitter || ''}
                      onChange={(e) => handleContactChange('twitter', e.target.value)}
                      placeholder="🐦 Twitter (@username)"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={formData.contactInfo.github || ''}
                      onChange={(e) => handleContactChange('github', e.target.value)}
                      placeholder="💻 GitHub (@username)"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={formData.contactInfo.instagram || ''}
                      onChange={(e) => handleContactChange('instagram', e.target.value)}
                      placeholder="📷 Instagram (@username)"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={formData.contactInfo.facebook || ''}
                      onChange={(e) => handleContactChange('facebook', e.target.value)}
                      placeholder="👥 Facebook"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                    />
                    <input
                      type="tel"
                      value={formData.contactInfo.whatsapp || ''}
                      onChange={(e) => handleContactChange('whatsapp', e.target.value)}
                      placeholder="💬 WhatsApp"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50"
                >
                  {saving ? '💾 Saving...' : '💾 Save Card'}
                </button>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-600">
                👈 Your card preview is on the right
              </div>
            )}
          </div>

          {/* Preview & Share */}
          <div className="space-y-6">
            {/* Card Preview */}
            <div className="bg-white rounded-2xl shadow-lg p-8 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Preview</h2>
              
              <div
                className={`relative rounded-2xl p-8 text-white transition-all ${
                  // Font Style
                  formData.fontStyle === 'sans' ? 'font-sans' :
                  formData.fontStyle === 'serif' ? 'font-serif' :
                  formData.fontStyle === 'mono' ? 'font-mono' : 'font-sans'
                } ${
                  // Border Style
                  formData.borderStyle === 'none' ? '' :
                  formData.borderStyle === 'thin' ? 'border-2 border-white border-opacity-30' :
                  formData.borderStyle === 'thick' ? 'border-4 border-white border-opacity-40' :
                  formData.borderStyle === 'double' ? 'border-4 border-double border-white border-opacity-40' : ''
                } ${
                  // Shadow
                  formData.showShadow ? 'shadow-2xl' : 'shadow-lg'
                } ${
                  // Animation
                  formData.animationEnabled ? 'transform hover:scale-105' : ''
                } ${
                  // Card Style - Background
                  formData.cardStyle === 'gradient' ? `bg-gradient-to-br ${templates.find((t) => t.id === formData.template)?.gradient || templates[0].gradient}` :
                  formData.cardStyle === 'solid' ? `bg-${templates.find((t) => t.id === formData.template)?.gradient.split('-')[2] || 'blue'}-600` :
                  formData.cardStyle === 'pattern' ? `bg-gradient-to-br ${templates.find((t) => t.id === formData.template)?.gradient || templates[0].gradient} bg-pattern` :
                  formData.cardStyle === 'glassmorphism' ? 'bg-white bg-opacity-10 backdrop-blur-2xl' : `bg-gradient-to-br ${templates.find((t) => t.id === formData.template)?.gradient || templates[0].gradient}`
                }`}
                style={formData.cardStyle === 'pattern' ? {
                  backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops)), repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)`
                } : {}}
              >
                {/* Pattern overlay for pattern style */}
                {formData.cardStyle === 'pattern' && (
                  <div className="absolute inset-0 opacity-20 rounded-2xl" style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)'
                  }}></div>
                )}

                {/* Profile Section - Layout variations */}
                <div className={`${
                  formData.layout === 'centered' ? 'text-center' :
                  formData.layout === 'left-aligned' ? 'text-left flex items-center gap-6' :
                  formData.layout === 'minimal' ? 'text-center' :
                  formData.layout === 'creative' ? 'text-left grid grid-cols-3 gap-6' : 'text-center'
                } mb-6 relative z-10`}>
                  <div className={`${
                    formData.layout === 'left-aligned' ? 'w-20 h-20' :
                    formData.layout === 'creative' ? 'w-24 h-24 col-span-1' :
                    formData.layout === 'minimal' ? 'w-16 h-16' :
                    'w-24 h-24'
                  } bg-white bg-opacity-20 rounded-full ${
                    formData.layout === 'centered' || formData.layout === 'minimal' ? 'mx-auto' : ''
                  } mb-4 flex items-center justify-center text-5xl backdrop-blur`}>
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className={formData.layout === 'minimal' ? 'text-3xl' : 'text-5xl'}>👤</span>
                    )}
                  </div>
                  <div className={formData.layout === 'creative' ? 'col-span-2' : ''}>
                    <h3 className={`${
                      formData.layout === 'minimal' ? 'text-xl' : 'text-2xl'
                    } font-bold mb-1`}>{user?.name || 'Your Name'}</h3>
                    {formData.title && (
                      <p className={`text-white text-opacity-90 font-medium ${
                        formData.layout === 'minimal' ? 'text-sm' : ''
                      }`}>{formData.title}</p>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {formData.bio && (
                  <p className={`text-white text-opacity-90 ${
                    formData.layout === 'left-aligned' || formData.layout === 'creative' ? 'text-left' : 'text-center'
                  } ${
                    formData.layout === 'minimal' ? 'text-sm mb-4' : 'mb-6'
                  } leading-relaxed relative z-10`}>
                    {formData.bio}
                  </p>
                )}

                {/* Contact Icons */}
                <div className={`flex ${
                  formData.layout === 'left-aligned' || formData.layout === 'creative' ? 'justify-start' : 'justify-center'
                } gap-3 flex-wrap relative z-10`}>
                  {formData.contactInfo.email && (
                    <div className={`${
                      formData.layout === 'minimal' ? 'w-10 h-10' : 'w-12 h-12'
                    } bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur hover:bg-opacity-30 transition-all cursor-pointer`} title="Email">
                      <span className={formData.layout === 'minimal' ? 'text-lg' : 'text-xl'}>📧</span>
                    </div>
                  )}
                  {formData.contactInfo.phone && (
                    <div className={`${
                      formData.layout === 'minimal' ? 'w-10 h-10' : 'w-12 h-12'
                    } bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur hover:bg-opacity-30 transition-all cursor-pointer`} title="Phone">
                      <span className={formData.layout === 'minimal' ? 'text-lg' : 'text-xl'}>📞</span>
                    </div>
                  )}
                  {formData.contactInfo.whatsapp && (
                    <div className={`${
                      formData.layout === 'minimal' ? 'w-10 h-10' : 'w-12 h-12'
                    } bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur hover:bg-opacity-30 transition-all cursor-pointer`} title="WhatsApp">
                      <span className={formData.layout === 'minimal' ? 'text-lg' : 'text-xl'}>💬</span>
                    </div>
                  )}
                  {formData.contactInfo.website && (
                    <div className={`${
                      formData.layout === 'minimal' ? 'w-10 h-10' : 'w-12 h-12'
                    } bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur hover:bg-opacity-30 transition-all cursor-pointer`} title="Website">
                      <span className={formData.layout === 'minimal' ? 'text-lg' : 'text-xl'}>🌐</span>
                    </div>
                  )}
                  {formData.contactInfo.linkedin && (
                    <div className={`${
                      formData.layout === 'minimal' ? 'w-10 h-10' : 'w-12 h-12'
                    } bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur hover:bg-opacity-30 transition-all cursor-pointer`} title="LinkedIn">
                      <span className={formData.layout === 'minimal' ? 'text-lg' : 'text-xl'}>💼</span>
                    </div>
                  )}
                  {formData.contactInfo.twitter && (
                    <div className={`${
                      formData.layout === 'minimal' ? 'w-10 h-10' : 'w-12 h-12'
                    } bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur hover:bg-opacity-30 transition-all cursor-pointer`} title="Twitter">
                      <span className={formData.layout === 'minimal' ? 'text-lg' : 'text-xl'}>🐦</span>
                    </div>
                  )}
                  {formData.contactInfo.github && (
                    <div className={`${
                      formData.layout === 'minimal' ? 'w-10 h-10' : 'w-12 h-12'
                    } bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur hover:bg-opacity-30 transition-all cursor-pointer`} title="GitHub">
                      <span className={formData.layout === 'minimal' ? 'text-lg' : 'text-xl'}>💻</span>
                    </div>
                  )}
                  {formData.contactInfo.instagram && (
                    <div className={`${
                      formData.layout === 'minimal' ? 'w-10 h-10' : 'w-12 h-12'
                    } bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur hover:bg-opacity-30 transition-all cursor-pointer`} title="Instagram">
                      <span className={formData.layout === 'minimal' ? 'text-lg' : 'text-xl'}>📷</span>
                    </div>
                  )}
                  {formData.contactInfo.facebook && (
                    <div className={`${
                      formData.layout === 'minimal' ? 'w-10 h-10' : 'w-12 h-12'
                    } bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur hover:bg-opacity-30 transition-all cursor-pointer`} title="Facebook">
                      <span className={formData.layout === 'minimal' ? 'text-lg' : 'text-xl'}>👥</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Share Section */}
            {card && (
              <div className="bg-white rounded-2xl shadow-lg p-8 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-xl font-bold text-gray-900 mb-6">📤 Share Your Card</h2>
                
                {/* QR Code */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl mb-6 text-center border-2 border-gray-200">
                  <QRCode value={shareUrl} size={180} className="mx-auto mb-4" level="H" />
                  <p className="text-sm text-gray-600 font-semibold">📱 Scan QR Code to view card</p>
                </div>

                {/* Share Link */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">🔗 Share Link</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-sm"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(shareUrl);
                        alert('✅ Link copied to clipboard!');
                      }}
                      className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-md"
                    >
                      📋 Copy
                    </button>
                  </div>
                </div>

                {/* Download vCard */}
                <button
                  onClick={downloadVCard}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
                >
                  📥 Download Contact Card (.vcf)
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Save to phone contacts or share via email
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
