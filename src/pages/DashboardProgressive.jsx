import { useState, useEffect } from 'react';
import { Users, Calendar, DollarSign, Loader } from 'lucide-react';
import { usePeriodFilter } from '../hooks/usePeriodFilter';
import { dashboardService } from '../services/dashboardService.js';

export default function DashboardProgressive() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Test du hook usePeriodFilter
  let periodFilterData = null;
  try {
    periodFilterData = usePeriodFilter();
  } catch (err) {
    console.error('❌ Erreur usePeriodFilter:', err);
  }

  // Test des appels API
  const testAPICall = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🧪 Test API call...');

      const result = await dashboardService.getDashboardOverview();
      console.log('✅ API Result:', result);
      setData(result);
    } catch (err) {
      console.error('❌ API Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="bg-blue-100 border border-blue-300 rounded p-4">
        <h1 className="text-xl font-bold text-blue-800">🧪 DASHBOARD PROGRESSIF - DÉBOGAGE</h1>
        <p className="text-blue-600">Test étape par étape des composants dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Étape 1: Hook usePeriodFilter */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            Étape 1: Hook usePeriodFilter
            {periodFilterData ? ' ✅' : ' ❌'}
          </h3>

          {periodFilterData ? (
            <div className="space-y-2 text-sm">
              <p><strong>Période:</strong> {periodFilterData.displayLabel}</p>
              <p><strong>Début:</strong> {periodFilterData.dateRange.startDate}</p>
              <p><strong>Fin:</strong> {periodFilterData.dateRange.endDate}</p>
              <button
                onClick={() => {
                  console.log('🔄 Passage à l\'étape 2');
                  setStep(2);
                }}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                ✅ Hook OK - Étape suivante (Step: {step})
              </button>
            </div>
          ) : (
            <p className="text-red-600">❌ Erreur dans usePeriodFilter</p>
          )}
        </div>

        {/* Étape 2: Test API */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            Étape 2: Test API Dashboard (Step actuel: {step})
          </h3>

          {step >= 2 ? (
            <div className="space-y-4">
              <button
                onClick={testAPICall}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? (
                  <><Loader className="w-4 h-4 animate-spin inline mr-2" /> Test en cours...</>
                ) : (
                  '🧪 Tester API Dashboard'
                )}
              </button>

              {error && (
                <div className="p-3 bg-red-100 border border-red-300 rounded">
                  <p className="text-red-600">❌ Erreur: {error}</p>
                </div>
              )}

              {data && (
                <div className="p-3 bg-green-100 border border-green-300 rounded">
                  <p className="text-green-600">✅ API fonctionne!</p>
                  <button
                    onClick={() => setStep(3)}
                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    ✅ API OK - Étape suivante
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Complétez d'abord l'étape 1</p>
          )}
        </div>

      </div>

      {/* Étape 3: Données mockées */}
      {step >= 3 && data && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Étape 3: Affichage des données ✅</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Patients</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {data.patientSummary?.totalPatients || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Consultations</p>
                  <p className="text-2xl font-bold text-green-600">
                    {data.consultationSummary?.todayConsultations || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Revenus</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {data.revenueSummary?.totalRevenue?.toLocaleString() || 0} FCFA
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded">
            <h4 className="text-green-800 font-semibold">🎉 Tous les tests passent !</h4>
            <p className="text-green-600 mt-1">
              Le problème dans le Dashboard original vient probablement :
              <br />• D'un useEffect en boucle infinie
              <br />• De dépendances manquantes
              <br />• Du AuthContext qui cause des re-renders constants
            </p>
          </div>
        </div>
      )}
    </div>
  );
}