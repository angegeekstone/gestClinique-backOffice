export default function StatCard({ title, value, change, changeType = 'neutral', icon: Icon }) {
  const dir = changeType === 'increase' ? 'up' : changeType === 'decrease' ? 'down' : null;
  const trendColor = dir === 'up' ? 'var(--status-success-fg)' : dir === 'down' ? 'var(--status-danger-fg)' : 'var(--text-subtle)';
  const trendBg    = dir === 'up' ? 'var(--status-success-bg)' : dir === 'down' ? 'var(--status-danger-bg)' : 'var(--surface-sunken)';

  return (
    <div style={{
      background: 'var(--surface-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)',
      padding: 'var(--space-5) var(--space-6)',
      display: 'flex', flexDirection: 'column', gap: 12,
      fontFamily: 'var(--font-sans)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{ fontSize: 'var(--text-body-sm)', fontWeight: 600, color: 'var(--text-muted)' }}>
          {title}
        </span>
        {Icon && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 34, height: 34, borderRadius: 'var(--radius-md)',
            background: 'var(--brand-soft)', color: 'var(--brand)',
            flexShrink: 0,
          }}>
            <Icon size={17} />
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span className="tnum" style={{
          fontFamily: 'var(--font-display)', fontSize: 'var(--text-h1)',
          fontWeight: 'var(--weight-extrabold)', color: 'var(--text-strong)',
          letterSpacing: 'var(--tracking-tight)', lineHeight: 1,
        }}>
          {value}
        </span>
      </div>

      {change != null && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            padding: '2px 8px', borderRadius: 'var(--radius-full)',
            background: trendBg, color: trendColor,
            fontSize: 'var(--text-caption)', fontWeight: 700,
          }}>
            {dir && (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                style={{ transform: dir === 'down' ? 'rotate(180deg)' : 'none', transition: 'none' }}>
                <path d="M12 19V5M12 5l-6 6M12 5l6 6" stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {dir === 'up' ? '+' : dir === 'down' ? '-' : ''}{Math.abs(change)}%
          </span>
          <span style={{ fontSize: 'var(--text-caption)', color: 'var(--text-subtle)' }}>
            vs. mois dernier
          </span>
        </div>
      )}
    </div>
  );
}