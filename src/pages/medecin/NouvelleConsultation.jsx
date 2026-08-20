import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { consultationService } from '../../services/consultationService';
import { patientService } from '../../services/patientService';
import {
  User,
  Search,
  Calendar,
  Clock,
  FileText,
  Pill,
  Activity,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Stethoscope,
  Heart,
  Thermometer,
  Scale,
  Ruler,
  Eye,
  RefreshCw,
  ArrowLeft,
  Plus,
  Minus,
  Copy,
  Send,
  Printer
} from 'lucide-react';

// Modèles de prescription
const PRESCRIPTION_TEMPLATES = [
  {
    id: 1,
    name: 'Douleur et fièvre',
    medications: [
      { name: 'Paracétamol', dosage: '1g', frequency: '3 fois par jour', duration: '5 jours', instructions: 'Après les repas' },
      { name: 'Ibuprofène', dosage: '400mg', frequency: '2 fois par jour', duration: '3 jours', instructions: 'En cas de douleur' }
    ]
  },
  {
    id: 2,
    name: 'Infection respiratoire',
    medications: [
      { name: 'Amoxicilline', dosage: '500mg', frequency: '3 fois par jour', duration: '7 jours', instructions: 'Pendant les repas' },
      { name: 'Sirop pour la toux', dosage: '10ml', frequency: '3 fois par jour', duration: '5 jours', instructions: 'Après les repas' }
    ]
  },
  {
    id: 3,
    name: 'Hypertension',
    medications: [
      { name: 'Amlodipine', dosage: '5mg', frequency: '1 fois par jour', duration: '30 jours', instructions: 'Le matin, à jeun' },
      { name: 'Hydrochlorothiazide', dosage: '25mg', frequency: '1 fois par jour', duration: '30 jours', instructions: 'Le matin' }
    ]
  }
];

// Types de consultation
const CONSULTATION_TYPES = [
  'Consultation générale',
  'Consultation spécialisée',
  'Suivi de traitement',
  'Contrôle post-opératoire',
  'Consultation d\'urgence',
  'Bilan de santé',
  'Consultation préventive',
  'Renouvellement d\'ordonnance'
];

