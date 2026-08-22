import React from 'react';
import { Plus, Clock } from 'lucide-react';

const mockCatalog = [
  { code: 'CBC001', name: 'Complete Blood Count (CBC)', category: 'Hematology', price: '₹450.00', parameters: 14, turnaround: '6 Hours', active: true },
  { code: 'LIP002', name: 'Lipid Profile', category: 'Biochemistry', price: '₹650.00', parameters: 6, turnaround: '12 Hours', active: true },
  { code: 'LFT003', name: 'Liver Function Test (LFT)', category: 'Biochemistry', price: '₹800.00', parameters: 9, turnaround: '12 Hours', active: true },
  { code: 'KFT004', name: 'Kidney Function Test (KFT)', category: 'Biochemistry', price: '₹750.00', parameters: 7, turnaround: '8 Hours', active: true },
  { code: 'HBA005', name: 'HbA1c (Glycated Hemoglobin)', category: 'Endocrinology', price: '₹550.00', parameters: 2, turnaround: '4 Hours', active: true },
  { code: 'THY006', name: 'Thyroid Profile (T3, T4, TSH)', category: 'Endocrinology', price: '₹600.00', parameters: 3, turnaround: '24 Hours', active: true }
];

const LabTestsView = () => {
  return (
    <div className="view-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Diagnostic Test Catalog</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Configure diagnostic tests, parameters, reference ranges, and pricing</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} /> Add New Lab Test
        </button>
      </div>

      <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {mockCatalog.map((test) => (
          <div key={test.code} className="stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <span className="badge badge-info">{test.category}</span>
              <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '700' }}>Active</span>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--accent-red)', fontWeight: '700', marginBottom: '0.2rem' }}>{test.code}</div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)' }}>{test.name}</h4>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              <div>
                <span style={{ color: 'var(--text-main)', fontWeight: '700' }}>{test.parameters}</span> Parameters
              </div>
              <div>
                <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {test.turnaround}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--accent-orange)' }}>
                {test.price}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LabTestsView;
