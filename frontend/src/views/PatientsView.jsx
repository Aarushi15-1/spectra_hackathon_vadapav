import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, User, ArrowUpRight, Phone, Droplet, Calendar } from 'lucide-react';
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
    <div className="view-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: '800', color: '#ffffff' }}>Patient Registry</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Registered ABHA patient records and demographic profiles</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} />
          <span>Register Patient</span>
        </button>
      </div>

      <div className="data-table-card">
        <div className="section-header" style={{ marginBottom: '1.25rem' }}>
          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by patient name or ABHA ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 1rem 0.6rem 2.4rem',
                borderRadius: 'var(--radius-pill)',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
            <Filter size={14} />
            <span>Filter</span>
          </button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Full Name</th>
              <th>Demographics</th>
              <th>Blood Group</th>
              <th>Contact Phone</th>
              <th>Orders</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.id}>
                <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-cyan)' }}>{patient.id}</td>
                <td style={{ fontWeight: '600', color: '#ffffff' }}>{patient.name}</td>
                <td style={{ color: 'var(--text-muted)' }}>{patient.age} yrs • {patient.gender}</td>
                <td>
                  <span className="badge badge-info">{patient.blood || patient.bloodGroup || 'O+'}</span>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-light)', fontSize: '0.8rem' }}>{patient.phone}</td>
                <td style={{ fontWeight: '600' }}>{patient.ordersCount} test orders</td>
                <td>
                  <button className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span>Profile</span>
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

export default PatientsView;
