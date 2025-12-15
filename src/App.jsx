import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';

// Super Admin Pages
import CliniquesManagement from './pages/super-admin/CliniquesManagement';

// Admin Clinique Pages
import UsersManagement from './pages/admin-clinique/UsersManagement';

// Médecin Pages
import ConsultationsManager from './pages/medecin/ConsultationsManager';

// Reception Pages
import PatientsManager from './pages/reception/PatientsManager';
import CaisseManager from './pages/reception/CaisseManager';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ProtectedRoute>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Super Admin Routes */}
              <Route path="/super-admin/cliniques" element={<CliniquesManagement />} />

              {/* Admin Clinique Routes */}
              <Route path="/admin-clinique/utilisateurs" element={<UsersManagement />} />

              {/* Médecin Routes */}
              <Route path="/medecin/consultations" element={<ConsultationsManager />} />

              {/* Reception Routes */}
              <Route path="/reception/patients" element={<PatientsManager />} />
              <Route path="/reception/caisse" element={<CaisseManager />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      </Router>
    </AuthProvider>
  );
}

export default App;
