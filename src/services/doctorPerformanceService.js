import api from './api';

const doctorPerformanceService = {
  async getDoctorPerformance(startDate, endDate, doctorId = null) {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (doctorId) params.append('doctorId', doctorId);

      const queryString = params.toString();
      const url = `/admin/reports/doctors/performance${queryString ? `?${queryString}` : ''}`;

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des performances des médecins:', error);
      throw error;
    }
  },

  async getDoctorPerformanceById(doctorId, startDate, endDate) {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const queryString = params.toString();
      const url = `/admin/reports/doctors/${doctorId}/performance${queryString ? `?${queryString}` : ''}`;

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des performances du médecin ${doctorId}:`, error);
      throw error;
    }
  },

  async getTopPerformingDoctors(limit = 10, startDate, endDate) {
    try {
      const params = new URLSearchParams();
      params.append('limit', limit.toString());
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const queryString = params.toString();
      const url = `/admin/reports/doctors/top-performers?${queryString}`;

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des meilleurs médecins:', error);
      throw error;
    }
  }
};

export default doctorPerformanceService;