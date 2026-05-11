import api from './api';

export const specialityService = {
  async getAllSpecialities() {
    try {
      const response = await api.get('/specialities');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des spécialités:', error);
      // Fallback sur des spécialités par défaut
      return [
        { id: 1, name: 'Généraliste', description: 'Médecine générale' },
        { id: 2, name: 'Cardiologie', description: 'Spécialiste du cœur' },
        { id: 3, name: 'Dermatologie', description: 'Spécialiste de la peau' },
        { id: 4, name: 'Gynécologie', description: 'Spécialiste de la femme' }
      ];
    }
  }
};