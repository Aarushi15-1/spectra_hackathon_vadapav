import React, { useState, useEffect } from 'react';
import { Plus, Clock, TestTube, CheckCircle2 } from 'lucide-react';
import { fetchLabTests } from '../services/apiService';

const defaultCatalog = [
  { code: 'CBC001', name: 'Complete Blood Count (CBC)', category: 'Hematology', price: '₹450.00', parameters: 14, turnaround: '6 Hours', active: true },
  { code: 'LIP002', name: 'Lipid Profile', category: 'Biochemistry', price: '₹650.00', parameters: 6, turnaround: '12 Hours', active: true },
  { code: 'LFT003', name: 'Liver Function Test (LFT)', category: 'Biochemistry', price: '₹800.00', parameters: 9, turnaround: '12 Hours', active: true },
  { code: 'KFT004', name: 'Kidney Function Test (KFT)', category: 'Biochemistry', price: '₹750.00', parameters: 7, turnaround: '8 Hours', active: true },
  { code: 'HBA005', name: 'HbA1c (Glycated Hemoglobin)', category: 'Endocrinology', price: '₹550.00', parameters: 2, turnaround: '4 Hours', active: true },
  { code: 'THY006', name: 'Thyroid Profile (T3, T4, TSH)', category: 'Endocrinology', price: '₹600.00', parameters: 3, turnaround: '24 Hours', active: true }
];

const LabTestsView = () => {
  const [catalog, setCatalog] = useState(defaultCatalog);

  useEffect(() => {
    const load = async () => {
      const data = await fetchLabTests();
      if (data && data.length > 0) {
        setCatalog(data.map(d => ({
          code: d.code,
          name: d.name,
          category: d.category,
          price: typeof d.price === 'number' ? `₹${d.price.toFixed(2)}` : (d.price ? `₹${d.price}` : '₹500.00'),
          parameters: d.parameters,
          turnaround: d.turnaroundTime || '8 Hours',
          active: d.active
        })));
      }
    };
    load();
  }, []);

  return (
    <div className="view-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: '800', color: '#ffffff' }}>Diagnostic Test Catalog</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Configured diagnostic panels, biomarkers, turnaround times, and pricing</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} />
          <span>Add Test Panel</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {catalog.map((test) => (
          <div key={test.code} className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <span className="badge badge-info">{test.category}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <CheckCircle2 size={12} /> Active
              </span>
            </div>

            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: '700', marginBottom: '0.25rem' }}>{test.code}</div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: '700', color: '#ffffff' }}>{test.name}</h4>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              <div>
                <span style={{ color: '#ffffff', fontWeight: '700' }}>{test.parameters}</span> Parameters
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={13} color="var(--accent-amber)" />
                <span>{test.turnaround}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.05rem', fontWeight: '800', color: 'var(--accent-emerald)' }}>
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
