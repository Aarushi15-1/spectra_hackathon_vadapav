import React, { useState, useEffect } from 'react';
import {
  Users,
  TestTube,
  FileCheck2,
  Clock,
  Server
} from 'lucide-react';
import { fetchDashboardStats, fetchRecentOrders } from '../services/apiService';

const DashboardView = ({ backendHealth }) => {
  const [stats, setStats] = useState({
    totalPatients: 1248,
    activeOrders: 42,
    pendingVerification: 18,
    reportsReleasedToday: 156,
    pipelineStages: [
      { label: 'PENDING', desc: 'Order Created', color: '#64748b', bg: '#f1f5f9' },
      { label: 'SAMPLE_COLLECTED', desc: 'Specimen Drawn', color: '#ea580c', bg: '#ffedd5' },
      { label: 'IN_ANALYSIS', desc: 'Lab Processing', color: '#d97706', bg: '#fef3c7' },
      { label: 'RESULT_READY', desc: 'Values Entered', color: '#e11d48', bg: '#ffe4e6' },
      { label: 'VERIFIED', desc: 'Pathologist Approved', color: '#059669', bg: '#d1fae5' },
      { label: 'COMPLETED', desc: 'Report Delivered', color: '#10b981', bg: '#ecfdf5' }
    ]
  });

  const [recentOrders, setRecentOrders] = useState([
    { orderId: 'ORD-9821', patientName: 'Rahul Sharma', tests: 'CBC, Lipid Profile', date: 'Today, 09:30 AM', status: 'IN_ANALYSIS' },
    { orderId: 'ORD-9820', patientName: 'Priya Patel', tests: 'Liver Function Test (LFT)', date: 'Today, 08:45 AM', status: 'RESULT_READY' },
    { orderId: 'ORD-9819', patientName: 'Amit Verma', tests: 'HbA1c, Fasting Blood Sugar', date: 'Today, 08:15 AM', status: 'VERIFIED' },
    { orderId: 'ORD-9818', patientName: 'Sunita Rao', tests: 'Thyroid Profile (T3, T4, TSH)', date: 'Yesterday, 04:20 PM', status: 'COMPLETED' }
  ]);

  useEffect(() => {
    const loadBackendData = async () => {
      if (backendHealth?.connected) {
        const liveStats = await fetchDashboardStats();
        if (liveStats) {
          setStats(liveStats);
        }
        const liveOrders = await fetchRecentOrders();
        if (liveOrders) {
          setRecentOrders(liveOrders);
        }
      }
    };
    loadBackendData();
  }, [backendHealth?.connected]);

  const getBadgeClass = (status) => {
    switch (status) {
      case 'IN_ANALYSIS': return 'badge-warning';
      case 'RESULT_READY': return 'badge-info';
      case 'VERIFIED': return 'badge-success';
      case 'COMPLETED': return 'badge-success';
      default: return 'badge-info';
    }
  };

  return (
    <div className="view-container">
      {/* Banner showcasing live backend connection info */}
      <div className="banner">
        <div className="banner-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Server size={18} color="var(--accent-red)" />
            <h3>Spring Boot Backend Connection Status</h3>
          </div>
          <p>
            Endpoint: <code style={{ background: '#ffffff', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-accent)', color: 'var(--accent-red)', fontWeight: '600' }}>http://localhost:8080/api/health</code>
          </p>
          <div style={{ fontSize: '0.825rem', marginTop: '0.4rem', color: 'var(--text-main)' }}>
            Response: <span style={{ fontWeight: '700', color: backendHealth?.connected ? '#059669' : 'var(--accent-red)' }}>
              {backendHealth?.data ? JSON.stringify(backendHealth.data) : (backendHealth?.error || 'Checking connection...')}
            </span>
          </div>
        </div>

        <div>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Refresh Dashboard
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="card-grid">
        <div className="stat-card">
          <div className="stat-info">
            <p>Total Registered Patients</p>
            <h3>{stats.totalPatients.toLocaleString()}</h3>
          </div>
          <div className="stat-icon" style={{ background: 'var(--accent-orange-light)', color: 'var(--accent-orange)' }}>
            <Users size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <p>Active Lab Orders</p>
            <h3>{stats.activeOrders}</h3>
          </div>
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
            <Clock size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <p>Pending Verification</p>
            <h3>{stats.pendingVerification}</h3>
          </div>
          <div className="stat-icon" style={{ background: 'var(--accent-red-light)', color: 'var(--accent-red)' }}>
            <TestTube size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <p>Reports Released Today</p>
            <h3>{stats.reportsReleasedToday}</h3>
          </div>
          <div className="stat-icon" style={{ background: '#d1fae5', color: '#059669' }}>
            <FileCheck2 size={24} />
          </div>
        </div>
      </div>

      {/* Order Status Pipeline Info */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '2rem', boxShadow: 'var(--shadow-card)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-main)' }}>
          LabConnect Order Lifecycle Pipeline
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', textAlign: 'center' }}>
          {(stats.pipelineStages || []).map((stage, idx) => (
            <div key={idx} style={{ background: stage.bg || '#f8fafc', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '800', color: stage.color || '#ea580c', marginBottom: '0.2rem' }}>{stage.label}</div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-main)', fontWeight: '500' }}>{stage.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders Data Table */}
      <div className="data-table-container">
        <div className="table-header">
          <h3>Recent Lab Orders Overview</h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
              Filter Status
            </button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Patient Name</th>
              <th>Ordered Tests</th>
              <th>Date & Time</th>
              <th>Order Status</th>
              <th>Report Action</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((row) => (
              <tr key={row.orderId}>
                <td style={{ fontWeight: '700', color: 'var(--accent-red)' }}>{row.orderId}</td>
                <td style={{ fontWeight: '600' }}>{row.patientName}</td>
                <td>{row.tests}</td>
                <td style={{ color: 'var(--text-muted)' }}>{row.date}</td>
                <td>
                  <span className={`badge ${getBadgeClass(row.status)}`}>{row.status}</span>
                </td>
                <td>
                  <button className="btn btn-outline" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}>
                    View Details
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
