import React from 'react';
import { Calendar, Plus, ArrowRight, Clock, MapPin } from 'lucide-react';

const mockBookings = [
  { id: 'APT-301', patient: 'Rahul Sharma', test: 'CBC & Lipid Profile', slot: 'Today, 07:30 AM - 08:30 AM', type: 'Home Collection', phlebotomist: 'Suresh Kumar', status: 'CONFIRMED' },
  { id: 'APT-302', patient: 'Priya Patel', test: 'Liver Function Test', slot: 'Today, 09:00 AM - 10:00 AM', type: 'Lab Visit', phlebotomist: 'Walk-in Desk', status: 'IN_PROGRESS' },
  { id: 'APT-303', patient: 'Vikram Singh', test: 'Thyroid Profile', slot: 'Tomorrow, 08:00 AM - 09:00 AM', type: 'Home Collection', phlebotomist: 'Assigning...', status: 'SCHEDULED' }
];

const AppointmentsView = () => {
  return (
    <div className="ticket-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <span style={{ color: 'var(--coral-deep)', font: '700 10px IBM Plex Mono, monospace', letterSpacing: '.1em', textTransform: 'uppercase' }}>
            01 / SPECIMEN DISPATCH
          </span>
          <h2 style={{ font: '700 28px Bricolage Grotesque, sans-serif', letterSpacing: '-.06em', color: 'var(--rose)', margin: '4px 0 0' }}>
            Sample Collection & Phlebotomy Queues
          </h2>
          <p style={{ color: 'var(--rose-soft)', fontSize: '13px', margin: '4px 0 0' }}>
            Home phlebotomy routes and center-based specimen drawing bookings
          </p>
        </div>
        <button className="signal-button">
          <Plus size={15} />
          <span>Book Sample Slot</span>
        </button>
      </div>

      <div style={{ background: 'var(--paper)', borderRadius: '6px', border: '1px solid var(--line)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--line)', background: '#fae9df' }}>
              <th style={{ padding: '12px 16px', font: '700 10px IBM Plex Mono, monospace', color: 'var(--rose-soft)', textTransform: 'uppercase' }}>Appt ID</th>
              <th style={{ padding: '12px 16px', font: '700 10px IBM Plex Mono, monospace', color: 'var(--rose-soft)', textTransform: 'uppercase' }}>Patient</th>
              <th style={{ padding: '12px 16px', font: '700 10px IBM Plex Mono, monospace', color: 'var(--rose-soft)', textTransform: 'uppercase' }}>Requested Panels</th>
              <th style={{ padding: '12px 16px', font: '700 10px IBM Plex Mono, monospace', color: 'var(--rose-soft)', textTransform: 'uppercase' }}>Time Window</th>
              <th style={{ padding: '12px 16px', font: '700 10px IBM Plex Mono, monospace', color: 'var(--rose-soft)', textTransform: 'uppercase' }}>Collection Mode</th>
              <th style={{ padding: '12px 16px', font: '700 10px IBM Plex Mono, monospace', color: 'var(--rose-soft)', textTransform: 'uppercase' }}>Phlebotomist</th>
              <th style={{ padding: '12px 16px', font: '700 10px IBM Plex Mono, monospace', color: 'var(--rose-soft)', textTransform: 'uppercase' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {mockBookings.map((apt) => (
              <tr key={apt.id} style={{ borderBottom: '1px solid rgba(231,185,166,0.4)' }}>
                <td style={{ padding: '14px 16px', font: '700 11px IBM Plex Mono, monospace', color: 'var(--coral-deep)' }}>
                  {apt.id}
                </td>
                <td style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--rose)' }}>
                  {apt.patient}
                </td>
                <td style={{ padding: '14px 16px', color: 'var(--rose-soft)' }}>
                  {apt.test}
                </td>
                <td style={{ padding: '14px 16px', font: '600 11px IBM Plex Mono, monospace', color: 'var(--rose-soft)' }}>
                  {apt.slot}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ background: '#ffd5c1', color: 'var(--rose)', padding: '3px 8px', borderRadius: '999px', font: '700 10px IBM Plex Mono, monospace' }}>
                    {apt.type}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', fontWeight: '600', color: 'var(--rose)' }}>
                  {apt.phlebotomist}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    background: apt.status === 'CONFIRMED' ? '#ffd5c1' : '#fae9df',
                    color: apt.status === 'CONFIRMED' ? 'var(--coral-deep)' : 'var(--marigold)',
                    padding: '3px 8px',
                    borderRadius: '999px',
                    font: '700 10px IBM Plex Mono, monospace'
                  }}>
                    {apt.status}
                  </span>
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
