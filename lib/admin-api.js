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
};

// Admin Users API
export const adminUsersAPI = {
  getAll: async () => {
    const { data } = await apiClient.get('/api/admin/users');
    return data;
  },

  getById: async (id) => {
    const { data } = await apiClient.get(`/api/admin/users/${id}`);
    return data;
  },

  updateRole: async (id, role) => {
    const { data } = await apiClient.patch(`/api/admin/users/${id}/role`, { role });
    return data;
  },

  toggleStatus: async (id) => {
    const { data } = await apiClient.patch(`/api/admin/users/${id}/toggle-status`);
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

// Consolidated Admin API export
export const adminAPI = {
  events: adminEventsAPI,
  donations: adminDonationsAPI,
  users: adminUsersAPI,
  stats: adminStatsAPI,
  charities: adminCharitiesAPI,
};
