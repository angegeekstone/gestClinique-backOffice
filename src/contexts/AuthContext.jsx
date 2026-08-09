import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { ROLES, PERMISSIONS, rolePermissions } from './authConstants';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
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