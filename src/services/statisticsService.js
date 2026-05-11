import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Configuration Axios avec token
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT
apiClient.interceptors.request.use(
  (config) => {
    // Récupérer le token depuis l'objet user dans localStorage
    const user = localStorage.getItem('user');
    let token = null;

    if (user) {
      try {
        const userData = JSON.parse(user);
        token = userData.token;
      } catch (error) {
        console.error('Erreur parsing user data:', error);
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('🔴 Erreur dans l\'intercepteur:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      headers: error.config?.headers,
      data: error.response?.data
    });

    // Seulement rediriger pour des erreurs d'authentification vraies
    if (error.response?.status === 401) {
      console.warn('⚠️ Token expiré ou invalide - redirection vers login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      console.warn('⚠️ Accès refusé - permissions insuffisantes');
      // Ne pas rediriger automatiquement pour les 403, juste loguer
    }
    return Promise.reject(error);
  }
);

export const statisticsService = {
  // Récupérer vue d'ensemble des statistiques
  getOverviewStats: async (days = 30, startDate = null, endDate = null) => {
    try {
      const params = new URLSearchParams();
      if (days) params.append('days', days);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      // Debug : afficher le token et l'URL
      const user = localStorage.getItem('user');
      let token = null;

      if (user) {
        try {
          const userData = JSON.parse(user);
          token = userData.token;
        } catch (error) {
          console.error('Erreur parsing user data:', error);
        }
      }

      const url = `/admin/statistics/overview?${params}`;

      console.log('🔍 Debug API Call:');
      console.log('URL complète:', `${API_BASE_URL}${url}`);
      console.log('User stocké:', user ? JSON.parse(user) : 'Aucun');
      console.log('Token présent:', !!token);
      console.log('Token (50 premiers chars):', token ? token.substring(0, 50) + '...' : 'Aucun');

      // Vérifier que le token existe
      if (!token) {
        throw new Error('Aucun token d\'authentification trouvé - veuillez vous reconnecter');
      }

      // Utiliser l'endpoint correct pour les statistiques
      const response = await apiClient.get(`/admin/statistics/overview?${params}`);
      console.log('✅ Réponse API réussie:', {
        status: response.status,
        dataKeys: Object.keys(response.data || {}),
        dataSize: JSON.stringify(response.data || {}).length
      });
      return response.data;
    } catch (error) {
      console.error('❌ Erreur API détaillée:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        responseData: error.response?.data,
        requestHeaders: error.config?.headers
      });
      throw error;
    }
  },


  // Statistiques détaillées des patients
  getPatientsStats: async (startDate = null, endDate = null) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      console.log('🔍 Calling patients stats endpoint:', `/admin/statistics/patients/stats?${params}`);

      const response = await apiClient.get(`/admin/statistics/patients/stats?${params}`);

      console.log('✅ Patients stats response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des statistiques patients:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  },

  // Statistiques détaillées des consultations
  getConsultationsStats: async (startDate = null, endDate = null) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      console.log('🔍 Calling consultations stats endpoint:', `/admin/statistics/consultations/stats?${params}`);

      const response = await apiClient.get(`/admin/statistics/consultations/stats?${params}`);

      console.log('✅ Consultations stats response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des statistiques consultations:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  },

  // Statistiques de performance des médecins
  getDoctorsPerformance: async (startDate = null, endDate = null) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      console.log('🔍 Calling doctors stats endpoint:', `/admin/statistics/doctors/stats?${params}`);

      const response = await apiClient.get(`/admin/statistics/doctors/stats?${params}`);

      console.log('✅ Doctors stats response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des statistiques médecins:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  },

  // Statistiques détaillées de performance des médecins
  getDoctorsDetailedPerformance: async (startDate = null, endDate = null) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      console.log('🔍 Calling detailed doctors performance endpoint:', `/admin/reports/doctors/performance?${params}`);

      const response = await apiClient.get(`/admin/reports/doctors/performance?${params}`);

      console.log('✅ Detailed doctors performance response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des performances détaillées des médecins:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  },

  // Exporter les rapports (à implémenter)
  exportReport: async (type, format = 'PDF', startDate = null, endDate = null) => {
    try {
      const params = new URLSearchParams();
      params.append('format', format);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await apiClient.get(`/admin/reports/export/${type}?${params}`, {
        responseType: 'blob'
      });

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `rapport_${type}_${new Date().toISOString().split('T')[0]}.${format.toLowerCase()}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors de l\'export du rapport:', error);
      throw error;
    }
  },

  // Statistiques en temps réel
  getRealTimeStats: async () => {
    try {
      const stats = await statisticsService.getOverviewStats(1);
      return stats;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques temps réel:', error);
      throw error;
    }
  },

  // Générer des données de test
  generateTestData: async () => {
    try {
      const response = await apiClient.post('/admin/test-data/generate');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la génération des données de test:', error);
      throw error;
    }
  }
};

// Utilitaires pour le formatage des données
export const formatters = {
  // Formater les nombres
  formatNumber: (num) => {
    if (num === null || num === undefined) return '0';
    return num.toLocaleString('fr-FR');
  },

  // Formater les pourcentages
  formatPercentage: (num, decimals = 1) => {
    if (num === null || num === undefined) return '0%';
    return `${num.toFixed(decimals)}%`;
  },

  // Formater les montants
  formatCurrency: (amount) => {
    if (amount === null || amount === undefined) return '0 FCFA';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(amount);
  },

  // Formater les dates
  formatDate: (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR');
  },

  // Formater les dates avec heure
  formatDateTime: (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  // Formater la durée en minutes
  formatDuration: (minutes) => {
    if (!minutes) return '0 min';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  },

  // Obtenir la couleur selon la valeur
  getStatusColor: (status) => {
    const colors = {
      'success': 'text-green-600 bg-green-100',
      'warning': 'text-yellow-600 bg-yellow-100',
      'error': 'text-red-600 bg-red-100',
      'info': 'text-blue-600 bg-blue-100',
      'neutral': 'text-gray-600 bg-gray-100'
    };
    return colors[status] || colors.neutral;
  }
};