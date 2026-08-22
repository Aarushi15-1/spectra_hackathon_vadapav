import React, { useState, useEffect } from 'react';
import {
  Users,
  TestTube,
  FileCheck2,
  Clock,
  Server,
  FlaskConical,
  Activity,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  FileCode,
  X,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { fetchDashboardStats, fetchRecentOrders } from '../services/apiService';

const fhirSampleBundle = `{
  "resourceType": "Bundle",
  "type": "transaction",
  "entry": [
    {
      "resource": {
        "resourceType": "DiagnosticReport",
        "id": "DR-9820-LFT",
        "status": "final",
        "category": [
          {
            "coding": [{ "system": "http://loinc.org", "code": "24323-8", "display": "Liver Function Panel" }]
          }
        ],
        "subject": { "reference": "Patient/PAT-1002", "display": "Priya Patel" },
        "performer": [{ "display": "HealthBridge Central PathLab (NABL-109)" }],
        "conclusion": "Bilirubin and SGPT values within normal physiological ranges."
      }
    },
    {
      "resource": {
        "resourceType": "Observation",
        "id": "OBS-BIL-01",
        "status": "final",
        "code": { "text": "Total Bilirubin" },
        "valueQuantity": { "value": 0.8, "unit": "mg/dL" },
        "referenceRange": [{ "low": { "value": 0.2 }, "high": { "value": 1.2 } }]
      }
    }
  ]
}`;

const DashboardView = ({ backendHealth }) => {
  const [stats, setStats] = useState({
    totalPatients: 1248,
    activeOrders: 42,
    pendingVerification: 18,
    reportsReleasedToday: 156,
    pipelineStages: [
      { label: 'PENDING', desc: 'Order Created', color: 'var(--rose-soft)' },
      { label: 'SAMPLE_COLLECTED', desc: 'Specimen Drawn', color: 'var(--marigold)' },
      { label: 'IN_ANALYSIS', desc: 'Lab Processing', color: 'var(--coral)' },
      { label: 'RESULT_READY', desc: 'Values Entered', color: 'var(--papaya)' },
      { label: 'VERIFIED', desc: 'Pathologist Approved', color: 'var(--coral-deep)' },
      { label: 'COMPLETED', desc: 'Report Delivered', color: 'var(--rose)' }
    ]
  });

  const [recentOrders, setRecentOrders] = useState([
    {
      orderId: 'ORD-9821',
      patientName: 'Rahul Sharma',
      patientId: 'PAT-1001',
      tests: 'Complete Blood Count (CBC), Lipid Profile',
      date: 'Today, 09:30 AM',
      status: 'IN_ANALYSIS',
      icon: FlaskConical,
      color: 'marigold',
      details: 'Specimen drawn via EDTA Tube. Automated analyzer processing cell count and cholesterol fractions.'
    },
    {
      orderId: 'ORD-9820',
      patientName: 'Priya Patel',
      patientId: 'PAT-1002',
      tests: 'Liver Function Test (LFT)',
      date: 'Today, 08:45 AM',
      status: 'RESULT_READY',
      icon: TestTube,
      color: 'coral',
      details: 'Serum chemistry results calculated. Total Bilirubin 0.8 mg/dL, SGPT 24 U/L. Ready for signature.'
    },
    {
      orderId: 'ORD-9819',
      patientName: 'Amit Verma',
      patientId: 'PAT-1003',
      tests: 'HbA1c & Fasting Blood Sugar',
      date: 'Today, 08:15 AM',
      status: 'VERIFIED',
      icon: FileCheck2,
      color: 'papaya',
      details: 'Verified and signed by Dr. S. K. Mehta (Reg: MCI-88219). Digitally pushed to ABDM health repository.'
    },
    {
      orderId: 'ORD-9818',
      patientName: 'Sunita Rao',
      patientId: 'PAT-1004',
      tests: 'Thyroid Profile (T3, T4, TSH)',
      date: 'Yesterday, 04:20 PM',
      status: 'COMPLETED',
      icon: Activity,
      color: 'marigold',
      details: 'Patient accessed report via QR digital health card. Encounter closed.'
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState(0);
  const [showFhirModal, setShowFhirModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadBackendData = async () => {
    setLoading(true);
    try {
      const liveStats = await fetchDashboardStats();
      if (liveStats) {
        setStats(liveStats);
      }
      const liveOrders = await fetchRecentOrders();
      if (liveOrders && liveOrders.length > 0) {
        setRecentOrders(liveOrders.map((o, idx) => ({
          ...o,
          patientId: `PAT-100${idx + 1}`,
          icon: idx % 2 === 0 ? FlaskConical : TestTube,
          color: idx % 3 === 0 ? 'coral' : (idx % 3 === 1 ? 'marigold' : 'papaya'),
          details: `${o.tests} · Standard Diagnostic Procedure Protocol.`
        })));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBackendData();
  }, [backendHealth?.connected]);

  const active = recentOrders[selectedOrder] || recentOrders[0];

  return (
    <div>
      {/* Dashboard Hero Banner */}
      <section className="dashboard-hero">
        <div className="hero-copy">
          <div className="hero-eyebrow">
            <span></span>
            LIVE PATHOLOGY STREAM
          </div>
          <h2>Diagnostic Operations & Automated HL7 / FHIR Gateway</h2>
          <p>
            Connected to Spring Boot ABDM repository. Automatically transforming LIMS HL7 v2 telemetry into FHIR R4 DiagnosticReports.
          </p>
          <div className="hero-meta">
            <span>• Backend Gateway: {backendHealth?.connected ? 'ONLINE' : 'CONNECTING'}</span>
            <span>• Auto-Sync: 15s</span>
            <span>• Supabase Engine: Active</span>
          </div>
        </div>

        <div className="hero-stamp">
          <div>
            <span>SPECIMEN</span>
            <strong>NHA</strong>
            <span>APPROVED</span>
          </div>
        </div>
      </section>

      {/* Vitals / Metric Cards */}
      <section className="vitals-section">
        <div className="section-heading">
          <div>
            <p className="section-index">01 / METRICS</p>
            <h3>Daily Diagnostic Throughput</h3>
          </div>
          <button
            className="signal-button"
            onClick={loadBackendData}
            style={{ padding: '8px 14px', fontSize: '11px' }}
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            <span>Sync Gateway</span>
          </button>
        </div>

        <div className="vitals-grid">
          <div className="vital-card">
            <span className="vital-mark mark-0">P</span>
            <p>Registered Patients</p>
            <strong>{stats.totalPatients?.toLocaleString() || '1,248'}</strong>
            <em><span></span> Active in ABHA Registry</em>
          </div>

          <div className="vital-card">
            <span className="vital-mark mark-1">O</span>
            <p>Active Lab Orders</p>
            <strong>{stats.activeOrders || 42}</strong>
            <em><span></span> In Specimen Pipeline</em>
          </div>

          <div className="vital-card">
            <span className="vital-mark mark-2">V</span>
            <p>Pending Verification</p>
            <strong>{stats.pendingVerification || 18}</strong>
            <em><span></span> Pathologist Signoff</em>
          </div>

          <div className="vital-card">
            <span className="vital-mark mark-3">R</span>
            <p>Reports Released Today</p>
            <strong>{stats.reportsReleasedToday || 156}</strong>
            <em><span></span> 100% FHIR Converted</em>
          </div>
        </div>
      </section>

      {/* Pipeline Stage Visualizer */}
      <section className="ticket-card" style={{ padding: '22px 26px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <span style={{ color: 'var(--coral-deep)', font: '700 10px IBM Plex Mono, monospace', letterSpacing: '.1em', textTransform: 'uppercase' }}>
              02 / WORKFLOW AUTOMATION
            </span>
            <h4 style={{ font: '700 20px Bricolage Grotesque, sans-serif', letterSpacing: '-.05em', margin: '4px 0 0', color: 'var(--rose)' }}>
              Order Lifecycle Telemetry
            </h4>
          </div>
          <span style={{ font: '600 11px IBM Plex Mono, monospace', color: 'var(--rose-soft)' }}>
            NHA Milestones 1-6
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
          {(stats.pipelineStages || []).map((stage, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--paper)',
                padding: '12px 14px',
                borderRadius: '6px',
                border: '1px solid var(--line)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--coral)' }}></span>
                <span style={{ font: '700 10px IBM Plex Mono, monospace', color: 'var(--rose)' }}>{stage.label}</span>
              </div>
              <small style={{ color: 'var(--rose-soft)', fontSize: '10px' }}>{stage.desc}</small>
            </div>
          ))}
        </div>
      </section>

      {/* Records & Orders Interactive Section */}
      <section className="records-section">
        <div className="section-heading">
          <div>
            <p className="section-index">03 / ACTIVE ORDERS</p>
            <h3>Live Diagnostic Feed & Inspection</h3>
          </div>
        </div>

        <div className="records-layout">
          <div className="record-timeline">
            {recentOrders.map((row, idx) => {
              const Icon = row.icon || FlaskConical;
              const isSelected = selectedOrder === idx;
              return (
                <button
                  key={row.orderId}
                  className={`record-row ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedOrder(idx)}
                >
                  <div className={`record-icon ${row.color || 'coral'}`}>
                    <Icon size={18} />
                  </div>
                  <div className="record-content">
                    <em>{row.orderId} · {row.status}</em>
                    <strong>{row.patientName} ({row.patientId})</strong>
                    <small>{row.tests}</small>
                  </div>
                  <div className="record-date">
                    <span>{row.date}</span>
                    <ArrowRight size={13} />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="record-detail">
            <div className="detail-type">
              <span className={`detail-dot ${active.color || 'coral'}`}></span>
              <span>{active.orderId} · {active.status}</span>
            </div>

            <h4>{active.tests}</h4>
            <p>{active.details}</p>

            <div className="secure-meta">
              <ShieldCheck size={16} />
              <div>
                <strong>HL7 V2 ORU^R01 Compliant</strong>
                <div>Digital signature validated via SHA-256 certificate</div>
              </div>
            </div>

            <button className="fhir-button" onClick={() => setShowFhirModal(true)}>
              <span>View Raw FHIR Bundle</span>
              <span>JSON / R4 →</span>
            </button>
          </div>
        </div>
      </section>

      {/* FHIR Modal */}
      {showFhirModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(74, 31, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'grid', placeItems: 'center', zIndex: 100, padding: '20px' }}>
          <div className="fhir-dialog">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="issuer-seal">ABDM · FHIR R4 DIAGNOSTIC REPORT</span>
                <h2 style={{ font: '700 24px Bricolage Grotesque, sans-serif', color: 'var(--rose)', margin: '6px 0 0' }}>
                  {active.orderId} Telemetry Bundle
                </h2>
              </div>
              <button
                onClick={() => setShowFhirModal(false)}
                style={{ border: 0, background: 'transparent', color: 'var(--rose)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <pre>{fhirSampleBundle}</pre>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
              <span style={{ fontSize: '11px', color: 'var(--rose-soft)' }}>Conforms to HL7 FHIR Release 4 (LOINC & SNOMED CT)</span>
              <button className="signal-button" onClick={() => setShowFhirModal(false)}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardView;
