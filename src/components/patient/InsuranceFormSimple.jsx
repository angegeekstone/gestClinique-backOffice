import { useState } from 'react';
import {
  Shield,
  Building,
  CreditCard,
  Calculator,
  Calendar,
  AlertCircle,
  Check,
  Info
} from 'lucide-react';

const INSURANCE_COMPANIES = [
  { code: 'AXMA', name: 'AXMA ASSURANCE', type: 'both' },
  { code: 'ASCOMA', name: 'ASCOMA', type: 'mutuelle' },
  { code: 'NSIA', name: 'NSIA ASSURANCE', type: 'both' },
  { code: 'SONAR', name: 'SONAR', type: 'assurance' },
  { code: 'SAHAM', name: 'SAHAM ASSURANCE', type: 'both' },
  { code: 'ALLIANZ', name: 'ALLIANZ CI', type: 'assurance' }
];

export default function InsuranceFormSimple({ patientData, setPatientData, errors = {} }) {
  const [simulationAmount, setSimulationAmount] = useState(50000);

  // Fonction pour mettre à jour les données d'assurance
  const handleInsuranceChange = (field, value) => {
    setPatientData(prev => ({
      ...prev,
      insurance: {
        ...prev.insurance,
        [field]: value
      }
    }));
  };

  // Toggle assurance - VERSION SIMPLIFIÉE
  const handleToggleInsurance = (hasInsurance) => {
    if (!hasInsurance) {
      // Reset toutes les données d'assurance
      setPatientData(prev => ({
        ...prev,
        insurance: {
          hasInsurance: false,
          companyName: '',
          companyCode: '',
          policyNumber: '',
          memberNumber: '',
          planType: '',
          planCategory: 'INDIVIDUAL',
          employerName: '',
          groupCode: '',
          coverageRate: 0,
          deductible: 0,
          validFrom: '',
          validUntil: '',
          isActive: true
        }
      }));
    } else {
      handleInsuranceChange('hasInsurance', true);
    }
  };

  // Calcul simplifié SANS plafonds
  const calculateSimulation = () => {
    if (!patientData.insurance.hasInsurance || !patientData.insurance.coverageRate) {
      return { coverage: 0, patient: simulationAmount };
    }

    const coverage = Math.round(simulationAmount * (patientData.insurance.coverageRate / 100));
    const patient = simulationAmount - coverage;

    return { coverage, patient };
  };

  const simulation = calculateSimulation();

  return (
    <div className="space-y-6">
      {/* Toggle principal */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="hasInsurance"
            checked={patientData.insurance?.hasInsurance || false}
            onChange={(e) => handleToggleInsurance(e.target.checked)}
            className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="hasInsurance" className="flex items-center text-lg font-medium text-gray-900">
            <Shield className="w-5 h-5 mr-2 text-blue-600" />
            Le patient a une assurance/mutuelle
          </label>
        </div>
        {!patientData.insurance?.hasInsurance && (
          <p className="mt-2 text-sm text-gray-500 ml-8">
            Le patient paiera l'intégralité des frais de consultation
          </p>
        )}
      </div>

      {/* Formulaire d'assurance simplifié */}
      {patientData.insurance?.hasInsurance && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <CreditCard className="w-6 h-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-blue-900">
              Informations de la carte d'assurance
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Compagnie d'assurance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Compagnie d'assurance *
              </label>
              <select
                value={patientData.insurance.companyCode || ''}
                onChange={(e) => {
                  const company = INSURANCE_COMPANIES.find(c => c.code === e.target.value);
                  handleInsuranceChange('companyCode', e.target.value);
                  handleInsuranceChange('companyName', company?.name || '');
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.insurance?.companyCode ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Sélectionner une compagnie...</option>
                {INSURANCE_COMPANIES.map((company) => (
                  <option key={company.code} value={company.code}>
                    {company.name}
                  </option>
                ))}
              </select>
              {errors.insurance?.companyCode && (
                <p className="text-sm text-red-600 mt-1">{errors.insurance.companyCode}</p>
              )}
            </div>

            {/* Numéro de police */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                N° de police (sur la carte) *
              </label>
              <input
                type="text"
                value={patientData.insurance.policyNumber || ''}
                onChange={(e) => handleInsuranceChange('policyNumber', e.target.value.toUpperCase())}
                placeholder="Ex: AX-2024-12345"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.insurance?.policyNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.insurance?.policyNumber && (
                <p className="text-sm text-red-600 mt-1">{errors.insurance.policyNumber}</p>
              )}
            </div>

            {/* Numéro adhérent */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                N° Adhérent *
              </label>
              <input
                type="text"
                value={patientData.insurance.memberNumber || ''}
                onChange={(e) => handleInsuranceChange('memberNumber', e.target.value)}
                placeholder="Ex: 240156789"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.insurance?.memberNumber ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.insurance?.memberNumber && (
                <p className="text-sm text-red-600 mt-1">{errors.insurance.memberNumber}</p>
              )}
            </div>

            {/* Type de plan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de plan/formule *
              </label>
              <input
                type="text"
                value={patientData.insurance.planType || ''}
                onChange={(e) => handleInsuranceChange('planType', e.target.value)}
                placeholder="Ex: GOLD ENTREPRISE, PREMIUM INDIVIDUAL"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.insurance?.planType ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.insurance?.planType && (
                <p className="text-sm text-red-600 mt-1">{errors.insurance.planType}</p>
              )}
            </div>

            {/* Catégorie de plan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                value={patientData.insurance.planCategory || 'INDIVIDUAL'}
                onChange={(e) => handleInsuranceChange('planCategory', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="INDIVIDUAL">Individuel</option>
                <option value="FAMILY">Familial</option>
                <option value="CORPORATE">Entreprise</option>
              </select>
            </div>

            {/* Employeur (si entreprise) */}
            {patientData.insurance.planCategory === 'CORPORATE' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employeur
                </label>
                <input
                  type="text"
                  value={patientData.insurance.employerName || ''}
                  onChange={(e) => handleInsuranceChange('employerName', e.target.value)}
                  placeholder="Ex: ECOBANK CÔTE D'IVOIRE"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Taux de couverture */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Taux de prise en charge (%) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={patientData.insurance.coverageRate || ''}
                  onChange={(e) => handleInsuranceChange('coverageRate', parseInt(e.target.value) || 0)}
                  placeholder="Ex: 80"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.insurance?.coverageRate ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                <span className="absolute right-3 top-2 text-gray-500">%</span>
              </div>
              {errors.insurance?.coverageRate && (
                <p className="text-sm text-red-600 mt-1">{errors.insurance.coverageRate}</p>
              )}
            </div>

            {/* Date d'expiration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date d'expiration *
              </label>
              <input
                type="date"
                value={patientData.insurance.validUntil || ''}
                onChange={(e) => handleInsuranceChange('validUntil', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.insurance?.validUntil ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.insurance?.validUntil && (
                <p className="text-sm text-red-600 mt-1">{errors.insurance.validUntil}</p>
              )}
            </div>

            {/* Franchise annuelle (optionnel) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Franchise annuelle (FCFA) - Optionnel
              </label>
              <input
                type="number"
                min="0"
                value={patientData.insurance.deductible || ''}
                onChange={(e) => handleInsuranceChange('deductible', parseInt(e.target.value) || 0)}
                placeholder="Ex: 10000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Montant à payer avant prise en charge (première consultation)
              </p>
            </div>
          </div>

          {/* Simulation simplifiée */}
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Calculator className="w-5 h-5 text-green-600 mr-2" />
              <h4 className="font-semibold text-green-900">
                Simulation de prise en charge
              </h4>
            </div>

            <div className="flex items-center space-x-4 mb-3">
              <label className="text-sm font-medium text-green-800">
                Montant consultation:
              </label>
              <input
                type="number"
                min="0"
                value={simulationAmount}
                onChange={(e) => setSimulationAmount(parseInt(e.target.value) || 0)}
                className="w-32 px-2 py-1 text-sm border border-green-300 rounded focus:ring-1 focus:ring-green-500"
              />
              <span className="text-sm text-green-700">FCFA</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <p className="text-green-600 font-medium">Prise en charge assurance</p>
                <p className="text-lg font-bold text-green-700">
                  {simulation.coverage.toLocaleString()} FCFA
                </p>
                <p className="text-xs text-green-600">
                  ({patientData.insurance.coverageRate || 0}%)
                </p>
              </div>

              <div className="text-center">
                <p className="text-blue-600 font-medium">Reste à charge patient</p>
                <p className="text-lg font-bold text-blue-700">
                  {simulation.patient.toLocaleString()} FCFA
                </p>
              </div>
            </div>
          </div>

          {/* Informations importantes */}
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Important :</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Vérifiez que toutes les informations correspondent exactement à celles de la carte</li>
                  <li>La date d'expiration doit être valide</li>
                  <li>Pas de plafond annuel - la prise en charge s'applique pour toutes les consultations</li>
                  <li>La franchise ne s'applique qu'une fois par an (première consultation)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}