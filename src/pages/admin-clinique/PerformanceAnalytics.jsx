import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import {
  Activity,
  Stethoscope,
  Users,
  Clock,
  Star,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  X,
  Calendar,
  BarChart3,
  PieChart,
  Download,
  RefreshCw,
  AlertCircle,
  Check
} from 'lucide-react';

export default function PerformanceAnalytics() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('doctors');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [notification, setNotification] = useState(null);

  const [doctorPerformance, setDoctorPerformance] = useState([]);
  const [specialityPerformance, setSpecialityPerformance] = useState([]);
  const [clinicMetrics, setClinicMetrics] = useState({
    averageConsultationTime: 0,
    patientSatisfaction: 0,
    appointmentCompletionRate: 0,
    noShowRate: 0,
    averageWaitTime: 0
  });

  const [performanceTrends, setPerformanceTrends] = useState([]);

  useEffect(() => {
    loadPerformanceData();
  }, [dateRange]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const loadPerformanceData = async () => {
    try {
      setLoading(true);

      const [usersData, specialitiesData] = await Promise.all([
        userService.getAllUsers().catch(() => []),
        userService.getAllSpecialities().catch(() => [])
      ]);

      const doctors = usersData.filter(user => user.role === 'MEDECIN');

      // Métriques de performance par médecin
      setDoctorPerformance(doctors.map(doctor => {
        const consultations = Math.floor(Math.random() * 25) + 15;
        const satisfaction = (Math.random() * 0.8 + 4.2).toFixed(1);
        const completionRate = Math.floor(Math.random() * 15) + 85;
        const avgTime = Math.floor(Math.random() * 20) + 25;

        return {
          id: doctor.id,
          name: `${doctor.firstName} ${doctor.lastName}`,
          speciality: doctor.speciality?.name || 'Non définie',
          consultations: consultations,
          satisfaction: parseFloat(satisfaction),
          completionRate: completionRate,
          avgConsultationTime: avgTime,
          patientsFollowed: consultations * 2,
          noShowRate: Math.floor(Math.random() * 8) + 2,
          punctuality: Math.floor(Math.random() * 20) + 80,
          performance: Math.round((parseFloat(satisfaction) * 20 + completionRate) / 2)
        };
      }));

      // Performance par spécialité
      setSpecialityPerformance(specialitiesData.map(spec => {
        const doctorsInSpec = doctors.filter(d => d.speciality?.id === spec.id);
        if (doctorsInSpec.length === 0) return null;

        const avgSatisfaction = doctorsInSpec.length > 0
          ? (doctorsInSpec.reduce((sum, d) => sum + (Math.random() * 0.8 + 4.2), 0) / doctorsInSpec.length)
          : 0;

        return {
          id: spec.id,
          name: spec.name,
          doctorsCount: doctorsInSpec.length,
          avgSatisfaction: avgSatisfaction.toFixed(1),
          totalConsultations: doctorsInSpec.length * 25,
          avgCompletionRate: Math.floor(Math.random() * 15) + 85,
          avgConsultationTime: Math.floor(Math.random() * 20) + 25
        };
      }).filter(Boolean));

      // Métriques globales de la clinique
      setClinicMetrics({
        averageConsultationTime: 28,
        patientSatisfaction: 4.6,
        appointmentCompletionRate: 87,
        noShowRate: 6.8,
        averageWaitTime: 12
      });

      // Tendances de performance (7 derniers jours)
      const last7Days = Array.from({length: 7}, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          date: date.toISOString().split('T')[0],
          satisfaction: (Math.random() * 0.5 + 4.2).toFixed(1),
          completionRate: Math.floor(Math.random() * 10) + 85,
          avgTime: Math.floor(Math.random() * 10) + 25
        };
      });

      setPerformanceTrends(last7Days);

    } catch (error) {
      console.error('Erreur chargement performance:', error);
      showNotification('error', 'Erreur lors du chargement des données de performance');
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getPerformanceBadge = (score) => {
    if (score >= 90) return { text: 'Excellent', color: 'bg-green-100 text-green-800 border-green-200' };
    if (score >= 75) return { text: 'Bon', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    if (score >= 60) return { text: 'Moyen', color: 'bg-amber-100 text-amber-800 border-amber-200' };
    return { text: 'Faible', color: 'bg-red-100 text-red-800 border-red-200' };
  };

  const tabs = [
    { id: 'doctors', label: 'Performance Médecins', icon: Stethoscope },
    { id: 'specialities', label: 'Par Spécialité', icon: Users },
    { id: 'metrics', label: 'Métriques Clinique', icon: Activity },
    { id: 'trends', label: 'Tendances', icon: TrendingUp }
  ];

  const MetricCard = ({ title, value, unit, icon: Icon, color, trend = null }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}{unit}</p>
        </div>
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          {trend >= 0 ? (
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
          )}
          <span className={`text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
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
          <h1 className="text-2xl font-bold text-gray-900">Analyse de Performance</h1>
          <p className="text-gray-600">Métriques de performance de l'équipe médicale</p>
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
            onClick={() => showNotification('info', 'Export en cours...')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* Alert sur données manquantes */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-amber-600 mr-2" />
          <div>
            <p className="text-amber-800 text-sm font-medium">Données de performance simulées</p>
            <p className="text-amber-700 text-sm">
              Pour des métriques réelles, créer les endpoints : <code>/api/admin/reports/performance/*</code>
              et ajouter le tracking de satisfaction/temps dans le backend.
            </p>
          </div>
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
          {/* Performance des Médecins */}
          {activeTab === 'doctors' && (
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full bg-white border border-gray-200 rounded-lg">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Médecin</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Score Global</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Satisfaction</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Consultations</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Taux Réussite</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Ponctualité</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Temps Moyen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctorPerformance
                      .sort((a, b) => b.performance - a.performance)
                      .map((doctor) => {
                        const badge = getPerformanceBadge(doctor.performance);
                        return (
                          <tr key={doctor.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                  <Stethoscope className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{doctor.name}</p>
                                  <p className="text-sm text-gray-600">{doctor.speciality}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                <span className={`font-bold text-lg ${getPerformanceColor(doctor.performance)}`}>
                                  {doctor.performance}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-full border ${badge.color}`}>
                                  {badge.text}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                <span className="font-medium text-gray-900">{doctor.satisfaction}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 font-medium text-gray-900">{doctor.consultations}</td>
                            <td className="py-4 px-4">
                              <span className={doctor.completionRate >= 90 ? 'text-green-600' : 'text-amber-600'}>
                                {doctor.completionRate}%
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className={doctor.punctuality >= 90 ? 'text-green-600' : 'text-amber-600'}>
                                {doctor.punctuality}%
                              </span>
                            </td>
                            <td className="py-4 px-4 text-gray-900">{doctor.avgConsultationTime} min</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Performance par Spécialité */}
          {activeTab === 'specialities' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {specialityPerformance.map((spec) => (
                  <div key={spec.id} className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">{spec.name}</h4>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="font-medium">{spec.avgSatisfaction}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Médecins</span>
                        <span className="font-medium">{spec.doctorsCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Consultations</span>
                        <span className="font-medium">{spec.totalConsultations}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Taux réussite</span>
                        <span className="font-medium text-green-600">{spec.avgCompletionRate}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Temps moyen</span>
                        <span className="font-medium">{spec.avgConsultationTime} min</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Métriques Clinique */}
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MetricCard
                  title="Satisfaction Globale"
                  value={clinicMetrics.patientSatisfaction}
                  unit="/5"
                  icon={Star}
                  color="bg-yellow-500"
                  trend={3}
                />
                <MetricCard
                  title="Taux de Réalisation"
                  value={clinicMetrics.appointmentCompletionRate}
                  unit="%"
                  icon={CheckCircle}
                  color="bg-green-500"
                  trend={2}
                />
                <MetricCard
                  title="Temps d'Attente"
                  value={clinicMetrics.averageWaitTime}
                  unit=" min"
                  icon={Clock}
                  color="bg-blue-500"
                  trend={-5}
                />
                <MetricCard
                  title="Durée Consultation"
                  value={clinicMetrics.averageConsultationTime}
                  unit=" min"
                  icon={Activity}
                  color="bg-purple-500"
                  trend={-2}
                />
                <MetricCard
                  title="Taux No-Show"
                  value={clinicMetrics.noShowRate}
                  unit="%"
                  icon={AlertTriangle}
                  color="bg-red-500"
                  trend={8}
                />
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Efficacité Globale</p>
                      <p className="text-2xl font-bold text-green-600">87%</p>
                    </div>
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphique des tendances */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  Tendances de Performance (7 jours)
                </h3>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {performanceTrends.map((day, index) => {
                    const satisfaction = parseFloat(day.satisfaction);
                    const height = (satisfaction / 5) * 200;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div
                          className="bg-yellow-500 rounded-t w-full min-h-[20px]"
                          style={{ height: `${height}px` }}
                          title={`Satisfaction: ${satisfaction}/5`}
                        />
                        <span className="text-xs text-gray-500 mt-2">
                          {new Date(day.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                        </span>
                        <span className="text-xs font-medium text-gray-700">{satisfaction}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Objectifs et KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-blue-600" />
                    Objectifs du Mois
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Satisfaction ≥ 4.5</span>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                        <span className="font-medium text-green-600">Atteint</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">No-show ≤ 5%</span>
                      <div className="flex items-center">
                        <X className="w-4 h-4 text-red-500 mr-1" />
                        <span className="font-medium text-red-600">6.8%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Temps d'attente ≤ 15 min</span>
                      <div className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                        <span className="font-medium text-green-600">12 min</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-yellow-600" />
                    Top 3 Ce Mois
                  </h3>
                  <div className="space-y-3">
                    {doctorPerformance.slice(0, 3).map((doctor, index) => (
                      <div key={doctor.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            index === 0 ? 'bg-yellow-100 text-yellow-600' :
                            index === 1 ? 'bg-gray-100 text-gray-600' :
                            'bg-orange-100 text-orange-600'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{doctor.name}</p>
                            <p className="text-sm text-gray-600">{doctor.speciality}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${getPerformanceColor(doctor.performance)}`}>
                            {doctor.performance}/100
                          </p>
                          <p className="text-sm text-gray-600">{doctor.satisfaction}★</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tendances */}
          {activeTab === 'trends' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="font-medium text-gray-900 mb-3">Satisfaction Patient</h4>
                  <div className="h-32 flex items-end justify-between space-x-1">
                    {performanceTrends.map((day, index) => {
                      const satisfaction = parseFloat(day.satisfaction);
                      const height = (satisfaction / 5) * 100;
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div
                            className="bg-yellow-500 rounded-t w-full min-h-[5px]"
                            style={{ height: `${height}px` }}
                          />
                          <span className="text-xs text-gray-500 mt-1">{satisfaction}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="font-medium text-gray-900 mb-3">Taux de Réalisation</h4>
                  <div className="h-32 flex items-end justify-between space-x-1">
                    {performanceTrends.map((day, index) => {
                      const rate = day.completionRate;
                      const height = (rate / 100) * 100;
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div
                            className="bg-green-500 rounded-t w-full min-h-[5px]"
                            style={{ height: `${height}px` }}
                          />
                          <span className="text-xs text-gray-500 mt-1">{rate}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h4 className="font-medium text-gray-900 mb-3">Temps Consultation</h4>
                  <div className="h-32 flex items-end justify-between space-x-1">
                    {performanceTrends.map((day, index) => {
                      const time = day.avgTime;
                      const height = (time / 45) * 100; // Max 45 min
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div
                            className="bg-purple-500 rounded-t w-full min-h-[5px]"
                            style={{ height: `${height}px` }}
                          />
                          <span className="text-xs text-gray-500 mt-1">{time}m</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Alertes de performance */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-amber-600" />
                  Alertes de Performance
                </h3>
                <div className="space-y-3">
                  {doctorPerformance
                    .filter(d => d.performance < 75 || d.noShowRate > 10)
                    .map((doctor) => (
                      <div key={doctor.id} className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-amber-900">{doctor.name}</h4>
                            <p className="text-sm text-amber-800">
                              {doctor.performance < 75 && `Performance faible (${doctor.performance}/100)`}
                              {doctor.performance < 75 && doctor.noShowRate > 10 && ' • '}
                              {doctor.noShowRate > 10 && `Taux no-show élevé (${doctor.noShowRate}%)`}
                            </p>
                          </div>
                          <AlertTriangle className="w-5 h-5 text-amber-600" />
                        </div>
                      </div>
                    ))}
                  {doctorPerformance.filter(d => d.performance < 75 || d.noShowRate > 10).length === 0 && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                      <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-green-800 font-medium">Aucune alerte de performance</p>
                      <p className="text-green-700 text-sm">Toute l'équipe maintient de bonnes performances</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-[60] max-w-md">
          <div className={`flex items-center px-4 py-3 rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' :
            notification.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' :
            'bg-blue-50 border border-blue-200 text-blue-800'
          }`}>
            {notification.type === 'success' ? <Check className="w-5 h-5 mr-2" /> :
             notification.type === 'error' ? <AlertCircle className="w-5 h-5 mr-2" /> :
             <AlertCircle className="w-5 h-5 mr-2" />}
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-auto text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}