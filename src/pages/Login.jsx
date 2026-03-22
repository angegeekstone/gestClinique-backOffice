import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Stethoscope,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Shield,
  Users,
  Building
} from 'lucide-react';

const DEMO_ACCOUNTS = [
  {
    role: 'ADMIN_CLINIQUE',
    email: 'admin@gestclinique.com',
    password: 'admin123',
    name: 'Alexandre Martin',
    description: 'Propriétaire système - Accès complet',
    icon: Building,
    color: 'text-red-600',
    bgColor: 'bg-red-50 border-red-200'
  },
  {
    role: 'ADMIN_CLINIQUE',
    email: 'directeur@clinique-centrale.fr',
    password: 'directeur123',
    name: 'Dr. Marie Dupont',
    description: 'Directeur Clinique Centrale - Gestion clinique',
    icon: Shield,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 border-purple-200'
  },
  {
    role: 'MEDECIN',
    email: 'marie.bernard@clinique-centrale.fr',
    password: 'medecin123',
    name: 'Dr. Marie Bernard',
    description: 'Cardiologue - Consultations & Ordonnances',
    icon: Stethoscope,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200'
  },
  {
    role: 'RECEPTION',
    email: 'reception@clinique-centrale.fr',
    password: 'reception123',
    name: 'Sophie Lefebvre',
    description: 'Réceptionniste - Patients & Caisse',
    icon: Users,
    color: 'text-green-600',
    bgColor: 'bg-green-50 border-green-200'
  }
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message 
        || error.response?.data 
        || 'Échec de la connexion. Vérifiez vos identifiants.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setError('');
  };

  const quickLogin = async (account) => {
    try {
      await login(account.email, account.password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Quick login error:', error);
      setError(error.response?.data?.message || 'Échec de la connexion');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8">

        {/* Formulaire de connexion */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">GestClinique</h1>
            <p className="text-gray-600 mt-2">Connectez-vous à votre espace</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="votre@email.com"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Votre mot de passe"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Mot de passe oublié ?
              <a href="#" className="text-blue-600 hover:text-blue-700 ml-1">
                Récupérer mon accès
              </a>
            </p>
          </div>
        </div>

        {/* Comptes de démonstration */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Comptes de Démonstration</h2>
            <p className="text-gray-600 mt-2">Cliquez pour remplir automatiquement ou connexion directe</p>
          </div>

          <div className="space-y-4">
            {DEMO_ACCOUNTS.map((account) => {
              const Icon = account.icon;
              return (
                <div
                  key={account.email}
                  className={`border-2 rounded-xl p-4 transition-all hover:shadow-md ${account.bgColor}`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-white`}>
                      <Icon className={`w-6 h-6 ${account.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{account.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{account.description}</p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div><strong>Email:</strong> {account.email}</div>
                        <div><strong>Mot de passe:</strong> {account.password}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => handleDemoLogin(account)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
                    >
                      Remplir le formulaire
                    </button>
                    <button
                      onClick={() => quickLogin(account)}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-white ${
                        account.role === 'ADMIN_CLINIQUE' ? 'bg-red-600 hover:bg-red-700' :
                        account.role === 'ADMIN_CLINIQUE' ? 'bg-purple-600 hover:bg-purple-700' :
                        account.role === 'MEDECIN' ? 'bg-blue-600 hover:bg-blue-700' :
                        'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      Connexion directe
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <h4 className="font-medium text-gray-900 mb-2">Autres comptes disponibles:</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div>• <strong>Autre Admin:</strong> directeur@clinique-nord.fr / directeur123</div>
              <div>• <strong>Médecins:</strong> pierre.martin@clinique-nord.fr, sophie.dubois@clinique-centrale.fr</div>
              <div>• <strong>Réception:</strong> accueil@clinique-nord.fr, chef.accueil@clinique-centrale.fr</div>
              <div className="text-xs text-gray-500 mt-2">Mot de passe: [rôle]123 (ex: medecin123)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}