import api from './api';

export const userService = {
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  getUsersByClinic: async (clinicId) => {
    const response = await api.get(`/admin/users/clinic/${clinicId}`);
    return response.data;
  },

  getUsersByRole: async (role) => {
    const response = await api.get(`/admin/users/role/${role}`);
    return response.data;
  },

  getAllSpecialities: async () => {
    const response = await api.get('/admin/specialities');
    return response.data;
  },

  createSpeciality: async (specialityData) => {
    const response = await api.post('/admin/specialities', specialityData);
    return response.data;
  },

  updateSpeciality: async (id, specialityData) => {
    const response = await api.put(`/admin/specialities/${id}`, specialityData);
    return response.data;
  },

  deleteSpeciality: async (id) => {
    const response = await api.delete(`/admin/specialities/${id}`);
    return response.data;
  },
};
