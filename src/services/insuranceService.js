import api from './api';

export const insuranceService = {
  // Mutuelles
  async getMutuelles() {
    try {
      const response = await api.get('/admin-clinique/mutuelles');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des mutuelles:', error);
      throw error;
    }
  },

  async createMutuelle(mutuelleData) {
    try {
      const response = await api.post('/admin-clinique/mutuelles', mutuelleData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la mutuelle:', error);
      throw error;
    }
  },

  async updateMutuelle(id, mutuelleData) {
    try {
      const response = await api.put(`/admin-clinique/mutuelles/${id}`, mutuelleData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la mutuelle:', error);
      throw error;
    }
  },

  async deleteMutuelle(id) {
    try {
      await api.delete(`/admin-clinique/mutuelles/${id}`);
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de la mutuelle:', error);
      throw error;
    }
  },

  // Assurances privées
  async getAssurancesPrivees() {
    try {
      const response = await api.get('/admin-clinique/assurances-privees');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des assurances privées:', error);
      throw error;
    }
  },

  async createAssurancePrivee(assuranceData) {
    try {
      const response = await api.post('/admin-clinique/assurances-privees', assuranceData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'assurance privée:', error);
      throw error;
    }
  },

  async updateAssurancePrivee(id, assuranceData) {
    try {
      const response = await api.put(`/admin-clinique/assurances-privees/${id}`, assuranceData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'assurance privée:', error);
      throw error;
    }
  },

  async deleteAssurancePrivee(id) {
    try {
      await api.delete(`/admin-clinique/assurances-privees/${id}`);
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'assurance privée:', error);
      throw error;
    }
  },

  // Import Excel
  async importFromExcel(file, type) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type); // 'mutuelle' ou 'assurance-privee'

      const response = await api.post('/admin-clinique/import-excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'import Excel:', error);
      throw error;
    }
  },


  // Export des données existantes vers Excel
  async exportToExcel(type) {
    try {
      const response = await api.get(`/admin-clinique/export-excel/${type}`, {
        responseType: 'blob'
      });

      // Créer un lien de téléchargement
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const currentDate = new Date().toISOString().split('T')[0];
      link.download = `export_${type}_${currentDate}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error('Erreur lors de l\'export Excel:', error);
      throw error;
    }
  }
};