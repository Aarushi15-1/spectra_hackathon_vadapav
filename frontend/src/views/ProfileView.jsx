import React from 'react';
import { Shield, Mail, Phone, Building, Award, CheckCircle2, FileSignature, KeyRound } from 'lucide-react';

const ProfileView = () => {
  return (
    <div>
      <div className="section-heading" style={{ marginBottom: '22px' }}>
        <div>
          <p className="section-index">01 / SYSTEM OPERATOR</p>
          <h2 style={{ font: '700 28px Bricolage Grotesque, sans-serif', letterSpacing: '-.06em', color: 'var(--rose)', margin: '4px 0 0' }}>
            Pathologist Station & Credentials
          </h2>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Profile Ticket Card */}
        <div className="ticket-card" style={{ marginBottom: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--coral)', color: 'var(--cream)', display: 'grid', placeItems: 'center', fontWeight: '800', fontSize: '1.25rem', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
              LC
            </div>
            <div>
              <span style={{ font: '700 10px IBM Plex Mono, monospace', color: 'var(--coral-deep)' }}>STATION #109</span>
              <h3 style={{ font: '700 22px Bricolage Grotesque, sans-serif', letterSpacing: '-.05em', color: 'var(--rose)', margin: '2px 0 0' }}>
                Dr. Lab Administrator
              </h3>
              <span style={{ font: '700 10px IBM Plex Mono, monospace', color: 'var(--marigold)' }}>ROLE_PATHOLOGIST</span>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '12px', fontSize: '13px', color: 'var(--rose-soft)', borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={15} color="var(--coral)" />
              <span style={{ color: 'var(--rose)' }}>admin@healthbridge.labconnect.com</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={15} color="var(--coral)" />
              <span style={{ color: 'var(--rose)' }}>+91 (022) 4920-8800</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={15} color="var(--marigold)" />
              <span style={{ color: 'var(--rose)' }}>Medical License: <strong>MCI-88219</strong></span>
            </div>
          </div>
        </div>

        {/* Clinical Facility & Accreditation Card */}
        <div className="ticket-card" style={{ marginBottom: 0, boxShadow: '14px 16px 0 #f7d891' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Award size={18} color="var(--coral-deep)" />
            <h3 style={{ font: '700 20px Bricolage Grotesque, sans-serif', letterSpacing: '-.04em', color: 'var(--rose)', margin: 0 }}>
              Facility & Accreditation
            </h3>
          </div>

          <div style={{ display: 'grid', gap: '12px', fontSize: '12px', color: 'var(--rose-soft)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building size={15} color="var(--coral)" />
              <div>
                <span style={{ font: '700 10px IBM Plex Mono, monospace', color: 'var(--rose-soft)', textTransform: 'uppercase', display: 'block' }}>Primary Hub</span>
                <strong style={{ color: 'var(--rose)', fontSize: '13px' }}>HealthBridge Central Diagnostic Hub (Bandra)</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={15} color="var(--marigold)" />
              <div>
                <span style={{ font: '700 10px IBM Plex Mono, monospace', color: 'var(--rose-soft)', textTransform: 'uppercase', display: 'block' }}>NABL Accreditation No.</span>
                <strong style={{ color: 'var(--rose)', fontSize: '13px' }}>MC-2024-9182 (Valid till Dec 2028)</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileSignature size={15} color="var(--coral)" />
              <div>
                <span style={{ font: '700 10px IBM Plex Mono, monospace', color: 'var(--rose-soft)', textTransform: 'uppercase', display: 'block' }}>Digital DSC Certificate</span>
                <strong style={{ color: 'var(--rose)', fontSize: '13px' }}>Class 3 FIPS-140-2 Level 3 (Active)</strong>
              </div>
            </div>

            <div style={{ background: '#ffd5c1', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--line)', marginTop: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', font: '700 11px IBM Plex Mono, monospace', color: 'var(--coral-deep)' }}>
                <CheckCircle2 size={15} />
                <span>ABDM Certified Health Information Provider (HIP)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
