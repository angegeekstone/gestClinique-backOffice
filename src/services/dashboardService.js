import api from './api';

// Mode fallback avec données mock - À activer temporairement
const FALLBACK_MODE = true;

const mockData = {
  overview: {
    patientSummary: {
      totalPatients: 1250,
      newPatientsToday: 8,
      newPatientsThisMonth: 142,
      growthRate: 12.5
    },
    doctorSummary: {
      totalDoctors: 15,
      activeDoctors: 12,
      availableToday: 8
    },
    consultationSummary: {
      totalConsultations: 3420,
      todayConsultations: 24,
      thisMonthConsultations: 687,
      growthRate: 8.3
    },
    revenueSummary: {
      totalRevenue: 125000,
      thisMonthRevenue: 18500,
      growthRate: 15.2
    }
  },
  patientStats: {
    totalPatients: 1250,
    newPatientsInPeriod: 142,
    growthRate: 12.5
  },
  appointmentStats: {
    todayAppointments: 24,
    pendingAppointments: 8,
    completionRate: 85,
    totalAppointments: 156
  },
  revenueStats: {
    totalRevenue: 125000,
    paidAmount: 18500,
    pendingAmount: 2300,
    growthRate: 15.2
  }
};

const mockRecentPatients = [
  {
    id: 1,
    firstName: "Jean",
    lastName: "Dupont",
    age: 45,
    lastVisit: "2026-02-27T10:30:00Z",
    status: "ACTIVE"
  },
  {
    id: 2,
    firstName: "Marie",
    lastName: "Martin",
    age: 32,
    lastVisit: "2026-02-26T14:15:00Z",
    status: "FOLLOW_UP"
  },
  {
    id: 3,
    firstName: "Pierre",
    lastName: "Bernard",
    age: 58,
    lastVisit: "2026-02-26T09:45:00Z",
    status: "COMPLETED"
  },
  {
    id: 4,
    firstName: "Anne",
    lastName: "Rousseau",
    age: 29,
    lastVisit: "2026-02-25T16:20:00Z",
    status: "ACTIVE"
  },
  {
    id: 5,
    firstName: "Paul",
    lastName: "Leroy",
    age: 67,
    lastVisit: "2026-02-25T11:10:00Z",
    status: "COMPLETED"
  }
];

const mockUpcomingAppointments = [
  {
    id: 1,
    patientName: "Sophie Leblanc",
    time: "14:30",
    type: "Consultation générale",
    status: "CONFIRMED",
    room: "Cabinet 1"
  },
  {
    id: 2,
    patientName: "Marc Petit",
    time: "15:00",
    type: "Suivi",
    status: "PENDING",
    room: "Cabinet 2"
  },
  {
    id: 3,
    patientName: "Claire Moreau",
    time: "15:30",
    type: "Consultation spécialisée",
    status: "URGENT",
    room: "Cabinet 1"
  },
  {
    id: 4,
    patientName: "Thomas Blanc",
    time: "16:00",
    type: "Contrôle",
    status: "CONFIRMED",
    room: "Cabinet 3"
  }
];

const mockChartData = [
  { name: 'Lun', consultations: 12, rendezVous: 18 },
  { name: 'Mar', consultations: 15, rendezVous: 22 },
  { name: 'Mer', consultations: 8, rendezVous: 14 },
  { name: 'Jeu', consultations: 18, rendezVous: 25 },
  { name: 'Ven', consultations: 14, rendezVous: 20 },
  { name: 'Sam', consultations: 6, rendezVous: 10 },
  { name: 'Dim', consultations: 3, rendezVous: 5 }
];

const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 300));

const apiCall = async (endpoint, options = {}) => {
  if (FALLBACK_MODE) {
    console.log(`🔧 FALLBACK MODE: Simulating API call to ${endpoint}`);
    await simulateDelay();

    // Return different mock data based on endpoint
    if (endpoint.includes('overview')) return mockData.overview;
    if (endpoint.includes('patient-stats')) return mockData.patientStats;
    if (endpoint.includes('appointment-stats')) return mockData.appointmentStats;
    if (endpoint.includes('revenue-stats')) return mockData.revenueStats;

    return mockData.overview; // Default fallback
  }

  try {
    const response = await api.get(endpoint, options);
    return response.data;
  } catch (error) {
    console.error(`API Error for ${endpoint}:`, error);

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
  // Dashboard overview
  getDashboardOverview: async () => {
    if (FALLBACK_MODE) {
      console.log('📊 Using mock dashboard overview data');
      await simulateDelay();
      return mockData.overview;
    }
    return apiCall('/dashboard/overview');
  },

  // Patient statistics
  getPatientStats: async (startDate, endDate) => {
    if (FALLBACK_MODE) {
      console.log('👥 Using mock patient stats data');
      await simulateDelay();
      return mockData.patientStats;
    }
    return apiCall(`/dashboard/patient-stats?startDate=${startDate}&endDate=${endDate}`);
  },

  // Appointment statistics
  getAppointmentStats: async (startDate, endDate) => {
    if (FALLBACK_MODE) {
      console.log('📅 Using mock appointment stats data');
      await simulateDelay();
      return mockData.appointmentStats;
    }
    return apiCall(`/dashboard/appointment-stats?startDate=${startDate}&endDate=${endDate}`);
  },

  // Revenue statistics
  getRevenueStats: async (startDate, endDate) => {
    if (FALLBACK_MODE) {
      console.log('💰 Using mock revenue stats data');
      await simulateDelay();
      return mockData.revenueStats;
    }
    return apiCall(`/dashboard/revenue-stats?startDate=${startDate}&endDate=${endDate}`);
  },

  // Recent patients
  getRecentPatients: async (limit = 5) => {
    if (FALLBACK_MODE) {
      console.log('👤 Using mock recent patients data');
      await simulateDelay();
      return mockRecentPatients.slice(0, limit);
    }
    return apiCall(`/dashboard/recent-patients?limit=${limit}`);
  },

  // Upcoming appointments
  getUpcomingAppointments: async (date, limit = 4) => {
    if (FALLBACK_MODE) {
      console.log('⏰ Using mock upcoming appointments data');
      await simulateDelay();
      return mockUpcomingAppointments.slice(0, limit);
    }
    return apiCall(`/dashboard/upcoming-appointments?date=${date}&limit=${limit}`);
  },

  // Chart data for appointments
  getAppointmentsChartData: async (period = 'week') => {
    if (FALLBACK_MODE) {
      console.log('📈 Using mock chart data');
      await simulateDelay();
      return mockChartData;
    }
    return apiCall(`/dashboard/appointments-chart?period=${period}`);
  }
};

export default dashboardService;