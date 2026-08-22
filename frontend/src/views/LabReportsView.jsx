import React from 'react';
import { FileText, Download, CheckCircle, Clock } from 'lucide-react';

const mockReports = [
  { reportId: 'REP-7701', orderId: 'ORD-9819', patient: 'Amit Verma', test: 'HbA1c, Fasting Blood Sugar', pathologist: 'Dr. S. K. Mehta', status: 'VERIFIED', date: '2026-08-22 08:30 AM' },
  { reportId: 'REP-7700', orderId: 'ORD-9818', patient: 'Sunita Rao', test: 'Thyroid Profile', pathologist: 'Dr. S. K. Mehta', status: 'VERIFIED', date: '2026-08-21 05:15 PM' },
  { reportId: 'REP-7699', orderId: 'ORD-9820', patient: 'Priya Patel', test: 'Liver Function Test (LFT)', pathologist: 'Pending Signoff', status: 'DRAFT', date: '2026-08-22 09:10 AM' },
];

const LabReportsView = () => {
  return (
    <div className="view-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Diagnostic Reports</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Review draft reports, perform pathologist verification, and release finalized reports</p>
        </div>
      </div>

      <div className="data-table-container">
        <div className="table-header">
          <h3>Lab Reports Status</h3>
        </div>

        <table>
          <thead>
            <tr>
              <th>Report ID</th>
              <th>Order Ref</th>
              <th>Patient Name</th>
              <th>Tests Included</th>
              <th>Verified By</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockReports.map((report) => (
              <tr key={report.reportId}>
                <td style={{ fontWeight: '600', color: 'var(--accent-cyan)' }}>{report.reportId}</td>
                <td>{report.orderId}</td>
                <td style={{ fontWeight: '500' }}>{report.patient}</td>
                <td>{report.test}</td>
                <td style={{ color: 'var(--text-muted)' }}>{report.pathologist}</td>
                <td>
                  <span className={`badge ${report.status === 'VERIFIED' ? 'badge-success' : 'badge-warning'}`}>
                    {report.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-outline" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}>
                    <Download size={12} /> Download PDF
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
