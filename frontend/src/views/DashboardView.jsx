import React, { useState, useEffect } from 'react';
import {
  Users,
  TestTube,
  FileCheck2,
  Clock,
  Server,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { fetchDashboardStats, fetchRecentOrders } from '../services/apiService';

const DashboardView = ({ backendHealth }) => {
  const [stats, setStats] = useState({
    totalPatients: 1248,
    activeOrders: 42,
    pendingVerification: 18,
    reportsReleasedToday: 156,
    pipelineStages: [
      { label: 'PENDING', desc: 'Order Created', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)' },
      { label: 'SAMPLE_COLLECTED', desc: 'Specimen Drawn', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
      { label: 'IN_ANALYSIS', desc: 'Lab Processing', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)' },
      { label: 'RESULT_READY', desc: 'Values Entered', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.1)' },
      { label: 'VERIFIED', desc: 'Pathologist Approved', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
      { label: 'COMPLETED', desc: 'Report Delivered', color: '#34d399', bg: 'rgba(52, 211, 153, 0.1)' }
    ]
  });

  const [recentOrders, setRecentOrders] = useState([
    { orderId: 'ORD-9821', patientName: 'Rahul Sharma', tests: 'CBC, Lipid Profile', date: 'Today, 09:30 AM', status: 'IN_ANALYSIS' },
    { orderId: 'ORD-9820', patientName: 'Priya Patel', tests: 'Liver Function Test (LFT)', date: 'Today, 08:45 AM', status: 'RESULT_READY' },
    { orderId: 'ORD-9819', patientName: 'Amit Verma', tests: 'HbA1c, Fasting Blood Sugar', date: 'Today, 08:15 AM', status: 'VERIFIED' },
    { orderId: 'ORD-9818', patientName: 'Sunita Rao', tests: 'Thyroid Profile (T3, T4, TSH)', date: 'Yesterday, 04:20 PM', status: 'COMPLETED' }
  ]);

  const [loading, setLoading] = useState(false);

  const loadBackendData = async () => {
    setLoading(true);
    try {
      const liveStats = await fetchDashboardStats();
      if (liveStats) {
        setStats(liveStats);
      }
      const liveOrders = await fetchRecentOrders();
      if (liveOrders) {
        setRecentOrders(liveOrders);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBackendData();
  }, [backendHealth?.connected]);

  const getBadgeClass = (status) => {
    switch (status) {
      case 'IN_ANALYSIS': return 'badge-info';
      case 'RESULT_READY': return 'badge-warning';
      case 'VERIFIED': return 'badge-success';
      case 'COMPLETED': return 'badge-success';
      default: return 'badge-info';
    }
  };

  return (
    <div className="view-container">
      {/* Live Backend Connection Status Banner */}
      <div className="banner">
        <div className="banner-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <Server size={20} color="var(--accent-emerald)" />
            <h3>Spring Boot Core Connection</h3>
            <span className={`badge ${backendHealth?.connected ? 'badge-success' : 'badge-danger'}`}>
              {backendHealth?.connected ? 'ONLINE' : 'CONNECTING'}
            </span>
          </div>
          <p>
            API Gateway: <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', background: 'rgba(6, 182, 212, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>http://localhost:8080/api/health</code>
          </p>
          <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={14} color="var(--accent-emerald)" />
            <span>Response: <strong style={{ color: backendHealth?.connected ? '#34d399' : '#f43f5e' }}>{backendHealth?.data ? JSON.stringify(backendHealth.data) : (backendHealth?.error || 'Checking gateway...')}</strong></span>
          </div>
        </div>

        <div>
          <button className="btn-primary" onClick={loadBackendData} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            <span>Sync Data</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Total Patients</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
              <Users size={20} />
            </div>
          </div>
          <div className="stat-value">{stats.totalPatients?.toLocaleString() || 1248}</div>
          <div className="stat-subtext">
            <span style={{ color: 'var(--accent-emerald)' }}>+14.2%</span> from last week
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Active Orders</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)' }}>
              <Clock size={20} />
            </div>
          </div>
          <div className="stat-value">{stats.activeOrders || 42}</div>
          <div className="stat-subtext">
            <span style={{ color: 'var(--accent-cyan)' }}>In pipeline</span> active analysis
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Pending Verification</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-coral)' }}>
              <TestTube size={20} />
            </div>
          </div>
          <div className="stat-value">{stats.pendingVerification || 18}</div>
          <div className="stat-subtext">
            <span style={{ color: 'var(--accent-coral)' }}>Pathologist review</span> required
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Reports Released Today</span>
            <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)' }}>
              <FileCheck2 size={20} />
            </div>
          </div>
          <div className="stat-value">{stats.reportsReleasedToday || 156}</div>
          <div className="stat-subtext">
            <span style={{ color: 'var(--accent-emerald)' }}>100% delivered</span> via FHIR/PDF
          </div>
        </div>
      </div>

      {/* Order Status Pipeline Info */}
      <div className="pipeline-section">
        <div className="section-header">
          <h3>LabConnect Order Lifecycle Pipeline</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Automated Stage Progression</span>
        </div>
        <div className="pipeline-grid">
          {(stats.pipelineStages || []).map((stage, idx) => (
            <div key={idx} className="pipeline-step">
              <span className="step-badge" style={{ background: stage.bg || 'rgba(255,255,255,0.05)', color: stage.color || 'var(--accent-cyan)' }}>
                {stage.label}
              </span>
              <div className="step-desc">{stage.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders Data Table */}
      <div className="data-table-card">
        <div className="section-header">
          <h3>Recent Diagnostic Orders</h3>
          <button className="btn-secondary" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
            Filter Live Feed
          </button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Patient Name</th>
              <th>Ordered Tests</th>
              <th>Timestamp</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((row) => (
              <tr key={row.orderId}>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-cyan)' }}>{row.orderId}</td>
                <td style={{ fontWeight: '600', color: '#ffffff' }}>{row.patientName}</td>
                <td style={{ color: 'var(--text-muted)' }}>{row.tests}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-light)' }}>{row.date}</td>
                <td>
                  <span className={`badge ${getBadgeClass(row.status)}`}>{row.status}</span>
                </td>
                <td>
                  <button className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span>Details</span>
                    <ArrowUpRight size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardView;
