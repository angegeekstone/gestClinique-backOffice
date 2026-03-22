import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Users,
  Calendar,
  DollarSign,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  Stethoscope,
  User,
  CheckCircle,
  AlertCircle,
  Eye,
  Plus
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    patients: { total: 0, nouveaux: 0, variation: 0 },
    consultations: { total: 0, aujourdhui: 0, variation: 0 },
    revenus: { total: 0, mois: 0, variation: 0 },
    medecins: { total: 0, actifs: 0 }
  });
  const [alerts, setAlerts] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Simuler le chargement des données (à remplacer par vos API)
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStats({
        patients: { total: 847, nouveaux: 23, variation: 12 },
        consultations: { total: 156, aujourdhui: 8, variation: -3 },
        revenus: { total: 45670, mois: 12340, variation: 15 },
        medecins: { total: 12, actifs: 10 }
      });

      setAlerts([
        {
          id: 1,
          type: 'warning',
          title: 'Planning surchargé',
          message: 'Dr. Martin a 15 consultations prévues demain',
          time: '2h'
        },
        {
          id: 2,
          type: 'info',
          title: 'Paiements en attente',
          message: '5 factures en attente de règlement',
          time: '1j'
        }
      ]);

      setRecentActivity([
        {
          id: 1,
          type: 'user_created',
          message: 'Dr. Dupont a été ajouté comme médecin',
          time: '5 min',
          icon: User
        },
        {
          id: 2,
          type: 'consultation',
          message: '8 consultations programmées pour demain',
          time: '15 min',
          icon: Calendar
        },
        {
          id: 3,
          type: 'payment',
          message: 'Paiement de 150€ reçu - Patient Martin',
          time: '1h',
          icon: DollarSign
        }
      ]);

    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subValue, change, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
          <p className="text-sm text-gray-500">{subValue}</p>
        </div>
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {change >= 0 ? (
          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
        )}
        <span className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change >= 0 ? '+' : ''}{change}%
        </span>
        <span className="text-sm text-gray-500 ml-1">vs mois dernier</span>
      </div>
    </div>
  );

  const AlertCard = ({ alert }) => (
    <div className={`p-4 rounded-lg border ${
      alert.type === 'warning' ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'
    }`}>
      <div className="flex items-start">
        {alert.type === 'warning' ? (
          <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 mr-3" />
        ) : (
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
        )}
        <div className="flex-1">
          <h4 className={`font-medium ${
            alert.type === 'warning' ? 'text-amber-800' : 'text-blue-800'
          }`}>
            {alert.title}
          </h4>
          <p className={`text-sm mt-1 ${
            alert.type === 'warning' ? 'text-amber-700' : 'text-blue-700'
          }`}>
            {alert.message}
          </p>
          <span className="text-xs text-gray-500 mt-2 inline-block">Il y a {alert.time}</span>
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => {
    const ActivityIcon = activity.icon;
    return (
      <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
          <ActivityIcon className="w-4 h-4 text-gray-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-900">{activity.message}</p>
          <span className="text-xs text-gray-500">Il y a {activity.time}</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Admin</h1>
        <p className="text-gray-600">Vue d'ensemble de votre clinique - {user?.firstName} {user?.lastName}</p>
      </div>

      {/* Alertes importantes */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
            Alertes Importantes
          </h2>
          <div className="space-y-3">
            {alerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </div>
      )}

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Patients Total"
          value={stats.patients.total}
          subValue={`+${stats.patients.nouveaux} nouveaux ce mois`}
          change={stats.patients.variation}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Consultations"
          value={stats.consultations.total}
          subValue={`${stats.consultations.aujourdhui} aujourd'hui`}
          change={stats.consultations.variation}
          icon={Calendar}
          color="bg-green-500"
        />
        <StatCard
          title="Revenus"
          value={stats.revenus.total}
          subValue={`${stats.revenus.mois.toLocaleString()}€ ce mois`}
          change={stats.revenus.variation}
          icon={DollarSign}
          color="bg-amber-500"
        />
        <StatCard
          title="Équipe Médicale"
          value={stats.medecins.total}
          subValue={`${stats.medecins.actifs} médecins actifs`}
          change={0}
          icon={Stethoscope}
          color="bg-purple-500"
        />
      </div>

      {/* Graphiques et activité */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique activité (placeholder) */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-600" />
            Activité Hebdomadaire
          </h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <Activity className="w-16 h-16 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Graphique des consultations par jour</p>
              <p className="text-xs text-gray-400">Intégration Chart.js à venir</p>
            </div>
          </div>
        </div>

        {/* Activité récente */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-600" />
            Activité Récente
          </h3>
          <div className="space-y-1">
            {recentActivity.map(activity => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Plus className="w-5 h-5 mr-2 text-blue-600" />
          Actions Rapides
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => window.location.href = '/admin-clinique/utilisateurs'}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
          >
            <User className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Ajouter Utilisateur</span>
          </button>
          <button
            onClick={() => window.location.href = '/admin-clinique/specialites'}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
          >
            <Stethoscope className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Gérer Spécialités</span>
          </button>
          <button
            onClick={() => window.location.href = '/admin-clinique/finances/tarifs'}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center"
          >
            <DollarSign className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Tarification</span>
          </button>
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center">
            <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Planning</span>
          </button>
        </div>
      </div>

      {/* Résumé par médecin */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Stethoscope className="w-5 h-5 mr-2 text-blue-600" />
          Performance des Médecins
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Médecin</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Consultations</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Revenus</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Satisfaction</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Statut</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Dr. Martin', speciality: 'Cardiologie', consultations: 28, revenus: 4200, satisfaction: 4.8, status: 'active' },
                { name: 'Dr. Dubois', speciality: 'Médecine générale', consultations: 35, revenus: 3850, satisfaction: 4.6, status: 'active' },
                { name: 'Dr. Leroy', speciality: 'Pédiatrie', consultations: 22, revenus: 3300, satisfaction: 4.9, status: 'absent' }
              ].map((medecin, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Stethoscope className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{medecin.name}</div>
                        <div className="text-sm text-gray-500">{medecin.speciality}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-900 font-medium">{medecin.consultations}</span>
                    <span className="text-sm text-gray-500 ml-1">ce mois</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-gray-900 font-medium">{medecin.revenus.toLocaleString()}€</span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <span className="text-gray-900 font-medium">{medecin.satisfaction}</span>
                      <span className="text-yellow-500 ml-1">★</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      medecin.status === 'active'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}>
                      {medecin.status === 'active' ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <Clock className="w-3 h-3 mr-1" />
                      )}
                      {medecin.status === 'active' ? 'Actif' : 'Absent'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}