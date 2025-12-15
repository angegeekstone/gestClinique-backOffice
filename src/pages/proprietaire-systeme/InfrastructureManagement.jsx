import { useState } from 'react';
import {
  Server,
  Database,
  Shield,
  Wifi,
  HardDrive,
  Cpu,
  MemoryStick,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  Power,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  Globe,
  Lock
} from 'lucide-react';

const mockInfrastructureData = {
  servers: [
    {
      id: 1,
      name: 'Web Server 01',
      type: 'Application',
      status: 'healthy',
      cpu: 45,
      memory: 67,
      disk: 34,
      uptime: '127 jours',
      location: 'Datacenter Casablanca',
      ip: '192.168.1.10'
    },
    {
      id: 2,
      name: 'Database Server 01',
      type: 'Database',
      status: 'healthy',
      cpu: 78,
      memory: 89,
      disk: 56,
      uptime: '127 jours',
      location: 'Datacenter Casablanca',
      ip: '192.168.1.20'
    },
    {
      id: 3,
      name: 'Backup Server 01',
      type: 'Backup',
      status: 'warning',
      cpu: 12,
      memory: 23,
      disk: 89,
      uptime: '45 jours',
      location: 'Datacenter Rabat',
      ip: '192.168.1.30'
    }
  ],
  network: {
    bandwidth: '1 Gbps',
    latency: '12ms',
    uptime: '99.9%',
    traffic: '450 GB/jour'
  },
  security: {
    firewall: 'active',
    ssl: 'active',
    lastScan: '2024-01-15 06:00:00',
    threatsBlocked: 47
  }
};

const StatusBadge = ({ status }) => {
  const config = {
    healthy: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Sain' },
    warning: { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle, text: 'Attention' },
    error: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Erreur' },
    offline: { color: 'bg-gray-100 text-gray-800', icon: XCircle, text: 'Hors ligne' }
  };

  const { color, icon: Icon, text } = config[status] || config.error;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {text}
    </span>
  );
};

