import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { businessCardsAPI } from '@/lib/api';
import QRCode from 'qrcode.react';
import { 
  Briefcase, 
  AlertCircle, 
  Loader2,
  Download,
  Share2,
  Smartphone,
  Home,
  Play,
  Pause,
  RotateCw,
  CheckCircle
} from 'lucide-react';

export default function BusinessCardView() {
  const router = useRouter();
  const { slug } = router.query;
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const cardRef = useRef(null);
  const autoRotateRef = useRef(null);

  useEffect(() => {
    if (slug) {
      loadCard();
    }
  }, [slug]);

  // Auto-rotate animation
  useEffect(() => {
    if (autoRotate && !isFlipped) {
      autoRotateRef.current = setInterval(() => {
        setRotateY((prev) => (prev + 0.5) % 360);
      }, 20);
    } else {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
      }
    }
    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
      }
    };
  }, [autoRotate, isFlipped]);

  const loadCard = async () => {
    try {
      setLoading(true);
      const data = await businessCardsAPI.getBySlug(slug);
      setCard(data);
    } catch (err) {
      setError('Business card not found');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseMove = (e) => {
    if (autoRotate || isFlipped) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateXValue = ((y - centerY) / centerY) * -15;
    const rotateYValue = ((x - centerX) / centerX) * 15;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    if (!autoRotate && !isFlipped) {
      setRotateX(0);
      setRotateY(0);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setAutoRotate(false);
  };

  const toggleAutoRotate = () => {
    setAutoRotate(!autoRotate);
    if (!autoRotate) {
      setIsFlipped(false);
      setRotateX(0);
    }
  };

  const handleDownloadVCard = () => {
    if (!card) return;
    
    const contactInfo = JSON.parse(card.contactInfo || '{}');
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${card.ownerName}
TITLE:${card.title || ''}
NOTE:${card.bio || ''}
EMAIL:${contactInfo.email || ''}
TEL:${contactInfo.phone || ''}
URL:${contactInfo.website || ''}
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${card.ownerName.replace(/\\s+/g, '_')}_card.vcf`;
    link.click();
  };

  const getTemplateGradient = (template) => {
    const templates = {
      'orange-modern': 'from-orange-500 to-amber-600',
      'orange-elegant': 'from-orange-800 to-amber-800',
      'orange-vibrant': 'from-orange-500 to-red-500',
      'sunset': 'from-orange-400 to-red-600',
      'amber-glow': 'from-amber-500 to-orange-400',
      'citrus': 'from-orange-500 to-yellow-500',
      'warm': 'from-orange-600 to-amber-400',
      'golden': 'from-yellow-600 to-orange-500',
    };
    return templates[template] || 'from-orange-500 to-amber-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Loader2 className="w-16 h-16 text-orange-400 animate-spin" />
          </div>
          <p className="text-white text-xl font-semibold">Loading business card...</p>
        </div>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="w-16 h-16 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Card Not Found</h2>
          <p className="text-gray-300 mb-6">{error || 'This business card does not exist'}</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-amber-700 transition-all"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  const contactInfo = JSON.parse(card.contactInfo || '{}');
  const gradient = getTemplateGradient(card.template);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full mb-6 border border-white/20 shadow-xl">
            <Briefcase className="w-5 h-5 text-orange-400" />
            <span className="text-sm font-semibold text-white">Digital Business Card</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white drop-shadow-2xl">
            {card.ownerName}
          </h1>
          {card.title && (
            <p className="text-xl md:text-2xl text-gray-200 font-medium">
              {card.title}
            </p>
          )}
          <div className="mt-6 flex items-center justify-center gap-4">
            <a
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold border border-white/20 transition-all"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </a>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-3 mb-10 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <button
            onClick={toggleAutoRotate}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl ${
              autoRotate
                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white'
                : 'bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm'
            }`}
          >
            {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="hidden sm:inline">{autoRotate ? 'Pause' : 'Auto-Rotate'}</span>
            <span className="sm:hidden">{autoRotate ? 'Pause' : 'Rotate'}</span>
          </button>
          <button
            onClick={handleFlip}
            className="flex items-center gap-2 px-5 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all shadow-lg hover:shadow-xl"
          >
            <RotateCw className="w-4 h-4" />
            <span className="hidden sm:inline">Flip Card</span>
            <span className="sm:hidden">Flip</span>
          </button>
          <button
            onClick={handleDownloadVCard}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Save Contact</span>
            <span className="sm:hidden">Save</span>
          </button>
        </div>

        {/* 3D Card Container */}
        <div className="perspective-1000 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative mx-auto w-full max-w-md md:max-w-2xl cursor-pointer"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateX(${isFlipped ? 180 : rotateX}deg) rotateY(${isFlipped ? 180 : rotateY}deg)`,
              transition: isFlipped ? 'transform 0.6s' : autoRotate ? 'none' : 'transform 0.1s',
            }}
          >
            {/* Front Side */}
            <div
              className="relative w-full aspect-[1.6/1] rounded-3xl shadow-2xl overflow-hidden"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'translateZ(40px)',
              }}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`}></div>
              
              {/* Pattern Overlay */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                  backgroundSize: '20px 20px'
                }}></div>
              </div>

              {/* Glassmorphism Effect */}
              <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>

              {/* Card Content */}
              <div className="relative h-full p-8 md:p-12 flex flex-col justify-between text-white">
                {/* Top Section */}
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold mb-2">{card.ownerName}</h2>
                      <p className="text-lg md:text-xl text-white/90">{card.title || 'Professional'}</p>
                    </div>
                    {card.ownerAvatar && (
                      <img
                        src={card.ownerAvatar}
                        alt={card.ownerName}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white/30 shadow-xl object-cover"
                      />
                    )}
                  </div>

                  {card.bio && (
                    <p className="text-sm md:text-base text-white/80 leading-relaxed mb-6 line-clamp-3">
                      {card.bio}
                    </p>
                  )}
                </div>

                {/* Bottom Section - Contact Info */}
                <div className="space-y-3">
                  {contactInfo.email && (
                    <div className="flex items-center gap-3 text-sm md:text-base">
                      <span className="text-xl">📧</span>
                      <span className="text-white/90">{contactInfo.email}</span>
                    </div>
                  )}
                  {contactInfo.phone && (
                    <div className="flex items-center gap-3 text-sm md:text-base">
                      <span className="text-xl">📱</span>
                      <span className="text-white/90">{contactInfo.phone}</span>
                    </div>
                  )}
                  {contactInfo.website && (
                    <div className="flex items-center gap-3 text-sm md:text-base">
                      <span className="text-xl">🌐</span>
                      <a 
                        href={contactInfo.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-white/90 hover:text-white underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {contactInfo.website}
                      </a>
                    </div>
                  )}

                  {/* Social Media Icons */}
                  <div className="flex gap-3 pt-4">
                    {contactInfo.linkedin && (
                      <a
                        href={contactInfo.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-xl">💼</span>
                      </a>
                    )}
                    {contactInfo.twitter && (
                      <a
                        href={contactInfo.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-xl">🐦</span>
                      </a>
                    )}
                    {contactInfo.github && (
                      <a
                        href={contactInfo.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-xl">💻</span>
                      </a>
                    )}
                    {contactInfo.instagram && (
                      <a
                        href={contactInfo.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-xl">📸</span>
                      </a>
                    )}
                    {contactInfo.facebook && (
                      <a
                        href={contactInfo.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-xl">👥</span>
                      </a>
                    )}
                    {contactInfo.whatsapp && (
                      <a
                        href={`https://wa.me/${contactInfo.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-xl">💬</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* SangKumFund Branding */}
                <div className="absolute bottom-4 right-4 text-xs text-white/50">
                  Powered by SangKumFund
                </div>
              </div>
            </div>

            {/* Back Side - QR Code */}
            <div
              className="absolute inset-0 w-full aspect-[1.6/1] rounded-3xl shadow-2xl overflow-hidden"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'translateZ(40px) rotateY(180deg)',
              }}
            >
              {/* Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900"></div>
              
              {/* Content */}
              <div className="relative h-full p-8 md:p-12 flex flex-col items-center justify-center text-white">
                <div className="text-center mb-6">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">Connect with Me</h3>
                  <p className="text-gray-300">Scan to save contact</p>
                </div>

                {/* QR Code */}
                <div className="bg-white p-6 rounded-2xl shadow-2xl">
                  <QRCode
                    value={typeof window !== 'undefined' ? window.location.href : ''}
                    size={200}
                    level="H"
                    includeMargin
                  />
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-400">
                    {card.ownerName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    SangKumFund Digital Card
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all group">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Share2 className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-white font-bold mb-2 text-lg">Share Anywhere</h3>
            <p className="text-gray-300 text-sm leading-relaxed">Share this link to connect instantly with anyone</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all group">
            <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Download className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-white font-bold mb-2 text-lg">Save Contact</h3>
            <p className="text-gray-300 text-sm leading-relaxed">Download to your phone or computer in one click</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all group">
            <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-white font-bold mb-2 text-lg">Always Updated</h3>
            <p className="text-gray-300 text-sm leading-relaxed">Changes sync automatically in real-time</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12 animate-fadeIn bg-white/5 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/10" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">Want Your Own Card?</h3>
          <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">Create your professional digital business card in minutes - completely free!</p>
          <a
            href="/business-card"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl font-bold hover:from-orange-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-2xl transform hover:scale-105"
          >
            <Briefcase className="w-5 h-5" />
            Create Your Card Free
          </a>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
