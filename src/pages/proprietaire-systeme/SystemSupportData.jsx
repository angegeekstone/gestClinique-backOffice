import { useState } from 'react';
import {
  Database,
  Search,
  Filter,
  Download,
  Eye,
  Users,
  Building2,
  Activity,
  Calendar,
  FileText,
  AlertTriangle,
  TrendingUp,
  Shield,
  Clock,
  Zap,
  HardDrive
} from 'lucide-react';

const mockSystemData = {
  overview: {
    totalCliniques: 156,
    totalUtilisateurs: 3420,
    consultationsTotal: 45678,
    consultationsMois: 2834,
    activiteDernieres24h: 892,
    espaceDiskUtilise: '2.4 TB',
    chargeServeur: 67
  },
  databases: [
    {
      name: 'gestclinique_main',
      size: '1.2 GB',
      status: 'healthy',
      lastBackup: '2024-01-15 03:00:00',
      tables: 45,
      records: 1250000
    },
    {
      name: 'gestclinique_logs',
      size: '800 MB',
      status: 'healthy',
      lastBackup: '2024-01-15 03:00:00',
      tables: 8,
      records: 850000
    },
    {
      name: 'gestclinique_analytics',
      size: '450 MB',
      status: 'warning',
      lastBackup: '2024-01-14 03:00:00',
      tables: 12,
      records: 320000
    }
  ],
  recentActivities: [
    {
      id: 1,
      type: 'clinique_created',
      message: 'Nouvelle clinique "Centre Médical Oasis" créée',
      timestamp: '2024-01-15 14:30:00',
      user: 'System Admin',
      severity: 'info'
    },
    {
      id: 2,
      type: 'user_login_failure',
      message: 'Échec de connexion multiple détecté pour user ID: 1245',
      timestamp: '2024-01-15 14:25:00',
      user: 'Security System',
      severity: 'warning'
    },
    {
      id: 3,
      type: 'backup_completed',
      message: 'Sauvegarde automatique terminée avec succès',
      timestamp: '2024-01-15 03:00:00',
      user: 'Backup System',
      severity: 'success'
    }
  ]
};

const StatusBadge = ({ status }) => {
  const config = {
    healthy: { color: 'bg-green-100 text-green-800', text: 'Sain' },
    warning: { color: 'bg-yellow-100 text-yellow-800', text: 'Attention' },
    error: { color: 'bg-red-100 text-red-800', text: 'Erreur' }
  };

  const { color, text } = config[status] || config.error;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {text}
    </span>
  );
};

const SeverityBadge = ({ severity }) => {
  const config = {
    success: { color: 'bg-green-100 text-green-800', text: 'Succès' },
    info: { color: 'bg-blue-100 text-blue-800', text: 'Info' },
    warning: { color: 'bg-yellow-100 text-yellow-800', text: 'Attention' },
    error: { color: 'bg-red-100 text-red-800', text: 'Erreur' }
  };

  const { color, text } = config[severity] || config.info;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {text}
    </span>
  );
};

