import React, { useState } from 'react';
import { Calendar, ChevronDown, Check } from 'lucide-react';
import { usePeriodFilter } from '../../hooks/usePeriodFilter';

export default function PeriodFilter() {
  const {
    selectedPeriod,
    dateRange,
    displayLabel,
    changePeriodPreset,
    changeCustomDates,
    presets,
    presetLabels
  } = usePeriodFilter();

  const [isOpen, setIsOpen] = useState(false);
  const [showCustomDates, setShowCustomDates] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(dateRange.startDate || '');
  const [tempEndDate, setTempEndDate] = useState(dateRange.endDate || '');

  const handlePresetClick = (preset) => {
    if (preset === presets.CUSTOM) {
      setShowCustomDates(true);
      setTempStartDate(dateRange.startDate || '');
      setTempEndDate(dateRange.endDate || '');
    } else {
      changePeriodPreset(preset);
      setIsOpen(false);
      setShowCustomDates(false);
    }
  };

  const handleCustomDatesApply = () => {
    if (tempStartDate && tempEndDate && tempStartDate <= tempEndDate) {
      changeCustomDates(tempStartDate, tempEndDate);
      setIsOpen(false);
      setShowCustomDates(false);
    }
  };

  const handleCustomDatesCancel = () => {
    setShowCustomDates(false);
    setTempStartDate(dateRange.startDate || '');
    setTempEndDate(dateRange.endDate || '');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
        <span>{displayLabel}</span>
        <ChevronDown className={`w-4 h-4 ml-2 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          <div className="py-1">
            {/* Périodes prédéfinies */}
            <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">
              Périodes rapides
            </div>

            {Object.entries(presetLabels).map(([preset, label]) => {
              if (preset === presets.CUSTOM) return null;

              const isSelected = selectedPeriod.preset === preset;

              return (
                <button
                  key={preset}
                  onClick={() => handlePresetClick(preset)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${
                    isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <span>{label}</span>
                  {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                </button>
              );
            })}

            {/* Séparateur */}
            <div className="border-t border-gray-100 my-1"></div>

            {/* Période personnalisée */}
            {!showCustomDates ? (
              <button
                onClick={() => handlePresetClick(presets.CUSTOM)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${
                  selectedPeriod.preset === presets.CUSTOM ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                <span>Période personnalisée</span>
                {selectedPeriod.preset === presets.CUSTOM && <Check className="w-4 h-4 text-blue-600" />}
              </button>
            ) : (
              <div className="p-4 border-t border-gray-100">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Date de début
                    </label>
                    <input
                      type="date"
                      value={tempStartDate}
                      onChange={(e) => setTempStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Date de fin
                    </label>
                    <input
                      type="date"
                      value={tempEndDate}
                      onChange={(e) => setTempEndDate(e.target.value)}
                      min={tempStartDate}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={handleCustomDatesCancel}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleCustomDatesApply}
                      disabled={!tempStartDate || !tempEndDate || tempStartDate > tempEndDate}
                      className="flex-1 px-3 py-2 text-sm border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Appliquer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overlay pour fermer le dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsOpen(false);
            setShowCustomDates(false);
          }}
        />
      )}
    </div>
  );
}