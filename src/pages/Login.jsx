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
  Building,
  Calendar,
  CreditCard,
  ArrowRight,
} from 'lucide-react';

const DEMO_ACCOUNTS = [
  {
    role: 'ADMIN_CLINIQUE',
    email: 'admin@gestclinique.com',
    password: 'Admin123',
    name: 'Alexandre Martin',
    description: 'Administrateur · Accès complet',
    icon: Building,
  },
  {
    role: 'ADMIN_CLINIQUE',
    email: 'directeur@clinique-centrale.fr',
    password: 'directeur123',
    name: 'Dr. Marie Dupont',
    description: 'Directrice · Clinique Centrale',
    icon: Shield,
  },
  {
    role: 'MEDECIN',
    email: 'marie.bernard@clinique-centrale.fr',
    password: 'medecin123',
    name: 'Dr. Marie Bernard',
    description: 'Cardiologue · Consultations & Ordonnances',
    icon: Stethoscope,
  },
  {
    role: 'RECEPTION',
    email: 'reception@clinique-centrale.fr',
    password: 'reception123',
    name: 'Sophie Lefebvre',
    description: 'Réceptionniste · Patients & Caisse',
    icon: Users,
  },
];

const inputStyle = {
  width: '100%',
  height: 'var(--control-md)',
  padding: '0 14px',
  fontFamily: 'var(--font-sans)',
  fontSize: 'var(--text-body-md)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-md)',
  background: 'var(--surface-card)',
  color: 'var(--text-strong)',
  outline: 'none',
  transition: 'border-color var(--dur-fast)',
};

export default function Login() {
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const navigate  = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const data = err.response?.data;
      setError(
        typeof data === 'string' ? data :
        data?.message ?? data?.error ?? 'Échec de la connexion. Vérifiez vos identifiants.'
      );
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (account) => {
    setError('');
    setLoading(true);
    try {
      await login(account.email, account.password);
      navigate('/dashboard');
    } catch (err) {
      const data = err.response?.data;
      setError(
        typeof data === 'string' ? data :
        data?.message ?? data?.error ?? 'Échec de la connexion.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', height: '100vh', width: '100%',
      fontFamily: 'var(--font-sans)',
    }}>

      {/* ── Left: form panel ─────────────────────────────────── */}
      <div style={{
        flex: '1 1 0', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '32px 24px', overflowY: 'auto', background: 'var(--surface-app)',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
            <div style={{
              width: 36, height: 36, background: 'var(--brand)',
              borderRadius: 'var(--radius-md)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Stethoscope size={18} color="#fff" />
            </div>
            <span style={{
              fontSize: 18, fontWeight: 800, color: 'var(--text-strong)',
              letterSpacing: 'var(--tracking-snug)',
            }}>gestclinique</span>
          </div>

          <h1 style={{
            fontSize: 28, fontWeight: 800, color: 'var(--text-strong)',
            letterSpacing: 'var(--tracking-tight)', margin: 0,
          }}>Bon retour parmi vous</h1>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: '8px 0 32px' }}>
            Connectez-vous pour accéder à votre clinique.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-strong)', marginBottom: 6 }}>
                Adresse e-mail
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)', pointerEvents: 'none' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  autoComplete="username"
                  className="gc-input"
                  style={{ ...inputStyle, paddingLeft: 40 }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-strong)', marginBottom: 6 }}>
                Mot de passe
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)', pointerEvents: 'none' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="gc-input"
                  style={{ ...inputStyle, paddingLeft: 40, paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-subtle)', display: 'flex', alignItems: 'center',
                    padding: 2,
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ accentColor: 'var(--brand)', width: 14, height: 14 }} />
                Se souvenir de moi
              </label>
              <a href="#" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-link)', textDecoration: 'none' }}>
                Mot de passe oublié ?
              </a>
            </div>

            {error && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
                background: 'var(--status-danger-bg)', color: 'var(--status-danger-fg)',
                borderRadius: 'var(--radius-md)', fontSize: 13,
              }}>
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                width: '100%', height: 'var(--control-lg)',
                fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body-lg)', fontWeight: 600,
                color: 'var(--text-on-brand)',
                background: loading ? 'var(--teal-400)' : 'var(--brand)',
                border: '1px solid transparent', borderRadius: 'var(--radius-md)',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background var(--dur-fast), box-shadow var(--dur-fast)',
              }}
              onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.background = 'var(--brand-strong)'; e.currentTarget.style.boxShadow = 'var(--shadow-brand)'; } }}
              onMouseLeave={(e) => { e.currentTarget.style.background = loading ? 'var(--teal-400)' : 'var(--brand)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              {loading ? 'Connexion en cours…' : 'Se connecter'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Divider + demo accounts */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '28px 0 16px' }}>
            <span style={{ flex: 1, height: 1, background: 'var(--divider)' }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
              Comptes de démonstration
            </span>
            <span style={{ flex: 1, height: 1, background: 'var(--divider)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {DEMO_ACCOUNTS.map((account) => {
              const Icon = account.icon;
              return (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => quickLogin(account)}
                  disabled={loading}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                    border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                    background: 'var(--surface-card)', cursor: loading ? 'not-allowed' : 'pointer',
                    textAlign: 'left', fontFamily: 'var(--font-sans)',
                    transition: 'border-color var(--dur-fast), background var(--dur-fast)',
                    opacity: loading ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.borderColor = 'var(--brand-border)'; e.currentTarget.style.background = 'var(--brand-soft)'; } }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface-card)'; }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 'var(--radius-sm)',
                    background: 'var(--brand-soft)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon size={16} color="var(--brand)" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{account.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-subtle)' }}>{account.description}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <p style={{ fontSize: 11.5, color: 'var(--text-subtle)', textAlign: 'center', marginTop: 28, lineHeight: 1.5 }}>
            Données de santé hébergées sur infrastructure certifiée HDS.
          </p>
        </div>
      </div>

      {/* ── Right: brand panel ────────────────────────────────── */}
      <div style={{
        flex: '1 1 0', position: 'relative', overflow: 'hidden',
        background: 'var(--teal-900)', color: '#fff',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '64px 56px',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(120% 80% at 90% 10%, rgba(111,194,184,0.20), transparent 60%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative' }}>
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'var(--teal-300)',
          }}>gestclinique</span>
          <p style={{
            fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 800,
            letterSpacing: 'var(--tracking-tight)', lineHeight: 1.15,
            margin: '20px 0 0', maxWidth: '16ch',
          }}>
            Toute votre clinique, dans une seule plateforme.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginTop: 44 }}>
            {[
              [Calendar,    'Agenda partagé entre praticiens'],
              [Users,       'Dossiers patients centralisés'],
              [CreditCard,  'Facturation et suivi des paiements'],
            ].map(([Icon, txt]) => (
              <div key={txt} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 40, height: 40, borderRadius: 'var(--radius-md)',
                  background: 'rgba(255,255,255,0.10)', color: 'var(--teal-200)', flexShrink: 0,
                }}>
                  <Icon size={20} />
                </span>
                <span style={{ fontSize: 16, color: 'var(--teal-50)' }}>{txt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}