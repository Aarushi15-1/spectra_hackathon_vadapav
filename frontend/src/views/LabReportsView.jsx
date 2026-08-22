import React from 'react';
import { Download, ShieldCheck, FileCheck2, ArrowRight } from 'lucide-react';

const mockReports = [
  { reportId: 'REP-7701', orderId: 'ORD-9819', patient: 'Amit Verma', test: 'HbA1c, Fasting Blood Sugar', pathologist: 'Dr. S. K. Mehta', status: 'VERIFIED', date: '2026-08-22 08:30 AM' },
  { reportId: 'REP-7700', orderId: 'ORD-9818', patient: 'Sunita Rao', test: 'Thyroid Profile', pathologist: 'Dr. S. K. Mehta', status: 'VERIFIED', date: '2026-08-21 05:15 PM' },
  { reportId: 'REP-7699', orderId: 'ORD-9820', patient: 'Priya Patel', test: 'Liver Function Test (LFT)', pathologist: 'Pending Signoff', status: 'DRAFT', date: '2026-08-22 09:10 AM' },
];

const LabReportsView = () => {
  return (
    <div className="ticket-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <span style={{ color: 'var(--coral-deep)', font: '700 10px IBM Plex Mono, monospace', letterSpacing: '.1em', textTransform: 'uppercase' }}>
            01 / PATHOLOGY SIGNOFF
          </span>
          <h2 style={{ font: '700 28px Bricolage Grotesque, sans-serif', letterSpacing: '-.06em', color: 'var(--rose)', margin: '4px 0 0' }}>
            Diagnostic Reports & Digital Signatures
          </h2>
          <p style={{ color: 'var(--rose-soft)', fontSize: '13px', margin: '4px 0 0' }}>
            Cryptographically signed laboratory reports converted into ABDM FHIR DiagnosticReports
          </p>
        </div>
      </div>

      <div style={{ background: 'var(--paper)', borderRadius: '6px', border: '1px solid var(--line)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--line)', background: '#fae9df' }}>
              <th style={{ padding: '12px 16px', font: '700 10px IBM Plex Mono, monospace', color: 'var(--rose-soft)', textTransform: 'uppercase' }}>Report ID</th>
              <th style={{ padding: '12px 16px', font: '700 10px IBM Plex Mono, monospace', color: 'var(--rose-soft)', textTransform: 'uppercase' }}>Order Ref</th>
              <th style={{ padding: '12px 16px', font: '700 10px IBM Plex Mono, monospace', color: 'var(--rose-soft)', textTransform: 'uppercase' }}>Patient Name</th>
              <th style={{ padding: '12px 16px', font: '700 10px IBM Plex Mono, monospace', color: 'var(--rose-soft)', textTransform: 'uppercase' }}>Diagnostic Panel</th>
              <th style={{ padding: '12px 16px', font: '700 10px IBM Plex Mono, monospace', color: 'var(--rose-soft)', textTransform: 'uppercase' }}>Verified Pathologist</th>
              <th style={{ padding: '12px 16px', font: '700 10px IBM Plex Mono, monospace', color: 'var(--rose-soft)', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '12px 16px', font: '700 10px IBM Plex Mono, monospace', color: 'var(--rose-soft)', textTransform: 'uppercase' }}>PDF Document</th>
            </tr>
          </thead>
          <tbody>
            {mockReports.map((report) => (
              <tr key={report.reportId} style={{ borderBottom: '1px solid rgba(231,185,166,0.4)' }}>
                <td style={{ padding: '14px 16px', font: '700 11px IBM Plex Mono, monospace', color: 'var(--coral-deep)' }}>
                  {report.reportId}
                </td>
                <td style={{ padding: '14px 16px', font: '600 11px IBM Plex Mono, monospace', color: 'var(--rose-soft)' }}>
                  {report.orderId}
                </td>
                <td style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--rose)' }}>
                  {report.patient}
                </td>
                <td style={{ padding: '14px 16px', color: 'var(--rose-soft)' }}>
                  {report.test}
                </td>
                <td style={{ padding: '14px 16px', color: 'var(--rose)' }}>
                  {report.pathologist}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    background: report.status === 'VERIFIED' ? '#ffd5c1' : '#fae9df',
                    color: report.status === 'VERIFIED' ? 'var(--coral-deep)' : 'var(--marigold)',
                    padding: '3px 8px',
                    borderRadius: '999px',
                    font: '700 10px IBM Plex Mono, monospace'
                  }}>
                    {report.status}
                  </span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <button className="workspace-chip" style={{ padding: '4px 10px', fontSize: '10px' }}>
                    <Download size={11} />
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
