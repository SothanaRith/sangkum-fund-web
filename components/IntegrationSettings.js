import { Check, Link2, Smartphone } from 'lucide-react';

export default function IntegrationSettings({
  telegramConnected,
  handleDisconnectTelegram,
  handleConnectTelegram
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Integrations</h2>

      {/* Telegram */}
      <div className="border border-gray-200 rounded-xl p-6 mb-4">
        <div className="flex items-start gap-4">
          <div className="text-5xl">
            <Smartphone className="w-10 h-10 text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Telegram Bot</h3>
            <p className="text-gray-600 mb-4">
              Receive instant notifications on Telegram for donations, milestones, and updates.
            </p>

            {telegramConnected ? (
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg font-semibold">
                  <Check className="w-4 h-4" />
                  Connected
                </span>
                <button
                  onClick={handleDisconnectTelegram}
                  className="px-6 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnectTelegram}
                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
              >
                Connect Telegram
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="border border-gray-200 rounded-xl p-6 opacity-50">
        <div className="flex items-start gap-4">
          <div className="text-5xl grayscale">
            <Link2 className="w-10 h-10 text-gray-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">More Integrations</h3>
            <p className="text-gray-600 mb-4">
              Slack, Discord, and Webhook integrations coming soon!
            </p>
            <span className="inline-block px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-semibold">
              Coming Soon
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
