import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { eventsAPI, donationsAPI } from '@/lib/api';
import { PAYMENT_METHODS } from '@/lib/utils';
import QRCode from 'qrcode.react';

export default function Donate() {
  const router = useRouter();
  const { id } = router.query;
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
      loadEvent();
    }
  }, [id]);

  const loadEvent = async () => {
    try {
      const data = await eventsAPI.getById(id);
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
      const token = localStorage.getItem('token');
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  // Show payment response
  if (paymentResponse) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {paymentResponse.status === 'SUCCESS' ? (
              <div className="text-center">
                <div className="text-6xl text-green-500 mb-4">✓</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Payment Successful!
                </h2>
                <p className="text-gray-600 mb-2">{paymentResponse.message}</p>
                <p className="text-sm text-gray-500 mb-6">
                  Transaction Reference: {paymentResponse.transactionRef}
                </p>
                <p className="text-sm text-gray-500">
                  Redirecting to events page...
                </p>
              </div>
            ) : (
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Complete Your Payment
                </h2>
                <p className="text-gray-600 mb-6">{paymentResponse.message}</p>
                
                {paymentResponse.qrCodeData && (
                  <div className="flex justify-center mb-6">
                    <QRCode value={paymentResponse.qrCodeData} size={256} />
                  </div>
                )}
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-600">Transaction Reference</p>
                  <p className="font-mono text-lg">{paymentResponse.transactionRef}</p>
                </div>
                
                <button
                  onClick={() => router.push('/events')}
                  className="bg-primary-600 text-white py-2 px-6 rounded-lg hover:bg-primary-700"
                >
                  Return to Events
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Make a Donation
          </h1>
          <p className="text-gray-600 mb-8">
            Supporting: <span className="font-semibold">{event?.title}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-800 p-4 rounded-lg">
                {error}
              </div>
            )}

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Donation Amount ($)
              </label>
              <input
                type="number"
                name="amount"
                min="1"
                step="0.01"
                required
                value={formData.amount}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter amount"
              />
            </div>

            {/* Anonymous */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="anonymous"
                id="anonymous"
                checked={formData.anonymous}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="anonymous" className="ml-2 text-sm text-gray-700">
                Make this donation anonymous
              </label>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value={PAYMENT_METHODS.VISA_CARD}>Credit/Debit Card</option>
                <option value={PAYMENT_METHODS.KHQR}>KHQR (Cambodia)</option>
                <option value={PAYMENT_METHODS.OFFLINE_QR}>Offline QR Payment</option>
              </select>
            </div>

            {/* Payment Details - Visa Card */}
            {formData.paymentMethod === PAYMENT_METHODS.VISA_CARD && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900">Card Details</h3>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    required
                    maxLength="16"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="4111111111111111"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    name="cardHolderName"
                    required
                    value={formData.cardHolderName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="John Doe"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      name="expiryDate"
                      required
                      placeholder="MM/YY"
                      maxLength="5"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      required
                      maxLength="3"
                      value={formData.cvv}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Details - KHQR */}
            {formData.paymentMethod === PAYMENT_METHODS.KHQR && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900">KHQR Details</h3>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="+855123456789"
                  />
                </div>
              </div>
            )}

            {/* Payment Details - Offline QR */}
            {formData.paymentMethod === PAYMENT_METHODS.OFFLINE_QR && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900">Payment Notes</h3>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    rows="3"
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Enter any additional information..."
                  />
                </div>
                <p className="text-sm text-gray-600">
                  You will receive a QR code after submission. Complete the payment and wait for admin verification.
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 px-6 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {submitting ? 'Processing...' : 'Complete Donation'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
