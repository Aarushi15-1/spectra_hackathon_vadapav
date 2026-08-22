import React from 'react';
import { FileText, Download, CheckCircle, Clock, ShieldCheck, ArrowUpRight } from 'lucide-react';

const mockReports = [
  { reportId: 'REP-7701', orderId: 'ORD-9819', patient: 'Amit Verma', test: 'HbA1c, Fasting Blood Sugar', pathologist: 'Dr. S. K. Mehta', status: 'VERIFIED', date: '2026-08-22 08:30 AM' },
  { reportId: 'REP-7700', orderId: 'ORD-9818', patient: 'Sunita Rao', test: 'Thyroid Profile', pathologist: 'Dr. S. K. Mehta', status: 'VERIFIED', date: '2026-08-21 05:15 PM' },
  { reportId: 'REP-7699', orderId: 'ORD-9820', patient: 'Priya Patel', test: 'Liver Function Test (LFT)', pathologist: 'Pending Signoff', status: 'DRAFT', date: '2026-08-22 09:10 AM' },
];

const LabReportsView = () => {
  return (
    <div className="view-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: '800', color: '#ffffff' }}>Diagnostic Reports</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Review draft reports, perform digital pathologist verification, and sign FHIR DiagnosticReports</p>
        </div>
      </div>

      <div className="data-table-card">
        <div className="section-header">
          <h3>Verified Reports Feed</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>HL7 V2 / FHIR R4 Compliant</span>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Report ID</th>
              <th>Order Ref</th>
              <th>Patient Name</th>
              <th>Diagnostic Panel</th>
              <th>Verified Pathologist</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockReports.map((report) => (
              <tr key={report.reportId}>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-cyan)' }}>{report.reportId}</td>
                <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-light)', fontSize: '0.8rem' }}>{report.orderId}</td>
                <td style={{ fontWeight: '600', color: '#ffffff' }}>{report.patient}</td>
                <td style={{ color: 'var(--text-muted)' }}>{report.test}</td>
                <td style={{ color: 'var(--text-light)' }}>{report.pathologist}</td>
                <td>
                  <span className={`badge ${report.status === 'VERIFIED' ? 'badge-success' : 'badge-warning'}`}>
                    {report.status}
                  </span>
                </td>
                <td>
                  <button className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Download size={12} />
                    <span>Download PDF</span>
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

export default LabReportsView;
