import apiClient from './api';

// Admin Events API
export const adminEventsAPI = {
  getAll: async () => {
    const { data } = await apiClient.get('/api/admin/events');
    return data;
  },

  getById: async (id) => {
    const { data } = await apiClient.get(`/api/admin/events/${id}`);
    return data;
  },

  create: async (eventData) => {
    const { data } = await apiClient.post('/api/admin/events', eventData);
    return data;
  },

  update: async (id, eventData) => {
    const { data } = await apiClient.put(`/api/admin/events/${id}`, eventData);
    return data;
  },

  delete: async (id) => {
    const { data } = await apiClient.delete(`/api/admin/events/${id}`);
    return data;
  },

  toggleStatus: async (id) => {
    const { data } = await apiClient.patch(`/api/admin/events/${id}/toggle-status`);
    return data;
  },

  // New admin-specific methods
  approve: async (id) => {
    const { data } = await apiClient.post(`/api/admin/events/${id}/approve`);
    return data;
  },

  reject: async (id, reason) => {
    const { data } = await apiClient.post(`/api/admin/events/${id}/reject`, { reason });
    return data;
  },

  getByStatus: async (status, page = 0, size = 10) => {
    const { data } = await apiClient.get(`/api/admin/events/status/${status}?page=${page}&size=${size}`);
    return data;
  },

  getPending: async () => {
    const { data } = await apiClient.get('/api/admin/events/pending');
    return data;
  },

  search: async (query, status = '', page = 0, size = 10) => {
    const { data } = await apiClient.get(`/api/admin/events/search?q=${query}&status=${status}&page=${page}&size=${size}`);
    return data;
  },

  getFundingProgress: async (id) => {
    const { data } = await apiClient.get(`/api/admin/events/${id}/funding`);
    return data;
  },
};

// Admin Donations API
export const adminDonationsAPI = {
  getAll: async () => {
    const { data } = await apiClient.get('/api/admin/donations');
    return data;
  },

  getById: async (id) => {
    const { data } = await apiClient.get(`/api/admin/donations/${id}`);
    return data;
  },

  approve: async (id) => {
    const { data } = await apiClient.patch(`/api/admin/donations/${id}/approve`);
    return data;
  },

  reject: async (id, reason) => {
    const { data } = await apiClient.patch(`/api/admin/donations/${id}/reject`, { reason });
    return data;
  },

  getByEvent: async (eventId) => {
    const { data } = await apiClient.get(`/api/admin/donations/event/${eventId}`);
    return data;
  },
  
  // New donation tracking methods
  getByStatus: async (status, page = 0, size = 10) => {
    const { data } = await apiClient.get(`/api/admin/donations/status/${status}?page=${page}&size=${size}`);
    return data;
  },
  
  getPending: async (page = 0, size = 10) => {
    const { data } = await apiClient.get(`/api/admin/donations/pending?page=${page}&size=${size}`);
    return data;
  },
  
  search: async (query, status = '', page = 0, size = 10) => {
    const { data } = await apiClient.get(`/api/admin/donations/search?q=${query}&status=${status}&page=${page}&size=${size}`);
    return data;
  },
  
  getDonorInfo: async (donorId) => {
    const { data } = await apiClient.get(`/api/admin/donations/donor/${donorId}`);
    return data;
  },
  
  getDonationStats: async () => {
    const { data } = await apiClient.get(`/api/admin/donations/stats`);
    return data;
  },
  
  getRecent: async (limit = 10) => {
    const { data } = await apiClient.get(`/api/admin/donations/recent?limit=${limit}`);
    return data;
  },
};

