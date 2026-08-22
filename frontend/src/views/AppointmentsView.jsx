import React from 'react';
import { Calendar, Clock, MapPin, User, Plus, ArrowUpRight } from 'lucide-react';

const mockBookings = [
  { id: 'APT-301', patient: 'Rahul Sharma', test: 'CBC & Lipid Profile', slot: 'Today, 07:30 AM - 08:30 AM', type: 'Home Collection', phlebotomist: 'Suresh Kumar', status: 'CONFIRMED' },
  { id: 'APT-302', patient: 'Priya Patel', test: 'Liver Function Test', slot: 'Today, 09:00 AM - 10:00 AM', type: 'Lab Visit', phlebotomist: 'Walk-in Desk', status: 'IN_PROGRESS' },
  { id: 'APT-303', patient: 'Vikram Singh', test: 'Thyroid Profile', slot: 'Tomorrow, 08:00 AM - 09:00 AM', type: 'Home Collection', phlebotomist: 'Assigning...', status: 'SCHEDULED' }
];

const AppointmentsView = () => {
  return (
    <div className="view-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: '800', color: '#ffffff' }}>Sample Collection Appointments</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Home phlebotomy visits and laboratory specimen collection queues</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} />
          <span>Book Collection Slot</span>
        </button>
      </div>

      <div className="data-table-card">
        <div className="section-header">
          <h3>Collection Schedule</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Real-time Schedule</span>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Appt ID</th>
              <th>Patient</th>
              <th>Requested Tests</th>
              <th>Time Slot</th>
              <th>Collection Mode</th>
              <th>Assigned Phlebotomist</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {mockBookings.map((apt) => (
              <tr key={apt.id}>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-cyan)' }}>{apt.id}</td>
                <td style={{ fontWeight: '600', color: '#ffffff' }}>{apt.patient}</td>
                <td style={{ color: 'var(--text-muted)' }}>{apt.test}</td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-light)' }}>{apt.slot}</td>
                <td>
                  <span className="badge badge-info">{apt.type}</span>
                </td>
                <td style={{ color: 'var(--text-main)' }}>{apt.phlebotomist}</td>
                <td>
                  <span className={`badge ${apt.status === 'CONFIRMED' ? 'badge-success' : (apt.status === 'IN_PROGRESS' ? 'badge-warning' : 'badge-info')}`}>
                    {apt.status}
                  </span>
                </td>
                <td>
                  <button className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span>Manage</span>
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

export default AppointmentsView;
