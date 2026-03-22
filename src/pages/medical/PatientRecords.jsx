import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Search,
  Calendar,
  FileText,
  Activity,
  Heart,
  Pill,
  AlertTriangle,
  Eye,
  Edit,
  Download,
  Plus,
  Filter,
  Clock,
  Stethoscope,
  BookOpen,
  Paperclip,
  Phone,
  Mail,
  MapPin,
  Baby,
  Weight,
  Ruler,
  Thermometer
} from 'lucide-react';

// Données de test des patients avec dossiers complets
const PATIENTS_DATA = [
  {
    id: 1,
    personalInfo: {
      name: 'Marie Dubois',
      birthDate: '1990-05-15',
      age: 34,
      gender: 'Féminin',
      phone: '+33 6 12 34 56 78',
      email: 'marie.dubois@email.com',
      address: '123 Rue de la Paix, 75001 Paris',
      medicalNumber: 'P001234',
      insurance: 'Sécurité Sociale',
      emergencyContact: 'Jean Dubois - +33 6 87 65 43 21'
    },
    medicalInfo: {
      allergies: ['Pénicilline', 'Arachides'],
      chronicConditions: ['Hypertension artérielle'],
      bloodType: 'A+',
      weight: '65 kg',
      height: '165 cm',
      lastUpdate: '2024-12-10'
    },
    consultations: [
      {
        id: 'C-2024-001',
        date: '2024-12-12',
        time: '14:30',
        doctor: 'Dr. Martin',
        type: 'Consultation générale',
        reason: 'Douleurs abdominales',
        diagnosis: 'Gastro-entérite aiguë',
        treatment: 'Repos, réhydratation, médicaments symptomatiques',
        vitalSigns: {
          temperature: '37.2°C',
          bloodPressure: '120/80 mmHg',
          heartRate: '75 bpm',
          weight: '65 kg'
        },
        notes: 'Symptômes depuis 2 jours, amélioration progressive',
        followUp: 'Consultation de contrôle dans 1 semaine si persistance'
      },
      {
        id: 'C-2024-002',
        date: '2024-11-15',
        time: '09:00',
        doctor: 'Dr. Martin',
        type: 'Consultation de suivi',
        reason: 'Contrôle hypertension',
        diagnosis: 'Hypertension stable',
        treatment: 'Poursuite du traitement actuel',
        vitalSigns: {
          temperature: '36.8°C',
          bloodPressure: '130/85 mmHg',
          heartRate: '72 bpm',
          weight: '64 kg'
        },
        notes: 'Tension bien contrôlée sous traitement',
        followUp: 'Prochain contrôle dans 3 mois'
      }
    ],
    prescriptions: [
      {
        id: 'P-2024-001',
        date: '2024-12-12',
        consultationId: 'C-2024-001',
        medications: [
          { name: 'Smecta', dosage: '1 sachet 3x/jour', duration: '3 jours' },
          { name: 'Spasfon', dosage: '1 comprimé si douleur', duration: 'Au besoin' }
        ],
        status: 'active'
      },
      {
        id: 'P-2024-002',
        date: '2024-11-15',
        consultationId: 'C-2024-002',
        medications: [
          { name: 'Amlor 5mg', dosage: '1 comprimé/jour', duration: '3 mois' }
        ],
        status: 'completed'
      }
    ],
    examinations: [
      {
        id: 'E-2024-001',
        date: '2024-10-20',
        type: 'Prise de sang',
        doctor: 'Dr. Martin',
        results: 'Glycémie normale, cholestérol limite',
        files: ['analyse-sang-2024-10-20.pdf']
      },
      {
        id: 'E-2024-002',
        date: '2024-09-15',
        type: 'ECG',
        doctor: 'Dr. Cardiologue',
        results: 'Rythme sinusal normal',
        files: ['ecg-2024-09-15.pdf']
      }
    ],
    documents: [
      { name: 'Carte d\'identité', type: 'ID', uploadDate: '2024-01-15' },
      { name: 'Carte Vitale', type: 'Insurance', uploadDate: '2024-01-15' },
      { name: 'Analyses sanguines', type: 'Medical', uploadDate: '2024-10-20' }
    ]
  },
  {
    id: 2,
    personalInfo: {
      name: 'Jean Martin',
      birthDate: '1978-09-22',
      age: 45,
      gender: 'Masculin',
      phone: '+33 6 23 45 67 89',
      email: 'jean.martin@email.com',
      address: '456 Avenue des Champs, 75008 Paris',
      medicalNumber: 'P001235',
      insurance: 'Mutuelle MGEN',
      emergencyContact: 'Sophie Martin - +33 6 12 34 56 78'
    },
    medicalInfo: {
      allergies: [],
      chronicConditions: ['Diabète type 2'],
      bloodType: 'O+',
      weight: '78 kg',
      height: '175 cm',
      lastUpdate: '2024-12-01'
    },
    consultations: [
      {
        id: 'C-2024-003',
        date: '2024-12-01',
        time: '10:15',
        doctor: 'Dr. Martin',
        type: 'Consultation diabète',
        reason: 'Contrôle glycémique',
        diagnosis: 'Diabète type 2 équilibré',
        treatment: 'Adaptation du régime, maintien traitement',
        vitalSigns: {
          temperature: '36.7°C',
          bloodPressure: '125/82 mmHg',
          heartRate: '68 bpm',
          weight: '78 kg'
        },
        notes: 'HbA1c à 7.2%, amélioration notable',
        followUp: 'Contrôle dans 3 mois, bilan sanguin'
      }
    ],
    prescriptions: [
      {
        id: 'P-2024-003',
        date: '2024-12-01',
        consultationId: 'C-2024-003',
        medications: [
          { name: 'Metformine 850mg', dosage: '1 comprimé 2x/jour', duration: '3 mois' }
        ],
        status: 'active'
      }
    ],
    examinations: [
      {
        id: 'E-2024-003',
        date: '2024-11-25',
        type: 'HbA1c',
        doctor: 'Dr. Martin',
        results: '7.2% (amélioration)',
        files: ['hba1c-2024-11-25.pdf']
      }
    ],
    documents: [
      { name: 'Carnet de glycémie', type: 'Medical', uploadDate: '2024-11-01' }
    ]
  }
];

