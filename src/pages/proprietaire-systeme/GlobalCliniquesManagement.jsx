import { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Users,
  MapPin,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const mockCliniques = [
  {
    id: 1,
    nom: 'Clinique Moderne',
    adresse: '123 Avenue de la Santé, Casablanca',
    telephone: '+212 522 123 456',
    email: 'contact@cliniquemoderne.ma',
    directeur: 'Dr. Amina Benali',
    status: 'active',
    abonnement: 'Premium',
    utilisateurs: 45,
    dateCreation: '2023-01-15',
    dernierPaiement: '2024-01-01',
    chiffreAffaires: '1,250,000 MAD'
  },
  {
    id: 2,
    nom: 'Centre Médical Atlas',
    adresse: '456 Boulevard Hassan II, Rabat',
    telephone: '+212 537 987 654',
    email: 'info@centreatlas.ma',
    directeur: 'Dr. Mohammed Alami',
    status: 'active',
    abonnement: 'Standard',
    utilisateurs: 28,
    dateCreation: '2023-03-20',
    dernierPaiement: '2024-01-01',
    chiffreAffaires: '850,000 MAD'
  },
  {
    id: 3,
    nom: 'Clinique Al Manar',
    adresse: '789 Rue de Fès, Meknes',
    telephone: '+212 535 456 789',
    email: 'contact@almanar.ma',
    directeur: 'Dr. Fatima Zahra',
    status: 'suspendu',
    abonnement: 'Basic',
    utilisateurs: 12,
    dateCreation: '2023-06-10',
    dernierPaiement: '2023-11-01',
    chiffreAffaires: '320,000 MAD'
  }
];

const StatusBadge = ({ status }) => {
  const config = {
    active: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Actif' },
    suspendu: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Suspendu' },
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, text: 'En attente' }
  };

  const { color, icon: Icon, text } = config[status] || config.pending;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {text}
    </span>
  );
};

export default function GlobalCliniquesManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('tous');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredCliniques = mockCliniques.filter(clinique => {
    const matchesSearch = clinique.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         clinique.directeur.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'tous' || clinique.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: mockCliniques.length,
    active: mockCliniques.filter(c => c.status === 'active').length,
    suspendu: mockCliniques.filter(c => c.status === 'suspendu').length,
    totalUtilisateurs: mockCliniques.reduce((sum, c) => sum + c.utilisateurs, 0)
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion Globale des Cliniques</h1>
            <p className="text-gray-600 mt-1">Créer et gérer toutes les cliniques du système</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Nouvelle Clinique</span>
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Cliniques</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cliniques Actives</p>
              <p className="text-3xl font-bold text-green-600">{stats.active}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Suspendues</p>
              <p className="text-3xl font-bold text-red-600">{stats.suspendu}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Utilisateurs</p>
              <p className="text-3xl font-bold text-purple-600">{stats.totalUtilisateurs}</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une clinique..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="tous">Tous les statuts</option>
                <option value="active">Actif</option>
                <option value="suspendu">Suspendu</option>
                <option value="pending">En attente</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des cliniques */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clinique
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Directeur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Abonnement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateurs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCliniques.map((clinique) => (
                <tr key={clinique.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{clinique.nom}</div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {clinique.adresse}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{clinique.directeur}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Depuis {new Date(clinique.dateCreation).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {clinique.telephone}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <Mail className="w-4 h-4 mr-1" />
                      {clinique.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={clinique.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      clinique.abonnement === 'Premium' ? 'bg-purple-100 text-purple-800' :
                      clinique.abonnement === 'Standard' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {clinique.abonnement}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {clinique.utilisateurs}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-800">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}