const ProgressBar = ({ value, label, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500'
  };

  const bgColorClasses = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    yellow: 'bg-yellow-100',
    red: 'bg-red-100'
  };

  const getColor = () => {
    if (value >= 80) return 'red';
    if (value >= 60) return 'yellow';
    return 'green';
  };

  const progressColor = color === 'auto' ? getColor() : color;

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-600 mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className={`w-full bg-gray-200 rounded-full h-2 ${bgColorClasses[progressColor]}`}>
        <div
          className={`h-2 rounded-full transition-all duration-300 ${colorClasses[progressColor]}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

export default function InfrastructureManagement() {
  const [selectedTab, setSelectedTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: Activity },
    { id: 'servers', label: 'Serveurs', icon: Server },
    { id: 'network', label: 'Réseau', icon: Wifi },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'monitoring', label: 'Monitoring', icon: TrendingUp }
  ];

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Serveurs Actifs</h3>
          <Server className="w-6 h-6 text-blue-600" />
        </div>
        <div className="text-3xl font-bold text-blue-600 mb-2">
          {mockInfrastructureData.servers.filter(s => s.status === 'healthy').length}
        </div>
        <p className="text-sm text-gray-600">sur {mockInfrastructureData.servers.length} total</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Uptime Réseau</h3>
          <Wifi className="w-6 h-6 text-green-600" />
        </div>
        <div className="text-3xl font-bold text-green-600 mb-2">
          {mockInfrastructureData.network.uptime}
        </div>
        <p className="text-sm text-gray-600">Ce mois-ci</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Sécurité</h3>
          <Shield className="w-6 h-6 text-purple-600" />
        </div>
        <div className="text-3xl font-bold text-purple-600 mb-2">
          {mockInfrastructureData.security.threatsBlocked}
        </div>
        <p className="text-sm text-gray-600">Menaces bloquées 24h</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Trafic Quotidien</h3>
          <TrendingUp className="w-6 h-6 text-orange-600" />
        </div>
        <div className="text-3xl font-bold text-orange-600 mb-2">
          {mockInfrastructureData.network.traffic}
        </div>
        <p className="text-sm text-gray-600">Moyenne</p>
      </div>
    </div>
  );

  const renderServers = () => (
    <div className="space-y-6">
      {mockInfrastructureData.servers.map((server) => (
        <div key={server.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${
                server.status === 'healthy' ? 'bg-green-100' :
                server.status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                <Server className={`w-6 h-6 ${
                  server.status === 'healthy' ? 'text-green-600' :
                  server.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                }`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{server.name}</h3>
                <p className="text-sm text-gray-600">{server.type} • {server.ip}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <StatusBadge status={server.status} />
              <div className="flex items-center space-x-1">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Settings className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <RefreshCw className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Power className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="space-y-3">
              <ProgressBar value={server.cpu} label="CPU" color="auto" />
            </div>
            <div className="space-y-3">
              <ProgressBar value={server.memory} label="Mémoire" color="auto" />
            </div>
            <div className="space-y-3">
              <ProgressBar value={server.disk} label="Disque" color="auto" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Uptime</p>
              <p className="font-semibold text-gray-900 flex items-center">
                <Clock className="w-4 h-4 mr-1 text-green-600" />
                {server.uptime}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Localisation</p>
              <p className="font-semibold text-gray-900">{server.location}</p>
            </div>
            <div>
              <p className="text-gray-600">Type</p>
              <p className="font-semibold text-gray-900">{server.type}</p>
            </div>
            <div>
              <p className="text-gray-600">Adresse IP</p>
              <p className="font-semibold text-gray-900 font-mono">{server.ip}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderNetwork = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Performance Réseau</h3>
          <Wifi className="w-6 h-6 text-blue-600" />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-600">Bande passante</span>
            <span className="font-semibold text-gray-900">{mockInfrastructureData.network.bandwidth}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-600">Latence moyenne</span>
            <span className="font-semibold text-gray-900">{mockInfrastructureData.network.latency}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-600">Uptime</span>
            <span className="font-semibold text-green-600">{mockInfrastructureData.network.uptime}</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-gray-600">Trafic quotidien</span>
            <span className="font-semibold text-gray-900">{mockInfrastructureData.network.traffic}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Monitoring en Temps Réel</h3>
          <Activity className="w-6 h-6 text-green-600" />
        </div>

        <div className="space-y-4">
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="w-12 h-12 mx-auto mb-2" />
            <p>Graphiques de monitoring en temps réel</p>
            <p className="text-sm">(Fonctionnalité à implémenter)</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">État de la Sécurité</h3>
          <Shield className="w-6 h-6 text-green-600" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600 flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Firewall
            </span>
            <StatusBadge status="healthy" />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600 flex items-center">
              <Lock className="w-4 h-4 mr-2" />
              SSL/TLS
            </span>
            <StatusBadge status="healthy" />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-gray-600">Dernier scan de sécurité</span>
            <span className="font-semibold text-gray-900">
              {new Date(mockInfrastructureData.security.lastScan).toLocaleDateString('fr-FR')}
            </span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-gray-600">Menaces bloquées (24h)</span>
            <span className="font-semibold text-red-600">{mockInfrastructureData.security.threatsBlocked}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Actions de Sécurité</h3>
          <Settings className="w-6 h-6 text-gray-600" />
        </div>

        <div className="space-y-3">
          <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">Lancer un scan de sécurité</span>
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
          </button>

          <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">Configurer le firewall</span>
              <Settings className="w-5 h-5 text-gray-600" />
            </div>
          </button>

          <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">Gérer les certificats SSL</span>
              <Lock className="w-5 h-5 text-green-600" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion Infrastructure Technique</h1>
            <p className="text-gray-600 mt-1">Monitoring et gestion de l'infrastructure système</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${'bg-green-400'} animate-pulse`}></div>
            <span className="text-sm font-medium text-green-700">Système Opérationnel</span>
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
          {selectedTab === 'servers' && renderServers()}
          {selectedTab === 'network' && renderNetwork()}
          {selectedTab === 'security' && renderSecurity()}
          {selectedTab === 'monitoring' && (
            <div className="text-center py-12 text-gray-500">
              <Activity className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Monitoring Avancé</h3>
              <p>Cette section sera développée pour inclure des graphiques détaillés et des alertes en temps réel.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}