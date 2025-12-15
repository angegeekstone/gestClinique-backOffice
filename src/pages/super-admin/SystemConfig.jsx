import { useState } from 'react';
import {
  Settings,
  Database,
  Shield,
  Server,
  Bell,
  Mail,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';

const systemConfig = {
  database: {
    host: 'db.gestclinique.com',
    port: '5432',
    name: 'gestclinique_prod',
    maxConnections: '100',
    backupInterval: '24',
    lastBackup: '2024-12-12T02:00:00'
  },
  security: {
    sessionTimeout: '30',
    passwordPolicy: 'strong',
    twoFactorAuth: true,
    ipWhitelist: true,
    encryptionLevel: 'AES-256'
  },
  notifications: {
    emailEnabled: true,
    smsEnabled: true,
    pushEnabled: true,
    maintenanceAlerts: true,
    errorThreshold: '5'
  },
  system: {
    version: '2.1.4',
    environment: 'production',
    maintenanceMode: false,
    debugMode: false,
    logLevel: 'info'
  }
};

export default function SystemConfig() {
  const [config, setConfig] = useState(systemConfig);
  const [showPasswords, setShowPasswords] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('database');

  const handleSave = async () => {
    setSaving(true);
    // Simuler la sauvegarde
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaving(false);
  };

  const tabs = [
    { id: 'database', label: 'Base de données', icon: Database },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'Système', icon: Server }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuration Système</h1>
          <p className="text-gray-600">Gérez la configuration globale du système GestClinique</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
        >
          {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          <span>{saving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
        </button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-yellow-800">Attention - Configuration Système</h3>
          <p className="text-yellow-700 text-sm mt-1">
            Toute modification de ces paramètres affectera toutes les cliniques du système.
            Assurez-vous de comprendre les implications avant de sauvegarder.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'database' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Configuration Base de Données</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Serveur de base de données
                  </label>
                  <input
                    type="text"
                    value={config.database.host}
                    onChange={(e) => setConfig({
                      ...config,
                      database: { ...config.database, host: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Port
                  </label>
                  <input
                    type="text"
                    value={config.database.port}
                    onChange={(e) => setConfig({
                      ...config,
                      database: { ...config.database, port: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de la base
                  </label>
                  <input
                    type="text"
                    value={config.database.name}
                    onChange={(e) => setConfig({
                      ...config,
                      database: { ...config.database, name: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Connexions max
                  </label>
                  <input
                    type="number"
                    value={config.database.maxConnections}
                    onChange={(e) => setConfig({
                      ...config,
                      database: { ...config.database, maxConnections: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-green-800 font-medium">Dernière sauvegarde</p>
                  <p className="text-green-700 text-sm">
                    {new Date(config.database.lastBackup).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Paramètres de Sécurité</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeout session (minutes)
                  </label>
                  <input
                    type="number"
                    value={config.security.sessionTimeout}
                    onChange={(e) => setConfig({
                      ...config,
                      security: { ...config.security, sessionTimeout: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Politique mot de passe
                  </label>
                  <select
                    value={config.security.passwordPolicy}
                    onChange={(e) => setConfig({
                      ...config,
                      security: { ...config.security, passwordPolicy: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="weak">Faible</option>
                    <option value="medium">Moyenne</option>
                    <option value="strong">Forte</option>
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.security.twoFactorAuth}
                    onChange={(e) => setConfig({
                      ...config,
                      security: { ...config.security, twoFactorAuth: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Authentification à deux facteurs obligatoire</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.security.ipWhitelist}
                    onChange={(e) => setConfig({
                      ...config,
                      security: { ...config.security, ipWhitelist: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Restriction IP activée</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Configuration Notifications</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-gray-700">Notifications par email</span>
                  <input
                    type="checkbox"
                    checked={config.notifications.emailEnabled}
                    onChange={(e) => setConfig({
                      ...config,
                      notifications: { ...config.notifications, emailEnabled: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-gray-700">Notifications SMS</span>
                  <input
                    type="checkbox"
                    checked={config.notifications.smsEnabled}
                    onChange={(e) => setConfig({
                      ...config,
                      notifications: { ...config.notifications, smsEnabled: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-gray-700">Alertes de maintenance</span>
                  <input
                    type="checkbox"
                    checked={config.notifications.maintenanceAlerts}
                    onChange={(e) => setConfig({
                      ...config,
                      notifications: { ...config.notifications, maintenanceAlerts: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Paramètres Système</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Version système
                  </label>
                  <input
                    type="text"
                    value={config.system.version}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Environnement
                  </label>
                  <select
                    value={config.system.environment}
                    onChange={(e) => setConfig({
                      ...config,
                      system: { ...config.system, environment: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="development">Développement</option>
                    <option value="staging">Test</option>
                    <option value="production">Production</option>
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-gray-700">Mode maintenance</span>
                  <input
                    type="checkbox"
                    checked={config.system.maintenanceMode}
                    onChange={(e) => setConfig({
                      ...config,
                      system: { ...config.system, maintenanceMode: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-gray-700">Mode debug</span>
                  <input
                    type="checkbox"
                    checked={config.system.debugMode}
                    onChange={(e) => setConfig({
                      ...config,
                      system: { ...config.system, debugMode: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}