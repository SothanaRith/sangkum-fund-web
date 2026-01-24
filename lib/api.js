import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (name, email, password) => {
    const { data } = await apiClient.post('/api/auth/register', {
      name,
      email,
      password,
    });
    return data;
  },

  login: async (email, password) => {
    const { data } = await apiClient.post('/api/auth/login', {
      email,
      password,
    });
    return data;
  },
};

// Events API
export const eventsAPI = {
  getAll: async () => {
    const { data } = await apiClient.get('/api/events');
    return data;
  },

  getById: async (id) => {
    const { data } = await apiClient.get(`/api/events/${id}`);
    return data;
  },

  create: async (eventData) => {
    const { data } = await apiClient.post('/api/events', eventData);
    return data;
  },

  update: async (id, eventData) => {
    const { data } = await apiClient.put(`/api/events/${id}`, eventData);
    return data;
  },

  getMyEvents: async () => {
    const { data } = await apiClient.get('/api/events/my-events');
    return data;
  },

  joinEvent: async (eventId) => {
    const { data } = await apiClient.post(`/api/events/${eventId}/join`);
    return data;
  },
};

// Donations API
export const donationsAPI = {
  create: async (donationData) => {
    const { data } = await apiClient.post('/api/donations', donationData);
    return data;
  },

  getMyDonations: async () => {
    const { data } = await apiClient.get('/api/donations/my-donations');
    return data;
  },
  getRecentByEvent: async () => {
    const { data } = await apiClient.get('/api/donations/my-donations');
    return data;
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    const { data } = await apiClient.get('/api/users/profile');
    return data;
  },

  updateProfile: async (profileData) => {
    const { data } = await apiClient.put('/api/users/profile', profileData);
    return data;
  },

  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await apiClient.post('/api/users/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
};

// Charities API
export const charitiesAPI = {
  getAll: async () => {
    const { data } = await apiClient.get('/api/charities');
    return data;
  },

  getById: async (id) => {
    const { data } = await apiClient.get(`/api/charities/${id}`);
    return data;
  },

  create: async (charityData) => {
    const { data } = await apiClient.post('/api/charities', charityData);
    return data;
  },

  update: async (id, charityData) => {
    const { data } = await apiClient.put(`/api/charities/${id}`, charityData);
    return data;
  },

  getMyCharity: async () => {
    const { data } = await apiClient.get('/api/charities/my-charity');
    return data;
  },
};

// Announcements API
export const announcementsAPI = {
  getByEvent: async (eventId) => {
    const { data } = await apiClient.get(`/api/events/${eventId}/announcements`);
    return data;
  },

  getByCharity: async (charityId) => {
    const { data } = await apiClient.get(`/api/charities/${charityId}/announcements`);
    return data;
  },

  create: async (announcementData) => {
    const { data } = await apiClient.post('/api/announcements', announcementData);
    return data;
  },

  update: async (id, announcementData) => {
    const { data } = await apiClient.put(`/api/announcements/${id}`, announcementData);
    return data;
  },

  delete: async (id) => {
    const { data } = await apiClient.delete(`/api/announcements/${id}`);
    return data;
  },

  // Comments
  addComment: async (announcementId, content) => {
    const { data } = await apiClient.post(`/api/announcements/${announcementId}/comments`, { content });
    return data;
  },

  deleteComment: async (announcementId, commentId) => {
    const { data } = await apiClient.delete(`/api/announcements/${announcementId}/comments/${commentId}`);
    return data;
  },

  // Reactions
  addReaction: async (announcementId, reactionType) => {
    const { data } = await apiClient.post(`/api/announcements/${announcementId}/reactions`, { reactionType });
    return data;
  },

  removeReaction: async (announcementId) => {
    const { data } = await apiClient.delete(`/api/announcements/${announcementId}/reactions`);
    return data;
  },
};

// Business Cards API
export const businessCardsAPI = {
  getMy: async () => {
    const { data } = await apiClient.get('/api/business-cards/my-card');
    return data;
  },

  getBySlug: async (slug) => {
    const { data } = await apiClient.get(`/api/business-cards/${slug}`);
    return data;
  },

  create: async (cardData) => {
    const { data } = await apiClient.post('/api/business-cards', cardData);
    return data;
  },

  update: async (cardData) => {
    const { data } = await apiClient.put('/api/business-cards', cardData);
    return data;
  },
};

// Event Timeline API
export const eventTimelineAPI = {
  getByEvent: async (eventId) => {
    const { data } = await apiClient.get(`/api/events/${eventId}/timeline`);
    return data;
  },

  create: async (eventId, timelineData) => {
    const { data } = await apiClient.post(`/api/events/${eventId}/timeline`, timelineData);
    return data;
  },
};

// Event Comments API
export const eventCommentsAPI = {
  getByEvent: async (eventId) => {
    const { data } = await apiClient.get(`/api/events/${eventId}/comments`);
    return data;
  },

  create: async (eventId, content) => {
    const { data } = await apiClient.post(`/api/events/${eventId}/comments`, { content });
    return data;
  },
};

// Notifications API
export const notificationsAPI = {
  getAll: async () => {
    const { data } = await apiClient.get('/api/notifications');
    return data;
  },

  markAsRead: async (id) => {
    const { data } = await apiClient.put(`/api/notifications/${id}/read`);
    return data;
  },

  markAllAsRead: async () => {
    const { data } = await apiClient.put('/api/notifications/read-all');
    return data;
  },

  delete: async (id) => {
    const { data } = await apiClient.delete(`/api/notifications/${id}`);
    return data;
  },
};

// Settings API
export const settingsAPI = {
  get: async () => {
    const { data } = await apiClient.get('/api/settings');
    return data;
  },

  update: async (settings) => {
    const { data } = await apiClient.put('/api/settings', settings);
    return data;
  },

  connectTelegram: async (telegramData) => {
    const { data } = await apiClient.post('/api/settings/telegram', telegramData);
    return data;
  },

  disconnectTelegram: async () => {
    const { data } = await apiClient.delete('/api/settings/telegram');
    return data;
  },
};

// Dashboard API
export const dashboardAPI = {
  getAnalytics: async () => {
    const { data } = await apiClient.get('/api/dashboard/analytics');
    return data;
  },
};

export default apiClient;
