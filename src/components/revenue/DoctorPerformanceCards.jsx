import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Award, Users, DollarSign, Clock } from 'lucide-react';
import revenueService from '../../services/revenueService';

const DoctorPerformanceCards = ({ startDate, endDate }) => {
  const [doctorData, setDoctorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDoctorData();
  }, [startDate, endDate]);

  const fetchDoctorData = async () => {
    try {
      setLoading(true);
      const data = await revenueService.getRevenueByDoctor(startDate, endDate);
      setDoctorData(data);
    } catch (err) {
      setError('Erreur lors du chargement des performances des médecins');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTopPerformers = () => {
    if (!doctorData.length) return { revenue: null, consultations: null, collectionRate: null };

    const topByRevenue = doctorData.reduce((max, doctor) =>
      doctor.totalRevenue > max.totalRevenue ? doctor : max
    );

    const topByConsultations = doctorData.reduce((max, doctor) =>
      doctor.consultationCount > max.consultationCount ? doctor : max
    );

    const topByCollectionRate = doctorData.reduce((max, doctor) =>
      doctor.collectionRate > max.collectionRate ? doctor : max
    );

    return {
      revenue: topByRevenue,
      consultations: topByConsultations,
      collectionRate: topByCollectionRate
    };
  };

  const getAverages = () => {
    if (!doctorData.length) return { avgRevenue: 0, avgConsultations: 0, avgCollectionRate: 0 };

    const totalRevenue = doctorData.reduce((sum, doctor) => sum + doctor.totalRevenue, 0);
    const totalConsultations = doctorData.reduce((sum, doctor) => sum + doctor.consultationCount, 0);
    const totalCollectionRate = doctorData.reduce((sum, doctor) => sum + doctor.collectionRate, 0);

    return {
      avgRevenue: totalRevenue / doctorData.length,
      avgConsultations: totalConsultations / doctorData.length,
      avgCollectionRate: totalCollectionRate / doctorData.length
    };
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const topPerformers = getTopPerformers();
  const averages = getAverages();

  const PerformanceCard = ({ title, doctor, value, subValue, icon: Icon, color, type }) => (
    <div className="bg-white rounded-lg shadow-lg p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <Icon size={20} color={color} className="mr-2" />
            <p className="text-sm font-medium text-gray-600">{title}</p>
          </div>

          {doctor ? (
            <>
              <p className="text-lg font-bold text-gray-900 mb-1">
                {doctor.doctorName.replace('Dr. ', '')}
              </p>
              <p className="text-sm text-gray-500 mb-2">{doctor.speciality}</p>
              <div className="space-y-1">
                <p className="text-xl font-semibold" style={{ color }}>
                  {value}
                </p>
                {subValue && (
                  <p className="text-sm text-gray-500">{subValue}</p>
                )}
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-sm">Aucune donnée disponible</p>
          )}
        </div>

        <div className="text-right">
          {doctor && type === 'collectionRate' && (
            <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
              doctor.collectionRate >= 90 ? 'bg-green-100 text-green-800' :
              doctor.collectionRate >= 80 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
              {doctor.collectionRate >= 90 ? 'Excellent' :
               doctor.collectionRate >= 80 ? 'Bon' : 'À améliorer'}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
        <p className="text-sm text-gray-500">
          {doctorData.length} médecin{doctorData.length > 1 ? 's' : ''} analysé{doctorData.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PerformanceCard
          title="Meilleur CA"
          doctor={topPerformers.revenue}
          value={topPerformers.revenue ? formatCurrency(topPerformers.revenue.totalRevenue) : 'N/A'}
          subValue={topPerformers.revenue ? `${topPerformers.revenue.consultationCount} consultations` : ''}
          icon={DollarSign}
          color="#10B981"
          type="revenue"
        />

        <PerformanceCard
          title="Plus de Consultations"
          doctor={topPerformers.consultations}
          value={topPerformers.consultations ? `${topPerformers.consultations.consultationCount}` : 'N/A'}
          subValue={topPerformers.consultations ? formatCurrency(topPerformers.consultations.averagePrice) + ' en moyenne' : ''}
          icon={Users}
          color="#3B82F6"
          type="consultations"
        />

        <PerformanceCard
          title="Meilleur Taux d'Encaissement"
          doctor={topPerformers.collectionRate}
          value={topPerformers.collectionRate ? `${topPerformers.collectionRate.collectionRate.toFixed(1)}%` : 'N/A'}
          subValue={topPerformers.collectionRate ? formatCurrency(topPerformers.collectionRate.paidAmount) + ' encaissé' : ''}
          icon={Award}
          color="#8B5CF6"
          type="collectionRate"
        />
      </div>

      {/* Statistiques moyennes */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Moyennes de l'équipe</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(averages.avgRevenue)}
            </p>
            <p className="text-sm text-gray-600">CA moyen par médecin</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {averages.avgConsultations.toFixed(0)}
            </p>
            <p className="text-sm text-gray-600">Consultations moyennes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {averages.avgCollectionRate.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600">Taux d'encaissement moyen</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorPerformanceCards;