import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Calendar,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  User,
  Stethoscope,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';

// Données de test pour les RDV
const SAMPLE_APPOINTMENTS = [
  {
    id: 1,
    patientName: 'Marie Dubois',
    patientPhone: '+33 6 12 34 56 78',
    time: '09:00',
    duration: 30,
    type: 'Consultation générale',
    status: 'confirmed',
    room: 'Salle 1',
    notes: 'Suivi hypertension'
  },
  {
    id: 2,
    patientName: 'Jean Martin',
    patientPhone: '+33 6 23 45 67 89',
    time: '09:30',
    duration: 45,
    type: 'Consultation diabète',
    status: 'confirmed',
    room: 'Salle 1',
    notes: 'Contrôle glycémique'
  },
  {
    id: 3,
    patientName: 'Sophie Bernard',
    patientPhone: '+33 6 34 56 78 90',
    time: '10:30',
    duration: 30,
    type: 'Consultation générale',
    status: 'waiting',
    room: 'Salle 1',
    notes: 'Première consultation'
  },
  {
    id: 4,
    patientName: 'Pierre Moreau',
    patientPhone: '+33 6 45 67 89 01',
    time: '11:00',
    duration: 30,
    type: 'Consultation générale',
    status: 'completed',
    room: 'Salle 1',
    notes: ''
  },
  {
    id: 5,
    patientName: 'Emma Leroy',
    patientPhone: '+33 6 56 78 90 12',
    time: '14:00',
    duration: 60,
    type: 'Bilan complet',
    status: 'confirmed',
    room: 'Salle 1',
    notes: 'Bilan annuel'
  },
  {
    id: 6,
    patientName: 'Lucas Thomas',
    patientPhone: '+33 6 67 89 01 23',
    time: '15:30',
    duration: 30,
    type: 'Consultation générale',
    status: 'cancelled',
    room: 'Salle 1',
    notes: 'Annulé - malade'
  }
];

// Horaires de travail
const WORKING_HOURS = {
  start: 8,
  end: 18,
  lunchStart: 12,
  lunchEnd: 14
};

