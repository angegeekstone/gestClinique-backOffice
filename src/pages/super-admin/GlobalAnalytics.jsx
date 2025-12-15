import { useState } from 'react';
import {
  TrendingUp,
  Users,
  Building,
  DollarSign,
  Activity,
  Calendar,
  BarChart3,
  PieChart,
  Filter
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell } from 'recharts';

const globalStats = {
  totalClinics: 15,
  totalUsers: 347,
  totalPatients: 12457,
  monthlyRevenue: 1250000,
  totalConsultations: 8945,
  avgConsultationTime: 32
};

const clinicPerformance = [
  { name: 'Clinique Centrale', patients: 1834, revenue: 285000, consultations: 1245, efficiency: 92 },
  { name: 'Clinique Nord', patients: 987, revenue: 165000, consultations: 687, efficiency: 88 },
  { name: 'Clinique Sud', patients: 654, revenue: 128000, consultations: 432, efficiency: 85 },
  { name: 'Clinique Est', patients: 1254, revenue: 198000, consultations: 892, efficiency: 90 },
  { name: 'Clinique Ouest', patients: 876, revenue: 145000, consultations: 567, efficiency: 87 }
];

const revenueData = [
  { month: 'Jan', revenue: 95000, consultations: 654 },
  { month: 'Feb', revenue: 108000, consultations: 723 },
  { month: 'Mar', revenue: 112000, consultations: 789 },
  { month: 'Apr', revenue: 125000, consultations: 856 },
  { month: 'May', revenue: 134000, consultations: 923 },
  { month: 'Jun', revenue: 142000, consultations: 1012 },
  { month: 'Jul', revenue: 156000, consultations: 1098 },
  { month: 'Aug', revenue: 168000, consultations: 1156 },
  { month: 'Sep', revenue: 175000, consultations: 1234 },
  { month: 'Oct', revenue: 189000, consultations: 1298 },
  { month: 'Nov', revenue: 198000, consultations: 1367 },
  { month: 'Dec', revenue: 185000, consultations: 1289 }
];

const subscriptionData = [
  { name: 'Premium', value: 8, color: '#3B82F6' },
  { name: 'Standard', value: 5, color: '#10B981' },
  { name: 'Basic', value: 2, color: '#F59E0B' }
];

const activityData = [
  { clinic: 'Centrale', lun: 45, mar: 52, mer: 38, jeu: 61, ven: 55, sam: 28, dim: 15 },
  { clinic: 'Nord', lun: 32, mar: 38, mer: 29, jeu: 45, ven: 41, sam: 22, dim: 8 },
  { clinic: 'Sud', lun: 28, mar: 31, mer: 25, jeu: 38, ven: 34, sam: 18, dim: 6 }
];

export default function GlobalAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Global</h1>
          <p className="text-gray-600">Vue d'ensemble de toutes les cliniques du système</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>Filtrer</span>
          </button>
        </div>
      </div>

      {/* Métriques globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cliniques</p>
              <p className="text-2xl font-bold text-gray-900">{globalStats.totalClinics}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+2 ce mois</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Utilisateurs</p>
              <p className="text-2xl font-bold text-gray-900">{globalStats.totalUsers}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+15 ce mois</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Patients</p>
              <p className="text-2xl font-bold text-gray-900">{globalStats.totalPatients.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+234 ce mois</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenus Mensuel</p>
              <p className="text-2xl font-bold text-gray-900">{(globalStats.monthlyRevenue / 1000).toFixed(0)}K€</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+12.5%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Consultations</p>
              <p className="text-2xl font-bold text-gray-900">{globalStats.totalConsultations.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+8.3%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Temps Moyen</p>
              <p className="text-2xl font-bold text-gray-900">{globalStats.avgConsultationTime}min</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
                <span className="text-sm text-red-600">+2min</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Graphique des revenus */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Évolution des Revenus</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedMetric('revenue')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedMetric === 'revenue'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Revenus
            </button>
            <button
              onClick={() => setSelectedMetric('consultations')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedMetric === 'consultations'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Consultations
            </button>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar
                dataKey={selectedMetric}
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance des cliniques */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance par Clinique</h3>
          <div className="space-y-4">
            {clinicPerformance.map((clinic, index) => (
              <div key={index} className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{clinic.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    clinic.efficiency >= 90
                      ? 'bg-green-100 text-green-800'
                      : clinic.efficiency >= 85
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {clinic.efficiency}% efficacité
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Patients</p>
                    <p className="font-semibold">{clinic.patients}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Revenus</p>
                    <p className="font-semibold">{(clinic.revenue / 1000).toFixed(0)}K€</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Consultations</p>
                    <p className="font-semibold">{clinic.consultations}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Répartition des abonnements */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Répartition des Abonnements</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <RechartsPieChart data={subscriptionData}>
                  {subscriptionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </RechartsPieChart>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {subscriptionData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value} cliniques</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}