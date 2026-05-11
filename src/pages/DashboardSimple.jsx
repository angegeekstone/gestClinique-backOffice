import { useState, useEffect } from 'react';
import { Users, Calendar, DollarSign } from 'lucide-react';

export default function DashboardSimple() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    console.log('🔄 Dashboard Simple - Démarrage');

    // Simulation simple
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('📊 Chargement des données...');

        // Attente courte
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockData = {
          patients: 1250,
          appointments: 24,
          revenue: 125000
        };

        setData(mockData);
        console.log('✅ Données chargées:', mockData);
      } catch (error) {
        console.error('❌ Erreur:', error);
      } finally {
        setLoading(false);
        console.log('🏁 Chargement terminé');
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement simple...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-red-600 p-8">
        <p>❌ Erreur: Impossible de charger les données</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-red-100 border border-red-300 rounded p-4">
        <h1 className="text-xl font-bold text-red-800">🔴 DASHBOARD SIMPLE - TEST</h1>
        <p className="text-red-600">Version de débogage sans complexité</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-12 w-12 text-blue-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Patients</h3>
              <p className="text-3xl font-bold text-blue-600">{data.patients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Calendar className="h-12 w-12 text-green-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">RDV Aujourd'hui</h3>
              <p className="text-3xl font-bold text-green-600">{data.appointments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <DollarSign className="h-12 w-12 text-purple-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Revenus</h3>
              <p className="text-3xl font-bold text-purple-600">{data.revenue.toLocaleString()} FCFA</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-100 border border-green-300 rounded p-4">
        <h2 className="text-lg font-semibold text-green-800">✅ Dashboard Simple Fonctionnel</h2>
        <p className="text-green-600">Si vous voyez ceci, le problème vient du Dashboard complexe</p>
      </div>
    </div>
  );
}