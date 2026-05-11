import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import revenueService from '../../services/revenueService';

const DoctorRevenueTable = ({ startDate, endDate }) => {
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('table'); // 'table' ou 'chart'

  useEffect(() => {
    fetchRevenueData();
  }, [startDate, endDate]);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      const data = await revenueService.getRevenueByDoctor(startDate, endDate);
      setRevenueData(data);
    } catch (err) {
      setError('Erreur lors du chargement des données de revenus');
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

  const formatPercentage = (rate) => {
    return `${rate.toFixed(1)}%`;
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

  const chartData = revenueData.map(doctor => ({
    name: doctor.doctorName.replace('Dr. ', ''),
    totalRevenue: doctor.totalRevenue,
    paidAmount: doctor.paidAmount,
    pendingAmount: doctor.pendingAmount,
    consultationCount: doctor.consultationCount
  }));

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Revenus par Médecin</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'table'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tableau
          </button>
          <button
            onClick={() => setViewMode('chart')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'chart'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Graphique
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Médecin</th>
                <th className="px-6 py-3">Spécialité</th>
                <th className="px-6 py-3">CA Total</th>
                <th className="px-6 py-3">Montant Payé</th>
                <th className="px-6 py-3">En Attente</th>
                <th className="px-6 py-3">Consultations</th>
                <th className="px-6 py-3">Prix Moyen</th>
                <th className="px-6 py-3">Taux Encaissement</th>
              </tr>
            </thead>
            <tbody>
              {revenueData.map((doctor) => (
                <tr key={doctor.doctorId} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {doctor.doctorName}
                  </td>
                  <td className="px-6 py-4">{doctor.speciality}</td>
                  <td className="px-6 py-4 font-semibold text-green-600">
                    {formatCurrency(doctor.totalRevenue)}
                  </td>
                  <td className="px-6 py-4 text-blue-600">
                    {formatCurrency(doctor.paidAmount)}
                  </td>
                  <td className="px-6 py-4 text-orange-600">
                    {formatCurrency(doctor.pendingAmount)}
                  </td>
                  <td className="px-6 py-4">{doctor.consultationCount}</td>
                  <td className="px-6 py-4">
                    {formatCurrency(doctor.averagePrice)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      doctor.collectionRate >= 95
                        ? 'bg-green-100 text-green-800'
                        : doctor.collectionRate >= 85
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {formatPercentage(doctor.collectionRate)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  formatCurrency(value),
                  name === 'totalRevenue' ? 'CA Total' :
                  name === 'paidAmount' ? 'Montant Payé' : 'En Attente'
                ]}
              />
              <Legend />
              <Bar dataKey="totalRevenue" name="CA Total" fill="#10B981" />
              <Bar dataKey="paidAmount" name="Montant Payé" fill="#3B82F6" />
              <Bar dataKey="pendingAmount" name="En Attente" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default DoctorRevenueTable;