import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { eventsAPI, donationsAPI } from '@/lib/api';
import { decryptId } from '@/lib/encryption';
import { PAYMENT_METHODS } from '@/lib/utils';
import QRCode from 'qrcode.react';

export default function Donate() {
  const router = useRouter();
  const { id } = router.query;
  const [plainId, setPlainId] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [paymentResponse, setPaymentResponse] = useState(null);

  const [formData, setFormData] = useState({
    amount: '',
    anonymous: false,
    paymentMethod: PAYMENT_METHODS.VISA_CARD,
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cvv: '',
    phoneNumber: '',
    notes: '',
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
      loadEvent();
    }
  }, [plainId]);

  const loadEvent = async () => {
    if (!plainId) return;
    
    try {
      const data = await eventsAPI.getById(plainId);
      setEvent(data);
    } catch (err) {
      setError('Failed to load event');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // Check if user is logged in
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/auth/login');
        return;
      }

      // Prepare payment details based on payment method
      let paymentDetails = {};

      if (formData.paymentMethod === PAYMENT_METHODS.VISA_CARD) {
        paymentDetails = {
          cardNumber: formData.cardNumber,
          cardHolderName: formData.cardHolderName,
          expiryDate: formData.expiryDate,
          cvv: formData.cvv,
        };
      } else if (formData.paymentMethod === PAYMENT_METHODS.KHQR) {
        paymentDetails = {
          phoneNumber: formData.phoneNumber,
        };
      } else if (formData.paymentMethod === PAYMENT_METHODS.OFFLINE_QR) {
        paymentDetails = {
          notes: formData.notes || 'Payment via bank transfer',
        };
      }

      const donationData = {
        eventId: parseInt(id),
        amount: parseFloat(formData.amount),
        anonymous: formData.anonymous,
        paymentMethod: formData.paymentMethod,
        paymentDetails,
      };

      const response = await donationsAPI.create(donationData);
      setPaymentResponse(response);

      // If payment is successful, redirect after 3 seconds
      if (response.status === 'SUCCESS') {
        setTimeout(() => {
          router.push('/events');
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process donation');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
          <div className="text-lg text-orange-700">Loading...</div>
        </div>
    );
  }

  if (error && !event) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
          <div className="text-red-600 bg-white p-8 rounded-2xl shadow-lg">{error}</div>
        </div>
    );
  }

  // Show payment response
  if (paymentResponse) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {paymentResponse.status === 'SUCCESS' ? (
                  <div className="text-center">
                    <div className="text-6xl text-green-500 mb-4">✓</div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Donation Successful!
                    </h2>
                    <p className="text-gray-600 mb-2">
                      Thank you for your generous contribution through SangKumFund!
                    </p>
                    <p className="text-gray-600 mb-6">
                      Your support helps make a real difference in Cambodian communities.
                    </p>
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-xl mb-6">
                      <p className="text-sm text-gray-600 mb-1">Transaction Reference</p>
                      <p className="font-mono text-lg font-bold text-orange-700">{paymentResponse.transactionRef}</p>
                      <p className="text-sm text-gray-600 mt-3">Donation Amount</p>
                      <p className="text-2xl font-bold text-gray-900">${formData.amount}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      Redirecting to events page...
                    </p>
                  </div>
              ) : (
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white p-6 rounded-t-2xl -mt-8 -mx-8 mb-8">
                      <h2 className="text-2xl font-bold mb-2">Complete Your Payment</h2>
                      <p className="text-orange-100">{paymentResponse.message}</p>
                    </div>

                    {paymentResponse.qrCodeData && (
                        <div className="space-y-4 mb-8">
                          <div className="flex justify-center mb-4">
                            <div className="p-4 bg-white rounded-2xl shadow-lg">
                              <QRCode value={paymentResponse.qrCodeData} size={256} />
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">
                            Scan this QR code with your mobile banking app to complete the payment
                          </p>
                        </div>
                    )}

                    <div className="bg-gray-50 p-6 rounded-xl mb-8">
                      <p className="text-sm text-gray-600 mb-2">Transaction Reference</p>
                      <p className="font-mono text-lg font-bold text-gray-900">{paymentResponse.transactionRef}</p>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-1">Campaign</p>
                        <p className="font-bold text-gray-900">{event?.title}</p>

                        <p className="text-sm text-gray-600 mt-3 mb-1">Donation Amount</p>
                        <p className="text-2xl font-bold text-orange-700">${formData.amount}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <button
                          onClick={() => router.push('/events')}
                          className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg"
                      >
                        Return to Campaigns
                      </button>
                      <button
                          onClick={() => window.print()}
                          className="w-full py-3 px-6 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                      >
                        Print Receipt
                      </button>
                    </div>
                  </div>
              )}
            </div>

            <div className="mt-8 text-center text-gray-600 text-sm">
              <p>Need help? Contact SangKumFund Support at support@sangkumfund.org</p>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Support Through <span className="text-orange-600">SangKumFund</span>
            </h1>
            <p className="text-gray-600">
              Your donation makes a real difference in Cambodian communities
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Campaign Info Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Campaign Details</h3>

                {event && (
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Campaign Title</p>
                        <p className="font-semibold text-gray-900">{event.title}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-1">Organizer</p>
                        <p className="font-medium text-gray-900">{event.organizer?.name || 'Community Initiative'}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-1">Category</p>
                        <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                      {event.category}
                    </span>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-sm text-gray-600">Progress</p>
                          <p className="text-sm font-semibold text-orange-600">
                            {event.raised || 0} / {event.goal} raised
                          </p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                              className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full"
                              style={{ width: `${Math.min(100, ((event.raised || 0) / event.goal) * 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold text-orange-700">💝 100% Secure:</span> Your donation is protected by SangKumFund's Trust & Safety system
                        </p>
                      </div>
                    </div>
                )}
              </div>
            </div>

            {/* Donation Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Form Header */}
                <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-6 text-white">
                  <h2 className="text-2xl font-bold mb-2">Make a Donation</h2>
                  <p className="text-orange-100">Complete the form below to support this campaign</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {error && (
                      <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-200">
                        {error}
                      </div>
                  )}

                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Donation Amount (USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">$</span>
                      <input
                          type="number"
                          name="amount"
                          min="1"
                          step="0.01"
                          required
                          value={formData.amount}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none transition-all"
                          placeholder="Enter amount"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {[10, 25, 50, 100, 250].map((amount) => (
                          <button
                              key={amount}
                              type="button"
                              onClick={() => setFormData({...formData, amount: amount.toString()})}
                              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                  formData.amount === amount.toString()
                                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                          >
                            ${amount}
                          </button>
                      ))}
                    </div>
                  </div>

                  {/* Anonymous */}
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <input
                        type="checkbox"
                        name="anonymous"
                        id="anonymous"
                        checked={formData.anonymous}
                        onChange={handleChange}
                        className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="anonymous" className="ml-3 text-gray-700">
                      <span className="font-medium">Make this donation anonymous</span>
                      <p className="text-sm text-gray-500 mt-1">Your name won't appear publicly on the campaign</p>
                    </label>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                      {[
                        { value: PAYMENT_METHODS.VISA_CARD, label: '💳 Card', icon: '💳' },
                        { value: PAYMENT_METHODS.KHQR, label: '🇰🇭 KHQR', icon: '📱' },
                        { value: PAYMENT_METHODS.OFFLINE_QR, label: '🏦 Bank', icon: '🏦' },
                      ].map((method) => (
                          <button
                              key={method.value}
                              type="button"
                              onClick={() => setFormData({...formData, paymentMethod: method.value})}
                              className={`p-4 rounded-xl border-2 transition-all ${
                                  formData.paymentMethod === method.value
                                      ? 'border-orange-500 bg-orange-50'
                                      : 'border-gray-200 hover:border-gray-300'
                              }`}
                          >
                            <div className="text-2xl mb-2">{method.icon}</div>
                            <div className="font-medium text-gray-900">{method.label}</div>
                          </button>
                      ))}
                    </div>

                    <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                    >
                      <option value={PAYMENT_METHODS.VISA_CARD}>Credit/Debit Card (Visa/Mastercard)</option>
                      <option value={PAYMENT_METHODS.KHQR}>KHQR (Cambodia Mobile Banking)</option>
                      <option value={PAYMENT_METHODS.OFFLINE_QR}>Bank Transfer & Offline Payment</option>
                    </select>
                  </div>

                  {/* Payment Details - Visa Card */}
                  {formData.paymentMethod === PAYMENT_METHODS.VISA_CARD && (
                      <div className="space-y-4 p-6 bg-gray-50 rounded-xl border border-gray-200">
                        <h3 className="font-semibold text-gray-900">Card Details</h3>
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">Card Number</label>
                          <input
                              type="text"
                              name="cardNumber"
                              required
                              maxLength="16"
                              value={formData.cardNumber}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                              placeholder="4111 1111 1111 1111"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">Cardholder Name</label>
                          <input
                              type="text"
                              name="cardHolderName"
                              required
                              value={formData.cardHolderName}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                              placeholder="John Doe"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-700 mb-2">Expiry Date</label>
                            <input
                                type="text"
                                name="expiryDate"
                                required
                                placeholder="MM/YY"
                                maxLength="5"
                                value={formData.expiryDate}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-700 mb-2">CVV</label>
                            <input
                                type="text"
                                name="cvv"
                                required
                                maxLength="3"
                                value={formData.cvv}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                                placeholder="123"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="text-lg">🔒</span>
                          <span>Your payment is secured with bank-level encryption</span>
                        </div>
                      </div>
                  )}

                  {/* Payment Details - KHQR */}
                  {formData.paymentMethod === PAYMENT_METHODS.KHQR && (
                      <div className="space-y-4 p-6 bg-gray-50 rounded-xl border border-gray-200">
                        <h3 className="font-semibold text-gray-900">KHQR Payment</h3>
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">Phone Number</label>
                          <input
                              type="tel"
                              name="phoneNumber"
                              required
                              value={formData.phoneNumber}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                              placeholder="+855123456789"
                          />
                        </div>
                        <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            You will receive a KHQR code after submitting this form. Scan it with your mobile banking app to complete the payment.
                          </p>
                        </div>
                      </div>
                  )}

                  {/* Payment Details - Offline QR */}
                  {formData.paymentMethod === PAYMENT_METHODS.OFFLINE_QR && (
                      <div className="space-y-4 p-6 bg-gray-50 rounded-xl border border-gray-200">
                        <h3 className="font-semibold text-gray-900">Bank Transfer Details</h3>
                        <div>
                          <label className="block text-sm text-gray-700 mb-2">
                            Additional Notes (Optional)
                          </label>
                          <textarea
                              name="notes"
                              rows="3"
                              value={formData.notes}
                              onChange={handleChange}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                              placeholder="Enter any additional information or bank transfer reference..."
                          />
                        </div>
                        <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            You will receive bank transfer details and a QR code after submission. Complete the payment and wait for admin verification within 24 hours.
                          </p>
                        </div>
                      </div>
                  )}

                  {/* Security & Privacy Note */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl text-green-600">🔒</div>
                      <div>
                        <p className="font-medium text-gray-900 mb-1">Secure & Protected</p>
                        <p className="text-sm text-gray-600">
                          Your donation is processed through SangKumFund's secure payment system.
                          We never store your full card details and comply with PCI DSS security standards.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex-1 py-4 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 py-4 px-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl"
                    >
                      {submitting ? (
                          <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                        Processing Donation...
                      </span>
                      ) : (
                          'Complete Donation'
                      )}
                    </button>
                  </div>

                  {/* Trust Badges */}
                  <div className="pt-6 border-t border-gray-200">
                    <div className="flex flex-wrap items-center justify-center gap-6 text-gray-500">
                      <div className="flex items-center gap-2">
                        <span>🔒</span>
                        <span className="text-sm">Secure Payment</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>🇰🇭</span>
                        <span className="text-sm">Cambodian Platform</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>💝</span>
                        <span className="text-sm">0% Platform Fee</span>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}