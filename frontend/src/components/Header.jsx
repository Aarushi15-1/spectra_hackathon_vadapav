import React from 'react';
import HealthStatusBadge from './HealthStatusBadge';
import { Search, Bell } from 'lucide-react';

const Header = ({ title, onHealthStatusChange }) => {
  return (
    <header className="top-header">
      <div className="header-title">
        <h2>{title}</h2>
      </div>

      <div className="header-actions">
        {/* Live Backend Connection Indicator */}
        <HealthStatusBadge onStatusChange={onHealthStatusChange} />

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search patients, tests, orders..."
            style={{
              padding: '0.45rem 0.9rem 0.45rem 2.2rem',
              borderRadius: '9999px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              outline: 'none',
              width: '220px'
            }}
          />
        </div>

        <button
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-muted)',
            padding: '0.5rem',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Notifications"
        >
          <Bell size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', paddingLeft: '0.5rem', borderLeft: '1px solid var(--border-color)' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-red), var(--accent-orange))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '0.85rem' }}>
            LC
          </div>
          <div style={{ fontSize: '0.825rem' }}>
            <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>Lab Admin</div>
            <div style={{ fontSize: '0.725rem', color: 'var(--accent-orange)', fontWeight: '700' }}>PATHOLOGIST</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
