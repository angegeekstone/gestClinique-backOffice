import api from './api';

// Types
interface ApiParams {
  [key: string]: string | number | null | undefined;
}

interface NetworkError extends Error {
  code: string;
  originalError: any;
}

interface DashboardOverview {
  doctorSummary?: {
    totalDoctors: number;
    activeDoctors: number;
  };
  patientSummary?: {
    newPatientsThisMonth: number;
    growthRate: number;
  };
  consultationSummary?: {
    totalConsultations: number;
    growthRate: number;
  };
}

interface PatientStats {
  totalPatients: number;
  newPatientsInPeriod: number;
  growthRate: number;
}

interface AppointmentStats {
  todayAppointments: number;
  pendingAppointments: number;
  completionRate: number;
}

interface RevenueStats {
  totalRevenue: number;
  paidAmount: number;
  growthRate: number;
}

interface ChartDataPoint {
  name: string;
  consultations: number;
  rendezVous: number;
}

interface RecentPatient {
  id: number;
  firstName?: string;
  lastName?: string;
  name?: string;
  age?: number;
  dateOfBirth?: string;
  lastVisit?: string;
  createdAt?: string;
  status: string;
}

interface UpcomingAppointment {
  id: number;
  patientName?: string;
  patient?: {
    firstName?: string;
    lastName?: string;
    name?: string;
  };
  time?: string;
  appointmentTime?: string;
  startTime?: string;
  type?: string;
  consultationType?: string;
  reason?: string;
  room?: string;
  location?: string;
  status: string;
  duration?: string;
}

// Wrapper pour gérer les timeouts et erreurs réseau
const apiCall = async <T = any>(endpoint: string, params: ApiParams = {}): Promise<T> => {
  try {
    const response = await api.get(endpoint, {
      params,
      timeout: 10000 // Timeout de 10 secondes
    });
    return response.data;
  } catch (error: any) {
    // Enrichir l'erreur avec des informations de type
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED' || error.code === 'TIMEOUT') {
      const networkError = new Error('Network Error') as NetworkError;
      networkError.code = 'NETWORK_ERROR';
      networkError.originalError = error;
      throw networkError;
    }
    throw error;
  }
};

export const dashboardService = {
  getDashboardOverview: async (): Promise<DashboardOverview> => {
    return apiCall<DashboardOverview>('/admin/reports/dashboard/overview');
  },

  getPatientStats: async (startDate: string | null = null, endDate: string | null = null): Promise<PatientStats> => {
    const params: ApiParams = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    return apiCall<PatientStats>('/admin/reports/patients/stats', params);
  },

  getAppointmentStats: async (startDate: string | null = null, endDate: string | null = null): Promise<AppointmentStats> => {
    const params: ApiParams = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    return apiCall<AppointmentStats>('/admin/reports/appointments/stats', params);
  },

  getConsultationStats: async (startDate: string | null = null, endDate: string | null = null): Promise<any> => {
    const params: ApiParams = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    return apiCall('/admin/reports/consultations/stats', params);
  },

  getRevenueStats: async (startDate: string | null = null, endDate: string | null = null): Promise<RevenueStats> => {
    const params: ApiParams = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    return apiCall<RevenueStats>('/admin/reports/revenue/stats', params);
  },

  getRevenueByDoctor: async (startDate: string | null = null, endDate: string | null = null): Promise<any[]> => {
    const params: ApiParams = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    return apiCall<any[]>('/admin/reports/revenue/by-doctor', params);
  },

  getRevenueBySpeciality: async (startDate: string | null = null, endDate: string | null = null): Promise<any[]> => {
    const params: ApiParams = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    return apiCall<any[]>('/admin/reports/revenue/by-speciality', params);
  },

  getDoctorPerformance: async (doctorId: number | null = null, startDate: string | null = null, endDate: string | null = null): Promise<any> => {
    const params: ApiParams = {};
    if (doctorId) params.doctorId = doctorId;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    return apiCall('/admin/reports/doctors/performance', params);
  },

  getSpecialityStats: async (startDate: string | null = null, endDate: string | null = null): Promise<any> => {
    const params: ApiParams = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    return apiCall('/admin/reports/specialities/stats', params);
  },

  // Nouveaux endpoints pour les composants dashboard
  getAppointmentsChartData: async (period: string = 'week'): Promise<ChartDataPoint[]> => {
    return apiCall<ChartDataPoint[]>('/admin/reports/appointments/chart-data', { period });
  },

  getRecentPatients: async (limit: number = 5): Promise<RecentPatient[]> => {
    return apiCall<RecentPatient[]>('/admin/reports/patients/recent', { limit });
  },

  getUpcomingAppointments: async (date: string | null = null, limit: number = 10): Promise<UpcomingAppointment[]> => {
    const params: ApiParams = { limit };
    if (date) params.date = date;

    return apiCall<UpcomingAppointment[]>('/admin/reports/appointments/upcoming', params);
  }
};