import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, ChevronDown } from 'lucide-react';

const roleLabels = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN_CLINIQUE: 'Admin Clinique',
  MEDECIN: 'Médecin',
  RECEPTION: 'Réception'
};

export default function RoleSwitcher() {
  const { user, switchRole, ROLES } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Seul le SUPER_ADMIN peut changer de rôle pour tester
  if (user?.role !== ROLES.SUPER_ADMIN) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg">
        <Shield className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-900">
          {roleLabels[user?.role] || user?.role}
        </span>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
      >
        <Shield className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-900">
          {roleLabels[user?.role] || user?.role}
        </span>
        <ChevronDown className="w-4 h-4 text-blue-600" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="py-1">
            <div className="px-3 py-2 text-xs text-gray-500 font-medium border-b border-gray-100">
              Mode test - Changer de rôle
            </div>
            {Object.values(ROLES).map((role) => (
              <button
                key={role}
                onClick={() => {
                  switchRole(role);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                  user.role === role ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                {roleLabels[role]}
                {user.role === role && (
                  <span className="ml-2 text-blue-500">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}