export default function SystemSupportData() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: Activity },
    { id: 'databases', label: 'Bases de données', icon: Database },
    { id: 'activities', label: 'Activités récentes', icon: Clock },
    { id: 'exports', label: 'Exports', icon: Download }
  ];

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Cliniques</p>
            <p className="text-3xl font-bold text-blue-600">{mockSystemData.overview.totalCliniques}</p>
          </div>
          <Building2 className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Utilisateurs</p>
            <p className="text-3xl font-bold text-purple-600">{mockSystemData.overview.totalUtilisateurs.toLocaleString()}</p>
          </div>
          <Users className="w-8 h-8 text-purple-600" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Consultations Total</p>
            <p className="text-3xl font-bold text-green-600">{mockSystemData.overview.consultationsTotal.toLocaleString()}</p>
          </div>
          <FileText className="w-8 h-8 text-green-600" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Activité 24h</p>
            <p className="text-3xl font-bold text-orange-600">{mockSystemData.overview.activiteDernieres24h}</p>
          </div>
          <Zap className="w-8 h-8 text-orange-600" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Espace Disque</p>
            <p className="text-3xl font-bold text-indigo-600">{mockSystemData.overview.espaceDiskUtilise}</p>
          </div>
          <HardDrive className="w-8 h-8 text-indigo-600" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Charge Serveur</p>
            <p className="text-3xl font-bold text-red-600">{mockSystemData.overview.chargeServeur}%</p>
          </div>
          <TrendingUp className="w-8 h-8 text-red-600" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Consultations ce mois</p>
            <p className="text-3xl font-bold text-teal-600">{mockSystemData.overview.consultationsMois.toLocaleString()}</p>
          </div>
          <Calendar className="w-8 h-8 text-teal-600" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Sécurité Système</p>
            <p className="text-3xl font-bold text-green-600">OK</p>
          </div>
          <Shield className="w-8 h-8 text-green-600" />
        </div>
      </div>
    </div>
  );

  const renderDatabases = () => (
    <div className="space-y-6">
      {mockSystemData.databases.map((db, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Database className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">{db.name}</h3>
              <StatusBadge status={db.status} />
            </div>
            <div className="flex items-center space-x-2">
              <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm hover:bg-blue-200">
                <Eye className="w-4 h-4 inline mr-1" />
                Examiner
              </button>
              <button className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm hover:bg-green-200">
                <Download className="w-4 h-4 inline mr-1" />
                Exporter
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Taille</p>
              <p className="font-semibold text-gray-900">{db.size}</p>
            </div>
            <div>
              <p className="text-gray-600">Tables</p>
              <p className="font-semibold text-gray-900">{db.tables}</p>
            </div>
            <div>
              <p className="text-gray-600">Enregistrements</p>
              <p className="font-semibold text-gray-900">{db.records.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Dernière sauvegarde</p>
              <p className="font-semibold text-gray-900">{new Date(db.lastBackup).toLocaleDateString('fr-FR')}</p>
            </div>
            <div>
              <p className="text-gray-600">Heure</p>
              <p className="font-semibold text-gray-900">{new Date(db.lastBackup).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderActivities = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Activités Récentes du Système</h3>
      </div>

      <div className="divide-y divide-gray-200">
        {mockSystemData.recentActivities.map((activity) => (
          <div key={activity.id} className="px-6 py-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                <div className="flex items-center mt-1 space-x-4">
                  <p className="text-xs text-gray-600">Par {activity.user}</p>
                  <p className="text-xs text-gray-600">{new Date(activity.timestamp).toLocaleString('fr-FR')}</p>
                </div>
              </div>
              <SeverityBadge severity={activity.severity} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderExports = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Données Cliniques</h3>
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
        <p className="text-sm text-gray-600 mb-4">Exporter toutes les données de toutes les cliniques</p>
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
          <Download className="w-4 h-4 inline mr-2" />
          Exporter CSV
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Utilisateurs</h3>
          <Users className="w-6 h-6 text-purple-600" />
        </div>
        <p className="text-sm text-gray-600 mb-4">Exporter la liste complète des utilisateurs</p>
        <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700">
          <Download className="w-4 h-4 inline mr-2" />
          Exporter Excel
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Logs Système</h3>
          <Activity className="w-6 h-6 text-green-600" />
        </div>
        <p className="text-sm text-gray-600 mb-4">Télécharger les logs d'activité système</p>
        <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
          <Download className="w-4 h-4 inline mr-2" />
          Télécharger ZIP
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Accès aux Données (Support)</h1>
            <p className="text-gray-600 mt-1">Accès à toutes les données système pour le support technique</p>
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
            <span className="text-sm font-medium text-amber-700">Accès Privilégié</span>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  selectedTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {selectedTab === 'overview' && renderOverview()}
          {selectedTab === 'databases' && renderDatabases()}
          {selectedTab === 'activities' && renderActivities()}
          {selectedTab === 'exports' && renderExports()}
        </div>
      </div>
    </div>
  );
}