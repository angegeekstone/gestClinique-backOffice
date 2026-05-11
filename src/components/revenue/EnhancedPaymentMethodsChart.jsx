import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { CreditCard, Banknote, Smartphone, Building, Shield } from 'lucide-react';
import revenueService from '../../services/revenueService';

const EnhancedPaymentMethodsChart = ({ startDate, endDate }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('chart'); // 'chart' ou 'breakdown'

  useEffect(() => {
    fetchPaymentMethods();
  }, [startDate, endDate]);

  const getPaymentMethodIcon = (method) => {
    switch (method?.toUpperCase()) {
      case 'CASH':
        return Banknote;
      case 'CARD':
        return CreditCard;
      case 'MOBILE_MONEY':
        return Smartphone;
      case 'TRANSFER':
        return Building;
      case 'INSURANCE':
        return Shield;
      default:
        return CreditCard;
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const paymentData = await revenueService.getRevenueByPaymentMethod(startDate, endDate);
      setData(paymentData);
    } catch (err) {
      setError('Erreur lors du chargement des modes de paiement');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
  const MOBILE_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-48"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);
  const mobileMoneyData = data.find(item => item.method === 'MOBILE_MONEY');

  if (!loading && !error && data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Analyse des Modes de Paiement</h3>
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard size={32} className="text-gray-400" />
          </div>
          <h4 className="text-lg font-medium text-gray-600 mb-2">Aucune donnée disponible</h4>
          <p className="text-gray-500">
            Aucun paiement n'a été enregistré pour la période sélectionnée.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Analyse des Modes de Paiement</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('chart')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'chart'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Vue Générale
          </button>
          <button
            onClick={() => setViewMode('breakdown')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'breakdown'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            disabled={!mobileMoneyData?.breakdown}
          >
            Mobile Money
          </button>
        </div>
      </div>

      {viewMode === 'chart' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Graphique en secteurs */}
          <div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percentage }) => `${percentage.toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [formatCurrency(value), 'Montant']}
                  labelFormatter={(label, payload) => {
                    const item = payload?.[0]?.payload;
                    return item ? item.methodName : label;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Détails par mode de paiement */}
          <div className="space-y-3">
            {data
              .sort((a, b) => b.amount - a.amount)
              .map((item, index) => {
                const Icon = getPaymentMethodIcon(item.method);
                return (
                  <div key={item.method} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${COLORS[index % COLORS.length]}20` }}
                      >
                        <Icon size={20} color={COLORS[index % COLORS.length]} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.methodName}</p>
                        <p className="text-sm text-gray-600">
                          {item.transactionCount} transaction{item.transactionCount > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(item.amount)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                );
              })}

            {/* Statistiques globales */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-center">
                <p className="text-lg font-bold text-blue-900">
                  {formatCurrency(totalAmount)}
                </p>
                <p className="text-sm text-blue-700">Total Encaissé</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Breakdown Mobile Money */
        <div className="space-y-6">
          {mobileMoneyData && (
            <>
              {/* En-tête Mobile Money */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Smartphone size={24} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Mobile Money</h4>
                      <p className="text-sm text-gray-600">
                        {mobileMoneyData.transactionCount} transactions • {mobileMoneyData.percentage.toFixed(1)}% du total
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-blue-600">
                      {formatCurrency(mobileMoneyData.amount)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Graphique providers */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={mobileMoneyData.breakdown} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="providerName"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis tick={{ fontSize: 12 }} tickFormatter={formatCurrency} />
                      <Tooltip formatter={(value) => [formatCurrency(value), 'Montant']} />
                      <Bar dataKey="amount" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Détail providers */}
                <div className="space-y-3">
                  {mobileMoneyData.breakdown
                    .sort((a, b) => b.amount - a.amount)
                    .map((provider, index) => (
                      <div key={provider.provider} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: MOBILE_COLORS[index % MOBILE_COLORS.length] }}
                          ></div>
                          <div>
                            <p className="font-medium text-gray-900">{provider.providerName}</p>
                            <p className="text-sm text-gray-600">
                              {provider.transactionCount} transactions
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(provider.amount)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {provider.percentage.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Statistiques providers */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-3">Analyse des Providers</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {mobileMoneyData.breakdown.map((provider, index) => (
                    <div key={provider.provider} className="text-center">
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(provider.averageAmount)}
                      </p>
                      <p className="text-sm text-gray-600">{provider.providerName}</p>
                      <p className="text-xs text-gray-500">Montant moyen</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedPaymentMethodsChart;