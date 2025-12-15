import { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  FileText,
  User,
  Calendar,
  Pill,
  Download,
  Eye,
  Copy,
  Printer,
  Save
} from 'lucide-react';

const prescriptions = [
  {
    id: 1,
    patient: {
      name: 'Marie Dubois',
      age: 34,
      phone: '+33 6 12 34 56 78'
    },
    date: '2024-12-12',
    medications: [
      { name: 'Doliprane 1000mg', dosage: '1 comprimé 3x/jour', duration: '5 jours', quantity: '15 comprimés' },
      { name: 'Spasfon Lyoc', dosage: '1 sachet si douleur', duration: 'Au besoin', quantity: '10 sachets' }
    ],
    diagnosis: 'Gastro-entérite aiguë',
    status: 'active',
    consultationId: 'C-2024-001'
  },
  {
    id: 2,
    patient: {
      name: 'Jean Martin',
      age: 45,
      phone: '+33 6 23 45 67 89'
    },
    date: '2024-12-11',
    medications: [
      { name: 'Kardégic 75mg', dosage: '1 comprimé/jour', duration: '3 mois', quantity: '90 comprimés' },
      { name: 'Amlor 5mg', dosage: '1 comprimé matin', duration: '3 mois', quantity: '90 comprimés' }
    ],
    diagnosis: 'Hypertension artérielle',
    status: 'active',
    consultationId: 'C-2024-002'
  },
  {
    id: 3,
    patient: {
      name: 'Sophie Bernard',
      age: 29,
      phone: '+33 6 34 56 78 90'
    },
    date: '2024-12-10',
    medications: [
      { name: 'Augmentin 1g', dosage: '1 comprimé 2x/jour', duration: '7 jours', quantity: '14 comprimés' }
    ],
    diagnosis: 'Infection urinaire',
    status: 'completed',
    consultationId: 'C-2024-003'
  }
];

const medicationTemplates = [
  {
    category: 'Antibiotiques',
    medications: [
      { name: 'Augmentin 1g', defaultDosage: '1 cp 2x/jour', defaultDuration: '7 jours' },
      { name: 'Clamoxyl 500mg', defaultDosage: '1 cp 3x/jour', defaultDuration: '7 jours' },
      { name: 'Ofloxacine 200mg', defaultDosage: '1 cp 2x/jour', defaultDuration: '5 jours' }
    ]
  },
  {
    category: 'Antalgiques',
    medications: [
      { name: 'Doliprane 1000mg', defaultDosage: '1 cp 3x/jour', defaultDuration: '5 jours' },
      { name: 'Advil 400mg', defaultDosage: '1 cp 3x/jour', defaultDuration: '3 jours' },
      { name: 'Efferalgan 1g', defaultDosage: '1 cp si douleur', defaultDuration: 'Au besoin' }
    ]
  }
];

const getStatusColor = (status) => {
  return status === 'active'
    ? 'bg-green-100 text-green-800 border-green-200'
    : 'bg-gray-100 text-gray-800 border-gray-200';
};