export default function PlanningMedecin() {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('day'); // 'day', 'week'
  const [appointments, setAppointments] = useState(SAMPLE_APPOINTMENTS);
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  // Navigation des dates
  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() + direction);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + (direction * 7));
    }
    setCurrentDate(newDate);
    setSelectedDate(newDate);
  };

  // Générer les créneaux horaires
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = WORKING_HOURS.start; hour < WORKING_HOURS.end; hour++) {
      // Skip lunch time
      if (hour >= WORKING_HOURS.lunchStart && hour < WORKING_HOURS.lunchEnd) {
        if (hour === WORKING_HOURS.lunchStart) {
          slots.push({
            time: '12:00',
            isLunch: true,
            label: 'Pause déjeuner'
          });
        }
        continue;
      }

      slots.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        hour: hour,
        isLunch: false
      });
      slots.push({
        time: `${hour.toString().padStart(2, '0')}:30`,
        hour: hour,
        isLunch: false
      });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Filtrer les RDV pour la date sélectionnée
  const getDayAppointments = (date) => {
    // Pour la démo, on retourne les RDV d'exemple pour aujourd'hui
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return appointments;
    }
    return [];
  };

  const dayAppointments = getDayAppointments(selectedDate);

  // Obtenir le statut d'un créneau
  const getSlotStatus = (timeSlot) => {
    const appointment = dayAppointments.find(apt => apt.time === timeSlot.time);
    if (appointment) {
      return {
        hasAppointment: true,
        appointment,
        status: appointment.status
      };
    }
    return {
      hasAppointment: false,
      appointment: null,
      status: 'available'
    };
  };

  // Couleurs des statuts
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'waiting':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'completed':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'cancelled':
        return 'bg-red-100 border-red-300 text-red-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'waiting':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Vérification des permissions
  if (!hasRole('MEDECIN') && !hasRole('ADMIN_CLINIQUE')) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-red-900 mb-2">Accès non autorisé</h2>
          <p className="text-red-700">Vous n'avez pas les permissions nécessaires pour accéder au planning.</p>
          <div className="mt-4 text-sm text-red-600">
            <p>Rôle actuel : {user?.role || 'Non défini'}</p>
            <p>Utilisateur : {user?.username || user?.email || 'Non connecté'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mon Planning</h1>
          <p className="text-gray-600">Gérez vos consultations et rendez-vous</p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Boutons de vue */}
          <div className="bg-white border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setView('day')}
              className={`px-3 py-2 text-sm rounded-md transition-colors ${
                view === 'day'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Jour
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-3 py-2 text-sm rounded-md transition-colors ${
                view === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Semaine
            </button>
          </div>

          <button
            onClick={() => setShowNewAppointment(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nouveau RDV</span>
          </button>
        </div>
      </div>

      {/* Navigation de dates */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateDate(-1)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {view === 'day'
                  ? currentDate.toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : `Semaine du ${currentDate.toLocaleDateString('fr-FR')}`
                }
              </h2>
              <p className="text-sm text-gray-500">
                {dayAppointments.length} rendez-vous programmés
              </p>
            </div>

            <button
              onClick={() => navigateDate(1)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => {
              setCurrentDate(new Date());
              setSelectedDate(new Date());
            }}
            className="flex items-center px-3 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Aujourd'hui
          </button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">RDV confirmés</p>
              <p className="text-2xl font-bold text-blue-600">
                {dayAppointments.filter(apt => apt.status === 'confirmed').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">En attente</p>
              <p className="text-2xl font-bold text-yellow-600">
                {dayAppointments.filter(apt => apt.status === 'waiting').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Terminés</p>
              <p className="text-2xl font-bold text-green-600">
                {dayAppointments.filter(apt => apt.status === 'completed').length}
              </p>
            </div>
            <Stethoscope className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Créneaux libres</p>
              <p className="text-2xl font-bold text-gray-600">
                {timeSlots.filter(slot => !slot.isLunch && !getSlotStatus(slot).hasAppointment).length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Planning détaillé */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Planning détaillé</h3>
          <p className="text-gray-600 text-sm">Cliquez sur un créneau libre pour ajouter un rendez-vous</p>
        </div>

        <div className="p-6">
          <div className="space-y-2">
            {timeSlots.map((slot, index) => {
              if (slot.isLunch) {
                return (
                  <div key={index} className="flex items-center py-3">
                    <div className="w-16 text-sm text-gray-500 font-medium">
                      {slot.time}
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 text-center">
                        <span className="text-gray-600 font-medium">{slot.label}</span>
                      </div>
                    </div>
                  </div>
                );
              }

              const slotStatus = getSlotStatus(slot);

              return (
                <div key={index} className="flex items-center py-2 hover:bg-gray-50 rounded-lg">
                  <div className="w-16 text-sm text-gray-500 font-medium">
                    {slot.time}
                  </div>
                  <div className="flex-1 mx-4">
                    {slotStatus.hasAppointment ? (
                      <div className={`border rounded-lg p-4 ${getStatusColor(slotStatus.status)}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(slotStatus.status)}
                            <div>
                              <h4 className="font-medium">{slotStatus.appointment.patientName}</h4>
                              <div className="flex items-center space-x-4 text-sm opacity-90">
                                <span className="flex items-center">
                                  <Stethoscope className="w-3 h-3 mr-1" />
                                  {slotStatus.appointment.type}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {slotStatus.appointment.duration}min
                                </span>
                                <span className="flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {slotStatus.appointment.room}
                                </span>
                                {slotStatus.appointment.phone && (
                                  <span className="flex items-center">
                                    <Phone className="w-3 h-3 mr-1" />
                                    {slotStatus.appointment.patientPhone}
                                  </span>
                                )}
                              </div>
                              {slotStatus.appointment.notes && (
                                <p className="text-sm mt-1 opacity-80">{slotStatus.appointment.notes}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {slotStatus.appointment.status === 'confirmed' && (
                              <button
                                onClick={() => navigate('/medecin/consultations/nouvelle', {
                                  state: { appointmentId: slotStatus.appointment.id }
                                })}
                                className="p-2 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-white/50"
                                title="Commencer la consultation"
                              >
                                <Stethoscope className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-white/50"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 text-red-600 hover:text-red-800 rounded-lg hover:bg-white/50"
                              title="Annuler"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedTimeSlot(slot);
                          setShowNewAppointment(true);
                        }}
                        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <Plus className="w-4 h-4" />
                          <span className="text-sm font-medium">Ajouter un rendez-vous</span>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal nouveau RDV (placeholder) */}
      {showNewAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-lg w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Nouveau Rendez-vous</h2>
              <button
                onClick={() => {
                  setShowNewAppointment(false);
                  setSelectedTimeSlot(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="text-center text-gray-600">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="mb-2">Fonctionnalité en cours de développement</p>
                {selectedTimeSlot && (
                  <p className="text-sm text-blue-600">
                    Créneau sélectionné : {selectedTimeSlot.time}
                  </p>
                )}
                <button
                  onClick={() => {
                    setShowNewAppointment(false);
                    setSelectedTimeSlot(null);
                  }}
                  className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}