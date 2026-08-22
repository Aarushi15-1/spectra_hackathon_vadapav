import React from 'react';
import { Shield, Mail, Phone, Server, CheckCircle2, XCircle } from 'lucide-react';
import { getApiBaseUrl } from '../services/apiService';

const ProfileView = ({ backendHealth }) => {
  return (
    <div>
      <div className="section-heading" style={{ marginBottom: '22px' }}>
        <div>
          <p className="section-index">01 / SYSTEM OPERATOR</p>
          <h2 style={{ font: '700 28px Bricolage Grotesque, sans-serif', letterSpacing: '-.06em', color: 'var(--rose)', margin: '4px 0 0' }}>
            Pathologist Station & Cloud Gateway Settings
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
              <span style={{ color: 'var(--rose)' }}>NABL Accreditation: <strong>PATH-IND-88219</strong></span>
            </div>
          </div>
        </div>

        {/* Cloud Config Ticket Card */}
        <div className="ticket-card" style={{ marginBottom: 0, boxShadow: '14px 16px 0 #f7d891' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Server size={18} color="var(--coral-deep)" />
            <h3 style={{ font: '700 20px Bricolage Grotesque, sans-serif', letterSpacing: '-.04em', color: 'var(--rose)', margin: 0 }}>
              Cloud Gateway Status
            </h3>
          </div>

          <div style={{ display: 'grid', gap: '12px', fontSize: '12px' }}>
            <div>
              <span style={{ font: '700 10px IBM Plex Mono, monospace', color: 'var(--rose-soft)', textTransform: 'uppercase' }}>REST Base URL</span>
              <div style={{ background: 'var(--paper)', padding: '8px 12px', borderRadius: '5px', border: '1px solid var(--line)', font: '600 11px IBM Plex Mono, monospace', color: 'var(--coral-deep)', marginTop: '4px' }}>
                {getApiBaseUrl()}
              </div>
            </div>

            <div>
              <span style={{ font: '700 10px IBM Plex Mono, monospace', color: 'var(--rose-soft)', textTransform: 'uppercase' }}>Health Telemetry Path</span>
              <div style={{ background: 'var(--paper)', padding: '8px 12px', borderRadius: '5px', border: '1px solid var(--line)', font: '600 11px IBM Plex Mono, monospace', color: 'var(--rose)', marginTop: '4px' }}>
                /api/health
              </div>
            </div>

            <div style={{ background: backendHealth?.connected ? '#ffd5c1' : '#fae9df', padding: '12px', borderRadius: '6px', border: '1px solid var(--line)', marginTop: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', font: '700 11px IBM Plex Mono, monospace', color: backendHealth?.connected ? 'var(--coral-deep)' : 'var(--marigold)' }}>
                {backendHealth?.connected ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                <span>{backendHealth?.connected ? 'Spring Boot Active Gateway' : 'Connecting to Core Backend...'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
