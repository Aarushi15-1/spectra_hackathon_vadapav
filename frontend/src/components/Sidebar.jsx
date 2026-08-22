import React from 'react';
import {
  LayoutDashboard,
  Users,
  TestTube,
  FileText,
  Building2,
  Calendar,
  User,
  Activity,
  HeartPulse
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'patients', label: 'Patients', icon: Users },
  { id: 'lab-tests', label: 'Lab Tests', icon: TestTube },
  { id: 'lab-reports', label: 'Lab Reports', icon: FileText },
  { id: 'laboratories', label: 'Laboratories', icon: Building2 },
  { id: 'appointments', label: 'Appointments', icon: Calendar },
  { id: 'profile', label: 'Profile', icon: User },
];

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-icon">
          <HeartPulse size={24} />
        </div>
        <div className="brand-text">
          <h1>HealthBridge</h1>
          <span>LabConnect</span>
        </div>
      </div>

      <nav style={{ marginTop: '0.5rem' }}>
        <ul className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                  style={{ width: '100%', border: 'none', textAlign: 'left', background: 'transparent' }}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div style={{ marginTop: 'auto', padding: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Spectra Hackathon</div>
          <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--accent-cyan)' }}>LabConnect Module v1.0</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
