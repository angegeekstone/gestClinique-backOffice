import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const ROLES = {
  ADMIN_CLINIQUE: 'ADMIN_CLINIQUE',
  MEDECIN: 'MEDECIN',
  RECEPTION: 'RECEPTION',
  CAISSE: 'CAISSE'
};

export const PERMISSIONS = {
  // ADMIN_CLINIQUE permissions (ancien SUPER_ADMIN)
  MANAGE_ALL_CLINIQUES: 'manage_all_cliniques',
  MANAGE_SYSTEM_CONFIG: 'manage_system_config',
  MANAGE_SUBSCRIPTIONS: 'manage_subscriptions',
  ACCESS_ALL_DATA: 'access_all_data',
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
  VIEW_SCHEDULE: 'view_schedule',
  CREATE_PATIENTS: 'create_patients',
  UPDATE_PATIENT_INFO: 'update_patient_info',
  VIEW_PATIENT_LIST: 'view_patient_list',
  VIEW_PATIENT_CONTACT: 'view_patient_contact',

  // CAISSIER permissions
  MANAGE_PAYMENTS: 'manage_payments',
  PROCESS_PAYMENTS: 'process_payments',
  GENERATE_RECEIPTS: 'generate_receipts',
  VIEW_PAYMENT_HISTORY: 'view_payment_history',
  MANAGE_CASH_REGISTER: 'manage_cash_register',
  GENERATE_CASH_REPORTS: 'generate_cash_reports'
};

const rolePermissions = {
  [ROLES.ADMIN_CLINIQUE]: [
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
  [ROLES.MEDECIN]: [
    PERMISSIONS.MANAGE_CONSULTATIONS,
    PERMISSIONS.GENERATE_PRESCRIPTIONS,
    PERMISSIONS.VIEW_PATIENT_FILES,
    PERMISSIONS.VIEW_SCHEDULE
  ],
  [ROLES.RECEPTION]: [
    PERMISSIONS.MANAGE_PATIENTS,
    PERMISSIONS.VIEW_SCHEDULE,
    PERMISSIONS.CREATE_PATIENTS,
    PERMISSIONS.UPDATE_PATIENT_INFO,
    PERMISSIONS.VIEW_PATIENT_LIST,
    PERMISSIONS.VIEW_PATIENT_CONTACT
  ],
  [ROLES.CAISSE]: [
    PERMISSIONS.MANAGE_PAYMENTS,
    PERMISSIONS.PROCESS_PAYMENTS,
    PERMISSIONS.GENERATE_RECEIPTS,
    PERMISSIONS.VIEW_PAYMENT_HISTORY,
    PERMISSIONS.MANAGE_CASH_REGISTER,
    PERMISSIONS.GENERATE_CASH_REPORTS,
    PERMISSIONS.VIEW_PATIENT_LIST,
    PERMISSIONS.VIEW_PATIENT_CONTACT
  ]
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const login = async (username, password) => {
    const response = await authService.login(username, password);

    // Decode JWT to get role and id from token payload
    let userRole = response.role;
    let userId = response.id;
    if (response.token) {
      try {
        const base64Payload = response.token.split('.')[1];
        const payload = JSON.parse(atob(base64Payload));
        if (payload.role && payload.role.startsWith('ROLE_')) {
          const roleFromToken = payload.role.replace('ROLE_', '');
          // Keep ADMIN_CLINIQUE as is
          userRole = roleFromToken;
        }
        // Extract user ID from token if not present in response
        if (!userId && payload.sub) {
          userId = payload.sub;
        }
      } catch (tokenError) {
        console.error('Error decoding token:', tokenError);
      }
    }

    const userData = {
      id: userId,
      username: response.username,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      role: userRole,
      token: response.token,
      clinique: response.clinique || null,
    };
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        // Decode JWT to get role and id from token payload
        if (userData.token) {
          try {
            const base64Payload = userData.token.split('.')[1];
            const payload = JSON.parse(atob(base64Payload));
            if (payload.role && payload.role.startsWith('ROLE_')) {
              const roleFromToken = payload.role.replace('ROLE_', '');
              // Keep ADMIN_CLINIQUE as is
              userData.role = roleFromToken;
            }
            // Extract user ID from token if not present
            if (!userData.id && payload.sub) {
              userData.id = payload.sub;
            }
            localStorage.setItem('user', JSON.stringify(userData));
          } catch (tokenError) {
            console.error('Error decoding token:', tokenError);
          }
        }
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const switchRole = (newRole) => {
    if (user?.role === ROLES.SUPER_ADMIN) {
      setUser(prev => ({ ...prev, role: newRole }));
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading: loading,
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