export default function NouvelleConsultation() {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // États principaux
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [foundPatients, setFoundPatients] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // États du formulaire de consultation
  const [consultationData, setConsultationData] = useState({
    type: 'Consultation générale',
    chiefComplaint: '', // Motif de consultation
    symptoms: '',
    physicalExam: '',
    vitalSigns: {
      temperature: '',
      bloodPressure: '',
      heartRate: '',
      weight: '',
      height: '',
      oxygen: ''
    },
    diagnosis: '',
    treatment: '',
    recommendations: '',
    followUp: '',
    nextAppointmentDate: '',
    notes: ''
  });

  // États prescription
  const [showPrescription, setShowPrescription] = useState(false);
  const [medications, setMedications] = useState([]);
  const [showPrescriptionSuccess, setShowPrescriptionSuccess] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  // Traitement des données pré-remplies depuis la navigation
  useEffect(() => {
    if (location.state?.patientData) {
      setSelectedPatient(location.state.patientData);
      setSearchTerm('');
      setFoundPatients([]);
    }

    if (location.state?.consultationData) {
      const prefilledData = location.state.consultationData;
      setConsultationData(prev => ({
        ...prev,
        type: prefilledData.type || prev.type,
        chiefComplaint: prefilledData.chiefComplaint || prev.chiefComplaint,
        symptoms: prefilledData.symptoms || prev.symptoms
      }));
    }
  }, [location.state]);

  // Normalise un patient venant de l'API vers la forme attendue par le formulaire
  const normalizePatient = (p) => ({
    id: p.id,
    name: p.name || `${p.firstName || ''} ${p.lastName || ''}`.trim(),
    birthDate: p.birthDate || p.dateOfBirth || '',
    phone: p.phone || p.phoneNumber || '',
    email: p.email || '',
    medicalNumber: p.medicalNumber || p.patientNumber || String(p.id),
    allergies: p.allergies || [],
    chronicConditions: p.chronicConditions || p.chronicDiseases || [],
    lastConsultation: p.lastConsultation || p.lastVisit || '',
    insurance: p.insurance || p.insuranceName || '',
  });

  // Recherche de patients via l'API
  const searchPatients = async (term) => {
    if (!term || term.length < 2) {
      setFoundPatients([]);
      return;
    }
    setSearchLoading(true);
    try {
      const data = await patientService.searchPatients(term);
      const list = Array.isArray(data) ? data : data?.content ?? [];
      setFoundPatients(list.map(normalizePatient));
    } catch {
      setFoundPatients([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Calcul de l'âge
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  };

  // Gestion des changements du formulaire
  const handleConsultationChange = (field, value) => {
    setConsultationData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleVitalSignChange = (field, value) => {
    setConsultationData(prev => ({
      ...prev,
      vitalSigns: { ...prev.vitalSigns, [field]: value }
    }));
  };

  // Gestion des médicaments
  const addMedication = () => {
    setMedications(prev => [...prev, {
      id: Date.now(),
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    }]);
  };

  const removeMedication = (id) => {
    setMedications(prev => prev.filter(med => med.id !== id));
  };

  const updateMedication = (id, field, value) => {
    setMedications(prev => prev.map(med =>
      med.id === id ? { ...med, [field]: value } : med
    ));
  };

  // Appliquer un modèle de prescription
  const applyPrescriptionTemplate = (templateId) => {
    const template = PRESCRIPTION_TEMPLATES.find(t => t.id === parseInt(templateId));
    if (template) {
      const templatedMeds = template.medications.map((med, index) => ({
        id: Date.now() + index,
        ...med
      }));
      setMedications(templatedMeds);
      setShowPrescription(true);
    }
  };

  // Générer l'ordonnance depuis la consultation
  const generatePrescription = async () => {
    if (!selectedPatient || medications.length === 0) {
      setErrors({ prescription: 'Sélectionnez un patient et ajoutez des médicaments' });
      return;
    }

    try {
      const prescriptionData = {
        id: Date.now(),
        patient: {
          name: selectedPatient.name,
          age: new Date().getFullYear() - new Date(selectedPatient.birthDate).getFullYear(),
          phone: selectedPatient.phone
        },
        date: new Date().toISOString().split('T')[0],
        medications: medications.map(med => ({
          name: med.name,
          dosage: `${med.dosage} ${med.frequency}`,
          duration: med.duration,
          quantity: calculateQuantity(med.dosage, med.frequency, med.duration)
        })),
        diagnosis: consultationData.diagnosis || 'Diagnostic en cours',
        status: 'active',
        consultationId: `C-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`
      };

      console.log('Ordonnance générée:', prescriptionData);
      setShowPrescriptionSuccess(true);

      // Masquer le message après 3 secondes
      setTimeout(() => setShowPrescriptionSuccess(false), 3000);

    } catch (error) {
      console.error('Erreur génération ordonnance:', error);
      setErrors({ prescription: 'Erreur lors de la génération de l\'ordonnance' });
    }
  };

  // Calculer la quantité approximative
  const calculateQuantity = (dosage, frequency, duration) => {
    // Logique simple pour estimer la quantité
    const frequencyMatch = frequency.match(/(\d+)/);
    const durationMatch = duration.match(/(\d+)/);

    if (frequencyMatch && durationMatch) {
      const timesPerDay = parseInt(frequencyMatch[1]);
      const days = parseInt(durationMatch[1]);
      return `${timesPerDay * days} ${dosage.includes('ml') ? 'ml' : 'comprimés'}`;
    }
    return 'Selon prescription';
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};

    if (!selectedPatient) {
      newErrors.patient = 'Veuillez sélectionner un patient';
    }

    if (!consultationData.chiefComplaint.trim()) {
      newErrors.chiefComplaint = 'Le motif de consultation est obligatoire';
    }

    if (!consultationData.symptoms.trim()) {
      newErrors.symptoms = 'Les symptômes sont obligatoires';
    }

    if (!consultationData.diagnosis.trim()) {
      newErrors.diagnosis = 'Le diagnostic est obligatoire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Sauvegarde de la consultation
  const handleSaveConsultation = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const payload = {
        patientId: selectedPatient.id,
        type: consultationData.type,
        chiefComplaint: consultationData.chiefComplaint,
        symptoms: consultationData.symptoms,
        physicalExam: consultationData.physicalExam,
        vitalSigns: consultationData.vitalSigns,
        diagnosis: consultationData.diagnosis,
        treatment: consultationData.treatment,
        recommendations: consultationData.recommendations,
        followUp: consultationData.followUp,
        nextAppointmentDate: consultationData.nextAppointmentDate || null,
        notes: consultationData.notes,
        medications,
      };

      const created = await consultationService.createConsultation(payload);

      navigate('/medecin/consultations', {
        state: { message: 'Consultation créée avec succès', newConsultation: created }
      });
    } catch (error) {
      setErrors({ general: error.message || 'Erreur lors de la sauvegarde' });
    } finally {
      setIsSaving(false);
    }
  };

  // Vérification des permissions
  if (!hasRole('MEDECIN') && !hasRole('ADMIN_CLINIQUE')) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-red-900 mb-2">Accès non autorisé</h2>
          <p className="text-red-700">Vous n'avez pas les permissions nécessaires pour créer une consultation.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/medecin/consultations')}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Stethoscope className="w-6 h-6 mr-2 text-blue-600" />
              {location.state?.consultationData ? 'Consultation en Cours' : 'Nouvelle Consultation'}
            </h1>
            <p className="text-gray-600 mt-1">
              {location.state?.consultationData
                ? `Consultation programmée à ${location.state.consultationData.scheduledTime}`
                : 'Créer un dossier de consultation médical'
              }
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/medecin/consultations')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSaveConsultation}
            disabled={isSaving}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Créer la consultation
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne de gauche - Sélection patient */}
        <div className="space-y-6">
          {/* Recherche patient */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Sélection du Patient
            </h2>

            {!selectedPatient ? (
              <>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Nom, téléphone, email ou numéro..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      searchPatients(e.target.value);
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                </div>

                {/* Résultats de recherche */}
                {searchLoading && (
                  <p className="text-sm text-gray-500 mb-2">Recherche en cours...</p>
                )}
                {!searchLoading && foundPatients.length > 0 && (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    <p className="text-sm text-gray-600 mb-3">
                      {foundPatients.length} patient(s) trouvé(s)
                    </p>
                    {foundPatients.map((patient) => (
                      <button
                        key={patient.id}
                        onClick={() => {
                          setSelectedPatient(patient);
                          setSearchTerm('');
                          setFoundPatients([]);
                        }}
                        className="w-full p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{patient.name}</p>
                          <p className="text-sm text-gray-600">{patient.phone}</p>
                          <p className="text-xs text-gray-500">#{patient.medicalNumber} • {calculateAge(patient.birthDate)} ans</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {!searchLoading && searchTerm && searchTerm.length >= 2 && foundPatients.length === 0 && (
                  <div className="text-center py-8">
                    <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun patient trouvé</h3>
                    <p className="text-gray-500">Aucun patient ne correspond à votre recherche.</p>
                  </div>
                )}

                {errors.patient && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.patient}
                  </p>
                )}
              </>
            ) : (
              /* Patient sélectionné */
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-blue-900">{selectedPatient.name}</h3>
                  <button
                    onClick={() => setSelectedPatient(null)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Âge:</span>
                    <span className="text-blue-900 font-medium">{calculateAge(selectedPatient.birthDate)} ans</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Téléphone:</span>
                    <span className="text-blue-900">{selectedPatient.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">N° dossier:</span>
                    <span className="text-blue-900 font-mono">{selectedPatient.medicalNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Assurance:</span>
                    <span className="text-blue-900">{selectedPatient.insurance}</span>
                  </div>

                  {selectedPatient.allergies.length > 0 && (
                    <div className="mt-3 p-2 bg-red-100 rounded border border-red-200">
                      <p className="text-red-800 font-medium text-xs">Allergies:</p>
                      <p className="text-red-700 text-sm">{selectedPatient.allergies.join(', ')}</p>
                    </div>
                  )}

                  {selectedPatient.chronicConditions.length > 0 && (
                    <div className="mt-2 p-2 bg-yellow-100 rounded border border-yellow-200">
                      <p className="text-yellow-800 font-medium text-xs">Conditions chroniques:</p>
                      <p className="text-yellow-700 text-sm">{selectedPatient.chronicConditions.join(', ')}</p>
                    </div>
                  )}

                  <div className="flex justify-between mt-3">
                    <span className="text-blue-700">Dernière consultation:</span>
                    <span className="text-blue-900">{new Date(selectedPatient.lastConsultation).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Signes vitaux */}
          {selectedPatient && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-500" />
                Signes Vitaux
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Thermometer className="w-4 h-4 inline mr-1" />
                    Température (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={consultationData.vitalSigns.temperature}
                    onChange={(e) => handleVitalSignChange('temperature', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="37.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Activity className="w-4 h-4 inline mr-1" />
                    Tension (mmHg)
                  </label>
                  <input
                    type="text"
                    value={consultationData.vitalSigns.bloodPressure}
                    onChange={(e) => handleVitalSignChange('bloodPressure', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="120/80"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Heart className="w-4 h-4 inline mr-1" />
                    Pouls (bpm)
                  </label>
                  <input
                    type="number"
                    value={consultationData.vitalSigns.heartRate}
                    onChange={(e) => handleVitalSignChange('heartRate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="72"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SpO2 (%)
                  </label>
                  <input
                    type="number"
                    value={consultationData.vitalSigns.oxygen}
                    onChange={(e) => handleVitalSignChange('oxygen', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="98"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Scale className="w-4 h-4 inline mr-1" />
                    Poids (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={consultationData.vitalSigns.weight}
                    onChange={(e) => handleVitalSignChange('weight', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="70.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Ruler className="w-4 h-4 inline mr-1" />
                    Taille (cm)
                  </label>
                  <input
                    type="number"
                    value={consultationData.vitalSigns.height}
                    onChange={(e) => handleVitalSignChange('height', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="175"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Colonne du milieu et droite - Formulaire de consultation */}
        <div className="lg:col-span-2 space-y-6">
          {selectedPatient && (
            <>
              {/* Informations de consultation */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-green-600" />
                  Informations de Consultation
                </h3>

                <div className="space-y-4">
                  {/* Type de consultation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de consultation *
                    </label>
                    <select
                      value={consultationData.type}
                      onChange={(e) => handleConsultationChange('type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {CONSULTATION_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Motif de consultation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Motif de consultation *
                    </label>
                    <input
                      type="text"
                      value={consultationData.chiefComplaint}
                      onChange={(e) => handleConsultationChange('chiefComplaint', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.chiefComplaint ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Douleurs abdominales, fièvre, contrôle..."
                    />
                    {errors.chiefComplaint && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.chiefComplaint}
                      </p>
                    )}
                  </div>

                  {/* Symptômes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Symptômes et histoire de la maladie *
                    </label>
                    <textarea
                      rows={4}
                      value={consultationData.symptoms}
                      onChange={(e) => handleConsultationChange('symptoms', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${
                        errors.symptoms ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Décrivez les symptômes actuels, leur évolution, les facteurs déclenchants..."
                    />
                    {errors.symptoms && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.symptoms}
                      </p>
                    )}
                  </div>

                  {/* Examen physique */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Examen physique
                    </label>
                    <textarea
                      rows={4}
                      value={consultationData.physicalExam}
                      onChange={(e) => handleConsultationChange('physicalExam', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                      placeholder="Inspection, palpation, percussion, auscultation..."
                    />
                  </div>

                  {/* Diagnostic */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Diagnostic *
                    </label>
                    <textarea
                      rows={3}
                      value={consultationData.diagnosis}
                      onChange={(e) => handleConsultationChange('diagnosis', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${
                        errors.diagnosis ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Diagnostic principal et diagnostics différentiels..."
                    />
                    {errors.diagnosis && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.diagnosis}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Traitement et prescription */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Pill className="w-5 h-5 mr-2 text-purple-600" />
                    Traitement et Prescription
                  </h3>
                  <button
                    onClick={() => setShowPrescription(!showPrescription)}
                    className="flex items-center px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                  >
                    {showPrescription ? <Minus className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
                    {showPrescription ? 'Masquer' : 'Ajouter'} prescription
                  </button>
                </div>

                {/* Traitement général */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plan de traitement
                    </label>
                    <textarea
                      rows={3}
                      value={consultationData.treatment}
                      onChange={(e) => handleConsultationChange('treatment', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                      placeholder="Traitement médicamenteux, non-médicamenteux, interventions..."
                    />
                  </div>

                  {/* Section prescription détaillée */}
                  {showPrescription && (
                    <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-purple-900">Prescription détaillée</h4>
                        <div className="flex items-center space-x-2">
                          <select
                            value={selectedTemplate}
                            onChange={(e) => {
                              setSelectedTemplate(e.target.value);
                              if (e.target.value) {
                                applyPrescriptionTemplate(e.target.value);
                              }
                            }}
                            className="text-sm px-3 py-1 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="">Modèles de prescription</option>
                            {PRESCRIPTION_TEMPLATES.map(template => (
                              <option key={template.id} value={template.id}>{template.name}</option>
                            ))}
                          </select>
                          <button
                            onClick={addMedication}
                            className="flex items-center px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Médicament
                          </button>
                        </div>
                      </div>

                      {medications.length === 0 ? (
                        <p className="text-purple-600 text-sm italic">Aucun médicament prescrit</p>
                      ) : (
                        <div className="space-y-3">
                          {medications.map((med, index) => (
                            <div key={med.id} className="bg-white border border-purple-200 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-purple-900">Médicament #{index + 1}</span>
                                <button
                                  onClick={() => removeMedication(med.id)}
                                  className="text-red-600 hover:text-red-800 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Nom du médicament
                                  </label>
                                  <input
                                    type="text"
                                    value={med.name}
                                    onChange={(e) => updateMedication(med.id, 'name', e.target.value)}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Paracétamol"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Dosage
                                  </label>
                                  <input
                                    type="text"
                                    value={med.dosage}
                                    onChange={(e) => updateMedication(med.id, 'dosage', e.target.value)}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="500mg"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Fréquence
                                  </label>
                                  <input
                                    type="text"
                                    value={med.frequency}
                                    onChange={(e) => updateMedication(med.id, 'frequency', e.target.value)}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="3 fois par jour"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Durée
                                  </label>
                                  <input
                                    type="text"
                                    value={med.duration}
                                    onChange={(e) => updateMedication(med.id, 'duration', e.target.value)}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="7 jours"
                                  />
                                </div>

                                <div className="md:col-span-2">
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Instructions
                                  </label>
                                  <input
                                    type="text"
                                    value={med.instructions}
                                    onChange={(e) => updateMedication(med.id, 'instructions', e.target.value)}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Après les repas"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Bouton Générer Ordonnance */}
                      {showPrescription && medications.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-purple-200">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-purple-700">
                              {medications.length} médicament{medications.length > 1 ? 's' : ''} ajouté{medications.length > 1 ? 's' : ''}
                            </div>
                            <button
                              onClick={generatePrescription}
                              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              Générer Ordonnance
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Message de succès ordonnance */}
                      {showPrescriptionSuccess && (
                        <div className="mt-3 p-3 bg-green-100 border border-green-200 rounded-lg flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                          <span className="text-green-800 text-sm font-medium">
                            Ordonnance générée avec succès !
                          </span>
                          <button
                            onClick={() => navigate('/medecin/ordonnances')}
                            className="ml-2 text-green-700 hover:text-green-900 underline text-sm"
                          >
                            Voir les ordonnances
                          </button>
                        </div>
                      )}

                      {/* Erreur prescription */}
                      {errors.prescription && (
                        <div className="mt-3 p-3 bg-red-100 border border-red-200 rounded-lg flex items-center">
                          <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                          <span className="text-red-800 text-sm">{errors.prescription}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Recommandations */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recommandations et conseils
                    </label>
                    <textarea
                      rows={3}
                      value={consultationData.recommendations}
                      onChange={(e) => handleConsultationChange('recommendations', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                      placeholder="Repos, régime alimentaire, exercices, précautions..."
                    />
                  </div>

                  {/* Suivi */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Suivi et contrôles
                      </label>
                      <textarea
                        rows={2}
                        value={consultationData.followUp}
                        onChange={(e) => handleConsultationChange('followUp', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                        placeholder="Examens complémentaires, RDV de contrôle..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prochain RDV (optionnel)
                      </label>
                      <input
                        type="date"
                        value={consultationData.nextAppointmentDate}
                        onChange={(e) => handleConsultationChange('nextAppointmentDate', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Notes privées */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes privées (médecin uniquement)
                    </label>
                    <textarea
                      rows={2}
                      value={consultationData.notes}
                      onChange={(e) => handleConsultationChange('notes', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                      placeholder="Notes personnelles, impressions, points d'attention..."
                    />
                  </div>
                </div>
              </div>

              {/* Messages d'erreur globaux */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <p className="text-red-700">{errors.general}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}