import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Plus,
  Calendar,
  Clock,
  User,
  Search,
  FileText,
  Pill,
  CheckCircle,
  AlertCircle,
  XCircle,
  Loader,
  RefreshCw
} from 'lucide-react';
import { consultationService } from '../../services/consultationService';

const getStatusInfo = (status) => {
  const statusMap = {
    scheduled: {
      label: 'Programmée',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: Calendar
    },
    in_progress: {
      label: 'En cours',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: AlertCircle
    },
    completed: {
      label: 'Terminée',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: CheckCircle
    },
    cancelled: {
      label: 'Annulée',
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: XCircle
    }
  };
  return statusMap[status] || statusMap.scheduled;
};

const TODAY = new Date().toISOString().split('T')[0];

export default function ConsultationsManager() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Détection de la vue (consultations actuelles vs historique)
  const isHistoryView = location.pathname.includes('/historique');

  // Ajuster le filtre par défaut selon la vue
  useEffect(() => {
    if (isHistoryView) {
      setSelectedStatus('completed');
      setSelectedDate('');
    } else {
      setSelectedStatus('all');
      setSelectedDate(TODAY);
    }
  }, [isHistoryView]);

  // Charger les consultations depuis l'API
  useEffect(() => {
    const fetchConsultations = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await consultationService.getConsultations();
        const list = Array.isArray(data) ? data : data?.content ?? [];
        setConsultations(list);
      } catch (err) {
        setError(err.message || 'Erreur lors du chargement des consultations');
      } finally {
        setLoading(false);
      }
    };
    fetchConsultations();
  }, [location.state?.newConsultation]);

  const filteredConsultations = consultations
    .filter(consultation => {
      const matchesSearch = consultation.patient.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDate = !selectedDate || consultation.date === selectedDate;
      const matchesStatus = selectedStatus === 'all' || consultation.status === selectedStatus;

      // Pour l'historique, on affiche seulement les consultations terminées
      if (isHistoryView) {
        return matchesSearch && matchesDate && consultation.status === 'completed';
      }

      // Pour les consultations actuelles, on exclut les consultations terminées anciennes
      if (!isHistoryView) {
        const isToday = consultation.date === TODAY;
        const isNotCompleted = consultation.status !== 'completed';
        return matchesSearch && matchesDate && matchesStatus && (isToday || isNotCompleted);
      }

      return matchesSearch && matchesDate && matchesStatus;
    })
    .sort((a, b) => {
      if (isHistoryView) {
        // Pour l'historique: plus récent en premier (date décroissante, puis ID décroissant)
        if (a.date !== b.date) {
          return new Date(b.date) - new Date(a.date);
        }
        return b.id - a.id;
      } else {
        // Pour les consultations actuelles: priorité aux en attente
        // Priorité 1: Consultations en attente d'abord
        if (a.status === 'scheduled' && b.status !== 'scheduled') return -1;
        if (b.status === 'scheduled' && a.status !== 'scheduled') return 1;

        // Priorité 2: Consultations en cours ensuite
        if (a.status === 'in_progress' && b.status !== 'in_progress' && b.status !== 'scheduled') return -1;
        if (b.status === 'in_progress' && a.status !== 'in_progress' && a.status !== 'scheduled') return 1;

        // Priorité 3: Dans chaque groupe, tri par ordre de création (ID croissant)
        return a.id - b.id;
      }
    });

  const todayConsultations = consultations.filter(c => c.date === TODAY);
  const completedToday = todayConsultations.filter(c => c.status === 'completed').length;
  const pendingToday = todayConsultations.filter(c => c.status !== 'completed').length;

  // Démarrer une consultation - redirection vers nouvelle consultation avec données pré-remplies
  const startConsultation = (consultation) => {
    // Passer les données via l'état de navigation
    navigate('/medecin/consultations/nouvelle', {
      state: {
        patientData: {
          id: consultation.patient.id || Math.floor(Math.random() * 1000),
          name: consultation.patient.name,
          birthDate: new Date(new Date().getFullYear() - consultation.patient.age, 0, 1).toISOString().split('T')[0],
          phone: consultation.patient.phone,
          email: consultation.patient.email || `${consultation.patient.name.toLowerCase().replace(' ', '.')}@email.com`,
          medicalNumber: `P00${consultation.id}`,
          allergies: [],
          chronicConditions: [],
          lastConsultation: consultation.date,
          insurance: 'Sécurité Sociale'
        },
        consultationData: {
          type: consultation.type,
          chiefComplaint: consultation.symptoms?.split(',')[0] || '',
          symptoms: consultation.symptoms || '',
          scheduledTime: consultation.time,
          appointmentId: consultation.id
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isHistoryView ? 'Historique des Consultations' : 'Mes Consultations'}
          </h1>
          <p className="text-gray-600">
            {isHistoryView
              ? 'Consultez vos consultations passées et archivées'
              : 'Gérez vos consultations et suivis patients'
            }
          </p>
        </div>
        {!isHistoryView && (
          <button
            onClick={() => navigate('/medecin/consultations/nouvelle')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Nouvelle Consultation</span>
          </button>
        )}
      </div>

      {!isHistoryView && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Consultations Aujourd'hui</p>
                <p className="text-2xl font-bold text-gray-900">{todayConsultations.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Terminées</p>
                <p className="text-2xl font-bold text-green-600">{completedToday}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Attente</p>
                <p className="text-2xl font-bold text-orange-600">{pendingToday}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
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
              placeholder="Rechercher par nom de patient..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <input
            type="date"
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            placeholder={isHistoryView ? "Filtrer par date" : "Date"}
          />
          {!isHistoryView && (
            <select
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="scheduled">Programmées</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminées</option>
              <option value="cancelled">Annulées</option>
            </select>
          )}
        </div>


        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-blue-600 animate-spin mr-3" />
            <span className="text-gray-600">Chargement des consultations...</span>
          </div>
        )}

        {!loading && error && (
          <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
            <span className="text-red-700">{error}</span>
            <button
              onClick={() => window.location.reload()}
              className="ml-auto px-3 py-1 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-100 flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Réessayer
            </button>
          </div>
        )}

        {!loading && !error && (
        <div className="space-y-4">
          {filteredConsultations.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune consultation trouvée</h3>
              <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
            </div>
          )}
          {filteredConsultations.map((consultation) => {
            const statusInfo = getStatusInfo(consultation.status);
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={consultation.id}
                className={`border rounded-lg p-6 hover:shadow-md transition-shadow ${
                  consultation.status === 'scheduled'
                    ? 'border-blue-300 bg-blue-50 shadow-sm'
                    : consultation.status === 'in_progress'
                    ? 'border-yellow-300 bg-yellow-50 shadow-sm'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {consultation.status === 'scheduled' && (
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-xs font-bold">
                            {filteredConsultations.filter(c => c.status === 'scheduled').findIndex(c => c.id === consultation.id) + 1}
                          </span>
                        )}
                        <h3 className="text-lg font-semibold text-gray-900">{consultation.patient.name}</h3>
                        <span className="text-sm text-gray-500">{consultation.patient.age} ans</span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color}`}>
                          <StatusIcon className="w-4 h-4 mr-1" />
                          {statusInfo.label}
                        </span>
                        {consultation.status === 'scheduled' && (
                          <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            À traiter
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Date & Heure</p>
                          <p className="font-medium">
                            {new Date(consultation.date).toLocaleDateString()} à {consultation.time}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Type de consultation</p>
                          <p className="font-medium">{consultation.type}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Contact</p>
                          <p className="font-medium">{consultation.patient.phone}</p>
                        </div>
                      </div>

                      {consultation.symptoms && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-500 mb-1">Symptômes</p>
                          <p className="text-gray-700">{consultation.symptoms}</p>
                        </div>
                      )}

                      {consultation.diagnosis && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-500 mb-1">Diagnostic</p>
                          <p className="text-gray-700">{consultation.diagnosis}</p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {consultation.prescription && (
                          <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                            <Pill className="w-4 h-4 mr-1" />
                            Ordonnance
                          </span>
                        )}
                        {consultation.nextAppointment && (
                          <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                            <Calendar className="w-4 h-4 mr-1" />
                            Prochain RDV: {new Date(consultation.nextAppointment).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    {consultation.status === 'scheduled' && (
                      <button
                        onClick={() => startConsultation(consultation)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm transition-colors"
                      >
                        Commencer
                      </button>
                    )}
                    {consultation.status === 'in_progress' && (
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                        Terminer
                      </button>
                    )}
                    <button className="px-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 text-sm">
                      Voir dossier
                    </button>
                    <button className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
                      <FileText className="w-4 h-4 inline mr-1" />
                      Rapport
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>
    </div>
  );
}