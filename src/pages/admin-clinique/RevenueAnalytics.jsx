import React, { useState } from 'react';
import { Calendar, Download, RefreshCw } from 'lucide-react';
import RevenueMetricsCards from '../../components/revenue/RevenueMetricsCards';
import DoctorRevenueTable from '../../components/revenue/DoctorRevenueTable';
import SpecialityRevenueChart from '../../components/revenue/SpecialityRevenueChart';
import CollectionRateChart from '../../components/revenue/CollectionRateChart';
import DailyTrendsChart from '../../components/revenue/DailyTrendsChart';
import EnhancedPaymentMethodsChart from '../../components/revenue/EnhancedPaymentMethodsChart';
import DoctorPerformanceCards from '../../components/revenue/DoctorPerformanceCards';
import DoctorComparisonChart from '../../components/revenue/DoctorComparisonChart';
import SpecialityPerformanceCards from '../../components/revenue/SpecialityPerformanceCards';
import SpecialityComparisonChart from '../../components/revenue/SpecialityComparisonChart';

const RevenueAnalytics = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleExport = () => {
    // TODO: Implémenter l'export des données
    alert('Fonctionnalité d\'export en cours de développement');
  };

  const formatDateForDisplay = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analyse des Revenus</h1>
            <p className="text-gray-600 mt-1">
              Période du {formatDateForDisplay(dateRange.startDate)} au {formatDateForDisplay(dateRange.endDate)}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Sélecteurs de dates */}
            <div className="flex items-center space-x-2">
              <Calendar size={20} className="text-gray-500" />
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => handleDateChange('startDate', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500">à</span>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => handleDateChange('endDate', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Boutons d'action */}
            <div className="flex space-x-2">
              <button
                onClick={handleRefresh}
                className="flex items-center px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RefreshCw size={16} className="mr-2" />
                Actualiser
              </button>
              <button
                onClick={handleExport}
                className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download size={16} className="mr-2" />
                Exporter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cartes de métriques */}
      <RevenueMetricsCards
        key={`metrics-${refreshKey}`}
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
      />

      {/* Performances des médecins */}
      <DoctorPerformanceCards
        key={`doctor-performance-${refreshKey}`}
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
      />

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <DoctorRevenueTable
          key={`doctor-table-${refreshKey}`}
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
        />

        <DoctorComparisonChart
          key={`doctor-comparison-${refreshKey}`}
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
        />
      </div>

      {/* Performances des spécialités */}
      <SpecialityPerformanceCards
        key={`speciality-performance-${refreshKey}`}
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
      />

      {/* Analyse des spécialités */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SpecialityRevenueChart
          key={`speciality-chart-${refreshKey}`}
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
        />

        <SpecialityComparisonChart
          key={`speciality-comparison-${refreshKey}`}
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
        />
      </div>

      {/* Graphiques secondaires */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <EnhancedPaymentMethodsChart
          key={`payment-methods-${refreshKey}`}
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
        />

        <CollectionRateChart
          key={`collection-chart-${refreshKey}`}
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
        />
      </div>

      {/* Évolution quotidienne */}
      <DailyTrendsChart
        key={`daily-trends-${refreshKey}`}
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
      />

      {/* Raccourcis de périodes */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Raccourcis de périodes</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Aujourd\'hui', days: 0 },
            { label: '7 derniers jours', days: 7 },
            { label: '30 derniers jours', days: 30 },
            { label: '3 derniers mois', days: 90 },
            { label: 'Cette année', days: 365 }
          ].map((period) => (
            <button
              key={period.label}
              onClick={() => {
                const endDate = new Date().toISOString().split('T')[0];
                const startDate = new Date(Date.now() - period.days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                setDateRange({ startDate, endDate });
              }}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalytics;