import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import revenueService from '../../services/revenueService';

const DoctorComparisonChart = ({ startDate, endDate }) => {
  const [doctorData, setDoctorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('bar'); // 'bar' ou 'scatter'

  useEffect(() => {
    fetchDoctorData();
  }, [startDate, endDate]);

  const fetchDoctorData = async () => {
    try {
      setLoading(true);
      const data = await revenueService.getRevenueByDoctor(startDate, endDate);
      setDoctorData(data);
    } catch (err) {
      setError('Erreur lors du chargement des données de comparaison');
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

  const prepareChartData = () => {
    return doctorData.map(doctor => ({
      name: doctor.doctorName.replace('Dr. ', '').split(' ')[0], // Prénom seulement pour l'affichage
      fullName: doctor.doctorName,
      speciality: doctor.speciality,
      totalRevenue: doctor.totalRevenue,
      paidAmount: doctor.paidAmount,
      pendingAmount: doctor.pendingAmount,
      consultationCount: doctor.consultationCount,
      averagePrice: doctor.averagePrice,
      collectionRate: doctor.collectionRate,
      // Pour le graphique scatter
      x: doctor.consultationCount,
      y: doctor.averagePrice
    }));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-48"></div>
          <div className="h-80 bg-gray-200 rounded"></div>
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

  const chartData = prepareChartData();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.fullName}</p>
          <p className="text-sm text-gray-600 mb-2">{data.speciality}</p>
          {chartType === 'bar' ? (
            <>
              <p className="text-sm">
                <span className="font-medium">CA Total:</span> {formatCurrency(data.totalRevenue)}
              </p>
              <p className="text-sm">
                <span className="font-medium">Payé:</span> {formatCurrency(data.paidAmount)}
              </p>
              <p className="text-sm">
                <span className="font-medium">En attente:</span> {formatCurrency(data.pendingAmount)}
              </p>
              <p className="text-sm">
                <span className="font-medium">Consultations:</span> {data.consultationCount}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm">
                <span className="font-medium">Consultations:</span> {data.consultationCount}
              </p>
              <p className="text-sm">
                <span className="font-medium">Prix moyen:</span> {formatCurrency(data.averagePrice)}
              </p>
              <p className="text-sm">
                <span className="font-medium">CA Total:</span> {formatCurrency(data.totalRevenue)}
              </p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Comparaison des Performances</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setChartType('bar')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              chartType === 'bar'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Barres
          </button>
          <button
            onClick={() => setChartType('scatter')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              chartType === 'scatter'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Nuage de points
          </button>
        </div>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="totalRevenue"
                name="CA Total"
                fill="#10B981"
                radius={[2, 2, 0, 0]}
              />
              <Bar
                dataKey="paidAmount"
                name="Montant Payé"
                fill="#3B82F6"
                radius={[2, 2, 0, 0]}
              />
              <Bar
                dataKey="pendingAmount"
                name="En Attente"
                fill="#F59E0B"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          ) : (
            <ScatterChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="x"
                name="Consultations"
                tick={{ fontSize: 12 }}
                label={{ value: 'Nombre de consultations', position: 'insideBottom', offset: -10 }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Prix moyen"
                tick={{ fontSize: 12 }}
                tickFormatter={formatCurrency}
                label={{ value: 'Prix moyen (XOF)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Scatter
                name="Médecins"
                data={chartData}
                fill="#8B5CF6"
                fillOpacity={0.7}
                stroke="#6D28D9"
                strokeWidth={2}
              />
            </ScatterChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        {chartType === 'bar' ? (
          <p>
            Comparaison des chiffres d'affaires, montants payés et en attente par médecin.
          </p>
        ) : (
          <p>
            Relation entre le nombre de consultations et le prix moyen par médecin.
            Plus le point est à droite et en haut, plus le médecin a un volume élevé avec des prix élevés.
          </p>
        )}
      </div>
    </div>
  );
};

export default DoctorComparisonChart;