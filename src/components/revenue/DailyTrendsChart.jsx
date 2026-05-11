import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import revenueService from '../../services/revenueService';

const DailyTrendsChart = ({ startDate, endDate }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDailyTrends();
  }, [startDate, endDate]);

  const fetchDailyTrends = async () => {
    try {
      setLoading(true);
      const statsData = await revenueService.getRevenueStats(startDate, endDate);

      const dailyData = statsData.dailyTrends?.map(item => ({
        date: new Date(item.date).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'short'
        }),
        revenue: item.revenue || 0,
        consultations: item.consultationCount || 0,
        averagePrice: item.averagePrice || 0
      })) || [];

      setData(dailyData);
    } catch (err) {
      setError('Erreur lors du chargement des tendances quotidiennes');
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
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Évolution Quotidienne des Revenus</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            yAxisId="revenue"
            tick={{ fontSize: 12 }}
            tickFormatter={formatCurrency}
          />
          <YAxis
            yAxisId="consultations"
            orientation="right"
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value, name) => [
              name === 'revenue' ? formatCurrency(value) : value,
              name === 'revenue' ? 'Revenus' :
              name === 'consultations' ? 'Consultations' : 'Prix Moyen'
            ]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Legend />
          <Line
            yAxisId="revenue"
            type="monotone"
            dataKey="revenue"
            stroke="#10B981"
            strokeWidth={2}
            name="Revenus"
          />
          <Line
            yAxisId="consultations"
            type="monotone"
            dataKey="consultations"
            stroke="#3B82F6"
            strokeWidth={2}
            name="Consultations"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyTrendsChart;