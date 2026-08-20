import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  TrendingUp,
  Activity,
  DollarSign,
  Clock,
  UserCheck,
  Stethoscope,
  Loader
} from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import RecentPatients from '../components/dashboard/RecentPatients';
import AppointmentsChart from '../components/dashboard/AppointmentsChart';
import QuickActions from '../components/dashboard/QuickActions';
import UpcomingAppointments from '../components/dashboard/UpcomingAppointments';
import ConnectionStatus from '../components/dashboard/ConnectionStatus';
import PeriodFilter from '../components/dashboard/PeriodFilter';
import { ROLES } from '../contexts/authConstants';
import { dashboardService } from '../services/dashboardService.js';
import { usePeriodFilter } from '../hooks/usePeriodFilter';

export default function Dashboard() {
  const { user, hasRole } = useAuth();

  const { dateRange } = usePeriodFilter();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('online'); // 'online', 'offline', 'error'

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]); // Recharger quand la période change

  useEffect(() => {
    // Polling automatique toutes les 30 secondes
    const interval = setInterval(() => {
      // N'effectuer le polling que si on est en ligne
      if (connectionStatus === 'online') {
        fetchDashboardData(true); // true pour indiquer que c'est un refresh automatique
      }
    }, 30000);

    // Écouter les événements de connexion/déconnexion
    const handleOnline = () => {
      setConnectionStatus('online');
      fetchDashboardData(true); // Refresh immédiat quand on revient en ligne
    };

    const handleOffline = () => {
      setConnectionStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup à la fermeture du composant
    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []); // CORRECTION: Suppression de [connectionStatus] qui causait la boucle infinie

  const fetchDashboardData = async (isAutoRefresh = false) => {
    try {
      if (isAutoRefresh) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      setConnectionStatus('online');

      if (hasRole(ROLES.ADMIN_CLINIQUE)) {
        const [overview, patientStats, appointmentStats, revenueStats] = await Promise.all([
          dashboardService.getDashboardOverview(),
          dashboardService.getPatientStats(dateRange.startDate, dateRange.endDate),
          dashboardService.getAppointmentStats(dateRange.startDate, dateRange.endDate),
          dashboardService.getRevenueStats(dateRange.startDate, dateRange.endDate)
        ]);

        setDashboardData({
          overview,
          patientStats,
          appointmentStats,
          revenueStats
        });
      } else {
        const overview = await dashboardService.getDashboardOverview();
        setDashboardData({ overview });
      }

      setLastUpdate(new Date());
      setConnectionStatus('online');
    } catch (err) {
      console.error('Erreur lors du chargement du dashboard:', err);

      // Différencier les types d'erreurs
      if (err.code === 'NETWORK_ERROR' || err.message.includes('Network Error')) {
        setConnectionStatus('offline');
        setError('Connexion réseau indisponible');
      } else {
        setConnectionStatus('error');
        setError('Erreur lors du chargement des données');
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const getDashboardContent = () => {
    if (hasRole(ROLES.ADMIN_CLINIQUE)) {
      const patientData = dashboardData?.patientStats || {};
      const appointmentData = dashboardData?.appointmentStats || {};
      const revenueData = dashboardData?.revenueStats || {};
      const overviewData = dashboardData?.overview || {};

      return {
        title: `Dashboard - ${user?.clinique?.name || 'Votre Clinique'}`,
        subtitle: 'Gestion de votre clinique',
        stats: [
          {
            title: "Total Patients",
            value: patientData.totalPatients?.toLocaleString() || "0",
            change: patientData.growthRate || 0,
            changeType: patientData.growthRate > 0 ? "increase" : patientData.growthRate < 0 ? "decrease" : "neutral",
            icon: Users
          },
          {
            title: "RDV Aujourd'hui",
            value: appointmentData.todayAppointments?.toString() || "0",
            change: appointmentData.completionRate || 0,
            changeType: appointmentData.completionRate > 80 ? "increase" : appointmentData.completionRate < 60 ? "decrease" : "neutral",
            icon: Calendar
          },
          {
            title: "Revenus Mensuel",
            value: `${revenueData.totalRevenue?.toLocaleString() || "0"} FCFA`,
            change: revenueData.growthRate || 0,
            changeType: revenueData.growthRate > 0 ? "increase" : revenueData.growthRate < 0 ? "decrease" : "neutral",
            icon: DollarSign
          },
          {
            title: "Médecins",
            value: overviewData.doctorSummary?.totalDoctors?.toString() || "0",
            change: 0,
            changeType: "neutral",
            icon: Stethoscope
          },
          {
            title: "Personnel",
            value: overviewData.doctorSummary?.activeDoctors?.toString() || "0",
            change: 0,
            changeType: "neutral",
            icon: UserCheck
          },
          {
            title: "Taux d'occupation",
            value: `${appointmentData.completionRate || 0}%`,
            change: appointmentData.completionRate || 0,
            changeType: appointmentData.completionRate > 80 ? "increase" : appointmentData.completionRate < 60 ? "decrease" : "neutral",
            icon: TrendingUp
          }
        ]
      };
    }

    if (hasRole(ROLES.MEDECIN)) {
      const overviewData = dashboardData?.overview || {};
      const appointmentData = dashboardData?.appointmentStats || {};

      return {
        title: `Dr. ${user?.lastName || 'Votre Espace'}`,
        subtitle: 'Vos consultations et patients',
        stats: [
          {
            title: "Patients Aujourd'hui",
            value: overviewData.patientSummary?.newPatientsThisMonth?.toString() || "0",
            change: overviewData.patientSummary?.growthRate || 0,
            changeType: overviewData.patientSummary?.growthRate > 0 ? "increase" : "neutral",
            icon: Users
          },
          {
            title: "RDV Aujourd'hui",
            value: appointmentData.todayAppointments?.toString() || "0",
            change: appointmentData.completionRate || 0,
            changeType: appointmentData.completionRate > 80 ? "increase" : "neutral",
            icon: Calendar
          },
          {
            title: "Ordonnances",
            value: overviewData.consultationSummary?.totalConsultations?.toString() || "0",
            change: overviewData.consultationSummary?.growthRate || 0,
            changeType: overviewData.consultationSummary?.growthRate > 0 ? "increase" : "neutral",
            icon: Activity
          },
          {
            title: "En attente",
            value: appointmentData.pendingAppointments?.toString() || "0",
            change: 0,
            changeType: "neutral",
            icon: Clock
          }
        ]
      };
    }

    if (hasRole(ROLES.RECEPTION)) {
      const patientData = dashboardData?.patientStats || {};
      const appointmentData = dashboardData?.appointmentStats || {};
      const revenueData = dashboardData?.revenueStats || {};

      return {
        title: 'Accueil & Caisse',
        subtitle: 'Gestion des patients et paiements',
        stats: [
          {
            title: "Patients Aujourd'hui",
            value: patientData.newPatientsInPeriod?.toString() || "0",
            change: patientData.growthRate || 0,
            changeType: patientData.growthRate > 0 ? "increase" : "neutral",
            icon: Users
          },
          {
            title: "RDV Aujourd'hui",
            value: appointmentData.todayAppointments?.toString() || "0",
            change: appointmentData.completionRate || 0,
            changeType: appointmentData.completionRate > 80 ? "increase" : "neutral",
            icon: Calendar
          },
          {
            title: "Encaissements",
            value: `${revenueData.paidAmount?.toLocaleString() || "0"} FCFA`,
            change: revenueData.growthRate || 0,
            changeType: revenueData.growthRate > 0 ? "increase" : "neutral",
            icon: DollarSign
          },
          {
            title: "En attente",
            value: appointmentData.pendingAppointments?.toString() || "0",
            change: 0,
            changeType: "neutral",
            icon: Clock
          }
        ]
      };
    }

    // SUPER_ADMIN default
    const overviewData = dashboardData?.overview || {};
    const patientData = dashboardData?.patientStats || {};
    const revenueData = dashboardData?.revenueStats || {};
    const appointmentData = dashboardData?.appointmentStats || {};

    return {
      title: 'Dashboard Global',
      subtitle: 'Vue d\'ensemble du système',
      stats: [
        {
          title: "Total Utilisateurs",
          value: patientData.totalPatients?.toString() || "0",
          change: patientData.growthRate || 0,
          changeType: patientData.growthRate > 0 ? "increase" : "neutral",
          icon: Users
        },
        {
          title: "Revenus Global",
          value: `€${revenueData.totalRevenue?.toLocaleString() || "0"}`,
          change: revenueData.growthRate || 0,
          changeType: revenueData.growthRate > 0 ? "increase" : "neutral",
          icon: DollarSign
        },
        {
          title: "Taux d'occupation",
          value: `${appointmentData.completionRate || 0}%`,
          change: appointmentData.completionRate || 0,
          changeType: appointmentData.completionRate > 80 ? "increase" : appointmentData.completionRate < 60 ? "decrease" : "neutral",
          icon: TrendingUp
        }
      ]
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Chargement du dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-red-500 text-center">
          <h3 className="text-lg font-semibold">Erreur de chargement</h3>
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const dashboardContent = getDashboardContent();
  const stats = dashboardContent.stats;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{dashboardContent.title}</h2>
          <p className="text-gray-600">{dashboardContent.subtitle}</p>
        </div>
        <div className="flex items-center space-x-4">
          <PeriodFilter />
          <ConnectionStatus status={connectionStatus} isRefreshing={isRefreshing} />
          <button
            onClick={() => fetchDashboardData()}
            disabled={isRefreshing}
            className={`px-3 py-1 text-sm text-white rounded transition-colors ${
              isRefreshing
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isRefreshing ? 'Actualisation...' : 'Actualiser'}
          </button>
          <div className="flex flex-col text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <span>Dernière mise à jour:</span>
              <span className="font-medium">
                {lastUpdate.toLocaleString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </span>
            </div>
            <div className="text-gray-400 mt-1">
              Actualisation automatique toutes les 30 secondes
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            icon={stat.icon}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AppointmentsChart />
        <QuickActions />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentPatients />
        <UpcomingAppointments />
      </div>
    </div>
  );
}