import { User, Calendar, Clock } from 'lucide-react';

const recentPatients = [
  {
    id: 1,
    name: "Marie Dupont",
    age: 34,
    lastVisit: "Aujourd'hui 10:30",
    status: "En consultation",
    avatar: null
  },
  {
    id: 2,
    name: "Jean Martin",
    age: 45,
    lastVisit: "Hier 15:20",
    status: "Suivi",
    avatar: null
  },
  {
    id: 3,
    name: "Sophie Bernard",
    age: 29,
    lastVisit: "Il y a 2 jours",
    status: "Terminé",
    avatar: null
  },
  {
    id: 4,
    name: "Pierre Lefebvre",
    age: 52,
    lastVisit: "Il y a 3 jours",
    status: "Suivi",
    avatar: null
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'En consultation':
      return 'bg-green-100 text-green-800';
    case 'Suivi':
      return 'bg-blue-100 text-blue-800';
    case 'Terminé':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function RecentPatients() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Patients récents</h3>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Voir tout
        </button>
      </div>

      <div className="space-y-4">
        {recentPatients.map((patient) => (
          <div key={patient.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-blue-600" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{patient.name}</p>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <Calendar className="w-3 h-3 mr-1" />
                <span>{patient.age} ans</span>
                <span className="mx-2">•</span>
                <Clock className="w-3 h-3 mr-1" />
                <span>{patient.lastVisit}</span>
              </div>
            </div>

            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
              {patient.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}