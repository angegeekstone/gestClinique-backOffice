import { useState } from 'react';
import {
  UserPlus,
  Search,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  Shield,
  User,
  Stethoscope,
  Users as UsersIcon,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';

const users = [
  {
    id: 1,
    name: 'Dr. Marie Dupont',
    email: 'marie.dupont@clinique.fr',
    phone: '+33 6 12 34 56 78',
    role: 'MEDECIN',
    status: 'active',
    lastLogin: '2024-12-12T10:30:00',
    created: '2023-01-15',
    speciality: 'Cardiologie'
  },
  {
    id: 2,
    name: 'Sophie Bernard',
    email: 'sophie.bernard@clinique.fr',
    phone: '+33 6 23 45 67 89',
    role: 'RECEPTION',
    status: 'active',
    lastLogin: '2024-12-12T09:15:00',
    created: '2023-02-10',
    speciality: null
  },
  {
    id: 3,
    name: 'Dr. Jean Martin',
    email: 'jean.martin@clinique.fr',
    phone: '+33 6 34 56 78 90',
    role: 'MEDECIN',
    status: 'active',
    lastLogin: '2024-12-11T16:45:00',
    created: '2023-03-20',
    speciality: 'Médecine générale'
  },
  {
    id: 4,
    name: 'Pierre Lefebvre',
    email: 'pierre.lefebvre@clinique.fr',
    phone: '+33 6 45 67 89 01',
    role: 'RECEPTION',
    status: 'inactive',
    lastLogin: '2024-12-05T14:20:00',
    created: '2023-08-15',
    speciality: null
  }
];

const getRoleInfo = (role) => {
  const roleMap = {
    MEDECIN: {
      label: 'Médecin',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: Stethoscope
    },
    RECEPTION: {
      label: 'Réception',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: UsersIcon
    },
    ADMIN_CLINIQUE: {
      label: 'Admin Clinique',
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      icon: Shield
    }
  };
  return roleMap[role] || { label: role, color: 'bg-gray-100 text-gray-800 border-gray-200', icon: User };
};

const getStatusColor = (status) => {
  return status === 'active'
    ? 'bg-green-100 text-green-800 border-green-200'
    : 'bg-red-100 text-red-800 border-red-200';
};

const getStatusIcon = (status) => {
  return status === 'active'
    ? <CheckCircle className="w-4 h-4" />
    : <XCircle className="w-4 h-4" />;
};

export default function UsersManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <p className="text-gray-600">Gérez les utilisateurs de votre clinique</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <UserPlus className="w-5 h-5" />
          <span>Nouvel Utilisateur</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="all">Tous les rôles</option>
            <option value="MEDECIN">Médecins</option>
            <option value="RECEPTION">Réception</option>
            <option value="ADMIN_CLINIQUE">Administrateurs</option>
          </select>
          <select
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Utilisateur</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Contact</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Rôle</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Statut</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Dernière connexion</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const roleInfo = getRoleInfo(user.role);
                const RoleIcon = roleInfo.icon;

                return (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          {user.speciality && (
                            <div className="text-sm text-gray-500">{user.speciality}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {user.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${roleInfo.color}`}>
                        <RoleIcon className="w-4 h-4 mr-1" />
                        {roleInfo.label}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(user.status)}`}>
                        {getStatusIcon(user.status)}
                        <span className="ml-1 capitalize">{user.status}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-600">
                        {new Date(user.lastLogin).toLocaleDateString()} à{' '}
                        {new Date(user.lastLogin).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Utilisateurs</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Médecins</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'MEDECIN').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Personnel Réception</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === 'RECEPTION').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}