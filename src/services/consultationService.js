import api from './api';

const handleResponse = (response) => response.data;

const handleError = (error) => {
  if (error.response?.status === 401) throw new Error('Authentication required');
  if (error.response?.status === 403) throw new Error('Access denied');
  throw error;
};

export const consultationService = {
  createConsultation: (data) =>
    api.post('/medecin/consultations', data).then(handleResponse).catch(handleError),

  getConsultations: (params = {}) =>
    api.get('/medecin/consultations', { params }).then(handleResponse).catch(handleError),

  getConsultationById: (id) =>
    api.get(`/medecin/consultations/${id}`).then(handleResponse).catch(handleError),
};

export default consultationService;