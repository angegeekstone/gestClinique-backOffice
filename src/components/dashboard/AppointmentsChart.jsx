import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { Loader, AlertCircle } from 'lucide-react';
import { dashboardService } from '../../services/dashboardService.js';

export default function AppointmentsChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      setError(null);
      const chartData = await dashboardService.getAppointmentsChartData('week');
      setData(chartData || []);
    } catch (err) {
      console.error('Erreur lors du chargement des données du graphique:', err);
      setError('Erreur de chargement');
      // Fallback avec données par défaut en cas d'erreur
      setData([
        { name: 'Lun', consultations: 0, rendezVous: 0 },
        { name: 'Mar', consultations: 0, rendezVous: 0 },
        { name: 'Mer', consultations: 0, rendezVous: 0 },
        { name: 'Jeu', consultations: 0, rendezVous: 0 },
        { name: 'Ven', consultations: 0, rendezVous: 0 },
        { name: 'Sam', consultations: 0, rendezVous: 0 },
        { name: 'Dim', consultations: 0, rendezVous: 0 },
      ]);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-80">
          <div className="flex items-center space-x-2">
            <Loader className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-gray-600">Chargement du graphique...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Activité hebdomadaire</h3>
        <div className="flex items-center space-x-4">
          {error && (
            <div className="flex items-center text-orange-600 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              <span>Données par défaut</span>
            </div>
          )}
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Consultations</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Rendez-vous</span>
          </div>
          <button
            onClick={fetchChartData}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Actualiser
          </button>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6b7280' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar
              dataKey="consultations"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            <Bar
              dataKey="rendezVous"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}