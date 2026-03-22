import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import DashboardNew from './pages/DashboardNew';
import DashboardFinal from './pages/DashboardFinal';
import DashboardSimple from './pages/DashboardSimple';
import DashboardTest from './pages/DashboardTest';
import DashboardProgressive from './pages/DashboardProgressive';

// Super Admin Pages
import CliniquesManagement from './pages/super-admin/CliniquesManagement';

// Admin Clinique Pages
import UsersManagement from './pages/admin-clinique/UsersManagement';
import SpecialitiesManagement from './pages/admin-clinique/SpecialitiesManagement';
import RolesAndPermissions from './pages/admin-clinique/RolesAndPermissions';
import ClinicSettings from './pages/admin-clinique/ClinicSettings';
import AdminDashboard from './pages/admin-clinique/AdminDashboard';
import PricingManagement from './pages/admin-clinique/PricingManagement';
import ClinicConfiguration from './pages/admin-clinique/ClinicConfiguration';
import ClinicReports from './pages/admin-clinique/ClinicReports';
import RevenueReports from './pages/admin-clinique/RevenueReports';
import PerformanceAnalytics from './pages/admin-clinique/PerformanceAnalytics';
import InsuranceManagement from './pages/admin-clinique/InsuranceManagement';

// Médecin Pages
import ConsultationsManager from './pages/medecin/ConsultationsManager';
import NouvelleConsultation from './pages/medecin/NouvelleConsultation';
import PrescriptionsManager from './pages/medecin/PrescriptionsManager';
import PlanningMedecin from './pages/medecin/PlanningMedecin';

// Reception Pages
import PatientsManager from './pages/reception/PatientsManager';
import RdvDuJour from './pages/reception/RdvDuJour';
import CaisseManager from './pages/reception/CaisseManager';

// Caisse Pages
import Encaissements from './pages/caisse/Encaissements';

// Documents Pages
import Documents from './pages/Documents';
import MedicalReport from './pages/documents/MedicalReport';

// Medical Pages
import PatientRecords from './pages/medical/PatientRecords';

// Auth Pages
import Login from './pages/Login';

// Placeholder component for pages not yet implemented
const ComingSoon = () => (
  <div className="flex items-center justify-center h-96">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Page en construction</h2>
      <p className="text-gray-600">Cette fonctionnalité sera bientôt disponible</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Route - Outside Layout */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes - With Layout */}
          <Route path="/*" element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<DashboardFinal />} />
                  <Route path="/dashboard" element={<DashboardFinal />} />
                  <Route path="/dashboard-test" element={<DashboardTest />} />
                  <Route path="/dashboard-simple" element={<DashboardSimple />} />
                  <Route path="/dashboard-full" element={<Dashboard />} />

                  {/* Super Admin Routes */}
                  <Route path="/super-admin/cliniques" element={<CliniquesManagement />} />
                  <Route path="/super-admin/cliniques/nouvelle" element={<ComingSoon />} />
                  <Route path="/super-admin/abonnements" element={<ComingSoon />} />
                  <Route path="/super-admin/system/**" element={<ComingSoon />} />
                  <Route path="/super-admin/facturation/**" element={<ComingSoon />} />
                  <Route path="/super-admin/analytics" element={<ComingSoon />} />

                  {/* Admin Clinique Routes */}
                  <Route path="/admin-clinique/utilisateurs" element={<UsersManagement />} />
                  <Route path="/admin-clinique/utilisateurs/nouveau" element={<UsersManagement />} />
                  <Route path="/admin-clinique/utilisateurs/roles" element={<RolesAndPermissions />} />
                  <Route path="/admin-clinique/specialites" element={<SpecialitiesManagement />} />
                  <Route path="/admin-clinique/assurances" element={<InsuranceManagement />} />
                  <Route path="/admin-clinique/rapports" element={<ClinicReports />} />
                  <Route path="/admin-clinique/rapports/stats" element={<ClinicReports />} />
                  <Route path="/admin-clinique/rapports/revenus" element={<RevenueReports />} />
                  <Route path="/admin-clinique/rapports/performance" element={<PerformanceAnalytics />} />
                  <Route path="/admin-clinique/finances/**" element={<ComingSoon />} />
                  <Route path="/admin-clinique/finances/tarifs" element={<PricingManagement />} />
                  <Route path="/admin-clinique/parametres/general" element={<ClinicSettings />} />
                  <Route path="/admin-clinique/parametres/config" element={<ClinicConfiguration />} />
                  <Route path="/admin-clinique/parametres/**" element={<ComingSoon />} />

                  {/* Médecin Routes */}
                  <Route path="/medecin/consultations" element={<ConsultationsManager />} />
                  <Route path="/medecin/consultations/nouvelle" element={<NouvelleConsultation />} />
                  <Route path="/medecin/consultations/historique" element={<ConsultationsManager />} />
                  <Route path="/medecin/ordonnances" element={<PrescriptionsManager />} />

                  {/* Reception Routes */}
                  <Route path="/reception/rdv-du-jour" element={<RdvDuJour />} />
                  <Route path="/reception/patients" element={<PatientsManager />} />
                  <Route path="/reception/patients/nouveau" element={<PatientsManager />} />
                  <Route path="/reception/patients/recherche" element={<PatientsManager />} />
                  <Route path="/reception/caisse" element={<CaisseManager />} />
                  <Route path="/reception/caisse/encaissements" element={<CaisseManager />} />
                  <Route path="/reception/caisse/historique" element={<CaisseManager />} />
                  <Route path="/reception/caisse/rapport" element={<CaisseManager />} />

                  {/* Caisse Routes */}
                  <Route path="/caissier/caisse" element={<CaisseManager />} />
                  <Route path="/caissier/caisse/encaissements" element={<Encaissements />} />
                  <Route path="/caissier/caisse/historique" element={<CaisseManager />} />
                  <Route path="/caissier/caisse/rapport" element={<CaisseManager />} />

                  {/* Common Routes */}
                  <Route path="/patients" element={<PatientsManager />} />
                  <Route path="/patients/dossiers" element={<PatientRecords />} />
                  <Route path="/planning" element={<PlanningMedecin />} />
                  <Route path="/documents" element={<Documents />} />
                  <Route path="/documents/rapport" element={<MedicalReport />} />

                  {/* Catch all - redirect to dashboard */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
