import Link from 'next/link';

export default function EventHeader({ selectedImage, eventImages, event, setSelectedImage }) {
  return (
    <div className="relative">
      {(selectedImage || eventImages.length > 0 || event.imageUrl) ? (
          <div className="h-[60vh] md:h-[70vh] relative">
            <img
                src={selectedImage?.imageUrl || eventImages[0]?.imageUrl || event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent"></div>
            
            {/* Image Thumbnails */}
            {eventImages.length > 0 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4">
                {eventImages.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage?.id === img.id 
                        ? 'border-white scale-110' 
                        : 'border-white/50 hover:border-white'
                    }`}
                  >
                    <img
                      src={img.imageUrl}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
      ) : (
          <div className="h-[60vh] md:h-[70vh] bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
            <div className="text-center">
              <div className="text-7xl mb-4">🙏</div>
              <p className="text-lg text-gray-600">Support this cause</p>
            </div>
          </div>
      )}

      {/* Back Navigation */}
      <div className="absolute top-4 left-4">
        <Link
            href="/events"
            className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-white transition-colors shadow-sm"
        >
          ← Back to fundraisers
        </Link>
      </div>

      {/* Category Tag */}
      {event.category && (
          <div className="absolute top-4 right-4">
        <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-gray-700">
          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
          {event.category}
        </span>
          </div>
      )}

      {/* Hero Content */}
      <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
              {event.title}
            </h1>
            <p className="text-white/90 text-lg mb-6 max-w-xl">
              {event.shortDescription || 'Help make a difference today'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