export default function PatientRecords() {
  const [patients] = useState(PATIENTS_DATA);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const filteredPatients = patients.filter(patient =>
    patient.personalInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.personalInfo.medicalNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getStatusColor = (status) => {
    return status === 'active'
      ? 'text-green-600 bg-green-100'
      : 'text-gray-600 bg-gray-100';
  };

  if (selectedPatient) {
    return (
      <div className="space-y-6">
        {/* En-tête du dossier */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setSelectedPatient(null)}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              ← Retour à la liste
            </button>
            <div className="flex space-x-2">
              <button className="flex items-center px-3 py-2 text-gray-600 border rounded-lg hover:bg-gray-50">
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </button>
              <button className="flex items-center px-3 py-2 text-gray-600 border rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </button>
            </div>
          </div>

          <div className="flex items-start space-x-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-blue-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{selectedPatient.personalInfo.name}</h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                <div>
                  <span className="text-gray-500">Âge:</span>
                  <p className="font-medium">{selectedPatient.personalInfo.age} ans</p>
                </div>
                <div>
                  <span className="text-gray-500">N° Dossier:</span>
                  <p className="font-medium">{selectedPatient.personalInfo.medicalNumber}</p>
                </div>
                <div>
                  <span className="text-gray-500">Groupe sanguin:</span>
                  <p className="font-medium">{selectedPatient.medicalInfo.bloodType}</p>
                </div>
                <div>
                  <span className="text-gray-500">Dernière MAJ:</span>
                  <p className="font-medium">{formatDate(selectedPatient.medicalInfo.lastUpdate)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Alertes médicales */}
          {(selectedPatient.medicalInfo.allergies.length > 0 || selectedPatient.medicalInfo.chronicConditions.length > 0) && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <span className="font-medium text-red-900">Alertes médicales</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {selectedPatient.medicalInfo.allergies.length > 0 && (
                  <div>
                    <span className="font-medium text-red-800">Allergies:</span>
                    <p className="text-red-700">{selectedPatient.medicalInfo.allergies.join(', ')}</p>
                  </div>
                )}
                {selectedPatient.medicalInfo.chronicConditions.length > 0 && (
                  <div>
                    <span className="font-medium text-red-800">Pathologies chroniques:</span>
                    <p className="text-red-700">{selectedPatient.medicalInfo.chronicConditions.join(', ')}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Onglets */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Vue d\'ensemble', icon: FileText },
                { id: 'consultations', label: 'Consultations', icon: Stethoscope },
                { id: 'prescriptions', label: 'Ordonnances', icon: Pill },
                { id: 'examinations', label: 'Examens', icon: Activity },
                { id: 'documents', label: 'Documents', icon: Paperclip }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Onglet Vue d'ensemble */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Informations personnelles */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Informations personnelles
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Date de naissance:</span>
                        <span className="font-medium">{formatDate(selectedPatient.personalInfo.birthDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Genre:</span>
                        <span className="font-medium">{selectedPatient.personalInfo.gender}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Téléphone:</span>
                        <span className="font-medium">{selectedPatient.personalInfo.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Email:</span>
                        <span className="font-medium">{selectedPatient.personalInfo.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Assurance:</span>
                        <span className="font-medium">{selectedPatient.personalInfo.insurance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Contact urgence:</span>
                        <span className="font-medium">{selectedPatient.personalInfo.emergencyContact}</span>
                      </div>
                    </div>
                  </div>

                  {/* Informations médicales */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Heart className="w-5 h-5 mr-2" />
                      Informations médicales
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Poids:</span>
                        <span className="font-medium">{selectedPatient.medicalInfo.weight}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Taille:</span>
                        <span className="font-medium">{selectedPatient.medicalInfo.height}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Groupe sanguin:</span>
                        <span className="font-medium">{selectedPatient.medicalInfo.bloodType}</span>
                      </div>
                      <div className="pt-2">
                        <span className="text-gray-500">Allergies:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {selectedPatient.medicalInfo.allergies.length > 0 ?
                            selectedPatient.medicalInfo.allergies.map((allergy, idx) => (
                              <span key={idx} className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                                {allergy}
                              </span>
                            )) :
                            <span className="text-gray-400">Aucune allergie connue</span>
                          }
                        </div>
                      </div>
                      <div className="pt-2">
                        <span className="text-gray-500">Pathologies chroniques:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {selectedPatient.medicalInfo.chronicConditions.length > 0 ?
                            selectedPatient.medicalInfo.chronicConditions.map((condition, idx) => (
                              <span key={idx} className="inline-block px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                                {condition}
                              </span>
                            )) :
                            <span className="text-gray-400">Aucune pathologie chronique</span>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dernières consultations */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Dernières consultations ({selectedPatient.consultations.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedPatient.consultations.slice(0, 3).map((consultation) => (
                      <div key={consultation.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium">{consultation.type}</span>
                              <span className="text-sm text-gray-500">• {formatDate(consultation.date)}</span>
                            </div>
                            <p className="text-sm text-gray-600">{consultation.diagnosis}</p>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800 text-sm">
                            Voir détails
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Consultations */}
            {activeTab === 'consultations' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Historique des consultations ({selectedPatient.consultations.length})
                  </h3>
                  <button
                    onClick={() => navigate('/medecin/consultations/nouvelle', {
                      state: { selectedPatient: selectedPatient.personalInfo }
                    })}
                    className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle consultation
                  </button>
                </div>

                <div className="space-y-4">
                  {selectedPatient.consultations.map((consultation) => (
                    <div key={consultation.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">{consultation.type}</h4>
                          <p className="text-sm text-gray-500">
                            {formatDate(consultation.date)} à {consultation.time} - {consultation.doctor}
                          </p>
                        </div>
                        <span className="text-sm bg-gray-100 px-2 py-1 rounded">{consultation.id}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Motif et diagnostic</h5>
                          <p className="text-sm text-gray-600 mb-2"><strong>Motif:</strong> {consultation.reason}</p>
                          <p className="text-sm text-gray-600"><strong>Diagnostic:</strong> {consultation.diagnosis}</p>
                        </div>

                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Signes vitaux</h5>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>Température: {consultation.vitalSigns.temperature}</p>
                            <p>Tension: {consultation.vitalSigns.bloodPressure}</p>
                            <p>Pouls: {consultation.vitalSigns.heartRate}</p>
                            <p>Poids: {consultation.vitalSigns.weight}</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h5 className="font-medium text-gray-900 mb-2">Traitement et suivi</h5>
                        <p className="text-sm text-gray-600 mb-2"><strong>Traitement:</strong> {consultation.treatment}</p>
                        <p className="text-sm text-gray-600 mb-2"><strong>Notes:</strong> {consultation.notes}</p>
                        <p className="text-sm text-gray-600"><strong>Suivi:</strong> {consultation.followUp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Onglet Ordonnances */}
            {activeTab === 'prescriptions' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Historique des ordonnances ({selectedPatient.prescriptions.length})
                </h3>

                <div className="space-y-4">
                  {selectedPatient.prescriptions.map((prescription) => (
                    <div key={prescription.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">Ordonnance {prescription.id}</h4>
                          <p className="text-sm text-gray-500">
                            {formatDate(prescription.date)} - Consultation {prescription.consultationId}
                          </p>
                        </div>
                        <span className={`text-sm px-2 py-1 rounded ${getStatusColor(prescription.status)}`}>
                          {prescription.status === 'active' ? 'Active' : 'Terminée'}
                        </span>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-900 mb-3">Médicaments prescrits</h5>
                        <div className="space-y-2">
                          {prescription.medications.map((med, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium text-gray-900">{med.name}</p>
                                <p className="text-sm text-gray-600">{med.dosage} - {med.duration}</p>
                              </div>
                              <Pill className="w-5 h-5 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Onglet Examens */}
            {activeTab === 'examinations' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Examens et résultats ({selectedPatient.examinations.length})
                </h3>

                <div className="space-y-4">
                  {selectedPatient.examinations.map((exam) => (
                    <div key={exam.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{exam.type}</h4>
                          <p className="text-sm text-gray-500 mb-2">
                            {formatDate(exam.date)} - {exam.doctor}
                          </p>
                          <p className="text-sm text-gray-600">{exam.results}</p>
                          {exam.files && exam.files.length > 0 && (
                            <div className="mt-3">
                              <span className="text-sm font-medium text-gray-700">Fichiers:</span>
                              <div className="mt-1 space-y-1">
                                {exam.files.map((file, idx) => (
                                  <div key={idx} className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                                    <Paperclip className="w-4 h-4 mr-1" />
                                    {file}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                          <Download className="w-4 h-4 mr-1" />
                          Télécharger
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Onglet Documents */}
            {activeTab === 'documents' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Documents ({selectedPatient.documents.length})
                  </h3>
                  <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un document
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedPatient.documents.map((doc, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <FileText className="w-8 h-8 text-gray-400 mt-1" />
                          <div>
                            <h4 className="font-medium text-gray-900">{doc.name}</h4>
                            <p className="text-sm text-gray-500">{doc.type}</p>
                            <p className="text-xs text-gray-400">{formatDate(doc.uploadDate)}</p>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dossiers Patients</h1>
          <p className="text-gray-600">Consultez les dossiers médicaux complets</p>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher par nom ou numéro de dossier..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Liste des patients */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Patients ({filteredPatients.length})
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="p-6 hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedPatient(patient)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{patient.personalInfo.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{patient.personalInfo.age} ans</span>
                      <span>•</span>
                      <span>{patient.personalInfo.medicalNumber}</span>
                      <span>•</span>
                      <span>{patient.consultations.length} consultation{patient.consultations.length > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {(patient.medicalInfo.allergies.length > 0 || patient.medicalInfo.chronicConditions.length > 0) && (
                    <div className="flex items-center text-red-600">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      <span className="text-sm">Alertes</span>
                    </div>
                  )}
                  <span className="text-sm text-gray-500">
                    MAJ: {formatDate(patient.medicalInfo.lastUpdate)}
                  </span>
                  <Eye className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Résumé rapide */}
              {patient.consultations.length > 0 && (
                <div className="mt-3 ml-16">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    Dernière consultation: {formatDate(patient.consultations[0].date)} - {patient.consultations[0].diagnosis}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}