import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  FileText,
  User,
  Pill,
  Download,
  Eye,
  Copy,
  Printer,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { prescriptionService } from '../../services/prescriptionService';
import { useAuth } from '../../contexts/AuthContext';

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

const getStatusColor = (isActive) =>
  isActive
    ? 'bg-green-100 text-green-800 border-green-200'
    : 'bg-gray-100 text-gray-800 border-gray-200';

export default function PrescriptionsManager() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    if (!user?.id) return;
    const fetchPrescriptions = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await prescriptionService.getPrescriptionsByDoctor(user.id);
        const list = Array.isArray(result) ? result : result?.content ?? [];
        setPrescriptions(list);
      } catch (err) {
        setError(err.message || 'Erreur lors du chargement des ordonnances');
      } finally {
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, [user?.id]);

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const medicationName = prescription.medicationName ?? '';
    const patientId = String(prescription.patientId ?? '');
    const matchesSearch =
      medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patientId.includes(searchTerm);
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'active' && prescription.isActive) ||
      (selectedStatus === 'completed' && !prescription.isActive);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Ordonnances</h1>
          <p className="text-gray-600">Gérez vos prescriptions et ordonnances</p>
        </div>
        <button
          onClick={() => window.location.href = '/medecin/consultations/nouvelle'}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Créer depuis Consultation</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par médicament ou patient..."
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

        {loading && (
          <div className="flex items-center justify-center py-12 text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span>Chargement des ordonnances...</span>
          </div>
        )}

        {error && (
          <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          {!loading && !error && filteredPrescriptions.map((prescription) => (
            <div key={prescription.id} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Patient #{prescription.patientId}
                      </h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(prescription.isActive)}`}>
                        {prescription.isActive ? 'Active' : 'Terminée'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Date :</strong> {new Date(prescription.prescriptionDate).toLocaleDateString('fr-FR')}</p>
                      {prescription.consultationId && (
                        <p><strong>Consultation :</strong> #{prescription.consultationId}</p>
                      )}
                      {prescription.startDate && prescription.endDate && (
                        <p>
                          <strong>Période :</strong>{' '}
                          {new Date(prescription.startDate).toLocaleDateString('fr-FR')} →{' '}
                          {new Date(prescription.endDate).toLocaleDateString('fr-FR')}
                        </p>
                      )}
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
                  Médicament prescrit
                </h4>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{prescription.medicationName}</p>
                    <p className="text-sm text-gray-600">
                      {prescription.dosage} — {prescription.frequency} — {prescription.duration}
                    </p>
                    {prescription.instructions && (
                      <p className="text-sm text-gray-500 italic mt-1">{prescription.instructions}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && !error && filteredPrescriptions.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune ordonnance trouvée</h3>
            <p className="text-gray-500">
              {prescriptions.length === 0
                ? 'Aucune ordonnance enregistrée pour le moment'
                : 'Essayez de modifier vos critères de recherche'}
            </p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Modèles de prescription</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {medicationTemplates.map((template, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">{template.category}</h4>
              <div className="space-y-2">
                {template.medications.map((med, medIndex) => (
                  <div key={medIndex} className="text-sm">
                    <p className="font-medium text-gray-800">{med.name}</p>
                    <p className="text-gray-600">{med.defaultDosage} — {med.defaultDuration}</p>
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