import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  Stethoscope,
  UserCheck,
  Pill,
  Activity,
  Building,
  Shield,
  CreditCard,
  Database,
  UserPlus,
  DollarSign,
  Search,
  MessageSquare,
  X,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const getMenuItemsForRole = (role) => {
  const base = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, href: '/dashboard' },
  ];

  const roleItems = {
    SUPER_ADMIN: [
      { id: 'cliniques', label: 'Gestion Cliniques', icon: Building, href: '/super-admin/cliniques',
        children: [
          { label: 'Toutes les cliniques', href: '/super-admin/cliniques' },
          { label: 'Abonnements', href: '/super-admin/abonnements' },
        ]
      },
      { id: 'system', label: 'Administration Système', icon: Shield, href: '/super-admin/system/config',
        children: [
          { label: 'Configuration globale', href: '/super-admin/system/config' },
          { label: 'Logs système', href: '/super-admin/system/logs' },
        ]
      },
      { id: 'billing', label: 'Facturation', icon: CreditCard, href: '/super-admin/facturation' },
      { id: 'analytics', label: 'Analytics Global', icon: Database, href: '/super-admin/analytics' },
    ],
    ADMIN_CLINIQUE: [
      { id: 'users', label: 'Utilisateurs', icon: UserCheck, href: '/admin-clinique/utilisateurs' },
      { id: 'roles', label: 'Rôles & Permissions', icon: Shield, href: '/admin-clinique/utilisateurs/roles' },
      { id: 'specialites', label: 'Spécialités', icon: Stethoscope, href: '/admin-clinique/specialites' },
      { id: 'assurances', label: 'Assurances', icon: Shield, href: '/admin-clinique/assurances' },
      { id: 'rapports', label: 'Rapports', icon: BarChart3, href: '/admin-clinique/rapports',
        children: [
          { label: 'Statistiques', href: '/admin-clinique/rapports/stats' },
          { label: 'Revenus', href: '/admin-clinique/rapports/revenus' },
          { label: 'Performance', href: '/admin-clinique/rapports/performance' },
        ]
      },
      { id: 'finances', label: 'Finances', icon: DollarSign, href: '/admin-clinique/finances/caisse',
        children: [
          { label: 'Caisse', href: '/admin-clinique/finances/caisse' },
          { label: 'Tarifs', href: '/admin-clinique/finances/tarifs' },
        ]
      },
      { id: 'patients', label: 'Patients', icon: Users, href: '/patients' },
      { id: 'planning', label: 'Planning', icon: Calendar, href: '/planning' },
    ],
    MEDECIN: [
      { id: 'consultations', label: 'Consultations', icon: Stethoscope, href: '/medecin/consultations',
        children: [
          { label: 'Mes consultations', href: '/medecin/consultations' },
          { label: 'Nouvelle consultation', href: '/medecin/consultations/nouvelle' },
        ]
      },
      { id: 'ordonnances', label: 'Ordonnances', icon: Pill, href: '/medecin/ordonnances' },
      { id: 'patients', label: 'Patients', icon: Users, href: '/patients' },
      { id: 'planning', label: 'Planning', icon: Calendar, href: '/planning' },
    ],
    RECEPTION: [
      { id: 'rdv', label: 'RDV du jour', icon: Calendar, href: '/reception/rdv-du-jour' },
      { id: 'patients', label: 'Patients', icon: Users, href: '/reception/patients' },
      { id: 'nouveau-patient', label: 'Nouveau patient', icon: UserPlus, href: '/reception/nouveau-patient' },
      { id: 'recherche', label: 'Recherche rapide', icon: Search, href: '/reception/recherche' },
      { id: 'caisse', label: 'Caisse', icon: DollarSign, href: '/reception/caisse' },
    ],
    CAISSE: [
      { id: 'caisse', label: 'Caisse', icon: DollarSign, href: '/caissier/caisse' },
      { id: 'encaissements', label: 'Encaissements', icon: CreditCard, href: '/caissier/caisse/encaissements' },
    ],
  };

  return [...base, ...(roleItems[role] || [])];
};

