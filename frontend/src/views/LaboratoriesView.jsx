import React from 'react';
import { Building2, MapPin, Award, ArrowRight } from 'lucide-react';

const mockLabs = [
  { id: 'LAB-01', name: 'HealthBridge Central Diagnostic Hub', location: 'Bandra West, Mumbai', accreditation: 'NABL & CAP Accredited', head: 'Dr. Ramesh Nambiar', status: 'Operational' },
  { id: 'LAB-02', name: 'HealthBridge PathLab Regional Center', location: 'Andheri East, Mumbai', accreditation: 'NABL Accredited', head: 'Dr. Ananya Roy', status: 'Operational' },
  { id: 'LAB-03', name: 'HealthBridge Diagnostic Express', location: 'Powai, Mumbai', accreditation: 'ISO 15189 Certified', head: 'Dr. Manish Gupta', status: 'Operational' }
];

const LaboratoriesView = () => {
  return (
    <div>
      <div className="section-heading" style={{ marginBottom: '22px' }}>
        <div>
          <p className="section-index">01 / DIAGNOSTIC NETWORK</p>
          <h2 style={{ font: '700 28px Bricolage Grotesque, sans-serif', letterSpacing: '-.06em', color: 'var(--rose)', margin: '4px 0 0' }}>
            Accredited Laboratory Facilities
          </h2>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {mockLabs.map((lab, idx) => (
          <div
            key={lab.id}
            className="ticket-card"
            style={{
              padding: '24px',
              boxShadow: idx === 0 ? '10px 12px 0 var(--blush)' : (idx === 1 ? '10px 12px 0 #f7d891' : '10px 12px 0 #f5b6a3'),
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              marginBottom: 0
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--coral)', color: 'var(--cream)', display: 'grid', placeItems: 'center' }}>
                  <Building2 size={18} />
                </div>
                <div>
                  <span style={{ font: '700 10px IBM Plex Mono, monospace', color: 'var(--coral-deep)' }}>{lab.id}</span>
                  <h4 style={{ font: '700 18px Bricolage Grotesque, sans-serif', letterSpacing: '-.04em', color: 'var(--rose)', margin: '2px 0 0' }}>
                    {lab.name}
                  </h4>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '6px', fontSize: '12px', color: 'var(--rose-soft)', margin: '14px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={13} color="var(--coral)" />
                  <span>{lab.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Award size={13} color="var(--marigold)" />
                  <span>{lab.accreditation}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--line)', paddingTop: '12px', marginTop: '10px' }}>
              <span style={{ background: '#ffd5c1', color: 'var(--rose)', padding: '3px 8px', borderRadius: '999px', font: '700 9px IBM Plex Mono, monospace' }}>
                {lab.status}
              </span>
              <button className="workspace-chip" style={{ padding: '4px 10px', fontSize: '10px' }}>
                <span>Lab Node</span>
                <ArrowRight size={11} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LaboratoriesView;
