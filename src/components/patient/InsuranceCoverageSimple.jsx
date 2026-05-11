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
import { insuranceCalculatorService } from '../../services/insuranceCalculatorServiceSimple';

export default function InsuranceCoverageSimple({ patient, consultationAmount = 50000, onCoverageCalculated }) {
  const [calculation, setCalculation] = useState(null);
  const [customAmount, setCustomAmount] = useState(consultationAmount);

  // Calculer automatiquement la couverture (SANS PLAFONDS)
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
                <label className="text-sm font-medium text-gray-500">Franchise</label>
                <p className="text-lg font-semibold text-gray-900">{insuranceDisplay?.deductible}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Catégorie</label>
                <p className="text-sm text-gray-700">
                  {insuranceDisplay?.planCategory === 'INDIVIDUAL' ? 'Individuel' :
                   insuranceDisplay?.planCategory === 'FAMILY' ? 'Familial' :
                   insuranceDisplay?.planCategory === 'CORPORATE' ? 'Entreprise' : 'Non spécifié'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Expire le</label>
                <p className="text-sm text-gray-700">{insuranceDisplay?.expirationDate}</p>
              </div>
            </div>
          </div>

          {/* Employeur si assurance entreprise */}
          {insuranceDisplay?.employerName && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center">
                <Building className="w-4 h-4 text-gray-500 mr-2" />
                <span className="text-sm font-medium text-gray-500">Employeur:</span>
                <span className="ml-2 text-sm font-semibold text-gray-900">{insuranceDisplay.employerName}</span>
              </div>
            </div>
          )}

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

      {/* Calculateur de prise en charge simplifié */}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

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
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Montant total:</strong> {calculation.consultationAmount.toLocaleString()} FCFA
                  </p>

                  {calculation.deductibleApplied > 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded p-2">
                      <p className="text-xs text-orange-800">
                        <strong>Franchise appliquée:</strong> {calculation.deductibleApplied.toLocaleString()} FCFA
                        <br />
                        <em>(Première consultation de l'année)</em>
                      </p>
                    </div>
                  )}
                </div>

                {/* Message ou erreur */}
                <div className="mt-3 text-center">
                  {calculation.error ? (
                    <div className="flex items-center justify-center text-red-600">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      <span className="text-sm">{calculation.message}</span>
                    </div>
                  ) : calculation.canBeCovered ? (
                    <div className="flex items-center justify-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm">{calculation.message}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center text-gray-600">
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

      {/* Avantages sans plafonds */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start">
          <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-green-800">
            <p className="font-medium mb-1">Avantages - Pas de plafond annuel :</p>
            <ul className="list-disc list-inside space-y-1">
              <li>La prise en charge s'applique pour toutes les consultations</li>
              <li>Pas de limite de consommation annuelle</li>
              <li>Calcul simplifié basé uniquement sur le taux de couverture</li>
              <li>Franchise applicable seulement à la première consultation de l'année</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Aide */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-1">Information :</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Le calcul se base uniquement sur le taux de couverture indiqué sur la carte</li>
              <li>La franchise ne s'applique qu'une seule fois par année civile</li>
              <li>Vérifiez toujours la validité de la carte avant la consultation</li>
              <li>En cas de doute, contactez directement la compagnie d'assurance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}