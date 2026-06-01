import { Clock, CheckCircle, Share2, X, Link2, Copy, Users, Shield } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { encryptId } from '@/lib/encryption';
import Link from 'next/link';

export default function EventDonationPanel({
  donationCardRef,
  isSticky,
  progress,
  event,
  daysRemaining,
  isOwner,
  joined,
  setShowJoinModal,
  joiningEvent,
  openShareModal,
  showShareModal,
  closeShareModal,
  shareUrl,
  encodedShareUrl,
  handleShare,
  handleCopyLink,
  copyState,
  shareEmailHref,
  recentDonations
}) {
  return (
    <div className="lg:col-span-1">
      <div
          ref={donationCardRef}
          className={`lg:sticky lg:top-8 ${isSticky ? 'lg:animate-slideUp' : ''}`}
      >
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 space-y-6">
          {/* Progress */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Fundraising progress</h3>
              <span className="text-orange-600 font-bold">{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-2 overflow-hidden">
              <div
                  className="bg-gradient-to-r from-orange-400 to-amber-400 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Raised: {formatCurrency(event.currentAmount)}</span>
              <span>Goal: {formatCurrency(event.goalAmount)}</span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{event.viewsCount || 0}</div>
              <div className="text-xs text-gray-500">Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{event.participantCount || 0}</div>
              <div className="text-xs text-gray-500">Supporters</div>
            </div>
          </div>

          {/* Urgency Indicator */}
          {daysRemaining > 0 && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                <div className="flex items-center gap-2 text-amber-800 mb-1">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">{daysRemaining} days left</span>
                </div>
                <p className="text-amber-700 text-sm">
                  This fundraiser ends soon. Your support can help reach the goal.
                </p>
              </div>
          )}

          {/* Donation CTA */}
          <div className="space-y-3">
            {!isOwner && !joined ? (
              <button
                onClick={() => setShowJoinModal(true)}
                disabled={joiningEvent}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-center py-4 px-6 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {joiningEvent ? 'Joining...' : '✓ Join Event'}
              </button>
            ) : joined && !isOwner ? (
              <div className="w-full bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-center py-4 px-6 rounded-xl font-bold text-lg border-2 border-green-300 flex items-center justify-center gap-2">
                <CheckCircle size={20} />
                Already a supporter!
              </div>
            ) : null}
            {!isOwner && (
              <Link
                  href={`/donate/${encryptId(event.id)}`}
                  className="block w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-center py-4 px-6 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                Donate now
              </Link>
            )}
          </div>

          {/* Share Section */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-gray-900 font-medium">
              <Share2 size={18} className="text-orange-600" />
              <span>Share this fundraiser</span>
            </div>

            <button
                onClick={openShareModal}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-200 rounded-lg font-medium text-gray-800 hover:border-orange-200 hover:text-orange-700 transition-colors"
            >
              <Share2 size={16} />
              Quick share
            </button>
          </div>

          {showShareModal && (
            <div
                className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4"
                onClick={closeShareModal}
            >
              <div
                  className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 space-y-4"
                  onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-900 font-semibold">
                    <Share2 size={18} className="text-orange-600" />
                    <span>Share this fundraiser</span>
                  </div>
                  <button
                      onClick={closeShareModal}
                      className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                      aria-label="Close share dialog"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded-lg border border-gray-200 px-3 py-2">
                  <Link2 size={16} className="text-orange-600" />
                  <span className="truncate">{shareUrl || 'Link will appear here once loaded'}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                      onClick={handleShare}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
                  >
                    <Share2 size={16} />
                    Native share
                  </button>
                  <button
                      onClick={handleCopyLink}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-200 rounded-lg font-medium text-gray-800 hover:border-orange-200 hover:text-orange-700 transition-colors"
                  >
                    <Copy size={16} />
                    {copyState === 'copied' ? 'Copied' : 'Copy link'}
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                  <a
                      href={encodedShareUrl ? `https://www.facebook.com/sharer/sharer.php?u=${encodedShareUrl}` : '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:border-orange-200 hover:text-orange-700 transition-colors"
                  >
                    Share on Facebook
                  </a>
                  <a
                      href={encodedShareUrl ? `https://wa.me/?text=${encodedShareUrl}` : '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:border-orange-200 hover:text-orange-700 transition-colors"
                  >
                    Share on WhatsApp
                  </a>
                  <a
                      href={shareEmailHref || '#'}
                      className="px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:border-orange-200 hover:text-orange-700 transition-colors"
                  >
                    Share via Email
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Recent Donors */}
          {recentDonations.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Recent supporters</h4>
                <div className="space-y-3">
                  {recentDonations.map((donation) => {
                    const displayName = donation.donorName || (donation.isAnonymous ? 'Anonymous' : 'Supporter');
                    const initial = displayName.charAt(0);
                    return (
                      <div key={donation.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {donation.donorAvatar ? (
                            <img
                              src={donation.donorAvatar}
                              alt={displayName}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                              {initial}
                            </div>
                          )}
                          <span className="text-sm text-gray-700">{displayName}</span>
                        </div>
                        <div className="text-sm font-medium text-orange-600">
                          {formatCurrency(donation.amount)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
          )}

          {/* Participants */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-700">
                <Users size={18} />
                <span>{event.participantCount || 0} supporters</span>
              </div>
              {joined ? (
                  <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                <CheckCircle size={14} />
                You're supporting
              </span>
              ) : (
                  <button
                      onClick={() => setShowJoinModal(true)}
                      disabled={joiningEvent}
                      className="text-orange-600 hover:text-orange-700 font-medium text-sm px-3 py-1 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50"
                  >
                    {joiningEvent ? 'Joining...' : 'Support fundraiser'}
                  </button>
              )}
            </div>
          </div>
        </div>

        {/* Additional Trust Info */}
        <div className="mt-4 bg-gray-50 rounded-2xl p-5 border border-gray-200">
          <div className="flex items-start gap-3 mb-3">
            <div className="p-2 bg-white rounded-lg border border-gray-200">
              <Shield className="text-gray-600" size={18} />
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Trust & Safety</h4>
              <p className="text-sm text-gray-600">
                Your donation is protected by our platform guarantee.
                Funds are delivered directly to the organizer and beneficiary.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              <span className="text-gray-700">Secure payments</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              <span className="text-gray-700">Verified identity</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
