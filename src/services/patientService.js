import api from './api';

export const patientService = {
  async createPatient(patientData) {
    try {
      const response = await api.post('/reception/patients', patientData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du patient:', error);
      throw error;
    }
  },

  async getPatients(page = 0, size = 20) {
    try {
      const response = await api.get(`/reception/patients?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des patients:', error);
      throw error;
    }
  },

  async getPatientById(patientId) {
    try {
      const response = await api.get(`/reception/patients/${patientId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du patient:', error);
      throw error;
    }
  },

  async searchPatients(searchTerm) {
    try {
      const response = await api.get(`/reception/patients/search?q=${encodeURIComponent(searchTerm)}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la recherche de patients:', error);
      throw error;
    }
  },

  async updatePatient(patientId, patientData) {
    try {
      const response = await api.put(`/reception/patients/${patientId}`, patientData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du patient:', error);
      throw error;
    }
  },

  async deletePatient(patientId) {
    try {
      await api.delete(`/reception/patients/${patientId}`);
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du patient:', error);
      throw error;
    }
  }
};