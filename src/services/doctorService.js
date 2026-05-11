import api from './api';

export const doctorService = {
  async getDoctorsBySpeciality(specialityId) {
    const response = await api.get(`/reception/doctors/speciality/${specialityId}`);
    return response.data.map(doctor => ({
      id: doctor.id,
      name: `Dr. ${doctor.firstName} ${doctor.lastName}`,
      specialty: doctor.specialityName,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      email: doctor.email,
      phoneNumber: doctor.phoneNumber
    }));
  },

  async getAvailableSlots(doctorId, date) {
    const response = await api.get(`/reception/doctors/${doctorId}/available-slots`, {
      params: { date }
    });
    return response.data;
  },

  async getDoctorWorkload(doctorId) {
    const response = await api.get(`/reception/doctors/${doctorId}/workload`);
    return response.data;
  }
};