// Admin Users API
export const adminUsersAPI = {
  getAll: async (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc') => {
    const { data } = await apiClient.get(`/api/admin/users?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
    return data;
  },

  getById: async (id) => {
    const { data } = await apiClient.get(`/api/admin/users/${id}`);
    return data;
  },

  activate: async (id) => {
    const { data } = await apiClient.post(`/api/admin/users/${id}/activate`);
    return data;
  },

  deactivate: async (id) => {
    const { data } = await apiClient.post(`/api/admin/users/${id}/deactivate`);
    return data;
  },

  block: async (id) => {
    const { data } = await apiClient.post(`/api/admin/users/${id}/block`);
    return data;
  },

  unblock: async (id) => {
    const { data } = await apiClient.post(`/api/admin/users/${id}/unblock`);
    return data;
  },

  search: async (query, page = 0, size = 10) => {
    const { data } = await apiClient.get(`/api/admin/users/search?q=${query}&page=${page}&size=${size}`);
    return data;
  },

  getActive: async (page = 0, size = 10) => {
    const { data } = await apiClient.get(`/api/admin/users/active?page=${page}&size=${size}`);
    return data;
  },

  getBlocked: async (page = 0, size = 10) => {
    const { data } = await apiClient.get(`/api/admin/users/blocked?page=${page}&size=${size}`);
    return data;
  },

  getStats: async () => {
    const { data } = await apiClient.get(`/api/admin/users/stats`);
    return data;
  },

  getRecent: async (limit = 10) => {
    const { data } = await apiClient.get(`/api/admin/users/recent?limit=${limit}`);
    return data;
  },
};

// Admin Notifications API
export const adminNotificationsAPI = {
  getAll: async (page = 0, size = 10, read = null, type = null) => {
    let url = `/api/admin/notifications?page=${page}&size=${size}`;
    if (read !== null) url += `&read=${read}`;
    if (type) url += `&type=${type}`;
    const { data } = await apiClient.get(url);
    return data;
  },

  getPending: async (page = 0, size = 20) => {
    const { data } = await apiClient.get(`/api/admin/notifications/pending?page=${page}&size=${size}`);
    return data;
  },

  getSystem: async (page = 0, size = 15) => {
    const { data } = await apiClient.get(`/api/admin/notifications/system?page=${page}&size=${size}`);
    return data;
  },

  getByType: async (type, page = 0, size = 15) => {
    const { data } = await apiClient.get(`/api/admin/notifications/type/${type}?page=${page}&size=${size}`);
    return data;
  },

  markAsRead: async (id) => {
    const { data } = await apiClient.post(`/api/admin/notifications/${id}/read`);
    return data;
  },

  markAllAsRead: async () => {
    const { data } = await apiClient.post(`/api/admin/notifications/read-all`);
    return data;
  },

  delete: async (id) => {
    const { data } = await apiClient.delete(`/api/admin/notifications/${id}`);
    return data;
  },

  dismiss: async (id) => {
    const { data } = await apiClient.post(`/api/admin/notifications/${id}/dismiss`);
    return data;
  },

  getStats: async () => {
    const { data } = await apiClient.get(`/api/admin/notifications/stats`);
    return data;
  },

  getRecent: async (limit = 5) => {
    const { data } = await apiClient.get(`/api/admin/notifications/recent?limit=${limit}`);
    return data;
  },
};

// Admin Stats API
export const adminStatsAPI = {
  getDashboard: async () => {
    const { data } = await apiClient.get('/api/admin/stats/dashboard');
    return data;
  },

  getEventStats: async (eventId) => {
    const { data } = await apiClient.get(`/api/admin/stats/events/${eventId}`);
    return data;
  },
};

// Admin Charities API
export const adminCharitiesAPI = {
  getAll: async () => {
    const { data } = await apiClient.get('/api/admin/charities');
    return data;
  },

  getById: async (id) => {
    const { data } = await apiClient.get(`/api/admin/charities/${id}`);
    return data;
  },

  verify: async (id) => {
    const { data } = await apiClient.post(`/api/admin/charities/${id}/verify`);
    return data;
  },

  reject: async (id, reason) => {
    const { data } = await apiClient.post(`/api/admin/charities/${id}/reject`, { reason });
    return data;
  },

  delete: async (id) => {
    const { data } = await apiClient.delete(`/api/admin/charities/${id}`);
    return data;
  },
};

// Admin Blog API
export const adminBlogAPI = {
  getAll: async (page = 0, size = 10, status = null) => {
    try {
      let url = `/api/admin/blog?page=${page}&size=${size}`;
      if (status) url += `&status=${status}`;
      const { data } = await apiClient.get(url);
      return data;
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      return { success: false, error: error.message };
    }
  },

  getPublished: async (page = 0, size = 10) => {
    try {
      const { data } = await apiClient.get(`/api/admin/blog/published?page=${page}&size=${size}`);
      return data;
    } catch (error) {
      console.error('Failed to fetch published articles:', error);
      return { success: false, error: error.message };
    }
  },

  getDrafts: async (page = 0, size = 10) => {
    try {
      const { data } = await apiClient.get(`/api/admin/blog/drafts?page=${page}&size=${size}`);
      return data;
    } catch (error) {
      console.error('Failed to fetch draft articles:', error);
      return { success: false, error: error.message };
    }
  },

  getById: async (id) => {
    try {
      const { data } = await apiClient.get(`/api/admin/blog/${id}`);
      return data;
    } catch (error) {
      console.error('Failed to fetch article:', error);
      return { success: false, error: error.message };
    }
  },

  getBySlug: async (slug) => {
    try {
      const { data } = await apiClient.get(`/api/admin/blog/slug/${slug}`);
      return data;
    } catch (error) {
      console.error('Failed to fetch article:', error);
      return { success: false, error: error.message };
    }
  },

  create: async (articleData) => {
    try {
      const { data } = await apiClient.post('/api/admin/blog', articleData);
      return data;
    } catch (error) {
      console.error('Failed to create article:', error);
      return { success: false, error: error.message };
    }
  },

  update: async (id, articleData) => {
    try {
      const { data } = await apiClient.put(`/api/admin/blog/${id}`, articleData);
      return data;
    } catch (error) {
      console.error('Failed to update article:', error);
      return { success: false, error: error.message };
    }
  },

  delete: async (id) => {
    try {
      const { data } = await apiClient.delete(`/api/admin/blog/${id}`);
      return data;
    } catch (error) {
      console.error('Failed to delete article:', error);
      return { success: false, error: error.message };
    }
  },

  publish: async (id) => {
    try {
      const { data } = await apiClient.post(`/api/admin/blog/${id}/publish`);
      return data;
    } catch (error) {
      console.error('Failed to publish article:', error);
      return { success: false, error: error.message };
    }
  },

  unpublish: async (id) => {
    try {
      const { data } = await apiClient.post(`/api/admin/blog/${id}/unpublish`);
      return data;
    } catch (error) {
      console.error('Failed to unpublish article:', error);
      return { success: false, error: error.message };
    }
  },

  getStats: async () => {
    try {
      const { data } = await apiClient.get('/api/admin/blog/stats/overview');
      return data;
    } catch (error) {
      console.error('Failed to fetch blog stats:', error);
      return { success: false, error: error.message };
    }
  },

  getRecent: async (limit = 5) => {
    try {
      const { data } = await apiClient.get(`/api/admin/blog/recent?limit=${limit}`);
      return data;
    } catch (error) {
      console.error('Failed to fetch recent articles:', error);
      return { success: false, error: error.message };
    }
  },
};

// Consolidated Admin API export
export const adminAPI = {
  events: adminEventsAPI,
  donations: adminDonationsAPI,
  users: adminUsersAPI,
  notifications: adminNotificationsAPI,
  stats: adminStatsAPI,
  charities: adminCharitiesAPI,
  blog: adminBlogAPI,
};
