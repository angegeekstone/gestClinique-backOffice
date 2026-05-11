import { useState, useEffect } from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Save,
  X,
  AlertCircle,
  UserPlus
} from 'lucide-react';
import InsuranceFormSimple from './InsuranceFormSimple';
import { insuranceCalculatorService } from '../../services/insuranceCalculatorServiceSimple';

const INITIAL_PATIENT_DATA = {
  // Données personnelles
  firstName: '',
  lastName: '',
  email: '',
  phone: '+225 ',
  address: '',
  dateOfBirth: '',
  gender: 'OTHER',

  // Contact d'urgence
  emergencyContactName: '',
  emergencyContactPhone: '+225 ',

  // Informations médicales
  medicalHistory: '',
  notes: '',

  // Assurance - VERSION SIMPLIFIÉE SANS PLAFONDS
  insurance: {
    hasInsurance: false,
    companyName: '',
    companyCode: '',
    policyNumber: '',
    memberNumber: '',
    planType: '',
    planCategory: 'INDIVIDUAL', // INDIVIDUAL, FAMILY, CORPORATE
    employerName: '',
    groupCode: '',
    coverageRate: 0,
    deductible: 0, // Franchise optionnelle
    validFrom: '',
    validUntil: '',
    isActive: true,
    createdAt: '',
    lastUpdated: ''
  }
};

export default function PatientFormSimple({
  isOpen,
  onClose,
  onSave,
  editingPatient = null,
  isLoading = false
}) {
  const [patientData, setPatientData] = useState(INITIAL_PATIENT_DATA);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Initialiser les données du patient à modifier
  useEffect(() => {
    if (editingPatient) {
      setPatientData({
        ...editingPatient,
        insurance: editingPatient.insurance || INITIAL_PATIENT_DATA.insurance
      });
    } else {
      setPatientData(INITIAL_PATIENT_DATA);
    }
  }, [editingPatient]);

  // Fonction pour mettre à jour les données du patient
  const handleInputChange = (field, value) => {
    setPatientData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};

    // Validation données personnelles
    if (!patientData.firstName?.trim()) {
      newErrors.firstName = 'Le prénom est obligatoire';
    }

    if (!patientData.lastName?.trim()) {
      newErrors.lastName = 'Le nom est obligatoire';
    }

    if (!patientData.phone?.trim() || patientData.phone === '+225 ') {
      newErrors.phone = 'Le téléphone est obligatoire';
    } else if (!/^\+225\s[0-9\s]{8,15}$/.test(patientData.phone)) {
      newErrors.phone = 'Format de téléphone invalide (+225 XX XX XX XX XX)';
    }

    if (patientData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!patientData.dateOfBirth) {
      newErrors.dateOfBirth = 'La date de naissance est obligatoire';
    } else {
      const birthDate = new Date(patientData.dateOfBirth);
      const today = new Date();
      if (birthDate >= today) {
        newErrors.dateOfBirth = 'La date de naissance doit être antérieure à aujourd\'hui';
      }
    }

    if (!patientData.address?.trim()) {
      newErrors.address = 'L\'adresse est obligatoire';
    }

    if (!patientData.gender || patientData.gender === 'OTHER') {
      newErrors.gender = 'Le sexe est obligatoire';
    }

    // Validation assurance (simplifiée)
    if (patientData.insurance.hasInsurance) {
      const insuranceValidation = insuranceCalculatorService.validateInsurance(patientData.insurance);
      if (!insuranceValidation.isValid) {
        newErrors.insurance = insuranceValidation.errors;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      // Préparation des données pour l'API (VERSION SIMPLIFIÉE)
      const submitData = {
        ...patientData,
        // Nettoyer les données d'assurance si pas d'assurance
        insurance: patientData.insurance.hasInsurance ?
          {
            ...patientData.insurance,
            createdAt: patientData.insurance.createdAt || new Date().toISOString(),
            lastUpdated: new Date().toISOString()
          } :
          null
      };

      await onSave(submitData);

      // Reset form if creating new patient
      if (!editingPatient) {
        setPatientData(INITIAL_PATIENT_DATA);
      }

      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du patient:', error);
      setErrors({
        submit: 'Erreur lors de la sauvegarde. Veuillez réessayer.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center">
              <UserPlus className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">
                {editingPatient ? 'Modifier le patient' : 'Nouveau patient'}
              </h3>
              <span className="ml-3 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                SANS PLAFONDS
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-8">

              {/* Erreur générale */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <span className="text-red-800">{errors.submit}</span>
                  </div>
                </div>
              )}

              {/* Informations personnelles */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Informations personnelles
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Prénom */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      value={patientData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Prénom du patient"
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  {/* Nom */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de famille *
                    </label>
                    <input
                      type="text"
                      value={patientData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Nom de famille"
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>
                    )}
                  </div>

                  {/* Téléphone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      value={patientData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="+225 07 12 34 56 78"
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={patientData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="exemple@email.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Date de naissance */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de naissance *
                    </label>
                    <input
                      type="date"
                      value={patientData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.dateOfBirth ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {errors.dateOfBirth && (
                      <p className="text-sm text-red-600 mt-1">{errors.dateOfBirth}</p>
                    )}
                  </div>

                  {/* Sexe */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sexe *
                    </label>
                    <select
                      value={patientData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.gender ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    >
                      <option value="OTHER">Sélectionner...</option>
                      <option value="MALE">Masculin</option>
                      <option value="FEMALE">Féminin</option>
                    </select>
                    {errors.gender && (
                      <p className="text-sm text-red-600 mt-1">{errors.gender}</p>
                    )}
                  </div>
                </div>

                {/* Adresse */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse complète *
                  </label>
                  <textarea
                    value={patientData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={2}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.address ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Adresse complète du patient"
                  />
                  {errors.address && (
                    <p className="text-sm text-red-600 mt-1">{errors.address}</p>
                  )}
                </div>
              </div>

              {/* Contact d'urgence */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-red-600" />
                  Contact d'urgence
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du contact
                    </label>
                    <input
                      type="text"
                      value={patientData.emergencyContactName}
                      onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nom du contact d'urgence"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone du contact
                    </label>
                    <input
                      type="tel"
                      value={patientData.emergencyContactPhone}
                      onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+225 05 11 22 33 44"
                    />
                  </div>
                </div>
              </div>

              {/* Assurance - VERSION SIMPLIFIÉE */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span>Informations d'assurance</span>
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Sans plafonds
                  </span>
                </h4>
                <InsuranceFormSimple
                  patientData={patientData}
                  setPatientData={setPatientData}
                  errors={errors}
                />
              </div>

              {/* Antécédents médicaux */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Informations médicales
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Antécédents médicaux
                    </label>
                    <textarea
                      value={patientData.medicalHistory}
                      onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Allergies, maladies chroniques, opérations précédentes..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes particulières
                    </label>
                    <textarea
                      value={patientData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Notes particulières sur le patient..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSaving}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {editingPatient ? 'Modifier' : 'Créer le patient'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}