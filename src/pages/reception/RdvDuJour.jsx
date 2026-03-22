import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Calendar,
  Clock,
  User,
  UserCheck,
  AlertCircle,
  Activity,
  RefreshCw,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  Stethoscope,
  Users,
  Timer,
  Play,
  Pause,
  Square,
  ChevronRight,
  Bell,
  ClipboardList
} from 'lucide-react';

// Données de test pour les RDV du jour
const SAMPLE_APPOINTMENTS = [
  {
    id: 1,
    patientId: 1,
    patientName: 'Marie Dubois',
    patientPhone: '+33 6 12 34 56 78',
    patientNumber: 'P001234',
    doctorId: 1,
    doctorName: 'Dr. Martin',
    specialty: 'Cardiologie',
    timeSlot: '09:00',
    appointmentTime: '2024-12-15T09:00:00',
    consultationType: 'consultation',
    urgency: 'normal',
    status: 'waiting', // waiting, in_progress, completed, cancelled
    checkInTime: '08:45',
    estimatedDuration: 30,
    notes: 'Contrôle de routine',
    queueNumber: 1
  },
  {
    id: 2,
    patientId: 2,
    patientName: 'Jean Martin',
    patientPhone: '+33 6 23 45 67 89',
    patientNumber: 'P001235',
    doctorId: 2,
    doctorName: 'Dr. Durand',
    specialty: 'Médecine générale',
    timeSlot: '09:00',
    appointmentTime: '2024-12-15T09:00:00',
    consultationType: 'consultation',
    urgency: 'normal',
    status: 'in_progress',
    checkInTime: '08:30',
    estimatedDuration: 20,
    notes: 'Fièvre et fatigue',
    queueNumber: 2
  },
  {
    id: 3,
    patientId: 3,
    patientName: 'Sophie Bernard',
    patientPhone: '+33 6 34 56 78 90',
    patientNumber: 'P001236',
    doctorId: 1,
    doctorName: 'Dr. Martin',
    specialty: 'Cardiologie',
    timeSlot: '09:30',
    appointmentTime: '2024-12-15T09:30:00',
    consultationType: 'controle',
    urgency: 'normal',
    status: 'waiting',
    checkInTime: '09:15',
    estimatedDuration: 25,
    notes: 'Suivi post-opératoire',
    queueNumber: 3
  },
  {
    id: 4,
    patientId: 4,
    patientName: 'Pierre Lefebvre',
    patientPhone: '+33 6 45 67 89 01',
    patientNumber: 'P001237',
    doctorId: 3,
    doctorName: 'Dr. Leroy',
    specialty: 'Pédiatrie',
    timeSlot: '10:00',
    appointmentTime: '2024-12-15T10:00:00',
    consultationType: 'urgence',
    urgency: 'urgent',
    status: 'waiting',
    checkInTime: '09:45',
    estimatedDuration: 15,
    notes: 'Douleurs abdominales',
    queueNumber: 4
  },
  {
    id: 5,
    patientId: 5,
    patientName: 'Amélie Rousseau',
    patientPhone: '+33 6 56 78 90 12',
    patientNumber: 'P001238',
    doctorId: 2,
    doctorName: 'Dr. Durand',
    specialty: 'Médecine générale',
    timeSlot: '10:30',
    appointmentTime: '2024-12-15T10:30:00',
    consultationType: 'vaccination',
    urgency: 'normal',
    status: 'completed',
    checkInTime: '10:00',
    estimatedDuration: 10,
    notes: 'Vaccination COVID-19',
    queueNumber: 5,
    completedTime: '10:15'
  }
];

const STATUS_CONFIG = {
  waiting: {
    label: 'En attente',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Timer,
    bgColor: 'bg-yellow-50'
  },
  in_progress: {
    label: 'En cours',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Activity,
    bgColor: 'bg-blue-50'
  },
  completed: {
    label: 'Terminé',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle,
    bgColor: 'bg-green-50'
  },
  cancelled: {
    label: 'Annulé',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle,
    bgColor: 'bg-red-50'
  }
};

const URGENCY_CONFIG = {
  normal: { label: 'Normal', color: 'text-gray-600' },
  urgent: { label: 'Urgent', color: 'text-orange-600' },
  tres_urgent: { label: 'Très urgent', color: 'text-red-600' }
};

