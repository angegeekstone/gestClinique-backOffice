import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, CreditCard, Clock, BarChart3 } from 'lucide-react';
import revenueService from '../../services/revenueService';

const RevenueMetricsCards = ({ startDate, endDate }) => {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    paidAmount: 0,
    pendingAmount: 0,
    unpaidAmount: 0,
    totalTransactions: 0,
    averageTransactionAmount: 0,
    growthRate: 0,
    topDoctor: null,
    topSpeciality: null,
    topPaymentMethod: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMetrics();
  }, [startDate, endDate]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);

      const statsData = await revenueService.getRevenueStats(startDate, endDate);

      // Trouver le meilleur médecin
      const topDoctor = statsData.byDoctor?.reduce((best, current) =>
        current.totalRevenue > (best?.totalRevenue || 0) ? current : best, null
      );

      // Trouver la meilleure spécialité
      const topSpeciality = statsData.bySpeciality?.reduce((best, current) =>
        current.totalRevenue > (best?.totalRevenue || 0) ? current : best, null
      );

      // Trouver le mode de paiement le plus utilisé
      const topPaymentMethod = statsData.paymentMethods?.reduce((best, current) =>
        current.amount > (best?.amount || 0) ? current : best, null
      );

      setMetrics({
        totalRevenue: statsData.totalRevenue || 0,
        paidAmount: statsData.paidAmount || 0,
        pendingAmount: statsData.pendingAmount || 0,
        unpaidAmount: statsData.unpaidAmount || 0,
        totalTransactions: statsData.totalTransactions || 0,
        averageTransactionAmount: statsData.averageTransactionAmount || 0,
        growthRate: statsData.growthRate || 0,
        topDoctor,
        topSpeciality,
        topPaymentMethod
      });
    } catch (err) {
      setError('Erreur lors du chargement des métriques');
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

  const MetricCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
    <div className="bg-white rounded-lg shadow-lg p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-full`} style={{ backgroundColor: `${color}20` }}>
          <Icon size={24} color={color} />
        </div>
      </div>
      {trend && (
        <div className="flex items-center mt-3">
          {trend.direction === 'up' ? (
            <TrendingUp size={16} className="text-green-500 mr-1" />
          ) : (
            <TrendingDown size={16} className="text-red-500 mr-1" />
          )}
          <span className={`text-sm font-medium ${
            trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend.value}% par rapport à la période précédente
          </span>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
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

  const collectionRate = metrics.totalRevenue > 0 ? (metrics.paidAmount / metrics.totalRevenue) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Chiffre d'Affaires Total"
        value={formatCurrency(metrics.totalRevenue)}
        icon={DollarSign}
        color="#10B981"
        subtitle={`${metrics.totalTransactions} transactions`}
        trend={metrics.growthRate !== 0 ? {
          direction: metrics.growthRate > 0 ? 'up' : 'down',
          value: Math.abs(metrics.growthRate).toFixed(1)
        } : null}
      />

      <MetricCard
        title="Montant Encaissé"
        value={formatCurrency(metrics.paidAmount)}
        icon={CreditCard}
        color="#3B82F6"
        subtitle={`${collectionRate.toFixed(1)}% du CA total`}
      />

      <MetricCard
        title="En Attente de Paiement"
        value={formatCurrency(metrics.pendingAmount)}
        icon={Clock}
        color="#F59E0B"
        subtitle="À encaisser"
      />

      <MetricCard
        title="Montant Impayé"
        value={formatCurrency(metrics.unpaidAmount)}
        icon={TrendingDown}
        color="#EF4444"
        subtitle="Non recouvré"
      />

      <MetricCard
        title="Montant Moyen Transaction"
        value={formatCurrency(metrics.averageTransactionAmount)}
        icon={BarChart3}
        color="#8B5CF6"
        subtitle="Par transaction"
      />

      <MetricCard
        title="Taux d'Encaissement"
        value={`${collectionRate.toFixed(1)}%`}
        icon={TrendingUp}
        color={collectionRate >= 90 ? "#10B981" : collectionRate >= 80 ? "#F59E0B" : "#EF4444"}
        subtitle={
          collectionRate >= 90 ? "Excellent" :
          collectionRate >= 80 ? "Bon" : "À améliorer"
        }
      />

      <MetricCard
        title="Médecin Top Performer"
        value={metrics.topDoctor?.doctorName?.replace('Dr. ', '') || 'N/A'}
        icon={Users}
        color="#EC4899"
        subtitle={metrics.topDoctor ? formatCurrency(metrics.topDoctor.totalRevenue) : ''}
      />

      <MetricCard
        title="Spécialité la Plus Rentable"
        value={metrics.topSpeciality?.specialityName || 'N/A'}
        icon={TrendingUp}
        color="#06B6D4"
        subtitle={metrics.topSpeciality ? formatCurrency(metrics.topSpeciality.totalRevenue) : ''}
      />

      {metrics.topPaymentMethod && (
        <MetricCard
          title="Mode de Paiement Principal"
          value={metrics.topPaymentMethod.method}
          icon={CreditCard}
          color="#84CC16"
          subtitle={`${metrics.topPaymentMethod.percentage?.toFixed(1)}% des paiements`}
        />
      )}

      <MetricCard
        title="Total Transactions"
        value={metrics.totalTransactions.toLocaleString()}
        icon={Users}
        color="#84CC16"
        subtitle="Sur la période"
      />
    </div>
  );
};

export default RevenueMetricsCards;