export default function PrescriptionsManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showNewPrescription, setShowNewPrescription] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const [newPrescription, setNewPrescription] = useState({
    patient: '',
    diagnosis: '',
    medications: [{ name: '', dosage: '', duration: '', quantity: '' }]
  });

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || prescription.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const addMedication = () => {
    setNewPrescription({
      ...newPrescription,
      medications: [...newPrescription.medications, { name: '', dosage: '', duration: '', quantity: '' }]
    });
  };

  const removeMedication = (index) => {
    const medications = newPrescription.medications.filter((_, i) => i !== index);
    setNewPrescription({ ...newPrescription, medications });
  };

  const handleSavePrescription = () => {
    console.log('Sauvegarde de l\'ordonnance:', newPrescription);
    setShowNewPrescription(false);
    setNewPrescription({
      patient: '',
      diagnosis: '',
      medications: [{ name: '', dosage: '', duration: '', quantity: '' }]
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Ordonnances</h1>
          <p className="text-gray-600">Gérez vos prescriptions et ordonnances</p>
        </div>
        <button
          onClick={() => setShowNewPrescription(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nouvelle Ordonnance</span>
        </button>
      </div>

      {/* Formulaire nouvelle ordonnance */}
      {showNewPrescription && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Nouvelle Ordonnance</h3>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowNewPrescription(false)}
                className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSavePrescription}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Sauvegarder</span>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient
                </label>
                <input
                  type="text"
                  value={newPrescription.patient}
                  onChange={(e) => setNewPrescription({ ...newPrescription, patient: e.target.value })}
                  placeholder="Rechercher un patient..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnostic
                </label>
                <input
                  type="text"
                  value={newPrescription.diagnosis}
                  onChange={(e) => setNewPrescription({ ...newPrescription, diagnosis: e.target.value })}
                  placeholder="Diagnostic médical..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-md font-semibold text-gray-900">Médicaments</h4>
                <button
                  onClick={addMedication}
                  className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter un médicament</span>
                </button>
              </div>

              {newPrescription.medications.map((medication, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 p-4 border border-gray-200 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Médicament
                    </label>
                    <input
                      type="text"
                      value={medication.name}
                      onChange={(e) => {
                        const medications = [...newPrescription.medications];
                        medications[index].name = e.target.value;
                        setNewPrescription({ ...newPrescription, medications });
                      }}
                      placeholder="Nom du médicament"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Posologie
                    </label>
                    <input
                      type="text"
                      value={medication.dosage}
                      onChange={(e) => {
                        const medications = [...newPrescription.medications];
                        medications[index].dosage = e.target.value;
                        setNewPrescription({ ...newPrescription, medications });
                      }}
                      placeholder="1 cp 3x/jour"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Durée
                    </label>
                    <input
                      type="text"
                      value={medication.duration}
                      onChange={(e) => {
                        const medications = [...newPrescription.medications];
                        medications[index].duration = e.target.value;
                        setNewPrescription({ ...newPrescription, medications });
                      }}
                      placeholder="7 jours"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantité
                    </label>
                    <input
                      type="text"
                      value={medication.quantity}
                      onChange={(e) => {
                        const medications = [...newPrescription.medications];
                        medications[index].quantity = e.target.value;
                        setNewPrescription({ ...newPrescription, medications });
                      }}
                      placeholder="21 comprimés"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-end">
                    {newPrescription.medications.length > 1 && (
                      <button
                        onClick={() => removeMedication(index)}
                        className="w-full px-3 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par patient ou diagnostic..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actives</option>
            <option value="completed">Terminées</option>
          </select>
        </div>

        <div className="space-y-4">
          {filteredPrescriptions.map((prescription) => (
            <div key={prescription.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>

                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{prescription.patient.name}</h3>
                      <span className="text-sm text-gray-500">{prescription.patient.age} ans</span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(prescription.status)}`}>
                        {prescription.status === 'active' ? 'Active' : 'Terminée'}
                      </span>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Diagnostic:</strong> {prescription.diagnosis}</p>
                      <p><strong>Date:</strong> {new Date(prescription.date).toLocaleDateString()}</p>
                      <p><strong>Consultation:</strong> {prescription.consultationId}</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50">
                    <Download className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-purple-50">
                    <Printer className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-orange-600 rounded-lg hover:bg-orange-50">
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Pill className="w-4 h-4 mr-2" />
                  Médicaments prescrits
                </h4>
                <div className="space-y-3">
                  {prescription.medications.map((medication, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{medication.name}</p>
                        <p className="text-sm text-gray-600">{medication.dosage} - {medication.duration}</p>
                      </div>
                      <span className="text-sm bg-white px-2 py-1 rounded border">
                        {medication.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPrescriptions.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune ordonnance trouvée</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>

      {/* Modèles de médicaments */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Modèles de prescription</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {medicationTemplates.map((template, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">{template.category}</h4>
              <div className="space-y-2">
                {template.medications.slice(0, 3).map((med, medIndex) => (
                  <div key={medIndex} className="text-sm">
                    <p className="font-medium text-gray-800">{med.name}</p>
                    <p className="text-gray-600">{med.defaultDosage} - {med.defaultDuration}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}