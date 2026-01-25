import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const adminAPI = axios.create({
  baseURL: API_URL,
});

// Add token to requests
adminAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Event Verification APIs
export const eventVerificationAPI = {
  // Get all pending events
  getPendingEvents: async () => {
    const response = await adminAPI.get('/api/admin/events/pending');
    return response.data;
  },

  // Approve an event
  approveEvent: async (eventId) => {
    const response = await adminAPI.post(`/api/admin/events/${eventId}/approve`);
    return response.data;
  },

  // Reject an event
  rejectEvent: async (eventId, reason) => {
    const response = await adminAPI.post(`/api/admin/events/${eventId}/reject`, { reason });
    return response.data;
  },

  // Get event status
  getEventStatus: async (eventId) => {
    const response = await adminAPI.get(`/api/admin/events/${eventId}/status`);
    return response.data;
  },
};

// Export for use in admin pages
export default adminAPI;
