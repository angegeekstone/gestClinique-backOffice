import { useState } from 'react';
import {
  Plus,
  Calendar,
  Clock,
  User,
  Search,
  Filter,
  FileText,
  Pill,
  Activity,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';

const consultations = [
  {
    id: 1,
    patient: {
      name: 'Marie Dubois',
      age: 34,
      phone: '+33 6 12 34 56 78'
    },
    date: '2024-12-12',
    time: '09:30',
    type: 'Consultation générale',
    status: 'completed',
    symptoms: 'Douleurs abdominales, fatigue',
    diagnosis: 'Gastrite chronique',
    prescription: true,
    nextAppointment: '2024-12-26'
  },
  {
    id: 2,
    patient: {
      name: 'Jean Martin',
      age: 45,
      phone: '+33 6 23 45 67 89'
    },
    date: '2024-12-12',
    time: '10:15',
    type: 'Suivi cardiologique',
    status: 'in_progress',
    symptoms: 'Essoufflement, palpitations',
    diagnosis: '',
    prescription: false,
    nextAppointment: null
  },
  {
    id: 3,
    patient: {
      name: 'Sophie Bernard',
      age: 29,
      phone: '+33 6 34 56 78 90'
    },
    date: '2024-12-12',
    time: '11:00',
    type: 'Consultation urgente',
    status: 'scheduled',
    symptoms: 'Fièvre élevée, maux de tête',
    diagnosis: '',
    prescription: false,
    nextAppointment: null
  },
  {
    id: 4,
    patient: {
      name: 'Pierre Lefebvre',
      age: 52,
      phone: '+33 6 45 67 89 01'
    },
    date: '2024-12-11',
    time: '16:30',
    type: 'Contrôle post-opératoire',
    status: 'completed',
    symptoms: 'Cicatrisation, douleurs modérées',
    diagnosis: 'Cicatrisation normale',
    prescription: true,
    nextAppointment: '2024-12-18'
  }
];

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

export default function ConsultationsManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('2024-12-12');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = consultation.patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !selectedDate || consultation.date === selectedDate;
    const matchesStatus = selectedStatus === 'all' || consultation.status === selectedStatus;
    return matchesSearch && matchesDate && matchesStatus;
  });

  const todayConsultations = consultations.filter(c => c.date === '2024-12-12');
  const completedToday = todayConsultations.filter(c => c.status === 'completed').length;
  const pendingToday = todayConsultations.filter(c => c.status !== 'completed').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Consultations</h1>
          <p className="text-gray-600">Gérez vos consultations et suivis patients</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Nouvelle Consultation</span>
        </button>
      </div>

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
          />
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
        </div>

        <div className="space-y-4">
          {filteredConsultations.map((consultation) => {
            const statusInfo = getStatusInfo(consultation.status);
            const StatusIcon = statusInfo.icon;

            return (
              <div key={consultation.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{consultation.patient.name}</h3>
                        <span className="text-sm text-gray-500">{consultation.patient.age} ans</span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color}`}>
                          <StatusIcon className="w-4 h-4 mr-1" />
                          {statusInfo.label}
                        </span>
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
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
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

        {filteredConsultations.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune consultation trouvée</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>
    </div>
  );
}