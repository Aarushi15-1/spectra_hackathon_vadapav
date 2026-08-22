import React, { useState } from 'react';
import { Search, Plus, Filter } from 'lucide-react';

const mockPatients = [
  { id: 'PAT-1001', name: 'Rahul Sharma', age: 34, gender: 'MALE', blood: 'O+', phone: '+91 98765 43210', ordersCount: 4, lastVisit: '2026-08-20' },
  { id: 'PAT-1002', name: 'Priya Patel', age: 29, gender: 'FEMALE', blood: 'A+', phone: '+91 98123 45678', ordersCount: 2, lastVisit: '2026-08-22' },
  { id: 'PAT-1003', name: 'Amit Verma', age: 52, gender: 'MALE', blood: 'B+', phone: '+91 97654 32109', ordersCount: 6, lastVisit: '2026-08-19' },
  { id: 'PAT-1004', name: 'Sunita Rao', age: 45, gender: 'FEMALE', blood: 'AB+', phone: '+91 99887 76655', ordersCount: 1, lastVisit: '2026-08-15' },
  { id: 'PAT-1005', name: 'Vikram Singh', age: 38, gender: 'MALE', blood: 'O-', phone: '+91 91234 56789', ordersCount: 3, lastVisit: '2026-08-10' }
];

const PatientsView = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = mockPatients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="view-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Patient Directory</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Manage registered patient records and demographic profiles</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} /> Register Patient
        </button>
      </div>

      <div className="data-table-container">
        <div className="table-header">
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 1rem 0.5rem 2.2rem',
                borderRadius: 'var(--radius-sm)',
                background: '#ffffff',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                fontSize: '0.85rem'
              }}
            />
          </div>
          <button className="btn btn-outline" style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}>
            <Filter size={14} /> Filter
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Full Name</th>
              <th>Age & Gender</th>
              <th>Blood Group</th>
              <th>Contact Phone</th>
              <th>Total Orders</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.id}>
                <td style={{ fontWeight: '700', color: 'var(--accent-red)' }}>{patient.id}</td>
                <td style={{ fontWeight: '600' }}>{patient.name}</td>
                <td>{patient.age} yrs ({patient.gender})</td>
                <td>
                  <span className="badge badge-info">{patient.blood}</span>
                </td>
                <td style={{ color: 'var(--text-muted)' }}>{patient.phone}</td>
                <td style={{ fontWeight: '500' }}>{patient.ordersCount} orders</td>
                <td>
                  <button className="btn btn-outline" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}>
                    View Profile
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

export default PatientsView;
