import React from 'react';
import { Shield, Mail, Phone, Server, CheckCircle2, XCircle } from 'lucide-react';
import { getApiBaseUrl } from '../services/apiService';

const ProfileView = ({ backendHealth }) => {
  return (
    <div className="view-container">
      <div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: '800', color: '#ffffff' }}>Pathologist Profile & System Settings</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Operator credentials and cloud gateway connection configuration</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Profile Card */}
        <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--accent-emerald), var(--accent-cyan))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#090d16', fontWeight: '800', fontSize: '1.3rem' }}>
              LC
            </div>
            <div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: '800', color: '#ffffff' }}>Dr. Lab Administrator</h4>
              <span className="badge badge-warning" style={{ marginTop: '0.35rem' }}>ROLE_PATHOLOGIST</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Mail size={16} color="var(--accent-cyan)" />
              <span style={{ color: 'var(--text-main)' }}>admin@healthbridge.labconnect.com</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Phone size={16} color="var(--accent-amber)" />
              <span style={{ color: 'var(--text-main)' }}>+91 (022) 4920-8800</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Shield size={16} color="var(--accent-emerald)" />
              <span style={{ color: 'var(--text-main)' }}>NABL Accreditation License: <strong>PATH-IND-88219</strong></span>
            </div>
          </div>
        </div>

        {/* Backend Settings Card */}
        <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Server size={20} color="var(--accent-cyan)" />
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: '700', color: '#ffffff' }}>Cloud Backend Configuration</h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', fontWeight: '700' }}>Gateway Base URL</label>
              <input
                type="text"
                readOnly
                value={getApiBaseUrl()}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--accent-cyan)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem', fontWeight: '700' }}>Health Endpoint</label>
              <input
                type="text"
                readOnly
                value="/api/health"
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ padding: '0.85rem 1rem', background: backendHealth?.connected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)', borderRadius: 'var(--radius-sm)', border: `1px solid ${backendHealth?.connected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', color: backendHealth?.connected ? '#34d399' : '#f43f5e' }}>
                {backendHealth?.connected ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                <span>{backendHealth?.connected ? 'Live Spring Boot Connection Active' : 'Connecting to Core Service...'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
