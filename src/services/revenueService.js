import api from './api';

const revenueService = {
  async getRevenueByDoctor(startDate, endDate, doctorId = null) {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (doctorId) params.append('doctorId', doctorId);

      const queryString = params.toString();
      const url = `/admin/reports/revenue/by-doctor${queryString ? `?${queryString}` : ''}`;

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des revenus par médecin:', error);
      throw error;
    }
  },

  async getRevenueBySpeciality(startDate, endDate, specialityId = null) {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (specialityId) params.append('specialityId', specialityId);

      const queryString = params.toString();
      const url = `/admin/reports/revenue/by-speciality${queryString ? `?${queryString}` : ''}`;

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des revenus par spécialité:', error);
      throw error;
    }
  },

  async getTotalRevenue(startDate, endDate) {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const queryString = params.toString();
      const url = `/admin/reports/revenue/total${queryString ? `?${queryString}` : ''}`;

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du chiffre d\'affaires total:', error);
      throw error;
    }
  },

  async getTopEarningDoctors(limit = 10, startDate, endDate) {
    try {
      const params = new URLSearchParams();
      params.append('limit', limit.toString());
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const queryString = params.toString();
      const url = `/admin/reports/revenue/top-doctors?${queryString}`;

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des médecins les plus rentables:', error);
      throw error;
    }
  },

  async getCollectionRateAnalysis(startDate, endDate) {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const queryString = params.toString();
      const url = `/admin/reports/revenue/collection-rate${queryString ? `?${queryString}` : ''}`;

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'analyse du taux d\'encaissement:', error);
      throw error;
    }
  },

  async getRevenueStats(startDate, endDate) {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const queryString = params.toString();
      const url = `/admin/reports/revenue/stats${queryString ? `?${queryString}` : ''}`;

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques de revenus:', error);
      throw error;
    }
  },

  async getRevenueByPaymentMethod(startDate, endDate) {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const queryString = params.toString();
      const url = `/admin/reports/revenue/by-payment-method${queryString ? `?${queryString}` : ''}`;

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des revenus par méthode de paiement:', error);
      throw error;
    }
  }
};

export default revenueService;