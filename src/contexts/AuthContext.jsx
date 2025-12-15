import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN_CLINIQUE: 'ADMIN_CLINIQUE',
  MEDECIN: 'MEDECIN',
  RECEPTION: 'RECEPTION'
};

export const PERMISSIONS = {
  // SUPER_ADMIN permissions
  MANAGE_ALL_CLINIQUES: 'manage_all_cliniques',
  MANAGE_SYSTEM_CONFIG: 'manage_system_config',
  MANAGE_SUBSCRIPTIONS: 'manage_subscriptions',
  ACCESS_ALL_DATA: 'access_all_data',

  // ADMIN_CLINIQUE permissions
  MANAGE_CLINIC_USERS: 'manage_clinic_users',
  VIEW_CLINIC_REPORTS: 'view_clinic_reports',
  MANAGE_CLINIC_SETTINGS: 'manage_clinic_settings',
  MANAGE_FINANCES: 'manage_finances',

  // MEDECIN permissions
  MANAGE_CONSULTATIONS: 'manage_consultations',
  GENERATE_PRESCRIPTIONS: 'generate_prescriptions',
  VIEW_PATIENT_FILES: 'view_patient_files',

  // RECEPTION permissions
  MANAGE_PATIENTS: 'manage_patients',
  MANAGE_PAYMENTS: 'manage_payments',
  VIEW_SCHEDULE: 'view_schedule'
};

const rolePermissions = {
  [ROLES.SUPER_ADMIN]: [
    PERMISSIONS.MANAGE_ALL_CLINIQUES,
    PERMISSIONS.MANAGE_SYSTEM_CONFIG,
    PERMISSIONS.MANAGE_SUBSCRIPTIONS,
    PERMISSIONS.ACCESS_ALL_DATA,
    PERMISSIONS.MANAGE_CLINIC_USERS,
    PERMISSIONS.VIEW_CLINIC_REPORTS,
    PERMISSIONS.MANAGE_CLINIC_SETTINGS,
    PERMISSIONS.MANAGE_FINANCES,
    PERMISSIONS.MANAGE_CONSULTATIONS,
    PERMISSIONS.GENERATE_PRESCRIPTIONS,
    PERMISSIONS.VIEW_PATIENT_FILES,
    PERMISSIONS.MANAGE_PATIENTS,
    PERMISSIONS.MANAGE_PAYMENTS,
    PERMISSIONS.VIEW_SCHEDULE
  ],
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

export function AuthProvider({ children }) {
  // Démarrage sans utilisateur connecté (nécessite login)
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const hasPermission = (permission) => {
    if (!user || !user.role) return false;
    return rolePermissions[user.role]?.includes(permission) || false;
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const canAccessPage = (requiredPermissions = []) => {
    if (!requiredPermissions.length) return true;
    return requiredPermissions.some(permission => hasPermission(permission));
  };

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const switchRole = (newRole) => {
    if (user.role === ROLES.SUPER_ADMIN) {
      setUser(prev => ({ ...prev, role: newRole }));
    }
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    hasPermission,
    hasRole,
    canAccessPage,
    switchRole,
    ROLES,
    PERMISSIONS
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}