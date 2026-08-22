import React from 'react';
import { ShieldCheck, Server, RefreshCw } from 'lucide-react';
import HealthStatusBadge from './HealthStatusBadge';

const Header = ({ title, activeTab, onHealthStatusChange }) => {
  return (
    <header className="app-header">
      <div className="page-heading">
        <p>Spectra Laboratory Gateway · ABDM / HL7 FHIR Pipeline</p>
        <h1>{title}</h1>
      </div>

      <div className="header-tools">
        {/* Workspace Switcher */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ fontSize: '10px', fontFamily: 'IBM Plex Mono, monospace', color: 'var(--rose-soft)', textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: '4px' }}>Workspace:</span>
          <span className="workspace-chip">Patient</span>
          <span className="workspace-chip">Doctor</span>
          <span className="workspace-chip active">Laboratory</span>
        </div>

        <HealthStatusBadge onStatusChange={onHealthStatusChange} />

        <div className="demo-label">
          <ShieldCheck size={13} />
          <span>PROD GATEWAY</span>
        </div>

        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--coral)', color: 'var(--cream)', display: 'grid', placeItems: 'center', fontWeight: '700', fontSize: '11px', fontFamily: 'IBM Plex Mono, monospace', border: '1px solid var(--coral)' }}>
          LC
        </div>
      </div>
    </header>
  );
};

export default Header;
