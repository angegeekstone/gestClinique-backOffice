import { Calendar, Clock, User, MapPin } from 'lucide-react';

const appointments = [
  {
    id: 1,
    patient: "Marie Dupont",
    time: "09:30",
    type: "Consultation générale",
    room: "Salle 1",
    status: "confirmed",
    duration: "30 min"
  },
  {
    id: 2,
    patient: "Jean Martin",
    time: "10:00",
    type: "Suivi cardiologie",
    room: "Salle 3",
    status: "confirmed",
    duration: "45 min"
  },
  {
    id: 3,
    patient: "Sophie Bernard",
    time: "10:45",
    type: "Contrôle post-op",
    room: "Salle 2",
    status: "pending",
    duration: "30 min"
  },
  {
    id: 4,
    patient: "Pierre Lefebvre",
    time: "11:30",
    type: "Consultation urgente",
    room: "Salle 1",
    status: "urgent",
    duration: "20 min"
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'urgent':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'confirmed':
      return 'Confirmé';
    case 'pending':
      return 'En attente';
    case 'urgent':
      return 'Urgent';
    default:
      return 'Inconnu';
  }
};

export default function UpcomingAppointments() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Prochains rendez-vous</h3>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          <span>Aujourd'hui</span>
        </div>
      </div>

      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="flex items-center space-x-4 p-4 rounded-lg border border-gray-100 hover:shadow-sm transition-shadow">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900">{appointment.patient}</h4>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                  {getStatusText(appointment.status)}
                </span>
              </div>

              <p className="text-sm text-gray-600 mt-1">{appointment.type}</p>

              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{appointment.time} ({appointment.duration})</span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span>{appointment.room}</span>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Voir
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
          Voir tous les rendez-vous du jour
        </button>
      </div>
    </div>
  );
}