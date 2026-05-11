import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CreditCard, Banknote, Smartphone, Building } from 'lucide-react';
import revenueService from '../../services/revenueService';

const PaymentMethodsChart = ({ startDate, endDate }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPaymentMethods();
  }, [startDate, endDate]);

  const getPaymentMethodIcon = (method) => {
    switch (method?.toUpperCase()) {
      case 'CASH':
        return Banknote;
      case 'CARD':
        return CreditCard;
      case 'MOBILE':
        return Smartphone;
      case 'BANK_TRANSFER':
        return Building;
      default:
        return CreditCard;
    }
  };

  const getPaymentMethodLabel = (method) => {
    switch (method?.toUpperCase()) {
      case 'CASH':
        return 'Espèces';
      case 'CARD':
        return 'Carte Bancaire';
      case 'MOBILE':
        return 'Paiement Mobile';
      case 'BANK_TRANSFER':
        return 'Virement Bancaire';
      default:
        return method;
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const statsData = await revenueService.getRevenueStats(startDate, endDate);

      const paymentData = statsData.paymentMethods?.map(item => ({
        method: item.method,
        amount: item.amount || 0,
        transactionCount: item.transactionCount || 0,
        percentage: item.percentage || 0,
        label: getPaymentMethodLabel(item.method)
      })) || [];

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

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par Mode de Paiement</h3>

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
                  return item ? item.label : label;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Détails par mode de paiement */}
        <div className="space-y-3">
          {data.map((item, index) => {
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
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-600">
                      {item.transactionCount} transactions
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
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsChart;