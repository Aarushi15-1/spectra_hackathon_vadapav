import React from 'react';
import {
  LayoutDashboard,
  Users,
  TestTube,
  FileText,
  Building2,
  Calendar,
  User,
  FlaskConical
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'patients', label: 'Patient Registry', icon: Users },
  { id: 'lab-tests', label: 'Test Catalog', icon: FlaskConical },
  { id: 'lab-reports', label: 'Diagnostic Reports', icon: FileText },
  { id: 'laboratories', label: 'Lab Network', icon: Building2 },
  { id: 'appointments', label: 'Collections', icon: Calendar },
  { id: 'profile', label: 'Operator Profile', icon: User },
];

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="app-rail">
      <div className="brand-lockup">
        <span className="signal-logo">
          <i className="logo-lobe lobe-a"></i>
          <i className="logo-lobe lobe-b"></i>
          <i className="logo-lobe lobe-c"></i>
          <span className="logo-pulse">~</span>
        </span>
        <span>
          Spectra<br />Health
        </span>
      </div>

      <nav>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="rail-bottom">
        <div style={{ background: 'rgba(255,247,239,0.08)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255,247,239,0.12)' }}>
          <div style={{ fontSize: '9px', fontFamily: 'IBM Plex Mono, monospace', color: '#f7b4a8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>ABDM · HL7 · FHIR R4</div>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--cream)', marginTop: '3px' }}>LabConnect v1.0</div>
        </div>
        <p>SECURE HEALTH DATA HIGHWAY · NHA PROTOCOL</p>
      </div>
    </aside>
  );
};

export default Sidebar;
