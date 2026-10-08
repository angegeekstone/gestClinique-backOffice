import api from './api';

const handleResponse = (response) => response.data;

const handleError = (error) => {
  if (error.response?.status === 401) throw new Error('Authentication required');
  if (error.response?.status === 403) throw new Error('Access denied');
  throw error;
};

export const prescriptionService = {
  getPrescriptionsByDoctor: (doctorId) =>
    api.get(`/medecin/prescriptions/doctor/${doctorId}`).then(handleResponse).catch(handleError),

  getPrescriptionsByPatient: (patientId) =>
    api.get(`/medecin/prescriptions/patient/${patientId}`).then(handleResponse).catch(handleError),

  getActivePrescriptionsByPatient: (patientId) =>
    api.get(`/medecin/prescriptions/patient/${patientId}/active`).then(handleResponse).catch(handleError),

  getPrescriptionById: (id) =>
    api.get(`/medecin/prescriptions/${id}`).then(handleResponse).catch(handleError),

  createPrescription: (data) =>
    api.post('/medecin/prescriptions', data).then(handleResponse).catch(handleError),

  updatePrescription: (id, data) =>
    api.put(`/medecin/prescriptions/${id}`, data).then(handleResponse).catch(handleError),

  deletePrescription: (id) =>
    api.delete(`/medecin/prescriptions/${id}`).then(handleResponse).catch(handleError),
};

export default prescriptionService;