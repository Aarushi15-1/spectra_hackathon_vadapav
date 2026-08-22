import React, { useState, useEffect } from 'react';
import { Plus, Clock, FlaskConical, Check, ArrowRight } from 'lucide-react';
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
    <div>
      <div className="section-heading" style={{ marginBottom: '22px' }}>
        <div>
          <p className="section-index">01 / DIAGNOSTIC SPECIFICATIONS</p>
          <h2 style={{ font: '700 28px Bricolage Grotesque, sans-serif', letterSpacing: '-.06em', color: 'var(--rose)', margin: '4px 0 0' }}>
            Diagnostic Test Catalog & Parameter Definitions
          </h2>
        </div>
        <button className="signal-button">
          <Plus size={15} />
          <span>New Test Definition</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '16px' }}>
        {catalog.map((test, idx) => (
          <div
            key={test.code}
            className="ticket-card"
            style={{
              padding: '24px',
              boxShadow: idx % 2 === 0 ? '10px 12px 0 var(--blush)' : '10px 12px 0 #f7d891',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              marginBottom: 0
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ background: '#ffd5c1', color: 'var(--rose)', padding: '3px 8px', borderRadius: '999px', font: '700 9px IBM Plex Mono, monospace' }}>
                  {test.category}
                </span>
                <span style={{ font: '700 9px IBM Plex Mono, monospace', color: 'var(--coral-deep)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Check size={12} /> ACTIVE
                </span>
              </div>

              <div style={{ font: '700 11px IBM Plex Mono, monospace', color: 'var(--coral-deep)', marginBottom: '3px' }}>
                {test.code}
              </div>
              <h4 style={{ font: '700 20px Bricolage Grotesque, sans-serif', letterSpacing: '-.04em', color: 'var(--rose)', margin: '0 0 12px' }}>
                {test.name}
              </h4>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--line)', paddingTop: '14px', marginTop: '10px' }}>
              <div>
                <span style={{ font: '700 13px Bricolage Grotesque, sans-serif', color: 'var(--rose)' }}>{test.parameters}</span>
                <span style={{ color: 'var(--rose-soft)', fontSize: '10px', marginLeft: '4px' }}>Parameters</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--rose-soft)', fontSize: '11px' }}>
                <Clock size={12} color="var(--marigold)" />
                <span>{test.turnaround}</span>
              </div>
              <div style={{ font: '700 16px IBM Plex Mono, monospace', color: 'var(--coral)' }}>
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
