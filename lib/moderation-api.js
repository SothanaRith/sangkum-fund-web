import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const moderationAPI = axios.create({
  baseURL: API_URL,
});

// Add token to requests
moderationAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User Moderation APIs
export const userModerationAPI = {
  blockUser: async (userId, reason) => {
    const response = await moderationAPI.post(`/api/admin/moderation/users/${userId}/block`, { reason });
    return response.data;
  },

  unblockUser: async (userId) => {
    const response = await moderationAPI.post(`/api/admin/moderation/users/${userId}/unblock`);
    return response.data;
  },

  getUserStatus: async (userId) => {
    const response = await moderationAPI.get(`/api/admin/moderation/users/${userId}/status`);
    return response.data;
  },
};

// Event Moderation APIs
export const eventModerationAPI = {
  blockEvent: async (eventId, reason) => {
    const response = await moderationAPI.post(`/api/admin/moderation/events/${eventId}/block`, { reason });
    return response.data;
  },

  unblockEvent: async (eventId) => {
    const response = await moderationAPI.post(`/api/admin/moderation/events/${eventId}/unblock`);
    return response.data;
  },
};

// Charity Moderation APIs
export const charityModerationAPI = {
  blockCharity: async (charityId, reason) => {
    const response = await moderationAPI.post(`/api/admin/moderation/charities/${charityId}/block`, { reason });
    return response.data;
  },

  unblockCharity: async (charityId) => {
    const response = await moderationAPI.post(`/api/admin/moderation/charities/${charityId}/unblock`);
    return response.data;
  },
};

export default moderationAPI;
