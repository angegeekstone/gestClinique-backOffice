import { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit3
} from 'lucide-react';

const appointments = [
  {
    id: 1,
    time: '08:30',
    duration: 30,
    patient: { name: 'Marie Dubois', phone: '+33 6 12 34 56 78', email: 'marie.dubois@email.com' },
    doctor: 'Dr. Martin',
    type: 'Consultation générale',
    status: 'confirmed',
    notes: ''
  },
  {
    id: 2,
    time: '09:00',
    duration: 45,
    patient: { name: 'Jean Martin', phone: '+33 6 23 45 67 89', email: 'jean.martin@email.com' },
    doctor: 'Dr. Bernard',
    type: 'Cardiologie',
    status: 'confirmed',
    notes: 'Patient arrive avec analyses'
  },
  {
    id: 3,
    time: '09:45',
    duration: 30,
    patient: { name: 'Sophie Bernard', phone: '+33 6 34 56 78 90', email: 'sophie.bernard@email.com' },
    doctor: 'Dr. Martin',
    type: 'Consultation urgente',
    status: 'pending',
    notes: ''
  },
  {
    id: 4,
    time: '10:30',
    duration: 30,
    patient: { name: 'Pierre Lefebvre', phone: '+33 6 45 67 89 01', email: 'pierre.lefebvre@email.com' },
    doctor: 'Dr. Dubois',
    type: 'Pédiatrie',
    status: 'confirmed',
    notes: 'Suivi vaccination'
  },
  {
    id: 5,
    time: '11:00',
    duration: 30,
    patient: { name: 'Anne Moreau', phone: '+33 6 56 78 90 12', email: 'anne.moreau@email.com' },
    doctor: 'Dr. Martin',
    type: 'Consultation générale',
    status: 'cancelled',
    notes: 'Patient annulé ce matin'
  }
];

const doctors = [
  { id: 1, name: 'Dr. Martin', specialty: 'Médecine générale', color: '#3B82F6' },
  { id: 2, name: 'Dr. Bernard', specialty: 'Cardiologie', color: '#10B981' },
  { id: 3, name: 'Dr. Dubois', specialty: 'Pédiatrie', color: '#8B5CF6' }
];

const timeSlots = [];
for (let hour = 8; hour < 18; hour++) {
  for (let minute = 0; minute < 60; minute += 30) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
  }
}

const getStatusInfo = (status) => {
  const statusMap = {
    confirmed: { label: 'Confirmé', color: 'text-green-800 bg-green-100', icon: CheckCircle },
    pending: { label: 'En attente', color: 'text-yellow-800 bg-yellow-100', icon: AlertCircle },
    cancelled: { label: 'Annulé', color: 'text-red-800 bg-red-100', icon: XCircle },
    completed: { label: 'Terminé', color: 'text-gray-800 bg-gray-100', icon: CheckCircle }
  };
  return statusMap[status] || statusMap.pending;
};

export default function ScheduleManager() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewAppointment, setShowNewAppointment] = useState(false);

  const [newAppointment, setNewAppointment] = useState({
    date: selectedDate,
    time: '09:00',
    duration: 30,
    patient: '',
    doctor: '',
    type: 'Consultation générale',
    notes: ''
  });

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.patient.phone.includes(searchTerm);
    const matchesDoctor = selectedDoctor === 'all' || appointment.doctor === selectedDoctor;
    return matchesSearch && matchesDoctor;
  });

  const getDoctorColor = (doctorName) => {
    const doctor = doctors.find(d => d.name === doctorName);
    return doctor ? doctor.color : '#6B7280';
  };

  const formatTime = (time) => {
    return new Date(`2024-01-01T${time}:00`).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateEndTime = (startTime, duration) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endMinutes = minutes + duration;
    const endHours = hours + Math.floor(endMinutes / 60);
    const finalMinutes = endMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${finalMinutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Planning des Rendez-vous</h1>
          <p className="text-gray-600">Gérez les rendez-vous et consultations</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            {viewMode === 'list' ? 'Vue calendrier' : 'Vue liste'}
          </button>
          <button
            onClick={() => setShowNewAppointment(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nouveau RDV</span>
          </button>
        </div>
      </div>

      {/* Nouveau rendez-vous modal */}
      {showNewAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Nouveau Rendez-vous</h3>
              <button
                onClick={() => setShowNewAppointment(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient
                </label>
                <input
                  type="text"
                  value={newAppointment.patient}
                  onChange={(e) => setNewAppointment({ ...newAppointment, patient: e.target.value })}
                  placeholder="Nom du patient"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Médecin
                </label>
                <select
                  value={newAppointment.doctor}
                  onChange={(e) => setNewAppointment({ ...newAppointment, doctor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner un médecin</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.name}>
                      {doctor.name} - {doctor.specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={newAppointment.date}
                  onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heure
                </label>
                <select
                  value={newAppointment.time}
                  onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>{formatTime(time)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée (minutes)
                </label>
                <select
                  value={newAppointment.duration}
                  onChange={(e) => setNewAppointment({ ...newAppointment, duration: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 heure</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de consultation
                </label>
                <select
                  value={newAppointment.type}
                  onChange={(e) => setNewAppointment({ ...newAppointment, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Consultation générale">Consultation générale</option>
                  <option value="Consultation spécialisée">Consultation spécialisée</option>
                  <option value="Consultation urgente">Consultation urgente</option>
                  <option value="Suivi">Suivi</option>
                  <option value="Contrôle">Contrôle</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                rows={3}
                value={newAppointment.notes}
                onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                placeholder="Notes additionnelles..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowNewAppointment(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  console.log('Nouveau RDV:', newAppointment);
                  setShowNewAppointment(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Créer le RDV
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filtres */}
        <div className="lg:w-80">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Médecin
              </label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les médecins</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.name}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recherche
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Patient ou téléphone..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Légende médecins</h4>
              <div className="space-y-2">
                {doctors.map((doctor) => (
                  <div key={doctor.id} className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: doctor.color }}
                    ></div>
                    <span className="text-sm text-gray-700">{doctor.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Liste des rendez-vous */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Rendez-vous du {new Date(selectedDate).toLocaleDateString('fr-FR')}
              </h3>
              <div className="text-sm text-gray-600">
                {filteredAppointments.length} rendez-vous
              </div>
            </div>

            <div className="space-y-4">
              {filteredAppointments
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((appointment) => {
                  const statusInfo = getStatusInfo(appointment.status);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className="flex flex-col items-center">
                            <div
                              className="w-4 h-4 rounded-full mb-1"
                              style={{ backgroundColor: getDoctorColor(appointment.doctor) }}
                            ></div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatTime(appointment.time)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {appointment.duration}min
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-semibold text-gray-900">{appointment.patient.name}</h4>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusInfo.label}
                              </span>
                            </div>

                            <div className="text-sm text-gray-600 space-y-1">
                              <p><strong>Médecin:</strong> {appointment.doctor}</p>
                              <p><strong>Type:</strong> {appointment.type}</p>
                              <div className="flex items-center space-x-4">
                                <span className="flex items-center">
                                  <Phone className="w-3 h-3 mr-1" />
                                  {appointment.patient.phone}
                                </span>
                              </div>
                              {appointment.notes && (
                                <p><strong>Notes:</strong> {appointment.notes}</p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {filteredAppointments.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun rendez-vous trouvé</h3>
                <p className="text-gray-500">Aucun rendez-vous prévu pour cette date</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}