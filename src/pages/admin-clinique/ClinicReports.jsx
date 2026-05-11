import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { statisticsService, formatters } from '../../services/statisticsService';
import ToastContainer from '../../components/common/ToastContainer';
import { useToast } from '../../hooks/useToast';
import RevenueMetricsCards from '../../components/revenue/RevenueMetricsCards';
import DoctorRevenueTable from '../../components/revenue/DoctorRevenueTable';
import SpecialityRevenueChart from '../../components/revenue/SpecialityRevenueChart';
import CollectionRateChart from '../../components/revenue/CollectionRateChart';
import {
  BarChart3,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  RefreshCw,
  Clock,
  Stethoscope,
  AlertCircle,
  Check,
  X,
  Activity,
  UserCheck
} from 'lucide-react';

export default function ClinicReports() {
  const { toasts, showSuccess, showError, showInfo, removeToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  // Données des rapports
  const [stats, setStats] = useState({
    patients: { total: 0, nouveaux: 0, variation: 0 },
    consultations: { total: 0, completed: 0, variation: 0 },
    appointments: { total: 0, cancelled: 0, noShow: 0 },
    doctors: { total: 0, active: 0 }
  });

  const [patientData, setPatientData] = useState([]);
  const [patientStatsDetailed, setPatientStatsDetailed] = useState(null);
  const [consultationData, setConsultationData] = useState([]);
  const [consultationStatsDetailed, setConsultationStatsDetailed] = useState(null);
  const [appointmentData, setAppointmentData] = useState([]);
  const [doctorStats, setDoctorStats] = useState([]);
  const [doctorStatsDetailed, setDoctorStatsDetailed] = useState(null);
  const [doctorPerformanceDetailed, setDoctorPerformanceDetailed] = useState(null);
  const [specialityStats, setSpecialityStats] = useState([]);

  useEffect(() => {
    loadReportData();
  }, [dateRange]);


  const loadReportData = async () => {
    try {
      setLoading(true);

      // Charger les statistiques réelles depuis les nouvelles API
      const [overviewData, patientsDetailedStats, consultationsDetailedStats, doctorsDetailedStats, doctorsPerformanceDetailed] = await Promise.all([
        statisticsService.getOverviewStats(30, dateRange.startDate, dateRange.endDate),
        statisticsService.getPatientsStats(dateRange.startDate, dateRange.endDate),
        statisticsService.getConsultationsStats(dateRange.startDate, dateRange.endDate),
        statisticsService.getDoctorsPerformance(dateRange.startDate, dateRange.endDate),
        statisticsService.getDoctorsDetailedPerformance(dateRange.startDate, dateRange.endDate)
      ]);

      // Stocker les statistiques détaillées
      setPatientStatsDetailed(patientsDetailedStats);
      setConsultationStatsDetailed(consultationsDetailedStats);
      setDoctorStatsDetailed(doctorsDetailedStats);
      setDoctorPerformanceDetailed(doctorsPerformanceDetailed);

      // Mettre à jour les statistiques avec les données réelles (utiliser les données détaillées pour patients)
      setStats({
        patients: {
          total: patientsDetailedStats?.totalPatients || overviewData.patients?.totalPatients || 0,
          nouveaux: patientsDetailedStats?.newPatientsThisMonth || overviewData.patients?.newPatientsThisMonth || 0,
          variation: patientsDetailedStats?.growthRate || overviewData.patients?.growthRate || 0
        },
        consultations: {
          total: consultationsDetailedStats?.totalConsultations || overviewData.consultations?.totalConsultations || 0,
          completed: consultationsDetailedStats?.completedConsultations || overviewData.consultations?.completedConsultations || 0,
          variation: consultationsDetailedStats?.completionRate || overviewData.consultations?.completionRate || 0,
          cancelled: consultationsDetailedStats?.cancelledConsultations || 0,
          averageDuration: consultationsDetailedStats?.averageDurationMinutes || 0
        },
        appointments: {
          total: overviewData.appointments?.totalAppointments || 0,
          cancelled: overviewData.appointments?.cancelledAppointments || 0,
          noShow: overviewData.appointments?.noShowAppointments || 0,
          pending: overviewData.appointments?.scheduledAppointments || 0,
          completionRate: overviewData.appointments?.completionRate || 0
        },
        doctors: {
          total: doctorsDetailedStats?.totalDoctors || overviewData.doctors?.totalDoctors || 0,
          active: doctorsDetailedStats?.activeDoctors || overviewData.doctors?.activeDoctors || 0
        }
      });

      // Statistiques des médecins - utiliser uniquement les données réelles
      const realDoctorStats = overviewData.doctors?.topPerformers || [];
      setDoctorStats(realDoctorStats.map(doctor => ({
        id: doctor.doctorId,
        name: doctor.doctorName,
        speciality: doctor.speciality,
        consultations: doctor.totalConsultations,
        patients: doctor.totalPatients, // Utiliser les vraies données de patients
        revenus: doctor.totalRevenue,
        satisfaction: doctor.averageRating?.toFixed(1) || "N/A",
        status: "active"
      })));

      // Statistiques par spécialité - utiliser les données détaillées en priorité
      const realSpecialityStats = doctorsDetailedStats?.specialityDistribution || overviewData.doctors?.specialityDistribution || [];
      setSpecialityStats(realSpecialityStats.map(speciality => ({
        id: speciality.specialityId,
        name: speciality.specialityName,
        patients: speciality.patientCount,
        consultations: speciality.consultationCount,
        revenus: speciality.totalRevenue,
        part: overviewData.revenue?.totalRevenue > 0
          ? ((speciality.totalRevenue / overviewData.revenue.totalRevenue) * 100).toFixed(1)
          : "0",
        doctorsCount: speciality.doctorCount,
        patientsCount: speciality.patientCount // Correction du nom de propriété
      })));

      // Données temporelles - utiliser les données détaillées des consultations
      const realConsultationData = consultationsDetailedStats?.dailyActivity || overviewData.consultations?.dailyActivity || [];
      setConsultationData(realConsultationData.map(day => ({
        date: day.date,
        consultations: day.count,
        revenus: day.value || (day.count * 150) // Utiliser la valeur réelle ou estimation
      })));

      const realAppointmentData = overviewData.appointments?.dailyBookings || [];
      setAppointmentData(realAppointmentData.map(day => ({
        date: day.date,
        rendezVous: day.count,
        confirmés: Math.round(day.count * 0.9),
        annulés: Math.round(day.count * 0.1)
      })));

      // Utiliser les données détaillées des patients
      const realPatientGrowth = patientsDetailedStats?.monthlyGrowth || overviewData.patients?.monthlyGrowth || [];
      setPatientData(realPatientGrowth.map(month => ({
        date: `${month.month}-01`,
        nouveaux: month.count,
        retours: Math.round(month.count * 1.5),
        percentage: month.percentage
      })));

      showSuccess('Données des rapports chargées avec succès');

    } catch (error) {
      console.error('Erreur chargement rapports:', error);
      showError('Erreur lors du chargement des données de rapport: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (type) => {
    try {
      showInfo(`Préparation de l'export ${type}...`);
      await statisticsService.exportReport(activeTab, type, dateRange.startDate, dateRange.endDate);
      showSuccess(`Rapport ${activeTab} exporté en ${type} avec succès`);
    } catch (error) {
      console.error('Erreur export:', error);
      showError('Erreur lors de l\'export du rapport: ' + error.message);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'consultations', label: 'Consultations', icon: Stethoscope },
    { id: 'performance', label: 'Performance', icon: Activity }
  ];

  const StatCard = ({ title, value, subValue, change, icon: Icon, color, onClick = null }) => (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{typeof value === 'number' ? value.toLocaleString() : value}</p>
          <p className="text-sm text-gray-500">{subValue}</p>
        </div>
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {change !== undefined && (
        <div className="mt-4 flex items-center">
          {change >= 0 ? (
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
          )}
          <span className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
          <span className="text-sm text-gray-500 ml-1">vs période précédente</span>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rapports Clinique</h1>
          <p className="text-gray-600">Analyses et statistiques de votre clinique</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <span className="text-gray-500">à</span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <button
            onClick={() => exportReport('PDF')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <TabIcon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Vue d'ensemble */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Statistiques principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Patients"
                  value={formatters.formatNumber(stats.patients.total)}
                  subValue={`+${formatters.formatNumber(stats.patients.nouveaux)} nouveaux`}
                  change={stats.patients.variation}
                  icon={Users}
                  color="bg-blue-500"
                  onClick={() => setActiveTab('patients')}
                />
                <StatCard
                  title="Consultations"
                  value={formatters.formatNumber(stats.consultations.total)}
                  subValue={`${formatters.formatNumber(stats.consultations.completed)} terminées`}
                  change={stats.consultations.variation}
                  icon={Stethoscope}
                  color="bg-green-500"
                  onClick={() => setActiveTab('consultations')}
                />
                <StatCard
                  title="Rendez-vous"
                  value={formatters.formatNumber(stats.appointments.total)}
                  subValue={`${formatters.formatNumber(stats.appointments.cancelled)} annulés`}
                  change={stats.appointments.noShowRate || 0}
                  icon={Calendar}
                  color="bg-purple-500"
                />
                <StatCard
                  title="Équipe Médicale"
                  value={formatters.formatNumber(stats.doctors.total)}
                  subValue={`${formatters.formatNumber(stats.doctors.active)} médecins actifs`}
                  change={0}
                  icon={UserCheck}
                  color="bg-indigo-500"
                  onClick={() => setActiveTab('performance')}
                />
              </div>

              {/* Graphique d'activité */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-blue-600" />
                  Activité des 7 derniers jours
                </h3>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {consultationData.map((day, index) => {
                    const maxValue = Math.max(...consultationData.map(d => d.consultations));
                    const height = (day.consultations / maxValue) * 200;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div
                          className="bg-blue-500 rounded-t w-full min-h-[20px]"
                          style={{ height: `${height}px` }}
                        />
                        <span className="text-xs text-gray-500 mt-2">
                          {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
                        </span>
                        <span className="text-xs font-medium text-gray-700">{day.consultations}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Répartition par spécialité */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Stethoscope className="w-5 h-5 mr-2 text-blue-600" />
                  Répartition par Spécialité
                </h3>
                <div className="grid gap-4">
                  {specialityStats.map((spec) => (
                    <div key={spec.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{spec.name}</h4>
                        <p className="text-sm text-gray-600">{spec.doctorsCount} médecin(s)</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatters.formatNumber(spec.consultations)} consultations</p>
                        <p className="text-sm text-gray-600">{formatters.formatNumber(spec.patientsCount)} patients</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Rapport Patients */}
          {activeTab === 'patients' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                  title="Patients Actifs"
                  value={patientStatsDetailed?.activePatients || stats.patients.total}
                  subValue="Total enregistrés"
                  change={patientStatsDetailed?.growthRate || stats.patients.variation}
                  icon={Users}
                  color="bg-blue-500"
                />
                <StatCard
                  title="Nouveaux Patients"
                  value={patientStatsDetailed?.newPatientsThisMonth || stats.patients.nouveaux}
                  subValue="Ce mois-ci"
                  change={patientStatsDetailed?.growthRate || stats.patients.variation}
                  icon={UserCheck}
                  color="bg-green-500"
                />
                <StatCard
                  title="Total Patients"
                  value={patientStatsDetailed?.totalPatients || stats.patients.total}
                  subValue="Base de données"
                  icon={Users}
                  color="bg-indigo-500"
                />
                <StatCard
                  title="Taux de Croissance"
                  value={`${formatters.formatPercentage(patientStatsDetailed?.growthRate || stats.patients.variation)}`}
                  subValue="Nouveaux vs Total"
                  icon={TrendingUp}
                  color="bg-purple-500"
                />
              </div>


              {/* Graphique de croissance mensuelle des patients */}
              {patientStatsDetailed && patientStatsDetailed.monthlyGrowth && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                    Évolution des Nouveaux Patients (6 derniers mois)
                  </h3>
                  <div className="h-64 flex items-end justify-between space-x-2">
                    {patientStatsDetailed.monthlyGrowth.map((month, index) => {
                      const maxValue = Math.max(...patientStatsDetailed.monthlyGrowth.map(m => m.count));
                      const height = maxValue > 0 ? (month.count / maxValue) * 200 : 20;
                      const monthName = new Date(month.month + '-01').toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div className="text-xs text-gray-600 mb-1">{month.percentage.toFixed(1)}%</div>
                          <div
                            className="bg-green-500 rounded-t w-full min-h-[20px] flex items-end justify-center text-white text-xs font-medium"
                            style={{ height: `${height}px` }}
                          >
                            {month.count > 0 && <span className="pb-1">{month.count}</span>}
                          </div>
                          <span className="text-xs text-gray-500 mt-2">{monthName}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Liste des médecins avec leurs patients */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition des Patients par Médecin</h3>
                <div className="grid gap-4">
                  {doctorStats.map((doctor) => (
                    <div key={doctor.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <Stethoscope className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                          <p className="text-sm text-gray-600">{doctor.speciality}</p>
                          <div className="flex items-center mt-1">
                            <span className="text-yellow-500 text-sm">★</span>
                            <span className="text-sm text-gray-600 ml-1">{doctor.satisfaction} satisfaction</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-3">
                        <div className="flex items-center space-x-6">
                          <div className="text-center">
                            <p className="text-lg font-bold text-blue-600">{formatters.formatNumber(doctor.consultations)}</p>
                            <p className="text-xs text-gray-500">Consultations</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-green-600">{formatters.formatNumber(doctor.patients || Math.round(doctor.consultations * 1.4))}</p>
                            <p className="text-xs text-gray-500">{doctor.patients ? 'Patients réels' : 'Patients estimés'}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-purple-600">{formatters.formatCurrency(doctor.revenus || 0)}</p>
                            <p className="text-xs text-gray-500">Revenus</p>
                          </div>
                        </div>
                        {/* Barre de progression des consultations */}
                        <div className="w-48">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Performance</span>
                            <span>{((doctor.consultations / Math.max(...doctorStats.map(d => d.consultations))) * 100).toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${(doctor.consultations / Math.max(...doctorStats.map(d => d.consultations))) * 100}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Rapport Consultations */}
          {activeTab === 'consultations' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                  title="Total Consultations"
                  value={consultationStatsDetailed?.totalConsultations || stats.consultations.total}
                  subValue="Ce mois-ci"
                  change={consultationStatsDetailed?.completionRate || stats.consultations.variation}
                  icon={Stethoscope}
                  color="bg-blue-500"
                />
                <StatCard
                  title="Consultations Terminées"
                  value={consultationStatsDetailed?.completedConsultations || stats.consultations.completed}
                  subValue={`Taux: ${formatters.formatPercentage(consultationStatsDetailed?.completionRate || stats.consultations.variation)}`}
                  change={consultationStatsDetailed?.completionRate || stats.consultations.variation}
                  icon={Check}
                  color="bg-green-500"
                />
                <StatCard
                  title="Consultations Annulées"
                  value={consultationStatsDetailed?.cancelledConsultations || stats.consultations.cancelled}
                  subValue="Ce mois-ci"
                  icon={X}
                  color="bg-red-500"
                />
                <StatCard
                  title="Durée Moyenne"
                  value={consultationStatsDetailed?.averageDurationMinutes > 0 ?
                    formatters.formatDuration(consultationStatsDetailed.averageDurationMinutes) : "N/A"}
                  subValue="Par consultation"
                  icon={Clock}
                  color="bg-purple-500"
                />
              </div>

              {/* Graphique d'activité quotidienne */}
              {consultationStatsDetailed && consultationStatsDetailed.dailyActivity && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-blue-600" />
                    Activité Quotidienne des Consultations (7 derniers jours)
                  </h3>
                  <div className="h-64 flex items-end justify-between space-x-2">
                    {consultationStatsDetailed.dailyActivity.map((day, index) => {
                      const maxValue = Math.max(...consultationStatsDetailed.dailyActivity.map(d => d.count), 1);
                      const height = (day.count / maxValue) * 200;
                      const dayName = new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div className="text-xs text-gray-600 mb-1">
                            {day.value > 0 && formatters.formatCurrency(day.value)}
                          </div>
                          <div
                            className="bg-blue-500 rounded-t w-full min-h-[20px] flex items-end justify-center text-white text-xs font-medium"
                            style={{ height: `${Math.max(height, 20)}px` }}
                          >
                            {day.count > 0 && <span className="pb-1">{day.count}</span>}
                          </div>
                          <span className="text-xs text-gray-500 mt-2">{dayName}</span>
                          <span className="text-xs font-medium text-gray-700">{day.count} consult.</span>
                        </div>
                      );
                    })}
                  </div>
                  {consultationStatsDetailed.dailyActivity.every(d => d.count === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      <Stethoscope className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>Aucune consultation enregistrée cette semaine</p>
                    </div>
                  )}
                </div>
              )}


              {/* Détail des consultations */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Consultations par Médecin</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Médecin</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Spécialité</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Consultations</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Satisfaction</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctorStats.map((doctor) => (
                        <tr key={doctor.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4 font-medium text-gray-900">{doctor.name}</td>
                          <td className="py-4 px-4 text-gray-600">{doctor.speciality}</td>
                          <td className="py-4 px-4 text-gray-900">{doctor.consultations}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <span className="text-gray-900 font-medium">{doctor.satisfaction}</span>
                              <span className="text-yellow-500 ml-1">★</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Performance */}
          {activeTab === 'performance' && (
            <div className="space-y-6">
              {/* Métriques de revenus */}
              <RevenueMetricsCards
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
              />

              {/* Graphiques de revenus */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <DoctorRevenueTable
                  startDate={dateRange.startDate}
                  endDate={dateRange.endDate}
                />
                <SpecialityRevenueChart
                  startDate={dateRange.startDate}
                  endDate={dateRange.endDate}
                />
              </div>

              {/* Analyse des taux d'encaissement */}
              <CollectionRateChart
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
              />


            </div>
          )}
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}