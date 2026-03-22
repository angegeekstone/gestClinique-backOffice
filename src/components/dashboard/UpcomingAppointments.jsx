import { Calendar, Clock, User, MapPin, Loader, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService.js';

const getStatusColor = (status) => {
  switch (status) {
    case 'confirmed':
    case 'CONFIRMED':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'pending':
    case 'PENDING':
    case 'SCHEDULED':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'urgent':
    case 'URGENT':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'CANCELLED':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-blue-100 text-blue-800 border-blue-200';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'confirmed':
    case 'CONFIRMED':
      return 'Confirmé';
    case 'pending':
    case 'PENDING':
    case 'SCHEDULED':
      return 'En attente';
    case 'urgent':
    case 'URGENT':
      return 'Urgent';
    case 'CANCELLED':
      return 'Annulé';
    default:
      return status || 'Inconnu';
  }
};

const formatTime = (timeString) => {
  if (!timeString) return '';

  try {
    // Si c'est un timestamp complet
    if (timeString.includes('T')) {
      return new Date(timeString).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    // Si c'est juste l'heure
    return timeString;
  } catch {
    return timeString;
  }
};

export default function UpcomingAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUpcomingAppointments();
  }, []);

  const fetchUpcomingAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const today = new Date().toISOString().split('T')[0];
      const appointmentsData = await dashboardService.getUpcomingAppointments(today, 4);
      setAppointments(appointmentsData || []);
    } catch (err) {
      console.error('Erreur lors du chargement des RDV à venir:', err);
      setError('Erreur de chargement');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <Loader className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-gray-600">Chargement des rendez-vous...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Prochains rendez-vous</h3>
        <div className="flex items-center space-x-2">
          {error && (
            <div className="flex items-center text-orange-600 text-xs">
              <AlertCircle className="w-3 h-3 mr-1" />
              <span>Erreur</span>
            </div>
          )}
          <button
            onClick={fetchUpcomingAppointments}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Actualiser
          </button>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            <span>Aujourd'hui</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {appointments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Aucun rendez-vous prévu</p>
          </div>
        ) : (
          appointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center space-x-4 p-4 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">
                    {appointment.patientName ||
                     (appointment.patient ?
                       (appointment.patient.firstName && appointment.patient.lastName ?
                         `${appointment.patient.firstName} ${appointment.patient.lastName}` :
                         appointment.patient.name) :
                       'Patient inconnu')}
                  </h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                    {getStatusText(appointment.status)}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mt-1">
                  {appointment.type || appointment.consultationType || appointment.reason || 'Consultation'}
                </p>

                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>
                      {formatTime(appointment.time || appointment.appointmentTime || appointment.startTime)}
                      {appointment.duration && ` (${appointment.duration})`}
                    </span>
                  </div>
                  {(appointment.room || appointment.location) && (
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span>{appointment.room || appointment.location}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0">
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Voir
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
          Voir tous les rendez-vous du jour
        </button>
      </div>
    </div>
  );
}