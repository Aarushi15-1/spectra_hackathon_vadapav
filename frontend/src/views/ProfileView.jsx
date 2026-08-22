import React from 'react';
import { Shield, Mail, Phone, Server } from 'lucide-react';
import { getApiBaseUrl } from '../services/apiService';

const ProfileView = ({ backendHealth }) => {
  return (
    <div className="view-container">
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>User Profile & System Preferences</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>LabConnect system operator credentials and API environment settings</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Profile Card */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-red), var(--accent-orange))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '1.25rem' }}>
              LC
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Lab Administrator</h4>
              <span className="badge badge-warning" style={{ marginTop: '0.2rem' }}>ROLE_PATHOLOGIST</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Mail size={16} color="var(--accent-red)" /> admin@healthbridge.labconnect.com
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Phone size={16} color="var(--accent-orange)" /> +91 (022) 4920-8800
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Shield size={16} color="#059669" /> Pathologist Accreditation ID: PATH-IND-88219
            </div>
          </div>
        </div>

        {/* API Settings Card */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Server size={20} color="var(--accent-red)" />
            <h4 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Backend Integration Settings</h4>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--text-main)', fontWeight: '600', marginBottom: '0.35rem' }}>Spring Boot Backend Base URL</label>
              <input
                type="text"
                readOnly
                value={getApiBaseUrl()}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  background: '#f8fafc',
                  border: '1px solid var(--border-color)',
                  color: 'var(--accent-red)',
                  fontFamily: 'monospace',
                  fontWeight: '600'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: 'var(--text-main)', fontWeight: '600', marginBottom: '0.35rem' }}>Health Endpoint Path</label>
              <input
                type="text"
                readOnly
                value="/api/health"
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  background: '#f8fafc',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-main)',
                  fontFamily: 'monospace'
                }}
              />
            </div>

            <div style={{ marginTop: '0.5rem', padding: '0.85rem', background: backendHealth?.connected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(225, 29, 72, 0.1)', borderRadius: 'var(--radius-sm)', border: `1px solid ${backendHealth?.connected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(225, 29, 72, 0.3)'}` }}>
              <div style={{ fontWeight: '700', color: backendHealth?.connected ? '#059669' : 'var(--accent-red)' }}>
                {backendHealth?.connected ? '✓ Connected to Spring Boot' : '✗ Disconnected'}
              </div>
              <div style={{ fontSize: '0.75rem', marginTop: '0.2rem', color: 'var(--text-main)' }}>
                {backendHealth?.data ? JSON.stringify(backendHealth.data) : (backendHealth?.error || 'Checking status...')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
