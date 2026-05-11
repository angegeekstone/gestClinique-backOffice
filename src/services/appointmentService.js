import api from './api';

export const appointmentService = {
  async createAppointment(appointmentData) {
    try {
      const response = await api.post('/reception/appointments', appointmentData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du rendez-vous:', error);
      throw error;
    }
  },

  async getAppointmentsByPatient(patientId) {
    try {
      const response = await api.get(`/reception/appointments/patient/${patientId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous du patient:', error);
      throw error;
    }
  },

  async getAppointmentsByDoctor(doctorId) {
    try {
      const response = await api.get(`/reception/appointments/doctor/${doctorId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous du médecin:', error);
      throw error;
    }
  },

  async getAppointmentsBetweenDates(startDate, endDate) {
    try {
      const response = await api.get('/reception/appointments/date-range', {
        params: {
          start: startDate,
          end: endDate
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous:', error);
      throw error;
    }
  },

  async updateAppointment(appointmentId, appointmentData) {
    try {
      const response = await api.put(`/reception/appointments/${appointmentId}`, appointmentData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rendez-vous:', error);
      throw error;
    }
  },

  async cancelAppointment(appointmentId) {
    try {
      const response = await api.patch(`/reception/appointments/${appointmentId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'annulation du rendez-vous:', error);
      throw error;
    }
  },

  async deleteAppointment(appointmentId) {
    try {
      await api.delete(`/reception/appointments/${appointmentId}`);
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du rendez-vous:', error);
      throw error;
    }
  }
};