import { useState } from 'react';
import {
  Shield,
  DollarSign,
  Calculator,
  AlertTriangle,
  CheckCircle,
  Info,
  Calendar,
  Building,
  CreditCard
} from 'lucide-react';
import { insuranceCalculatorService } from '../../services/insuranceCalculatorService';

export default function InsuranceCoverage({ patient, consultationAmount = 50000, onCoverageCalculated }) {
  const [calculation, setCalculation] = useState(null);
  const [customAmount, setCustomAmount] = useState(consultationAmount);

  // Calculer automatiquement la couverture
  const calculateCoverage = (amount = customAmount) => {
    if (!patient?.insurance?.hasInsurance) {
      const result = {
        consultationAmount: amount,
        insuranceCoverage: 0,
        patientPayment: amount,
        canBeCovered: false,
        message: 'Aucune assurance'
      };
      setCalculation(result);
      onCoverageCalculated?.(result);
      return result;
    }

    const result = insuranceCalculatorService.calculateCoverage(patient.insurance, amount);
    setCalculation(result);
    onCoverageCalculated?.(result);
    return result;
  };

  // Formater les informations d'assurance pour l'affichage
  const insuranceDisplay = patient?.insurance?.hasInsurance ?
    insuranceCalculatorService.formatInsuranceDisplay(patient.insurance) :
    null;

  return (
    <div className="space-y-6">

      {/* Informations d'assurance du patient */}
      {patient?.insurance?.hasInsurance ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Shield className={`w-6 h-6 mr-2 ${
                insuranceDisplay?.color === 'green' ? 'text-green-600' :
                insuranceDisplay?.color === 'orange' ? 'text-orange-600' :
                insuranceDisplay?.color === 'red' ? 'text-red-600' :
                'text-gray-600'
              }`} />
              <h3 className="text-lg font-semibold text-gray-900">
                Assurance active
              </h3>
            </div>

            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              insuranceDisplay?.status === 'active' ? 'bg-green-100 text-green-800' :
              insuranceDisplay?.status === 'expiring' ? 'bg-orange-100 text-orange-800' :
              insuranceDisplay?.status === 'expired' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {insuranceDisplay?.status === 'active' ? 'Valide' :
               insuranceDisplay?.status === 'expiring' ? 'Expire bientôt' :
               insuranceDisplay?.status === 'expired' ? 'Expirée' : 'Inconnue'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Compagnie</label>
                <p className="text-lg font-semibold text-gray-900">{insuranceDisplay?.display}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">N° Police</label>
                <p className="text-sm font-mono text-gray-700">{insuranceDisplay?.policyNumber}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Taux de couverture</label>
                <p className="text-lg font-semibold text-blue-600">{insuranceDisplay?.coverageRate}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Plafond annuel</label>
                <p className="text-lg font-semibold text-gray-900">{insuranceDisplay?.annualLimit}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Reste disponible</label>
                <p className="text-lg font-semibold text-green-600">{insuranceDisplay?.remainingLimit}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Expire le</label>
                <p className="text-sm text-gray-700">{insuranceDisplay?.expirationDate}</p>
              </div>
            </div>
          </div>

          {/* Alertes */}
          {insuranceDisplay?.isExpiringSoon && !insuranceDisplay?.isExpired && (
            <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
                <span className="text-sm text-orange-800">
                  Assurance expire dans moins de 30 jours
                </span>
              </div>
            </div>
          )}

          {insuranceDisplay?.isExpired && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-sm text-red-800">
                  Assurance expirée - Aucune prise en charge possible
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune assurance</h3>
              <p className="text-sm text-gray-500">
                Le patient paiera l'intégralité des frais de consultation
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Calculateur de prise en charge */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Calculator className="w-6 h-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-blue-900">
            Calcul de prise en charge
          </h3>
        </div>

        <div className="space-y-4">
          {/* Saisie du montant */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-blue-800 whitespace-nowrap">
              Montant consultation:
            </label>
            <input
              type="number"
              min="0"
              value={customAmount}
              onChange={(e) => setCustomAmount(parseInt(e.target.value) || 0)}
              className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="50000"
            />
            <span className="text-sm font-medium text-blue-700">FCFA</span>
            <button
              onClick={() => calculateCoverage()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Calculer
            </button>
          </div>

          {/* Résultats du calcul */}
          {calculation && (
            <div className="bg-white rounded-lg border border-blue-200 p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Montant total */}
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <DollarSign className="w-5 h-5 text-gray-600 mr-1" />
                    <span className="text-sm font-medium text-gray-600">Montant total</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    {calculation.consultationAmount.toLocaleString()} FCFA
                  </p>
                </div>

                {/* Prise en charge */}
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Shield className="w-5 h-5 text-green-600 mr-1" />
                    <span className="text-sm font-medium text-green-600">Prise en charge</span>
                  </div>
                  <p className="text-xl font-bold text-green-700">
                    -{calculation.insuranceCoverage.toLocaleString()} FCFA
                  </p>
                  {calculation.coverageRate > 0 && (
                    <p className="text-xs text-green-600">
                      ({calculation.coverageRate}%)
                    </p>
                  )}
                </div>

                {/* Reste à charge */}
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <CreditCard className="w-5 h-5 text-blue-600 mr-1" />
                    <span className="text-sm font-medium text-blue-600">Reste à charge</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">
                    {calculation.patientPayment.toLocaleString()} FCFA
                  </p>
                </div>
              </div>

              {/* Informations supplémentaires */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {calculation.remainingLimit !== undefined && (
                    <div>
                      <span className="text-gray-600">Plafond restant après:</span>
                      <span className="ml-2 font-semibold text-gray-900">
                        {calculation.remainingLimit.toLocaleString()} FCFA
                      </span>
                    </div>
                  )}

                  {calculation.deductibleApplied > 0 && (
                    <div>
                      <span className="text-gray-600">Franchise appliquée:</span>
                      <span className="ml-2 font-semibold text-orange-600">
                        {calculation.deductibleApplied.toLocaleString()} FCFA
                      </span>
                    </div>
                  )}
                </div>

                {/* Message ou erreur */}
                <div className="mt-3">
                  {calculation.error ? (
                    <div className="flex items-center text-red-600">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      <span className="text-sm">{calculation.message}</span>
                    </div>
                  ) : calculation.canBeCovered ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm">{calculation.message}</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-600">
                      <Info className="w-4 h-4 mr-2" />
                      <span className="text-sm">{calculation.message}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Aide */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-1">Information :</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Le calcul se base sur les informations d'assurance saisies</li>
              <li>Le plafond annuel est réinitialisé chaque année</li>
              <li>La franchise s'applique à la première consultation de l'année</li>
              <li>Vérifiez toujours la validité de la carte avant la consultation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}