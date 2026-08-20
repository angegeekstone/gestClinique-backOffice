import api from './api';

const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await api.get(endpoint, options);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Authentication required');
    }
    if (error.response?.status === 403) {
      throw new Error('Access denied');
    }
    if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
      const networkError = new Error('Network connection failed');
      networkError.code = 'NETWORK_ERROR';
      throw networkError;
    }
    throw error;
  }
};

export const dashboardService = {
  getDashboardOverview: () =>
    apiCall('/dashboard/overview'),

  getPatientStats: (startDate, endDate) =>
    apiCall(`/dashboard/patient-stats?startDate=${startDate}&endDate=${endDate}`),

  getAppointmentStats: (startDate, endDate) =>
    apiCall(`/dashboard/appointment-stats?startDate=${startDate}&endDate=${endDate}`),

  getRevenueStats: (startDate, endDate) =>
    apiCall(`/dashboard/revenue-stats?startDate=${startDate}&endDate=${endDate}`),

  getRecentPatients: (limit = 5) =>
    apiCall(`/dashboard/recent-patients?limit=${limit}`),

  getUpcomingAppointments: (date, limit = 4) =>
    apiCall(`/dashboard/upcoming-appointments?date=${date}&limit=${limit}`),

  getAppointmentsChartData: (period = 'week') =>
    apiCall(`/dashboard/appointments-chart?period=${period}`),
};

export default dashboardService;