import { Wifi, WifiOff, AlertCircle } from 'lucide-react';

export default function ConnectionStatus({ status, isRefreshing }) {
  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return {
          icon: Wifi,
          text: isRefreshing ? 'Actualisation...' : 'En ligne',
          color: isRefreshing ? 'text-blue-600' : 'text-green-600',
          bgColor: isRefreshing ? 'bg-blue-50' : 'bg-green-50',
          borderColor: isRefreshing ? 'border-blue-200' : 'border-green-200'
        };
      case 'offline':
        return {
          icon: WifiOff,
          text: 'Hors ligne',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200'
        };
      case 'error':
        return {
          icon: AlertCircle,
          text: 'Erreur',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      default:
        return {
          icon: Wifi,
          text: 'Connexion',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-lg border text-xs font-medium ${config.color} ${config.bgColor} ${config.borderColor}`}>
      <Icon className={`w-3 h-3 mr-1 ${isRefreshing ? 'animate-pulse' : ''}`} />
      <span>{config.text}</span>
    </div>
  );
}