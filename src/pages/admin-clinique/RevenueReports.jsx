import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Users,
  Stethoscope,
  CreditCard,
  AlertCircle,
  Check,
  X,
  RefreshCw,
  Filter,
  BarChart3,
  PieChart,
  Euro
} from 'lucide-react';

export default function RevenueReports() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [notification, setNotification] = useState(null);

  const [revenueStats, setRevenueStats] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    variation: 0,
    averagePerConsultation: 0,
    pendingPayments: 0
  });

  const [doctorRevenue, setDoctorRevenue] = useState([]);
  const [specialityRevenue, setSpecialityRevenue] = useState([]);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    loadRevenueData();
  }, [dateRange]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const loadRevenueData = async () => {
    try {
      setLoading(true);

      // Charger les données des médecins et spécialités
      const [usersData, specialitiesData] = await Promise.all([
        userService.getAllUsers().catch(() => []),
        userService.getAllSpecialities().catch(() => [])
      ]);

      const doctors = usersData.filter(user => user.role === 'MEDECIN');

      // Simuler les revenus (en attendant les endpoints financiers)
      const totalConsultations = doctors.length * 25;
      const averagePrice = 65;
      const monthlyRevenue = totalConsultations * averagePrice;

      setRevenueStats({
        totalRevenue: monthlyRevenue * 12, // Estimation annuelle
        monthlyRevenue: monthlyRevenue,
        variation: 12,
        averagePerConsultation: averagePrice,
        pendingPayments: Math.floor(monthlyRevenue * 0.15) // 15% en attente
      });

      // Revenus par médecin
      setDoctorRevenue(doctors.map(doctor => {
        const consultations = Math.floor(Math.random() * 20) + 15;
        const revenue = consultations * (averagePrice + Math.floor(Math.random() * 30 - 15));
        return {
          id: doctor.id,
          name: `${doctor.firstName} ${doctor.lastName}`,
          speciality: doctor.speciality?.name || 'Non définie',
          consultations: consultations,
          revenue: revenue,
          averagePrice: Math.round(revenue / consultations),
          pendingAmount: Math.floor(revenue * 0.1) // 10% en attente
        };
      }));

      // Revenus par spécialité
      setSpecialityRevenue(specialitiesData.map(spec => {
        const doctorsInSpec = doctors.filter(d => d.speciality?.id === spec.id).length;
        const consultations = doctorsInSpec * 25;
        const revenue = consultations * (averagePrice + Math.floor(Math.random() * 20 - 10));
        return {
          id: spec.id,
          name: spec.name,
          doctorsCount: doctorsInSpec,
          consultations: consultations,
          revenue: revenue,
          percentage: doctorsInSpec > 0 ? Math.round((revenue / monthlyRevenue) * 100) : 0
        };
      }).filter(spec => spec.doctorsCount > 0));

      // Revenus journaliers des 30 derniers jours
      const last30Days = Array.from({length: 30}, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        const dailyConsultations = Math.floor(Math.random() * 8) + 2;
        return {
          date: date.toISOString().split('T')[0],
          revenue: dailyConsultations * averagePrice,
          consultations: dailyConsultations
        };
      });

      setDailyRevenue(last30Days);

      // Méthodes de paiement simulées
      setPaymentMethods([
        { method: 'Carte Bancaire', amount: monthlyRevenue * 0.6, percentage: 60 },
        { method: 'Espèces', amount: monthlyRevenue * 0.25, percentage: 25 },
        { method: 'Chèque', amount: monthlyRevenue * 0.10, percentage: 10 },
        { method: 'Virement', amount: monthlyRevenue * 0.05, percentage: 5 }
      ]);

    } catch (error) {
      console.error('Erreur chargement revenus:', error);
      showNotification('error', 'Erreur lors du chargement des données de revenus');
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (type) => {
    showNotification('info', `Export rapport revenus ${type} en cours... (fonctionnalité à développer)`);
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'doctors', label: 'Par Médecin', icon: Stethoscope },
    { id: 'specialities', label: 'Par Spécialité', icon: Users },
    { id: 'payments', label: 'Paiements', icon: CreditCard }
  ];

  const StatCard = ({ title, value, subValue, change, icon: Icon, color, format = 'number' }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {format === 'currency' ? `${typeof value === 'number' ? value.toLocaleString() : value}€` :
             typeof value === 'number' ? value.toLocaleString() : value}
          </p>
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
          <h1 className="text-2xl font-bold text-gray-900">Rapports Financiers</h1>
          <p className="text-gray-600">Analyses des revenus et performance financière</p>
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
            onClick={() => exportReport('Excel')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Excel</span>
          </button>
          <button
            onClick={() => exportReport('PDF')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Alert sur les données manquantes */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
          <div>
            <p className="text-red-800 text-sm font-medium">Fonctionnalité financière incomplète</p>
            <p className="text-red-700 text-sm">
              Les modèles backend ne contiennent pas de champs financiers (prix, paiements).
              Ces rapports utilisent des données simulées.
              <strong>Endpoints à créer :</strong> <code>/api/admin/reports/revenue/*</code>
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
          {/* Vue d'ensemble */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Revenus Total"
                  value={revenueStats.totalRevenue}
                  subValue="Cette année"
                  change={revenueStats.variation}
                  icon={DollarSign}
                  color="bg-green-500"
                  format="currency"
                />
                <StatCard
                  title="Revenus Mois"
                  value={revenueStats.monthlyRevenue}
                  subValue="Ce mois-ci"
                  change={8}
                  icon={Euro}
                  color="bg-blue-500"
                  format="currency"
                />
                <StatCard
                  title="Prix Moyen"
                  value={revenueStats.averagePerConsultation}
                  subValue="Par consultation"
                  change={3}
                  icon={BarChart3}
                  color="bg-purple-500"
                  format="currency"
                />
                <StatCard
                  title="En Attente"
                  value={revenueStats.pendingPayments}
                  subValue="Paiements dus"
                  change={-5}
                  icon={AlertCircle}
                  color="bg-amber-500"
                  format="currency"
                />
              </div>

              {/* Graphique revenus journaliers */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                  Évolution des Revenus (30 derniers jours)
                </h3>
                <div className="h-64 flex items-end justify-between space-x-1">
                  {dailyRevenue.map((day, index) => {
                    const maxValue = Math.max(...dailyRevenue.map(d => d.revenue));
                    const height = (day.revenue / maxValue) * 200;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div
                          className="bg-green-500 rounded-t w-full min-h-[10px]"
                          style={{ height: `${height}px` }}
                          title={`${day.revenue}€ - ${day.consultations} consultations`}
                        />
                        <span className="text-xs text-gray-500 mt-2 rotate-45 origin-bottom-left">
                          {new Date(day.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Méthodes de paiement */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                  Répartition par Méthode de Paiement
                </h3>
                <div className="grid gap-4">
                  {paymentMethods.map((method) => (
                    <div key={method.method} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="font-medium text-gray-900">{method.method}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{method.amount.toLocaleString()}€</p>
                        <p className="text-sm text-gray-600">{method.percentage}%</p>
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-2 ml-4">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${method.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Revenus par Médecin */}
          {activeTab === 'doctors' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  title="Meilleur Performer"
                  value={Math.max(...doctorRevenue.map(d => d.revenue))}
                  subValue="Ce mois"
                  icon={TrendingUp}
                  color="bg-green-500"
                  format="currency"
                />
                <StatCard
                  title="Revenu Moyen"
                  value={Math.round(revenueStats.monthlyRevenue / doctorRevenue.length)}
                  subValue="Par médecin"
                  icon={BarChart3}
                  color="bg-blue-500"
                  format="currency"
                />
                <StatCard
                  title="Écart Type"
                  value="±15%"
                  subValue="Variation revenus"
                  icon={TrendingUp}
                  color="bg-purple-500"
                />
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Financière par Médecin</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Médecin</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Spécialité</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Consultations</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Revenus</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Prix Moyen</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">En Attente</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctorRevenue
                        .sort((a, b) => b.revenue - a.revenue)
                        .map((doctor) => (
                          <tr key={doctor.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4 font-medium text-gray-900">{doctor.name}</td>
                            <td className="py-4 px-4 text-gray-600">{doctor.speciality}</td>
                            <td className="py-4 px-4 text-gray-900">{doctor.consultations}</td>
                            <td className="py-4 px-4 font-semibold text-green-600">{doctor.revenue.toLocaleString()}€</td>
                            <td className="py-4 px-4 text-gray-900">{doctor.averagePrice}€</td>
                            <td className="py-4 px-4 text-amber-600">{doctor.pendingAmount.toLocaleString()}€</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Revenus par Spécialité */}
          {activeTab === 'specialities' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {specialityRevenue.map((spec) => (
                  <div key={spec.id} className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">{spec.name}</h4>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {spec.percentage}%
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Revenus</span>
                        <span className="font-semibold text-green-600">{spec.revenue.toLocaleString()}€</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Consultations</span>
                        <span className="font-medium text-gray-900">{spec.consultations}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Médecins</span>
                        <span className="font-medium text-gray-900">{spec.doctorsCount}</span>
                      </div>
                    </div>
                    <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${spec.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gestion des Paiements */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  title="Paiements Reçus"
                  value={revenueStats.monthlyRevenue - revenueStats.pendingPayments}
                  subValue="Ce mois"
                  change={5}
                  icon={Check}
                  color="bg-green-500"
                  format="currency"
                />
                <StatCard
                  title="En Attente"
                  value={revenueStats.pendingPayments}
                  subValue="À encaisser"
                  change={-10}
                  icon={Clock}
                  color="bg-amber-500"
                  format="currency"
                />
                <StatCard
                  title="Taux de Recouvrement"
                  value="85%"
                  subValue="Paiements à temps"
                  change={3}
                  icon={TrendingUp}
                  color="bg-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Méthodes de paiement détaillées */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Méthodes de Paiement</h3>
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div key={method.method} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <CreditCard className="w-5 h-5 text-gray-600" />
                          <span className="font-medium text-gray-900">{method.method}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{method.amount.toLocaleString()}€</p>
                          <p className="text-sm text-gray-600">{method.percentage}% du total</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Statut des paiements */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Statut des Paiements</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-900">Payé</span>
                      </div>
                      <span className="font-semibold text-green-900">
                        {(revenueStats.monthlyRevenue - revenueStats.pendingPayments).toLocaleString()}€
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-amber-600" />
                        <span className="font-medium text-amber-900">En attente</span>
                      </div>
                      <span className="font-semibold text-amber-900">
                        {revenueStats.pendingPayments.toLocaleString()}€
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <X className="w-5 h-5 text-red-600" />
                        <span className="font-medium text-red-900">Impayé</span>
                      </div>
                      <span className="font-semibold text-red-900">
                        {Math.floor(revenueStats.monthlyRevenue * 0.05).toLocaleString()}€
                      </span>
                    </div>
                  </div>
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