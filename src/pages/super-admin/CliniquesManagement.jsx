import { useState } from 'react';
import {
  Building,
  Plus,
  Search,
  MoreVertical,
  Users,
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const cliniques = [
  {
    id: 1,
    name: 'Clinique Centrale',
    address: '123 Rue de la Santé, Paris',
    phone: '+33 1 23 45 67 89',
    email: 'contact@clinique-centrale.fr',
    admin: 'Dr. Marie Dupont',
    users: 25,
    patients: 1834,
    status: 'active',
    subscription: 'Premium',
    created: '2023-01-15',
    lastPayment: '2024-11-01'
  },
  {
    id: 2,
    name: 'Clinique du Nord',
    address: '456 Avenue Médicale, Lille',
    phone: '+33 3 20 30 40 50',
    email: 'contact@clinique-nord.fr',
    admin: 'Dr. Jean Martin',
    users: 18,
    patients: 987,
    status: 'active',
    subscription: 'Standard',
    created: '2023-03-20',
    lastPayment: '2024-10-15'
  },
  {
    id: 3,
    name: 'Clinique du Sud',
    address: '789 Rue de la Médecine, Marseille',
    phone: '+33 4 91 23 45 67',
    email: 'contact@clinique-sud.fr',
    admin: 'Dr. Sophie Bernard',
    users: 12,
    patients: 654,
    status: 'suspended',
    subscription: 'Standard',
    created: '2023-06-10',
    lastPayment: '2024-08-01'
  }
];

const getStatusColor = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'suspended':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'active':
      return <CheckCircle className="w-4 h-4" />;
    case 'suspended':
      return <XCircle className="w-4 h-4" />;
    case 'pending':
      return <AlertCircle className="w-4 h-4" />;
    default:
      return null;
  }
};

export default function CliniquesManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredCliniques = cliniques.filter(clinique => {
    const matchesSearch = clinique.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         clinique.admin.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || clinique.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Cliniques</h1>
          <p className="text-gray-600">Gérez toutes les cliniques du système</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Nouvelle Clinique</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par nom de clinique ou administrateur..."
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
            <option value="suspended">Suspendues</option>
            <option value="pending">En attente</option>
          </select>
        </div>

        <div className="grid gap-6">
          {filteredCliniques.map((clinique) => (
            <div key={clinique.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building className="w-8 h-8 text-blue-600" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{clinique.name}</h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(clinique.status)}`}>
                        {getStatusIcon(clinique.status)}
                        <span className="ml-1 capitalize">{clinique.status}</span>
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                        {clinique.subscription}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{clinique.address}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{clinique.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{clinique.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>Admin: {clinique.admin}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">{clinique.users}</div>
                        <div className="text-xs text-gray-500">Utilisateurs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">{clinique.patients.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Patients</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">{new Date(clinique.created).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500">Créée le</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">{new Date(clinique.lastPayment).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500">Dernier paiement</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-4 pt-4 border-t border-gray-100">
                <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium">
                  Voir détails
                </button>
                <button className="px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg text-sm font-medium">
                  Accéder à la clinique
                </button>
                {clinique.status === 'active' && (
                  <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium">
                    Suspendre
                  </button>
                )}
                {clinique.status === 'suspended' && (
                  <button className="px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg text-sm font-medium">
                    Réactiver
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredCliniques.length === 0 && (
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune clinique trouvée</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>
    </div>
  );
}