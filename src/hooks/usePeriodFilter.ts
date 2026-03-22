import { useState, useEffect, useCallback } from 'react';

// Types
export type PeriodPreset = 'today' | 'this_week' | 'this_month' | 'this_quarter' | 'this_year' | 'custom';

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface PeriodState {
  preset: PeriodPreset;
  startDate: string | null;
  endDate: string | null;
}

export interface UsePeriodFilterReturn {
  selectedPeriod: PeriodState;
  dateRange: DateRange;
  displayLabel: string;
  changePeriodPreset: (preset: PeriodPreset) => void;
  changeCustomDates: (startDate: string, endDate: string) => void;
  presets: typeof PERIOD_PRESETS;
  presetLabels: Record<PeriodPreset, string>;
}

// Périodes prédéfinies
export const PERIOD_PRESETS = {
  TODAY: 'today' as const,
  THIS_WEEK: 'this_week' as const,
  THIS_MONTH: 'this_month' as const,
  THIS_QUARTER: 'this_quarter' as const,
  THIS_YEAR: 'this_year' as const,
  CUSTOM: 'custom' as const
};

const PERIOD_LABELS: Record<PeriodPreset, string> = {
  [PERIOD_PRESETS.TODAY]: "Aujourd'hui",
  [PERIOD_PRESETS.THIS_WEEK]: 'Cette semaine',
  [PERIOD_PRESETS.THIS_MONTH]: 'Ce mois',
  [PERIOD_PRESETS.THIS_QUARTER]: 'Ce trimestre',
  [PERIOD_PRESETS.THIS_YEAR]: 'Cette année',
  [PERIOD_PRESETS.CUSTOM]: 'Période personnalisée'
};

// Calcul des dates pour chaque période
const calculateDateRange = (preset: PeriodPreset): DateRange => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (preset) {
    case PERIOD_PRESETS.TODAY:
      return {
        startDate: today.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0]
      };

    case PERIOD_PRESETS.THIS_WEEK: {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Lundi
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Dimanche

      return {
        startDate: startOfWeek.toISOString().split('T')[0],
        endDate: endOfWeek.toISOString().split('T')[0]
      };
    }

    case PERIOD_PRESETS.THIS_MONTH: {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      return {
        startDate: startOfMonth.toISOString().split('T')[0],
        endDate: endOfMonth.toISOString().split('T')[0]
      };
    }

    case PERIOD_PRESETS.THIS_QUARTER: {
      const quarter = Math.floor(now.getMonth() / 3);
      const startOfQuarter = new Date(now.getFullYear(), quarter * 3, 1);
      const endOfQuarter = new Date(now.getFullYear(), (quarter + 1) * 3, 0);

      return {
        startDate: startOfQuarter.toISOString().split('T')[0],
        endDate: endOfQuarter.toISOString().split('T')[0]
      };
    }

    case PERIOD_PRESETS.THIS_YEAR: {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const endOfYear = new Date(now.getFullYear(), 11, 31);

      return {
        startDate: startOfYear.toISOString().split('T')[0],
        endDate: endOfYear.toISOString().split('T')[0]
      };
    }

    default:
      return {
        startDate: today.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0]
      };
  }
};

export const usePeriodFilter = (): UsePeriodFilterReturn => {
  // État de la période sélectionnée
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodState>(() => {
    try {
      const saved = localStorage.getItem('dashboard_period_filter');
      return saved ? JSON.parse(saved) : {
        preset: PERIOD_PRESETS.THIS_MONTH,
        startDate: null,
        endDate: null
      };
    } catch {
      return {
        preset: PERIOD_PRESETS.THIS_MONTH,
        startDate: null,
        endDate: null
      };
    }
  });

  // Calcul automatique des dates selon le preset
  const dateRange: DateRange = selectedPeriod.preset === PERIOD_PRESETS.CUSTOM && selectedPeriod.startDate && selectedPeriod.endDate
    ? { startDate: selectedPeriod.startDate, endDate: selectedPeriod.endDate }
    : calculateDateRange(selectedPeriod.preset);

  // Sauvegarde dans localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dashboard_period_filter', JSON.stringify(selectedPeriod));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des préférences de période:', error);
    }
  }, [selectedPeriod]);

  // Changer le preset
  const changePeriodPreset = useCallback((preset: PeriodPreset) => {
    if (preset === PERIOD_PRESETS.CUSTOM) {
      // Pour custom, garder les dates actuelles ou utiliser ce mois
      const fallbackRange = calculateDateRange(PERIOD_PRESETS.THIS_MONTH);
      setSelectedPeriod(prev => ({
        preset,
        startDate: prev.startDate || fallbackRange.startDate,
        endDate: prev.endDate || fallbackRange.endDate
      }));
    } else {
      setSelectedPeriod({
        preset,
        startDate: null,
        endDate: null
      });
    }
  }, []);

  // Changer les dates personnalisées
  const changeCustomDates = useCallback((startDate: string, endDate: string) => {
    setSelectedPeriod({
      preset: PERIOD_PRESETS.CUSTOM,
      startDate,
      endDate
    });
  }, []);

  // Formatage pour l'affichage
  const getDisplayLabel = useCallback((): string => {
    if (selectedPeriod.preset === PERIOD_PRESETS.CUSTOM && dateRange.startDate && dateRange.endDate) {
      const start = new Date(dateRange.startDate).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      const end = new Date(dateRange.endDate).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      return `${start} - ${end}`;
    }

    return PERIOD_LABELS[selectedPeriod.preset] || "Période inconnue";
  }, [selectedPeriod.preset, dateRange]);

  return {
    // État actuel
    selectedPeriod,
    dateRange,
    displayLabel: getDisplayLabel(),

    // Actions
    changePeriodPreset,
    changeCustomDates,

    // Constantes utiles
    presets: PERIOD_PRESETS,
    presetLabels: PERIOD_LABELS
  };
};