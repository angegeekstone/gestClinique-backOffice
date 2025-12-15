import { useState } from 'react';
import {
  Home,
  Users,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  Stethoscope,
  UserCheck,
  Pill,
  Activity,
  Menu,
  Building,
  Shield,
  CreditCard,
  Database,
  UserPlus,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../utils/cn';

const getMenuItemsForRole = (role, permissions) => {
  const baseItems = [
    {
      title: 'Dashboard',
      icon: Home,
      href: '/dashboard',
      roles: ['SUPER_ADMIN', 'ADMIN_CLINIQUE', 'MEDECIN', 'RECEPTION'],
      badge: 'Vue d\'ensemble',
      badgeColor: 'bg-blue-100 text-blue-800'
    }
  ];

  const roleSpecificItems = {
    SUPER_ADMIN: [
      {
        title: 'Gestion Cliniques',
        icon: Building,
        href: '/super-admin/cliniques',
        badge: 'TOUTES',
        badgeColor: 'bg-red-100 text-red-800',
        children: [
          { title: 'Toutes les cliniques', href: '/super-admin/cliniques', badge: 'Actif' },
          { title: 'Nouvelle clinique', href: '/super-admin/cliniques/nouvelle', badge: 'Créer' },
          { title: 'Abonnements', href: '/super-admin/abonnements', badge: 'Gérer' },
        ]
      },
      {
        title: 'Administration Système',
        icon: Shield,
        href: '/super-admin/system',
        badge: 'CONFIG',
        badgeColor: 'bg-orange-100 text-orange-800',
        children: [
          { title: 'Configuration globale', href: '/super-admin/system/config', badge: 'Actif' },
          { title: 'Logs système', href: '/super-admin/system/logs', badge: 'Vue' },
          { title: 'Maintenance', href: '/super-admin/system/maintenance', badge: 'Gérer' },
        ]
      },
      {
        title: 'Facturation',
        icon: CreditCard,
        href: '/super-admin/facturation',
        badge: 'BILLING',
        badgeColor: 'bg-green-100 text-green-800',
        children: [
          { title: 'Factures', href: '/super-admin/facturation/factures', badge: 'Vue' },
          { title: 'Paiements', href: '/super-admin/facturation/paiements', badge: 'Gérer' },
          { title: 'Abonnements', href: '/super-admin/facturation/abonnements', badge: 'Gérer' },
        ]
      },
      {
        title: 'Analytics Global',
        icon: Database,
        href: '/super-admin/analytics',
        badge: 'STATS',
        badgeColor: 'bg-purple-100 text-purple-800',
      }
    ],
    ADMIN_CLINIQUE: [
      {
        title: 'Gestion Utilisateurs',
        icon: UserCheck,
        href: '/admin-clinique/utilisateurs',
        badge: 'SA CLINIQUE',
        badgeColor: 'bg-purple-100 text-purple-800',
        children: [
          { title: 'Tous les utilisateurs', href: '/admin-clinique/utilisateurs', badge: 'Actif' },
          { title: 'Ajouter utilisateur', href: '/admin-clinique/utilisateurs/nouveau', badge: 'Créer' },
          { title: 'Rôles et permissions', href: '/admin-clinique/utilisateurs/roles', badge: 'Gérer' },
        ]
      },
      {
        title: 'Rapports Clinique',
        icon: BarChart3,
        href: '/admin-clinique/rapports',
        badge: 'STATS',
        badgeColor: 'bg-indigo-100 text-indigo-800',
        children: [
          { title: 'Statistiques', href: '/admin-clinique/rapports/stats', badge: 'Vue' },
          { title: 'Revenus', href: '/admin-clinique/rapports/revenus', badge: 'Vue' },
          { title: 'Performance', href: '/admin-clinique/rapports/performance', badge: 'Vue' },
        ]
      },
      {
        title: 'Finances',
        icon: DollarSign,
        href: '/admin-clinique/finances',
        badge: 'CAISSE',
        badgeColor: 'bg-green-100 text-green-800',
        children: [
          { title: 'Caisse', href: '/admin-clinique/finances/caisse', badge: 'Gérer' },
          { title: 'Facturation', href: '/admin-clinique/finances/facturation', badge: 'Gérer' },
          { title: 'Tarifs', href: '/admin-clinique/finances/tarifs', badge: 'Définir' },
        ]
      },
      {
        title: 'Paramètres Clinique',
        icon: Settings,
        href: '/admin-clinique/parametres',
        badge: 'CONFIG',
        badgeColor: 'bg-gray-100 text-gray-800',
        children: [
          { title: 'Informations générales', href: '/admin-clinique/parametres/general', badge: 'Actif' },
          { title: 'Configuration', href: '/admin-clinique/parametres/config', badge: 'Gérer' },
          { title: 'Sécurité', href: '/admin-clinique/parametres/securite', badge: 'Gérer' },
        ]
      }
    ],
    MEDECIN: [
      {
        title: 'Consultations',
        icon: Stethoscope,
        href: '/medecin/consultations',
        badge: 'SOINS',
        badgeColor: 'bg-blue-100 text-blue-800',
        children: [
          { title: 'Mes consultations', href: '/medecin/consultations', badge: 'Actif' },
          { title: 'Nouvelle consultation', href: '/medecin/consultations/nouvelle', badge: 'Créer' },
          { title: 'Historique', href: '/medecin/consultations/historique', badge: 'Vue' },
        ]
      },
      {
        title: 'Ordonnances',
        icon: Pill,
        href: '/medecin/ordonnances',
        badge: 'RX',
        badgeColor: 'bg-green-100 text-green-800',
        children: [
          { title: 'Créer ordonnance', href: '/medecin/ordonnances/nouvelle', badge: 'Actif' },
          { title: 'Mes ordonnances', href: '/medecin/ordonnances', badge: 'Actif' },
          { title: 'Modèles', href: '/medecin/ordonnances/modeles', badge: 'Gérer' },
        ]
      }
    ],
    RECEPTION: [
      {
        title: 'Patients',
        icon: Users,
        href: '/reception/patients',
        badge: 'GESTION',
        badgeColor: 'bg-blue-100 text-blue-800',
        children: [
          { title: 'Liste des patients', href: '/reception/patients', badge: 'Actif' },
          { title: 'Nouveau patient', href: '/reception/patients/nouveau', badge: 'Créer' },
          { title: 'Recherche', href: '/reception/patients/recherche', badge: 'Chercher' },
        ]
      },
      {
        title: 'Caisse',
        icon: DollarSign,
        href: '/reception/caisse',
        badge: 'PAIEMENTS',
        badgeColor: 'bg-green-100 text-green-800',
        children: [
          { title: 'Encaissements', href: '/reception/caisse/encaissements', badge: 'Actif' },
          { title: 'Historique', href: '/reception/caisse/historique', badge: 'Actif' },
          { title: 'Rapport journalier', href: '/reception/caisse/rapport', badge: 'Vue' },
        ]
      }
    ]
  };

  // Items communs pour certains rôles
  const commonItems = [
    {
      title: 'Patients',
      icon: Users,
      href: '/patients',
      roles: ['ADMIN_CLINIQUE', 'MEDECIN'],
      badge: 'DOSSIERS',
      badgeColor: 'bg-teal-100 text-teal-800',
      children: [
        { title: 'Liste des patients', href: '/patients', badge: 'Vue' },
        { title: 'Dossiers médicaux', href: '/patients/dossiers', badge: 'Médicaux' },
      ]
    },
    {
      title: 'Planning',
      icon: Calendar,
      href: '/planning',
      roles: ['ADMIN_CLINIQUE', 'MEDECIN', 'RECEPTION'],
      badge: 'RDV',
      badgeColor: 'bg-orange-100 text-orange-800'
    },
    {
      title: 'Documents',
      icon: FileText,
      href: '/documents',
      roles: ['ADMIN_CLINIQUE', 'MEDECIN'],
      badge: 'DOCS',
      badgeColor: 'bg-gray-100 text-gray-800'
    }
  ];

  return [
    ...baseItems,
    ...(roleSpecificItems[role] || []),
    ...commonItems.filter(item => item.roles?.includes(role))
  ];
};

const SidebarItem = ({ item, isOpen, activeItem, setActiveItem }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
    setActiveItem(item.href);
  };

  return (
    <div className="mb-1">
      <button
        onClick={handleClick}
        className={cn(
          "w-full flex items-center px-4 py-3 text-left text-sm font-medium transition-colors duration-200",
          "hover:bg-blue-50 hover:text-blue-700",
          activeItem === item.href
            ? "bg-blue-100 text-blue-700 border-r-2 border-blue-600"
            : "text-gray-700"
        )}
      >
        <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
        <div className={cn("flex-1 flex items-center", !isOpen && "hidden lg:flex")}>
          <span>{item.title}</span>
        </div>
        {hasChildren && (
          <div className={cn("ml-2", !isOpen && "hidden lg:block")}>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </div>
        )}
      </button>

      {hasChildren && isExpanded && (
        <div className={cn("ml-8 space-y-1", !isOpen && "hidden lg:block")}>
          {item.children.map((child) => (
            <button
              key={child.href}
              onClick={() => setActiveItem(child.href)}
              className={cn(
                "w-full text-left px-4 py-2 text-sm transition-colors duration-200",
                "hover:bg-gray-50 hover:text-blue-600",
                activeItem === child.href
                  ? "text-blue-600 font-medium"
                  : "text-gray-600"
              )}
            >
              <div className="flex items-center w-full">
                <span>{child.title}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Sidebar({ isOpen, toggleSidebar }) {
  const [activeItem, setActiveItem] = useState('/dashboard');
  const { user } = useAuth();
  const menuItems = getMenuItemsForRole(user?.role, user?.permissions);

  return (
    <>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-white shadow-lg transition-transform duration-300 transform",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "w-64"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className={cn("flex items-center", !isOpen && "justify-center w-full lg:justify-start")}>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <span className={cn("text-xl font-bold text-gray-800", !isOpen && "hidden lg:block")}>
                  GestClinique
                </span>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-1.5 rounded-md hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 py-4 overflow-y-auto">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.href}
                item={item}
                isOpen={isOpen}
                activeItem={activeItem}
                setActiveItem={setActiveItem}
              />
            ))}
          </nav>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}