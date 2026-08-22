import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, User, ArrowRight, Phone, Droplet, Calendar, ShieldCheck } from 'lucide-react';
import { fetchPatients } from '../services/apiService';

const defaultPatients = [
  { id: 'PAT-1001', name: 'Rahul Sharma', age: 34, gender: 'MALE', blood: 'O+', phone: '+91 98765 43210', ordersCount: 4, lastVisit: '2026-08-20' },
  { id: 'PAT-1002', name: 'Priya Patel', age: 29, gender: 'FEMALE', blood: 'A+', phone: '+91 98123 45678', ordersCount: 2, lastVisit: '2026-08-22' },
  { id: 'PAT-1003', name: 'Amit Verma', age: 52, gender: 'MALE', blood: 'B+', phone: '+91 97654 32109', ordersCount: 6, lastVisit: '2026-08-19' },
  { id: 'PAT-1004', name: 'Sunita Rao', age: 45, gender: 'FEMALE', blood: 'AB+', phone: '+91 99887 76655', ordersCount: 1, lastVisit: '2026-08-15' },
  { id: 'PAT-1005', name: 'Vikram Singh', age: 38, gender: 'MALE', blood: 'O-', phone: '+91 91234 56789', ordersCount: 3, lastVisit: '2026-08-10' }
];

const PatientsView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState(defaultPatients);

  useEffect(() => {
    const load = async () => {
      const data = await fetchPatients();
      if (data && data.length > 0) {
        setPatients(data);
      }
    };
    load();
  }, []);

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="ticket-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <span style={{ color: 'var(--coral-deep)', font: '700 10px IBM Plex Mono, monospace', letterSpacing: '.1em', textTransform: 'uppercase' }}>
              01 / IDENTITY REGISTRY
            </span>
            <h2 style={{ font: '700 28px Bricolage Grotesque, sans-serif', letterSpacing: '-.06em', color: 'var(--rose)', margin: '4px 0 0' }}>
              ABHA Verified Patient Directory
            </h2>
            <p style={{ color: 'var(--rose-soft)', fontSize: '13px', margin: '4px 0 0' }}>
              Authenticated demographic records linked to National Health Authority repository
            </p>
          </div>
          <button className="signal-button">
            <Plus size={15} />
            <span>Register ABHA Patient</span>
          </button>
        </div>

        {/* Search & Filter bar */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--rose-soft)' }} />
            <input
              type="text"
              placeholder="Search by patient name or ABHA ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 38px',
                borderRadius: '6px',
                background: 'var(--paper)',
                border: '1px solid var(--line)',
                color: 'var(--rose)',
                fontSize: '12px',
                outline: 'none',
                fontFamily: 'Manrope, sans-serif'
              }}
            />
          </div>
          <button className="workspace-chip" style={{ padding: '9px 14px' }}>
            <Filter size={13} />
            <span>All Groups</span>
          </button>
        </div>

        {/* Patient Table */}
        <div style={{ background: 'var(--paper)', borderRadius: '6px', border: '1px solid var(--line)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)', background: '#fae9df' }}>
                <th style={{ padding: '12px 16px', font: '700 10px IBM Plex Mono, monospace', color: 'var(--rose-soft)', textTransform: 'uppercase' }}>Patient ID</th>
                <th style={{ padding: '12px 16px', font: '700 10px IBM Plex Mono, monospace', color: 'var(--rose-soft)', textTransform: 'uppercase' }}>Full Name</th>
                <th style={{ padding: '12px 16px', font: '700 10px IBM Plex Mono, monospace', color: 'var(--rose-soft)', textTransform: 'uppercase' }}>Demographics</th>
                <th style={{ padding: '12px 16px', font: '700 10px IBM Plex Mono, monospace', color: 'var(--rose-soft)', textTransform: 'uppercase' }}>Blood Group</th>
                <th style={{ padding: '12px 16px', font: '700 10px IBM Plex Mono, monospace', color: 'var(--rose-soft)', textTransform: 'uppercase' }}>Phone</th>
                <th style={{ padding: '12px 16px', font: '700 10px IBM Plex Mono, monospace', color: 'var(--rose-soft)', textTransform: 'uppercase' }}>Lab Orders</th>
                <th style={{ padding: '12px 16px', font: '700 10px IBM Plex Mono, monospace', color: 'var(--rose-soft)', textTransform: 'uppercase' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id} style={{ borderBottom: '1px solid rgba(231,185,166,0.4)', transition: 'background .16s ease' }}>
                  <td style={{ padding: '14px 16px', font: '700 11px IBM Plex Mono, monospace', color: 'var(--coral-deep)' }}>
                    {patient.id}
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--rose)' }}>
                    {patient.name}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--rose-soft)' }}>
                    {patient.age} yrs · {patient.gender}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: '#ffd5c1', color: 'var(--rose)', padding: '3px 8px', borderRadius: '999px', font: '700 10px IBM Plex Mono, monospace' }}>
                      {patient.blood || patient.bloodGroup || 'O+'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', font: '600 11px IBM Plex Mono, monospace', color: 'var(--rose-soft)' }}>
                    {patient.phone}
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--rose)' }}>
                    {patient.ordersCount} orders
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button className="workspace-chip" style={{ padding: '4px 10px', fontSize: '10px' }}>
                      <span>View History</span>
                      <ArrowRight size={11} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientsView;