function NavItem({ item, onNavigate }) {
  const location  = useLocation();
  const [open, setOpen] = useState(false);
  const hasChildren = item.children?.length > 0;
  const isActive    = location.pathname === item.href ||
    (hasChildren && item.children.some((c) => location.pathname === c.href));

  const handleClick = () => {
    if (hasChildren) {
      setOpen((v) => !v);
    } else {
      onNavigate(item.href);
    }
  };

  const Icon = item.icon;

  return (
    <div>
      <button
        onClick={handleClick}
        style={{
          display: 'flex', alignItems: 'center', gap: 12, width: '100%',
          padding: '10px 12px', borderRadius: 'var(--radius-md)',
          border: 'none', cursor: 'pointer', textAlign: 'left',
          fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body-md)',
          background: isActive ? 'var(--brand-soft)' : 'transparent',
          color: isActive ? 'var(--brand-strong)' : 'var(--text-muted)',
          fontWeight: isActive ? 700 : 500,
          transition: 'background var(--dur-fast), color var(--dur-fast)',
        }}
        onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'var(--surface-hover)'; }}
        onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
      >
        <Icon size={18} style={{ flexShrink: 0 }} />
        <span style={{ flex: 1 }}>{item.label}</span>
        {hasChildren && (
          open
            ? <ChevronDown size={15} style={{ flexShrink: 0, opacity: 0.6 }} />
            : <ChevronRight size={15} style={{ flexShrink: 0, opacity: 0.4 }} />
        )}
        {item.badge && (
          <span style={{
            fontSize: 10, fontWeight: 700, color: '#fff',
            background: 'var(--accent)', borderRadius: 'var(--radius-full)',
            minWidth: 18, height: 18, display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center', padding: '0 5px',
          }}>{item.badge}</span>
        )}
      </button>

      {hasChildren && open && (
        <div style={{ marginLeft: 30, marginTop: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {item.children.map((child) => {
            const childActive = location.pathname === child.href;
            return (
              <button
                key={child.href}
                onClick={() => onNavigate(child.href)}
                style={{
                  display: 'block', width: '100%', padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer',
                  textAlign: 'left', fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-body-sm)',
                  background: childActive ? 'var(--brand-soft)' : 'transparent',
                  color: childActive ? 'var(--brand-strong)' : 'var(--text-muted)',
                  fontWeight: childActive ? 600 : 400,
                  transition: 'background var(--dur-fast)',
                }}
                onMouseEnter={(e) => { if (!childActive) e.currentTarget.style.background = 'var(--surface-hover)'; }}
                onMouseLeave={(e) => { if (!childActive) e.currentTarget.style.background = 'transparent'; }}
              >
                {child.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();
  const { user }  = useAuth();
  const items     = getMenuItemsForRole(user?.role);

  const onNavigate = (href) => {
    navigate(href);
    if (window.innerWidth < 1024) toggleSidebar();
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        style={{
          position: 'fixed', inset: '0 auto 0 0', zIndex: 50,
          width: 'var(--sidebar-w)',
          background: 'var(--surface-card)',
          borderRight: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column',
          padding: '0 14px',
          transition: 'transform var(--dur-base) var(--ease-standard)',
        }}
      >
        {/* Logo */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 8px 20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, background: 'var(--brand)',
              borderRadius: 'var(--radius-md)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Stethoscope size={16} color="#fff" />
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-strong)', letterSpacing: 'var(--tracking-snug)' }}>
              gestclinique
            </span>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', padding: 4, display: 'flex',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Role badge */}
        {user?.role && (
          <div style={{ padding: '0 8px 16px' }}>
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'var(--brand)',
              background: 'var(--brand-soft)', padding: '3px 8px',
              borderRadius: 'var(--radius-full)',
            }}>
              {user.role.replace(/_/g, ' ')}
            </span>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
          {items.map((item) => (
            <NavItem key={item.id} item={item} onNavigate={onNavigate} />
          ))}
        </nav>

        {/* Bottom: documents + settings */}
        <div style={{ padding: '16px 0', borderTop: '1px solid var(--divider)', display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[
            { icon: FileText, label: 'Documents', href: '/documents' },
            { icon: Settings, label: 'Paramètres', href: '/admin-clinique/parametres/general' },
          ].map(({ icon: Icon, label, href }) => {
            const active = false;
            return (
              <button
                key={href}
                onClick={() => onNavigate(href)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                  padding: '10px 12px', borderRadius: 'var(--radius-md)',
                  border: 'none', cursor: 'pointer', background: 'transparent',
                  color: 'var(--text-muted)', fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-body-md)', fontWeight: 500,
                  transition: 'background var(--dur-fast)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                {label}
              </button>
            );
          })}
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(31,28,24,0.4)' }}
          className="lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
