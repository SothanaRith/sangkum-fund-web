import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
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

// Response interceptor - handle errors and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      if (typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          try {
            const { data } = await axios.post(`${API_URL}/api/auth/refresh`, {
              refreshToken
            });
            
            // Save new tokens
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            
            // Update authorization header
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            
            processQueue(null, data.accessToken);
            
            return apiClient(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError, null);
            
            // Clear tokens and redirect to login
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/auth/login';
            
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        } else {
          isRefreshing = false;
          // No refresh token, redirect to login
          localStorage.removeItem('accessToken');
          window.location.href = '/auth/login';
        }
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

  registerWithOtp: async (name, email, password, otpCode) => {
    const { data } = await apiClient.post('/api/auth/register/otp', {
      name,
      email,
      password,
      otpCode,
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

  loginWithOtp: async (email, password, otpCode) => {
    const { data } = await apiClient.post('/api/auth/login/otp', {
      email,
      password,
      otpCode,
    });
    return data;
  },

  sendOtp: async (email, purpose) => {
    const { data } = await apiClient.post('/api/auth/otp/send', {
      email,
      purpose,
    });
    return data;
  },

  refreshToken: async (refreshToken) => {
    const { data } = await apiClient.post('/api/auth/refresh', {
      refreshToken,
    });
    return data;
  },

  logout: async (refreshToken) => {
    const { data } = await apiClient.post('/api/auth/logout', {
      refreshToken,
    });
    return data;
  },

  forgotPassword: async (email) => {
    const { data } = await apiClient.post('/api/auth/forgot-password', {
      email,
    });
    return data;
  },

  validateResetToken: async (token) => {
    const { data } = await apiClient.get('/api/auth/validate-reset-token', {
      params: { token },
    });
    return data;
  },

  resetPassword: async (token, newPassword, confirmPassword) => {
    const { data } = await apiClient.post('/api/auth/reset-password', {
      token,
      newPassword,
      confirmPassword,
    });
    return data;
  },
};

// Survey API
export const surveyAPI = {
  submit: async (surveyData) => {
    const { data } = await apiClient.post('/api/survey', surveyData);
    return data;
  },

  getMySurvey: async () => {
    const { data } = await apiClient.get('/api/survey/me');
    return data;
  },
};

// Platform Feedback API
export const platformFeedbackAPI = {
  submit: async (feedbackData) => {
    const { data } = await apiClient.post('/api/platform-feedback', feedbackData);
    return data;
  },

  getMy: async () => {
    const { data } = await apiClient.get('/api/platform-feedback/my');
    return data;
  },
};

// Events API
export const eventsAPI = {
  getAll: async (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') => {
    // Ensure parameters are valid
    const validPage = page ?? 0;
    const validSize = size ?? 10;
    const validSortBy = sortBy || 'createdAt';
    const validSortDir = sortDir || 'desc';
    
    const { data } = await apiClient.get('/api/events', {
      params: { 
        page: validPage, 
        size: validSize, 
        sortBy: validSortBy, 
        sortDir: validSortDir 
      }
    });
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

  getMyEvents: async (page = 0, size = 10) => {
    const { data } = await apiClient.get('/api/events/my-events', {
      params: { page, size }
    });
    return data;
  },

  joinEvent: async (eventId, joinData = {}) => {
    const { data } = await apiClient.post(`/api/events/${eventId}/join`, joinData);
    return data;
  },

  getParticipants: async (eventId) => {
    const { data } = await apiClient.get(`/api/events/${eventId}/participants`);
    return data;
  },

  uploadImages: async (eventId, files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    const { data } = await apiClient.post(`/api/events/${eventId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  getImages: async (eventId) => {
    const { data } = await apiClient.get(`/api/events/${eventId}/images`);
    return data;
  },

  deleteImage: async (eventId, imageId) => {
    const { data } = await apiClient.delete(`/api/events/${eventId}/images/${imageId}`);
    return data;
  },

  setPrimaryImage: async (eventId, imageId) => {
    const { data } = await apiClient.put(`/api/events/${eventId}/images/${imageId}/primary`);
    return data;
  },

  recordView: async (eventId) => {
    try {
      const { data } = await apiClient.post(`/api/events/${eventId}/view`);
      return data;
    } catch (err) {
      // If user is not authenticated, try anonymous view
      const { data } = await apiClient.post(`/api/events/${eventId}/view/anonymous`);
      return data;
    }
  },
};

// Donations API
export const donationsAPI = {
  create: async (donationData) => {
    const { data } = await apiClient.post('/api/donations', donationData);
    return data;
  },

  getMyDonations: async (page = 0, size = 10) => {
    const { data } = await apiClient.get('/api/donations/my-donations', {
      params: { page, size }
    });
    return data;
  },
  getRecentByEvent: async (eventId) => {
    const { data } = await apiClient.get(`/api/events/${eventId}/donations`);
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
  getAll: async (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc', status = null, category = null) => {
    const params = { page, size, sortBy, sortDir };
    if (status) params.status = status;
    if (category) params.category = category;
    const { data } = await apiClient.get('/api/charities', { params });
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
    const { data } = await apiClient.get(`/api/business-cards/slug/${slug}`);
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

// Contact API
export const contactAPI = {
  sendMessage: async (name, email, category, message) => {
    const { data } = await apiClient.post('/api/contact', {
      name,
      email,
      category,
      message,
    });
    return data;
  },
};

// Posts/Blog API
export const postsAPI = {
  getAll: async (page = 0, size = 10, search = null, tag = null, sortBy = 'publishedAt', sortDir = 'desc') => {
    const { data } = await apiClient.get('/api/posts', {
      params: { page, size, search, tag, sortBy, sortDir }
    });
    return data;
  },

  getFeatured: async (limit = 3) => {
    const { data } = await apiClient.get('/api/posts/featured', {
      params: { limit }
    });
    return data;
  },

  getBySlug: async (slug, includeDraft = false) => {
    const { data } = await apiClient.get(`/api/posts/${slug}`, {
      params: { includeDraft }
    });
    return data;
  },

  create: async (postData) => {
    const { data } = await apiClient.post('/api/posts', postData);
    return data;
  },

  update: async (id, postData) => {
    const { data } = await apiClient.put(`/api/posts/${id}`, postData);
    return data;
  },

  updateStatus: async (id, status, featured) => {
    const { data } = await apiClient.patch(`/api/posts/${id}/status`, {
      status,
      featured
    });
    return data;
  },

  delete: async (id) => {
    const { data } = await apiClient.delete(`/api/posts/${id}`);
    return data;
  },
};

// OCR Verification API
export const ocrAPI = {
  verifyDocument: async (documentImage, documentType, expectedName) => {
    const { data } = await apiClient.post('/api/ocr/verify', {
      documentImage,
      documentType,
      expectedName,
    });
    return data;
  },

  getVerificationStatus: async () => {
    const { data } = await apiClient.get('/api/ocr/status');
    return data;
  },
};

// Access Request API
export const accessRequestAPI = {
  // Request access to private event
  requestEventAccess: async (eventId, reason = '') => {
    const { data } = await apiClient.post(`/api/access-requests/event/${eventId}`, { reason });
    return data;
  },

  // Request access to private charity
  requestCharityAccess: async (charityId, reason = '') => {
    const { data } = await apiClient.post(`/api/access-requests/charity/${charityId}`, { reason });
    return data;
  },

  // Get pending event access requests (for owner)
  getPendingEventRequests: async (eventId, page = 0, size = 10) => {
    const { data } = await apiClient.get(`/api/access-requests/event/${eventId}/pending`, {
      params: { page, size }
    });
    return data;
  },

  // Get pending charity access requests (for owner)
  getPendingCharityRequests: async (charityId, page = 0, size = 10) => {
    const { data } = await apiClient.get(`/api/access-requests/charity/${charityId}/pending`, {
      params: { page, size }
    });
    return data;
  },

  // Approve access request
  approveRequest: async (requestId) => {
    const { data } = await apiClient.post(`/api/access-requests/${requestId}/approve`);
    return data;
  },

  // Reject access request
  rejectRequest: async (requestId, reason = '') => {
    const { data } = await apiClient.post(`/api/access-requests/${requestId}/reject`, { reason });
    return data;
  },

  // Get user's event access status
  getUserEventStatus: async (eventId) => {
    const { data } = await apiClient.get(`/api/access-requests/event/${eventId}/user-status`);
    return data;
  },

  // Get user's charity access status
  getUserCharityStatus: async (charityId) => {
    const { data } = await apiClient.get(`/api/access-requests/charity/${charityId}/user-status`);
    return data;
  },
};

// Event Chat/Messages API
export const eventMessagesAPI = {
  // Send a message to event chat
  sendMessage: async (eventId, message) => {
    // Get current user ID from localStorage
    let userId = 1; // Default fallback
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          userId = JSON.parse(user).id;
        } catch (e) {
          // Fallback to default
        }
      }
    }
    
    const { data } = await apiClient.post(`/api/events/${eventId}/messages`, { 
      message,
      userId 
    });
    return data;
  },

  // Get event messages with pagination
  getMessages: async (eventId, page = 0, size = 50) => {
    const { data } = await apiClient.get(`/api/events/${eventId}/messages`, {
      params: { page, size }
    });
    return data;
  },

  // Get recent messages (limit)
  getRecentMessages: async (eventId, limit = 50) => {
    const { data } = await apiClient.get(`/api/events/${eventId}/messages/recent`, {
      params: { limit }
    });
    return data;
  },

  // Get message count
  getMessageCount: async (eventId) => {
    const { data } = await apiClient.get(`/api/events/${eventId}/messages/count`);
    return data;
  },

  // Delete a message
  deleteMessage: async (eventId, messageId) => {
    // Get current user ID from localStorage
    let userId = 1; // Default fallback
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          userId = JSON.parse(user).id;
        } catch (e) {
          // Fallback to default
        }
      }
    }
    
    const { data } = await apiClient.delete(`/api/events/${eventId}/messages/${messageId}`, {
      params: { userId }
    });
    return data;
  },
};

export default apiClient;
