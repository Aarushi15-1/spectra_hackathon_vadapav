import React from 'react';
import { Calendar, Clock, MapPin, User, Plus } from 'lucide-react';

const mockBookings = [
  { id: 'APT-301', patient: 'Rahul Sharma', test: 'CBC & Lipid Profile', slot: 'Today, 07:30 AM - 08:30 AM', type: 'Home Collection', phlebotomist: 'Suresh Kumar', status: 'CONFIRMED' },
  { id: 'APT-302', patient: 'Priya Patel', test: 'Liver Function Test', slot: 'Today, 09:00 AM - 10:00 AM', type: 'Lab Visit', phlebotomist: 'Walk-in Desk', status: 'IN_PROGRESS' },
  { id: 'APT-303', patient: 'Vikram Singh', test: 'Thyroid Profile', slot: 'Tomorrow, 08:00 AM - 09:00 AM', type: 'Home Collection', phlebotomist: 'Assigning...', status: 'SCHEDULED' }
];

const AppointmentsView = () => {
  return (
    <div className="view-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Sample Collection Appointments</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Schedule home collections and lab visit slots for specimen drawing</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} /> Book Collection Slot
        </button>
      </div>

      <div className="data-table-container">
        <div className="table-header">
          <h3>Collection Schedule</h3>
        </div>

        <table>
          <thead>
            <tr>
              <th>Appt ID</th>
              <th>Patient</th>
              <th>Requested Tests</th>
              <th>Time Slot</th>
              <th>Collection Mode</th>
              <th>Phlebotomist</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {mockBookings.map((apt) => (
              <tr key={apt.id}>
                <td style={{ fontWeight: '600', color: 'var(--accent-cyan)' }}>{apt.id}</td>
                <td style={{ fontWeight: '500' }}>{apt.patient}</td>
                <td>{apt.test}</td>
                <td style={{ color: 'var(--text-muted)' }}>{apt.slot}</td>
                <td>
                  <span className="badge badge-info">{apt.type}</span>
                </td>
                <td>{apt.phlebotomist}</td>
                <td>
                  <span className="badge badge-success">{apt.status}</span>
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
