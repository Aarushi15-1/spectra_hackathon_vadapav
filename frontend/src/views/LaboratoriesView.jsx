import React from 'react';
import { Building2, MapPin, Award, Phone } from 'lucide-react';

const mockLabs = [
  { id: 'LAB-01', name: 'HealthBridge Central Diagnostic Hub', location: 'Bandras West, Mumbai', accreditation: 'NABL & CAP Accredited', head: 'Dr. Ramesh Nambiar', status: 'Operational' },
  { id: 'LAB-02', name: 'HealthBridge PathLab Regional Center', location: 'Andheri East, Mumbai', accreditation: 'NABL Accredited', head: 'Dr. Ananya Roy', status: 'Operational' },
  { id: 'LAB-03', name: 'HealthBridge Diagnostic Express', location: 'Powai, Mumbai', accreditation: 'ISO 15189 Certified', head: 'Dr. Manish Gupta', status: 'Operational' }
];

const LaboratoriesView = () => {
  return (
    <div className="view-container">
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Laboratory Network</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Partner diagnostic labs and regional collection centers</p>
      </div>

      <div className="card-grid">
        {mockLabs.map((lab) => (
          <div key={lab.id} className="stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'rgba(14, 165, 233, 0.15)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: '700' }}>{lab.id}</div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '600' }}>{lab.name}</h4>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={14} color="var(--accent-cyan)" /> {lab.location}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={14} color="var(--accent-emerald)" /> {lab.accreditation}
              </div>
            </div>

            <div style={{ width: '100%', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge badge-success">{lab.status}</span>
              <button className="btn btn-outline" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}>
                Lab Portal
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LaboratoriesView;