export default function RdvDuJour() {
  const { user, hasRole } = useAuth();
  const [appointments, setAppointments] = useState(SAMPLE_APPOINTMENTS);
  const [filteredAppointments, setFilteredAppointments] = useState(SAMPLE_APPOINTMENTS);
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Mise à jour du temps actuel toutes les minutes
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Toutes les minutes

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Filtrage des RDV
  useEffect(() => {
    let filtered = [...appointments];

    if (selectedDoctor !== 'all') {
      filtered = filtered.filter(apt => apt.doctorId.toString() === selectedDoctor);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(apt => apt.status === selectedStatus);
    }

    // Trier par urgence puis par heure
    filtered.sort((a, b) => {
      // Priorité aux urgences
      if (a.urgency === 'tres_urgent' && b.urgency !== 'tres_urgent') return -1;
      if (b.urgency === 'tres_urgent' && a.urgency !== 'tres_urgent') return 1;
      if (a.urgency === 'urgent' && b.urgency === 'normal') return -1;
      if (b.urgency === 'urgent' && a.urgency === 'normal') return 1;

      // Puis par heure de RDV
      return new Date(a.appointmentTime) - new Date(b.appointmentTime);
    });

    setFilteredAppointments(filtered);
  }, [appointments, selectedDoctor, selectedStatus]);

  // Statistiques
  const stats = {
    total: appointments.length,
    waiting: appointments.filter(apt => apt.status === 'waiting').length,
    inProgress: appointments.filter(apt => apt.status === 'in_progress').length,
    completed: appointments.filter(apt => apt.status === 'completed').length,
    urgent: appointments.filter(apt => apt.urgency === 'urgent' || apt.urgency === 'tres_urgent').length
  };

  // Liste des médecins
  const doctors = [...new Set(appointments.map(apt => ({ id: apt.doctorId, name: apt.doctorName })))];

  // Changer le statut d'un RDV
  const updateAppointmentStatus = (appointmentId, newStatus) => {
    setAppointments(prev => prev.map(apt =>
      apt.id === appointmentId
        ? {
            ...apt,
            status: newStatus,
            completedTime: newStatus === 'completed' ? new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : apt.completedTime
          }
        : apt
    ));
  };

  // Démarrer une consultation
  const startConsultation = (appointmentId) => {
    updateAppointmentStatus(appointmentId, 'in_progress');
  };

  // Terminer une consultation
  const completeConsultation = (appointmentId) => {
    updateAppointmentStatus(appointmentId, 'completed');
  };

  // Annuler un RDV
  const cancelAppointment = (appointmentId) => {
    updateAppointmentStatus(appointmentId, 'cancelled');
  };

  // Formatage de l'heure
  const formatTime = (timeString) => {
    return new Date(`1970-01-01T${timeString}:00`).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!hasRole('RECEPTION') && !hasRole('ADMIN_CLINIQUE') && !hasRole('MEDECIN')) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-red-900 mb-2">Accès non autorisé</h2>
          <p className="text-red-700">Vous n'avez pas les permissions nécessaires pour accéder aux RDV.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-blue-600" />
            RDV du Jour
          </h1>
          <p className="text-gray-600 mt-1">
            {new Date().toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center px-3 py-2 rounded-lg border transition-colors ${
              autoRefresh
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-gray-50 border-gray-200 text-gray-700'
            }`}
          >
            {autoRefresh ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
            {autoRefresh ? 'Pause' : 'Auto-refresh'}
          </button>

          <button
            onClick={() => setCurrentTime(new Date())}
            className="flex items-center px-3 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Actualiser
          </button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total RDV</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <ClipboardList className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.waiting}</p>
            </div>
            <Timer className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En cours</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <Activity className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Terminés</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Urgents</p>
              <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
            </div>
            <Bell className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Filtre par médecin */}
            <div className="min-w-0 flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Médecin</label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les médecins</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id.toString()}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtre par statut */}
            <div className="min-w-0 flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="waiting">En attente</option>
                <option value="in_progress">En cours</option>
                <option value="completed">Terminés</option>
                <option value="cancelled">Annulés</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            {filteredAppointments.length} RDV affiché(s)
          </div>
        </div>
      </div>

      {/* Liste des RDV */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Médecin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Heure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => {
                const StatusIcon = STATUS_CONFIG[appointment.status].icon;

                return (
                  <tr
                    key={appointment.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      appointment.urgency === 'tres_urgent' ? 'bg-red-25' :
                      appointment.urgency === 'urgent' ? 'bg-orange-25' : ''
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900">
                              {appointment.patientName}
                            </p>
                            {appointment.urgency !== 'normal' && (
                              <span className={`text-xs font-semibold ${URGENCY_CONFIG[appointment.urgency].color}`}>
                                {URGENCY_CONFIG[appointment.urgency].label.toUpperCase()}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">#{appointment.patientNumber}</p>
                          <div className="flex items-center space-x-3 mt-1">
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <Phone className="w-3 h-3" />
                              <span>{appointment.patientPhone}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Stethoscope className="w-4 h-4 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{appointment.doctorName}</p>
                          <p className="text-xs text-gray-500">{appointment.specialty}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{appointment.timeSlot}</p>
                        <p className="text-xs text-gray-500">
                          Check-in: {appointment.checkInTime}
                        </p>
                        {appointment.completedTime && (
                          <p className="text-xs text-green-600">
                            Fini: {appointment.completedTime}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm text-gray-900 capitalize">{appointment.consultationType}</p>
                        <p className="text-xs text-gray-500">{appointment.estimatedDuration} min</p>
                        {appointment.notes && (
                          <p className="text-xs text-gray-400 truncate max-w-32" title={appointment.notes}>
                            {appointment.notes}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_CONFIG[appointment.status].color}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {STATUS_CONFIG[appointment.status].label}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {appointment.status === 'waiting' && (
                        <button
                          onClick={() => startConsultation(appointment.id)}
                          className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Démarrer
                        </button>
                      )}

                      {appointment.status === 'in_progress' && (
                        <button
                          onClick={() => completeConsultation(appointment.id)}
                          className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Terminer
                        </button>
                      )}

                      {(appointment.status === 'waiting' || appointment.status === 'in_progress') && (
                        <button
                          onClick={() => cancelAppointment(appointment.id)}
                          className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Annuler
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun RDV trouvé</h3>
            <p className="text-gray-500">
              {selectedDoctor !== 'all' || selectedStatus !== 'all'
                ? 'Aucun RDV ne correspond aux filtres sélectionnés.'
                : 'Aucun RDV programmé pour aujourd\'hui.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}