import { useState } from 'react';
import {
  UserPlus,
  Search,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Edit3,
  Eye,
  CreditCard,
  Clock,
  User,
  AlertCircle
} from 'lucide-react';

const patients = [
  {
    id: 1,
    name: 'Marie Dubois',
    email: 'marie.dubois@email.com',
    phone: '+33 6 12 34 56 78',
    address: '123 Rue de la Paix, Paris',
    birthDate: '1990-05-15',
    lastVisit: '2024-12-10',
    nextAppointment: '2024-12-15 14:30',
    status: 'active',
    balance: 150,
    medicalNumber: 'P001234',
    insuranceType: 'Sécurité Sociale'
  },
  {
    id: 2,
    name: 'Jean Martin',
    email: 'jean.martin@email.com',
    phone: '+33 6 23 45 67 89',
    address: '456 Avenue des Champs, Lyon',
    birthDate: '1978-11-22',
    lastVisit: '2024-12-08',
    nextAppointment: null,
    status: 'active',
    balance: -75,
    medicalNumber: 'P001235',
    insuranceType: 'Mutuelle'
  },
  {
    id: 3,
    name: 'Sophie Bernard',
    email: 'sophie.bernard@email.com',
    phone: '+33 6 34 56 78 90',
    address: '789 Rue de la Santé, Marseille',
    birthDate: '1995-03-08',
    lastVisit: '2024-11-25',
    nextAppointment: '2024-12-14 10:00',
    status: 'inactive',
    balance: 0,
    medicalNumber: 'P001236',
    insuranceType: 'CMU'
  },
  {
    id: 4,
    name: 'Pierre Lefebvre',
    email: 'pierre.lefebvre@email.com',
    phone: '+33 6 45 67 89 01',
    address: '321 Boulevard Médical, Toulouse',
    birthDate: '1972-09-12',
    lastVisit: '2024-12-11',
    nextAppointment: '2024-12-18 16:00',
    status: 'active',
    balance: 250,
    medicalNumber: 'P001237',
    insuranceType: 'Sécurité Sociale'
  }
];

const getStatusColor = (status) => {
  return status === 'active'
    ? 'bg-green-100 text-green-800 border-green-200'
    : 'bg-gray-100 text-gray-800 border-gray-200';
};

const getBalanceColor = (balance) => {
  if (balance > 0) return 'text-green-600';
  if (balance < 0) return 'text-red-600';
  return 'text-gray-600';
};

const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

export default function PatientsManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.phone.includes(searchTerm) ||
                         patient.medicalNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || patient.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const activePatients = patients.filter(p => p.status === 'active').length;
  const totalBalance = patients.reduce((sum, p) => sum + p.balance, 0);
  const upcomingAppointments = patients.filter(p => p.nextAppointment).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Patients</h1>
          <p className="text-gray-600">Gérez les patients et leurs informations</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <UserPlus className="w-5 h-5" />
          <span>Nouveau Patient</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Patients Actifs</p>
              <p className="text-2xl font-bold text-gray-900">{activePatients}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Solde Total</p>
              <p className={`text-2xl font-bold ${getBalanceColor(totalBalance)}`}>
                {totalBalance > 0 ? '+' : ''}{totalBalance}€
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">RDV Programmés</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingAppointments}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
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
              placeholder="Rechercher par nom, email, téléphone ou numéro médical..."
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
            <option value="all">Tous les patients</option>
            <option value="active">Patients actifs</option>
            <option value="inactive">Patients inactifs</option>
          </select>
        </div>

        <div className="space-y-4">
          {filteredPatients.map((patient) => (
            <div key={patient.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                      <span className="text-sm text-gray-500">
                        {calculateAge(patient.birthDate)} ans
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(patient.status)}`}>
                        {patient.status === 'active' ? 'Actif' : 'Inactif'}
                      </span>
                      {patient.balance < 0 && (
                        <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Impayé
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{patient.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{patient.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{patient.address}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span className="font-medium">N°:</span>
                        <span>{patient.medicalNumber}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500">Dernière visite</p>
                        <p className="font-medium text-sm">
                          {new Date(patient.lastVisit).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Prochain RDV</p>
                        <p className="font-medium text-sm">
                          {patient.nextAppointment
                            ? new Date(patient.nextAppointment).toLocaleDateString()
                            : 'Aucun'
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Assurance</p>
                        <p className="font-medium text-sm">{patient.insuranceType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Solde</p>
                        <p className={`font-medium text-sm ${getBalanceColor(patient.balance)}`}>
                          {patient.balance > 0 ? '+' : ''}{patient.balance}€
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>RDV</span>
                  </button>
                  <button className="px-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 text-sm flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>Voir</span>
                  </button>
                  <button className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm flex items-center space-x-1">
                    <Edit3 className="w-4 h-4" />
                    <span>Modifier</span>
                  </button>
                  {patient.balance !== 0 && (
                    <button className="px-4 py-2 text-green-600 border border-green-200 rounded-lg hover:bg-green-50 text-sm flex items-center space-x-1">
                      <CreditCard className="w-4 h-4" />
                      <span>Paiement</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun patient trouvé</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>
    </div>
  );
}