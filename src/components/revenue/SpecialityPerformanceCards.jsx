import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, Target, Award, BarChart3 } from 'lucide-react';
import revenueService from '../../services/revenueService';

const SpecialityPerformanceCards = ({ startDate, endDate }) => {
  const [specialityData, setSpecialityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSpecialityData();
  }, [startDate, endDate]);

  const fetchSpecialityData = async () => {
    try {
      setLoading(true);
      const data = await revenueService.getRevenueBySpeciality(startDate, endDate);
      setSpecialityData(data);
    } catch (err) {
      setError('Erreur lors du chargement des performances des spécialités');
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
    if (!specialityData.length) return { revenue: null, consultations: null, marketShare: null, averagePrice: null };

    const topByRevenue = specialityData.reduce((max, spec) =>
      spec.totalRevenue > max.totalRevenue ? spec : max
    );

    const topByConsultations = specialityData.reduce((max, spec) =>
      spec.consultationCount > max.consultationCount ? spec : max
    );

    const topByMarketShare = specialityData.reduce((max, spec) =>
      spec.marketShare > max.marketShare ? spec : max
    );

    const topByAveragePrice = specialityData.reduce((max, spec) =>
      spec.averagePrice > max.averagePrice ? spec : max
    );

    return {
      revenue: topByRevenue,
      consultations: topByConsultations,
      marketShare: topByMarketShare,
      averagePrice: topByAveragePrice
    };
  };

  const getTotalStats = () => {
    if (!specialityData.length) return { totalRevenue: 0, totalConsultations: 0 };

    const totalRevenue = specialityData.reduce((sum, spec) => sum + spec.totalRevenue, 0);
    const totalConsultations = specialityData.reduce((sum, spec) => sum + spec.consultationCount, 0);

    return { totalRevenue, totalConsultations };
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
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
  const totalStats = getTotalStats();

  const PerformanceCard = ({ title, speciality, value, subValue, icon: Icon, color, badge }) => (
    <div className="bg-white rounded-lg shadow-lg p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Icon size={20} color={color} className="mr-2" />
          <p className="text-sm font-medium text-gray-600">{title}</p>
        </div>
        {badge && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Award size={12} className="mr-1" />
            Leader
          </span>
        )}
      </div>

      {speciality ? (
        <>
          <p className="text-lg font-bold text-gray-900 mb-2">
            {speciality.specialityName}
          </p>
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
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Performances par Spécialité</h3>
        <p className="text-sm text-gray-500">
          {specialityData.length} spécialité{specialityData.length > 1 ? 's' : ''} active{specialityData.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Top performers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PerformanceCard
          title="Plus Haut CA"
          speciality={topPerformers.revenue}
          value={topPerformers.revenue ? formatCurrency(topPerformers.revenue.totalRevenue) : 'N/A'}
          subValue={topPerformers.revenue ? `${topPerformers.revenue.marketShare?.toFixed(1)}% de part de marché` : ''}
          icon={DollarSign}
          color="#10B981"
          badge={true}
        />

        <PerformanceCard
          title="Plus de Consultations"
          speciality={topPerformers.consultations}
          value={topPerformers.consultations ? `${topPerformers.consultations.consultationCount}` : 'N/A'}
          subValue={topPerformers.consultations ? formatCurrency(topPerformers.consultations.averagePrice) + ' en moyenne' : ''}
          icon={Users}
          color="#3B82F6"
          badge={true}
        />

        <PerformanceCard
          title="Plus Grosse Part de Marché"
          speciality={topPerformers.marketShare}
          value={topPerformers.marketShare ? `${topPerformers.marketShare.marketShare?.toFixed(1)}%` : 'N/A'}
          subValue={topPerformers.marketShare ? formatCurrency(topPerformers.marketShare.totalRevenue) : ''}
          icon={Target}
          color="#8B5CF6"
          badge={true}
        />

        <PerformanceCard
          title="Prix Moyen le Plus Élevé"
          speciality={topPerformers.averagePrice}
          value={topPerformers.averagePrice ? formatCurrency(topPerformers.averagePrice.averagePrice) : 'N/A'}
          subValue={topPerformers.averagePrice ? `${topPerformers.averagePrice.consultationCount} consultations` : ''}
          icon={BarChart3}
          color="#F59E0B"
          badge={true}
        />
      </div>

      {/* Tableau de comparaison compact */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Comparaison Détaillée</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-medium text-gray-900">Spécialité</th>
                <th className="text-right py-3 px-2 font-medium text-gray-900">CA</th>
                <th className="text-right py-3 px-2 font-medium text-gray-900">Part de Marché</th>
                <th className="text-right py-3 px-2 font-medium text-gray-900">Consultations</th>
                <th className="text-right py-3 px-2 font-medium text-gray-900">Prix Moyen</th>
              </tr>
            </thead>
            <tbody>
              {specialityData
                .sort((a, b) => b.totalRevenue - a.totalRevenue)
                .map((spec, index) => (
                  <tr key={spec.specialityId} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium text-gray-900">
                      <div className="flex items-center">
                        {index === 0 && <Award size={16} className="text-yellow-500 mr-2" />}
                        {spec.specialityName}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right font-semibold text-green-600">
                      {formatCurrency(spec.totalRevenue)}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        spec.marketShare >= 30 ? 'bg-green-100 text-green-800' :
                        spec.marketShare >= 20 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {spec.marketShare?.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right text-blue-600 font-medium">
                      {spec.consultationCount}
                    </td>
                    <td className="py-3 px-2 text-right text-gray-900">
                      {formatCurrency(spec.averagePrice)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Vue d'Ensemble</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(totalStats.totalRevenue)}
            </p>
            <p className="text-sm text-gray-600">CA Total Toutes Spécialités</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {totalStats.totalConsultations}
            </p>
            <p className="text-sm text-gray-600">Total Consultations</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {specialityData.length}
            </p>
            <p className="text-sm text-gray-600">Spécialités Actives</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialityPerformanceCards;