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
  Loader,
  RefreshCw
} from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import RecentPatients from '../components/dashboard/RecentPatients';
import AppointmentsChart from '../components/dashboard/AppointmentsChart';
import QuickActions from '../components/dashboard/QuickActions';
import UpcomingAppointments from '../components/dashboard/UpcomingAppointments';
import PeriodFilter from '../components/dashboard/PeriodFilter';
import { dashboardService } from '../services/dashboardService.js';
import { usePeriodFilter } from '../hooks/usePeriodFilter';

export default function DashboardNew() {
  const { dateRange, displayLabel } = usePeriodFilter();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Chargement initial des données
  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Charger les données principales
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

      setLastUpdate(new Date());
    } catch (err) {
      console.error('Erreur chargement dashboard:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh toutes les 60 secondes (plus raisonnable que 30s)
  useEffect(() => {
    const interval = setInterval(() => {
      loadDashboardData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-red-500 text-center">
          <h3 className="text-lg font-semibold">Erreur de chargement</h3>
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={loadDashboardData}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const patientData = dashboardData?.patientStats || {};
  const appointmentData = dashboardData?.appointmentStats || {};
  const revenueData = dashboardData?.revenueStats || {};
  const overviewData = dashboardData?.overview || {};

  const stats = [
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
      value: `€${revenueData.totalRevenue?.toLocaleString() || "0"}`,
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
      title: "Personnel Actif",
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
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Clinique</h1>
          <p className="text-gray-600">Vue d'ensemble de votre activité</p>
        </div>

        <div className="flex items-center space-x-4">
          <PeriodFilter />

          <button
            onClick={loadDashboardData}
            disabled={loading}
            className={`flex items-center space-x-2 px-3 py-2 text-sm rounded transition-colors ${
              loading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Actualisation...' : 'Actualiser'}</span>
          </button>

          <div className="text-xs text-gray-500">
            <div>Dernière mise à jour:</div>
            <div className="font-medium">
              {lastUpdate.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Période sélectionnée */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <span className="text-blue-800 font-medium">Période: {displayLabel}</span>
          <span className="text-blue-600 text-sm">
            ({dateRange.startDate} au {dateRange.endDate})
          </span>
        </div>
      </div>

      {/* Statistiques principales */}
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

      {/* Graphiques et actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AppointmentsChart />
        <QuickActions />
      </div>

      {/* Données détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentPatients />
        <UpcomingAppointments />
      </div>

      {/* Indicateur de status */}
      {error && (
        <div className="bg-orange-50 border border-orange-200 rounded p-4">
          <div className="flex items-center text-orange-800">
            <Activity className="w-4 h-4 mr-2" />
            <span className="text-sm">Mode données simulées actif</span>
          </div>
        </div>
      )}
    </div>
  );
}