import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import revenueService from '../../services/revenueService';

const SpecialityRevenueChart = ({ startDate, endDate }) => {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('pie'); // 'pie' ou 'bar'

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  useEffect(() => {
    fetchRevenueData();
  }, [startDate, endDate]);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      const data = await revenueService.getRevenueBySpeciality(startDate, endDate);
      setRevenueData(data);
    } catch (err) {
      setError('Erreur lors du chargement des données de revenus par spécialité');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => `${value.toFixed(1)}%`;

  const customLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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

  const pieData = revenueData.map(speciality => ({
    name: speciality.specialityName,
    value: speciality.totalRevenue,
    marketShare: speciality.marketShare
  }));

  const barData = revenueData.map(speciality => ({
    name: speciality.specialityName,
    revenue: speciality.totalRevenue,
    consultations: speciality.consultationCount,
    averagePrice: speciality.averagePrice
  }));

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Revenus par Spécialité</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setChartType('pie')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              chartType === 'pie'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Répartition
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              chartType === 'bar'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Comparaison
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique */}
        <div className="lg:col-span-2">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'pie' ? (
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={customLabel}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [formatCurrency(value), 'Revenus']} />
                </PieChart>
              ) : (
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      name === 'revenue' ? formatCurrency(value) : value,
                      name === 'revenue' ? 'Revenus' :
                      name === 'consultations' ? 'Consultations' : 'Prix Moyen'
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenus" fill="#0088FE" />
                  <Bar dataKey="consultations" name="Consultations" fill="#00C49F" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Légende et statistiques */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-700">Détails par Spécialité</h3>
          <div className="space-y-3">
            {revenueData.map((speciality, index) => (
              <div key={speciality.specialityId} className="flex items-start space-x-3">
                <div
                  className="w-4 h-4 rounded-full mt-1 flex-shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-900">
                    {speciality.specialityName}
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>{formatCurrency(speciality.totalRevenue)}</div>
                    <div>{speciality.consultationCount} consultations</div>
                    <div>Part de marché: {formatPercentage(speciality.marketShare)}</div>
                    <div>Prix moyen: {formatCurrency(speciality.averagePrice)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Résumé total */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-700 mb-2">Total</h4>
            <div className="text-sm text-gray-600">
              <div>CA Total: {formatCurrency(revenueData.reduce((sum, s) => sum + s.totalRevenue, 0))}</div>
              <div>Consultations: {revenueData.reduce((sum, s) => sum + s.consultationCount, 0)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialityRevenueChart;