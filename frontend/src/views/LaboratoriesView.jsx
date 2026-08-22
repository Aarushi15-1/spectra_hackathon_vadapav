import React from 'react';
import { Building2, MapPin, Award, Phone, ArrowUpRight } from 'lucide-react';

const mockLabs = [
  { id: 'LAB-01', name: 'HealthBridge Central Diagnostic Hub', location: 'Bandra West, Mumbai', accreditation: 'NABL & CAP Accredited', head: 'Dr. Ramesh Nambiar', status: 'Operational' },
  { id: 'LAB-02', name: 'HealthBridge PathLab Regional Center', location: 'Andheri East, Mumbai', accreditation: 'NABL Accredited', head: 'Dr. Ananya Roy', status: 'Operational' },
  { id: 'LAB-03', name: 'HealthBridge Diagnostic Express', location: 'Powai, Mumbai', accreditation: 'ISO 15189 Certified', head: 'Dr. Manish Gupta', status: 'Operational' }
];

const LaboratoriesView = () => {
  return (
    <div className="view-container">
      <div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: '800', color: '#ffffff' }}>Laboratory Network</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Partner diagnostic facilities and accredited regional collection centers</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {mockLabs.map((lab) => (
          <div key={lab.id} className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-md)', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={22} />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: '700' }}>{lab.id}</div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: '700', color: '#ffffff' }}>{lab.name}</h4>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={14} color="var(--accent-cyan)" />
                <span>{lab.location}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={14} color="var(--accent-emerald)" />
                <span>{lab.accreditation}</span>
              </div>
            </div>

            <div style={{ width: '100%', borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge badge-success">{lab.status}</span>
              <button className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span>Lab Portal</span>
                <ArrowUpRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LaboratoriesView;
