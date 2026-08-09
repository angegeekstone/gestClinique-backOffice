import { useState } from 'react';
import {
  Search,
  Bell,
  Settings,
  Menu,
  ChevronDown,
  LogOut,
  UserCircle,
  AlertTriangle,
  Plus,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import RoleSwitcher from './RoleSwitcher';

function Avatar({ name, size = 36 }) {
  const initials = name
    ? name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : '?';

  const colors = [
    ['#D2EDE9', '#0B564F'],
    ['#F6DED3', '#A2503A'],
    ['#E9F5EE', '#257146'],
    ['#FBF2E3', '#A56F1F'],
  ];
  const [bg, fg] = colors[initials.charCodeAt(0) % colors.length];

  return (
    <div style={{
      width: size, height: size, borderRadius: 'var(--radius-full)',
      background: bg, color: fg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.36, fontWeight: 700,
      fontFamily: 'var(--font-sans)', flexShrink: 0,
      border: '1.5px solid var(--border)',
    }}>
      {initials}
    </div>
  );
}

export default function Header({ sidebarOpen, setSidebarOpen }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen,       setProfileOpen]       = useState(false);
  const [showLogoutModal,   setShowLogoutModal]   = useState(false);
  const { user, logout } = useAuth();

  const fullName = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : user?.username || 'Utilisateur';

  const handleLogout = () => {
    setShowLogoutModal(false);
    setProfileOpen(false);
    logout();
  };

  const notifications = [
    { id: 1, message: 'Nouveau patient inscrit',          time: 'Il y a 5 min',  type: 'info' },
    { id: 2, message: 'Rappel : Consultation à 14h30',    time: 'Il y a 15 min', type: 'warning' },
    { id: 3, message: 'Stock faible : Paracétamol',       time: 'Il y a 1h',     type: 'alert' },
  ];

  return (
    <header style={{
      height: 'var(--topbar-h)', flexShrink: 0,
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '0 var(--space-6)',
      background: 'var(--surface-card)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 30,
    }}>

      {/* Mobile hamburger */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 36, height: 36, borderRadius: 'var(--radius-md)',
          border: 'none', cursor: 'pointer', background: 'transparent',
          color: 'var(--text-muted)',
          transition: 'background var(--dur-fast)',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-hover)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
      >
        <Menu size={18} />
      </button>

      {/* Search */}
      <div style={{ flex: 1, maxWidth: 320, position: 'relative' }}>
        <Search size={15} style={{
          position: 'absolute', left: 12, top: '50%',
          transform: 'translateY(-50%)', color: 'var(--text-subtle)',
          pointerEvents: 'none',
        }} />
        <input
          type="text"
          placeholder="Rechercher un patient, un rendez-vous…"
          className="gc-input"
          style={{
            width: '100%', height: 'var(--control-sm)',
            padding: '0 14px 0 36px',
            fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body-sm)',
            border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
            background: 'var(--surface-sunken)', color: 'var(--text-strong)',
            outline: 'none',
          }}
        />
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        <RoleSwitcher />

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false); }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 36, height: 36, borderRadius: 'var(--radius-md)',
              border: 'none', cursor: 'pointer', background: 'transparent',
              color: 'var(--text-muted)', position: 'relative',
              transition: 'background var(--dur-fast)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <Bell size={18} />
            <span style={{
              position: 'absolute', top: 6, right: 6,
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--accent)', border: '2px solid var(--surface-card)',
            }} />
          </button>

          {notificationsOpen && (
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 8px)',
              width: 300, background: 'var(--surface-card)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)', zIndex: 100, overflow: 'hidden',
            }}>
              <div style={{ padding: '14px var(--space-5)', borderBottom: '1px solid var(--divider)' }}>
                <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 700, color: 'var(--text-strong)' }}>
                  Notifications
                </span>
              </div>
              <div style={{ maxHeight: 260, overflowY: 'auto' }}>
                {notifications.map((n) => (
                  <div key={n.id} style={{
                    padding: 'var(--space-4) var(--space-5)',
                    borderBottom: '1px solid var(--divider)', cursor: 'pointer',
                    transition: 'background var(--dur-fast)',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-hover)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <p style={{ fontSize: 13, color: 'var(--text-strong)', margin: 0 }}>{n.message}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-subtle)', marginTop: 4 }}>{n.time}</p>
                  </div>
                ))}
              </div>
              <div style={{ padding: 'var(--space-3) var(--space-5)' }}>
                <button style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: 600, color: 'var(--text-link)',
                  fontFamily: 'var(--font-sans)',
                }}>
                  Voir toutes les notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Nouveau button */}
        <button
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            height: 'var(--control-sm)', padding: '0 14px',
            fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body-sm)', fontWeight: 600,
            color: 'var(--text-on-brand)', background: 'var(--brand)',
            border: '1px solid transparent', borderRadius: 'var(--radius-md)',
            cursor: 'pointer', transition: 'background var(--dur-fast), box-shadow var(--dur-fast)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--brand-strong)'; e.currentTarget.style.boxShadow = 'var(--shadow-brand)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--brand)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          <Plus size={15} />
          Nouveau
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: 'var(--divider)', margin: '0 4px' }} />

        {/* Profile */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotificationsOpen(false); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '4px 8px 4px 4px', borderRadius: 'var(--radius-md)',
              border: 'none', cursor: 'pointer', background: 'transparent',
              transition: 'background var(--dur-fast)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <Avatar name={fullName} size={32} />
            <div style={{ lineHeight: 1.2, textAlign: 'left' }} className="hidden md:block">
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-strong)', whiteSpace: 'nowrap' }}>{fullName}</div>
              <div style={{ fontSize: 11, color: 'var(--text-subtle)' }}>
                {user?.clinique?.name || user?.role || 'Clinique'}
              </div>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-subtle)' }} />
          </button>

          {profileOpen && (
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 8px)',
              width: 230, background: 'var(--surface-card)',
              border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)', zIndex: 100, overflow: 'hidden',
            }}>
              <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--divider)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-strong)' }}>{fullName}</div>
                <div style={{ fontSize: 12, color: 'var(--text-subtle)', marginTop: 2 }}>{user?.email}</div>
                {user?.role && (
                  <span style={{
                    display: 'inline-block', marginTop: 6,
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                    color: 'var(--brand)', background: 'var(--brand-soft)',
                    padding: '2px 8px', borderRadius: 'var(--radius-full)',
                  }}>
                    {user.role.replace(/_/g, ' ')}
                  </span>
                )}
              </div>

              {[
                [UserCircle, 'Mon profil'],
                [Settings,   'Préférences'],
              ].map(([Icon, label]) => (
                <button key={label} style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                  padding: 'var(--space-3) var(--space-5)',
                  border: 'none', cursor: 'pointer', background: 'transparent',
                  fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-body)',
                  textAlign: 'left', transition: 'background var(--dur-fast)',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-hover)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <Icon size={15} style={{ color: 'var(--text-subtle)' }} />
                  {label}
                </button>
              ))}

              <div style={{ borderTop: '1px solid var(--divider)', paddingTop: 4 }}>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                    padding: 'var(--space-3) var(--space-5)',
                    border: 'none', cursor: 'pointer', background: 'transparent',
                    fontFamily: 'var(--font-sans)', fontSize: 13,
                    color: 'var(--status-danger-fg)', textAlign: 'left',
                    transition: 'background var(--dur-fast)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--status-danger-bg)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <LogOut size={15} />
                  Se déconnecter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click-away to close dropdowns */}
      {(notificationsOpen || profileOpen) && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 90 }}
          onClick={() => { setNotificationsOpen(false); setProfileOpen(false); }}
        />
      )}

      {/* Logout confirmation modal */}
      {showLogoutModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(31,28,24,0.4)',
        }}
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            style={{
              background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-xl)', padding: 'var(--space-7)',
              width: 400, maxWidth: '90vw',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{
                width: 40, height: 40, borderRadius: 'var(--radius-full)',
                background: 'var(--status-danger-bg)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <AlertTriangle size={18} color="var(--status-danger-fg)" />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-strong)' }}>
                  Confirmer la déconnexion
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.5 }}>
                  Êtes-vous sûr de vouloir vous déconnecter ? Les données non sauvegardées seront perdues.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 'var(--space-6)' }}>
              <button
                onClick={() => setShowLogoutModal(false)}
                style={{
                  height: 'var(--control-sm)', padding: '0 16px',
                  fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600,
                  border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)',
                  background: 'var(--surface-card)', color: 'var(--text-body)', cursor: 'pointer',
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleLogout}
                style={{
                  height: 'var(--control-sm)', padding: '0 16px',
                  fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600,
                  border: '1px solid transparent', borderRadius: 'var(--radius-md)',
                  background: 'var(--red-500)', color: '#fff', cursor: 'pointer',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--red-600)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--red-500)'; }}
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}