import { useAuth } from '../../contexts/AuthContext';
import {
  Shield,
  Stethoscope,
  Users as UsersIcon,
  UserCheck,
  Check,
  X,
  Eye,
  Edit3,
  Trash2,
  Plus,
  Settings,
  BarChart3,
  DollarSign,
  Calendar,
  FileText,
  UserPlus
} from 'lucide-react';


const getRoleDetails = (ROLES) => {
  return [
    {
      key: ROLES.ADMIN_CLINIQUE,
      name: 'Administrateur Clinique',
      description: 'Gestion complète d\'une clinique et de ses utilisateurs',
      icon: Shield,
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      badge: 'ADMIN'
    },
    {
      key: ROLES.MEDECIN,
      name: 'Médecin',
      description: 'Gestion des consultations, ordonnances et dossiers patients',
      icon: Stethoscope,
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      badge: 'MÉDICAL'
    },
    {
      key: ROLES.RECEPTION,
      name: 'Réception',
      description: 'Gestion des patients, planning et paiements',
      icon: UsersIcon,
      color: 'bg-green-100 text-green-800 border-green-200',
      badge: 'ACCUEIL'
    }
  ];
};

export default function RolesAndPermissions() {
  const { PERMISSIONS, ROLES } = useAuth();

  // Importer dynamiquement les permissions depuis AuthContext
  const rolePermissions = {
    [ROLES.ADMIN_CLINIQUE]: [
      PERMISSIONS.MANAGE_CLINIC_USERS,
      PERMISSIONS.VIEW_CLINIC_REPORTS,
      PERMISSIONS.MANAGE_CLINIC_SETTINGS,
      PERMISSIONS.MANAGE_FINANCES,
      PERMISSIONS.VIEW_SCHEDULE,
      PERMISSIONS.VIEW_PATIENT_FILES
    ],
    [ROLES.MEDECIN]: [
      PERMISSIONS.MANAGE_CONSULTATIONS,
      PERMISSIONS.GENERATE_PRESCRIPTIONS,
      PERMISSIONS.VIEW_PATIENT_FILES,
      PERMISSIONS.VIEW_SCHEDULE
    ],
    [ROLES.RECEPTION]: [
      PERMISSIONS.MANAGE_PATIENTS,
      PERMISSIONS.MANAGE_PAYMENTS,
      PERMISSIONS.VIEW_SCHEDULE
    ]
  };

  const roles = getRoleDetails(ROLES);

  // Mapper les permissions depuis AuthContext
  const getPermissionInfo = (permissionKey) => {
    const permissionMap = {
      [PERMISSIONS.MANAGE_ALL_CLINIQUES]: { name: 'Gérer toutes les cliniques', description: 'Accès à toutes les cliniques du système' },
      [PERMISSIONS.MANAGE_SYSTEM_CONFIG]: { name: 'Configuration système', description: 'Modifier la configuration globale du système' },
      [PERMISSIONS.MANAGE_SUBSCRIPTIONS]: { name: 'Gérer les abonnements', description: 'Gestion des abonnements et facturation' },
      [PERMISSIONS.ACCESS_ALL_DATA]: { name: 'Accès à toutes les données', description: 'Accès complet à toutes les données du système' },
      [PERMISSIONS.MANAGE_CLINIC_USERS]: { name: 'Gérer les utilisateurs', description: 'Créer, modifier, supprimer des utilisateurs de la clinique' },
      [PERMISSIONS.VIEW_CLINIC_REPORTS]: { name: 'Voir les rapports', description: 'Accéder aux rapports et statistiques de la clinique' },
      [PERMISSIONS.MANAGE_CLINIC_SETTINGS]: { name: 'Paramètres clinique', description: 'Modifier la configuration de la clinique' },
      [PERMISSIONS.MANAGE_FINANCES]: { name: 'Gérer les finances', description: 'Accéder à la gestion financière et comptable' },
      [PERMISSIONS.MANAGE_CONSULTATIONS]: { name: 'Gérer les consultations', description: 'Créer, modifier et gérer les consultations' },
      [PERMISSIONS.GENERATE_PRESCRIPTIONS]: { name: 'Générer les ordonnances', description: 'Créer et imprimer des ordonnances médicales' },
      [PERMISSIONS.VIEW_PATIENT_FILES]: { name: 'Voir les dossiers patients', description: 'Accéder aux informations médicales des patients' },
      [PERMISSIONS.MANAGE_PATIENTS]: { name: 'Gérer les patients', description: 'Créer, modifier les informations des patients' },
      [PERMISSIONS.MANAGE_PAYMENTS]: { name: 'Gérer les paiements', description: 'Enregistrer et suivre les paiements' },
      [PERMISSIONS.VIEW_SCHEDULE]: { name: 'Voir le planning', description: 'Consulter les plannings et rendez-vous' }
    };
    return permissionMap[permissionKey] || { name: permissionKey, description: 'Permission système' };
  };

  // Obtenir toutes les permissions uniques
  const allPermissions = [...new Set(Object.values(rolePermissions).flat())];

  // Grouper les permissions par catégorie (uniquement celles utilisées dans votre système clinique)
  const categorizedPermissions = [
    {
      category: 'Gestion des Utilisateurs',
      icon: UserCheck,
      color: 'bg-purple-100 text-purple-800',
      permissions: [
        PERMISSIONS.MANAGE_CLINIC_USERS
      ].filter(p => allPermissions.includes(p))
    },
    {
      category: 'Consultations Médicales',
      icon: Stethoscope,
      color: 'bg-blue-100 text-blue-800',
      permissions: [
        PERMISSIONS.MANAGE_CONSULTATIONS,
        PERMISSIONS.GENERATE_PRESCRIPTIONS,
        PERMISSIONS.VIEW_PATIENT_FILES
      ].filter(p => allPermissions.includes(p))
    },
    {
      category: 'Gestion des Patients',
      icon: UsersIcon,
      color: 'bg-green-100 text-green-800',
      permissions: [
        PERMISSIONS.MANAGE_PATIENTS,
        PERMISSIONS.MANAGE_PAYMENTS,
        PERMISSIONS.VIEW_SCHEDULE
      ].filter(p => allPermissions.includes(p))
    },
    {
      category: 'Administration Clinique',
      icon: Settings,
      color: 'bg-orange-100 text-orange-800',
      permissions: [
        PERMISSIONS.VIEW_CLINIC_REPORTS,
        PERMISSIONS.MANAGE_CLINIC_SETTINGS,
        PERMISSIONS.MANAGE_FINANCES
      ].filter(p => allPermissions.includes(p))
    }
  ].filter(category => category.permissions.length > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Rôles et Permissions</h1>
        <p className="text-gray-600">Vue d'ensemble des rôles et permissions dans le système</p>
      </div>

      {/* Rôles Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-blue-600" />
          Rôles Définis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((role) => {
            const RoleIcon = role.icon;
            return (
              <div key={role.key} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${role.color.split(' ')[0]} ${role.color.split(' ')[1].replace('text', 'text')}`}>
                      <RoleIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{role.name}</h3>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${role.color} border`}>
                        {role.badge}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                <div className="text-xs text-gray-500">
                  {rolePermissions[role.key]?.length || 0} permissions assignées
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <UserCheck className="w-5 h-5 mr-2 text-blue-600" />
          Matrice des Permissions
        </h2>

        <div className="space-y-6">
          {categorizedPermissions.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <div key={category.category} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <CategoryIcon className="w-5 h-5 mr-2 text-gray-600" />
                  {category.category}
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 font-medium text-gray-700 min-w-64">Permission</th>
                        {roles.map(role => (
                          <th key={role.key} className="text-center py-2 font-medium text-gray-700 min-w-24">
                            {role.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {category.permissions.map((permissionKey) => {
                        const permissionInfo = getPermissionInfo(permissionKey);
                        return (
                          <tr key={permissionKey} className="border-b border-gray-100">
                            <td className="py-3">
                              <div>
                                <div className="font-medium text-gray-900">{permissionInfo.name}</div>
                                <div className="text-gray-500 text-xs">{permissionInfo.description}</div>
                              </div>
                            </td>
                            {roles.map(role => (
                              <td key={role.key} className="py-3 text-center">
                                {rolePermissions[role.key]?.includes(permissionKey) ? (
                                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                                ) : (
                                  <X className="w-5 h-5 text-gray-300 mx-auto" />
                                )}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roles.map((role) => {
          const RoleIcon = role.icon;
          return (
            <div key={role.key} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{role.name}</p>
                  <p className="text-xl font-bold text-gray-900">
                    {rolePermissions[role.key]?.length || 0}
                  </p>
                  <p className="text-xs text-gray-500">permissions</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${role.color.split(' ')[0]} ${role.color.split(' ')[1].replace('text', 'text')}`}>
                  <RoleIcon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Information</h3>
        <p className="text-blue-800 text-sm">
          Cette page présente une vue en lecture seule des rôles et permissions configurés dans le système.
          Les modifications des rôles et permissions nécessitent une intervention technique.
        </p>
      </div>
    </div>
  );
}