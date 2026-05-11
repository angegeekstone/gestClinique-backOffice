import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import revenueService from '../../services/revenueService';

const SpecialityComparisonChart = ({ startDate, endDate }) => {
  const [specialityData, setSpecialityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('bar'); // 'bar', 'scatter', 'radar'

  useEffect(() => {
    fetchSpecialityData();
  }, [startDate, endDate]);

  const fetchSpecialityData = async () => {
    try {
      setLoading(true);
      const data = await revenueService.getRevenueBySpeciality(startDate, endDate);
      setSpecialityData(data);
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

  const prepareBarData = () => {
    return specialityData.map(spec => ({
      name: spec.specialityName.substring(0, 12), // Nom abrégé pour l'affichage
      fullName: spec.specialityName,
      revenue: spec.totalRevenue,
      consultations: spec.consultationCount,
      averagePrice: spec.averagePrice,
      marketShare: spec.marketShare
    }));
  };

  const prepareScatterData = () => {
    return specialityData.map(spec => ({
      x: spec.consultationCount,
      y: spec.averagePrice,
      z: spec.totalRevenue,
      name: spec.specialityName,
      marketShare: spec.marketShare
    }));
  };

  const prepareRadarData = () => {
    if (!specialityData.length) return [];

    // Normaliser les données pour le radar (0-100)
    const maxRevenue = Math.max(...specialityData.map(s => s.totalRevenue));
    const maxConsultations = Math.max(...specialityData.map(s => s.consultationCount));
    const maxPrice = Math.max(...specialityData.map(s => s.averagePrice));

    return specialityData.map(spec => ({
      name: spec.specialityName,
      'CA (%)': (spec.totalRevenue / maxRevenue) * 100,
      'Consultations (%)': (spec.consultationCount / maxConsultations) * 100,
      'Prix Moyen (%)': (spec.averagePrice / maxPrice) * 100,
      'Part de Marché': spec.marketShare
    }));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.fullName || data.name}</p>
          {chartType === 'bar' && (
            <>
              <p className="text-sm">
                <span className="font-medium">CA:</span> {formatCurrency(data.revenue)}
              </p>
              <p className="text-sm">
                <span className="font-medium">Consultations:</span> {data.consultations}
              </p>
              <p className="text-sm">
                <span className="font-medium">Prix moyen:</span> {formatCurrency(data.averagePrice)}
              </p>
              <p className="text-sm">
                <span className="font-medium">Part de marché:</span> {data.marketShare?.toFixed(1)}%
              </p>
            </>
          )}
          {chartType === 'scatter' && (
            <>
              <p className="text-sm">
                <span className="font-medium">Consultations:</span> {data.x}
              </p>
              <p className="text-sm">
                <span className="font-medium">Prix moyen:</span> {formatCurrency(data.y)}
              </p>
              <p className="text-sm">
                <span className="font-medium">CA Total:</span> {formatCurrency(data.z)}
              </p>
              <p className="text-sm">
                <span className="font-medium">Part de marché:</span> {data.marketShare?.toFixed(1)}%
              </p>
            </>
          )}
        </div>
      );
    }
    return null;
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

  const barData = prepareBarData();
  const scatterData = prepareScatterData();
  const radarData = prepareRadarData();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Analyse Comparative des Spécialités</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              chartType === 'bar'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Barres
          </button>
          <button
            onClick={() => setChartType('scatter')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              chartType === 'scatter'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Nuage
          </button>
          <button
            onClick={() => setChartType('radar')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              chartType === 'radar'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Radar
          </button>
        </div>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
                yAxisId="left"
                orientation="left"
                tick={{ fontSize: 12 }}
                tickFormatter={formatCurrency}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="revenue"
                name="CA Total"
                fill="#10B981"
                radius={[2, 2, 0, 0]}
              />
              <Bar
                yAxisId="right"
                dataKey="consultations"
                name="Consultations"
                fill="#3B82F6"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          ) : chartType === 'scatter' ? (
            <ScatterChart data={scatterData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
                name="Spécialités"
                data={scatterData}
                fill="#8B5CF6"
                fillOpacity={0.7}
                stroke="#6D28D9"
                strokeWidth={2}
              />
            </ScatterChart>
          ) : (
            <RadarChart data={radarData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <PolarGrid />
              <PolarAngleAxis tick={{ fontSize: 10 }} />
              <PolarRadiusAxis
                angle={0}
                domain={[0, 100]}
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => `${value}%`}
              />
              {radarData.map((spec, index) => (
                <Radar
                  key={spec.name}
                  name={spec.name.substring(0, 12)}
                  dataKey="name"
                  stroke={`hsl(${(index * 360) / radarData.length}, 70%, 50%)`}
                  fill={`hsl(${(index * 360) / radarData.length}, 70%, 50%)`}
                  fillOpacity={0.1}
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
                  data={[spec]}
                />
              ))}
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </RadarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        {chartType === 'bar' && (
          <p>
            Comparaison des chiffres d'affaires et du nombre de consultations par spécialité.
          </p>
        )}
        {chartType === 'scatter' && (
          <p>
            Analyse de la relation entre le volume de consultations et le prix moyen par spécialité.
            Plus le point est à droite et en haut, plus la spécialité combine volume élevé et prix élevés.
          </p>
        )}
        {chartType === 'radar' && (
          <p>
            Vue multidimensionnelle des performances : CA, consultations, prix moyen et part de marché.
            Plus l'aire est grande, plus la spécialité performe globalement.
          </p>
        )}
      </div>
    </div>
  );
};

export default SpecialityComparisonChart;