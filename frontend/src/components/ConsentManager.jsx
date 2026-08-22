import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle2, AlertTriangle, Eye, ShieldAlert } from 'lucide-react';

export function ConsentManager() {
  const [consents, setConsents] = useState([
    {
      id: 'consent-01',
      requester: 'Dr. Vikram Malhotra (Fortis Healthcare)',
      purpose: 'Cardiology Follow-Up & Medication Review',
      scope: 'Diagnostic Reports & Prescriptions',
      validTill: '2026-09-30',
      status: 'GRANTED'
    },
    {
      id: 'consent-02',
      requester: 'AIIMS Telemedicine Portal',
      purpose: 'General OPD Consultation',
      scope: 'All Medical Records (Last 12 Months)',
      validTill: '2026-08-31',
      status: 'GRANTED'
    },
    {
      id: 'consent-03',
      requester: 'Star Health Insurance TPA',
      purpose: 'Hospitalization Claim Processing',
      scope: 'Discharge Summaries & Bills',
      validTill: '2026-08-25',
      status: 'GRANTED'
    }
  ]);

  const handleRevoke = (id) => {
    setConsents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'REVOKED' } : c))
    );
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ABDM Electronic Consent Artifacts & HIPAA Privacy Control</span>
          </h3>
          <p className="text-xs text-gray-400">
            You have 100% granular control over who can view your medical data. Access can be revoked instantly.
          </p>
        </div>
        <span className="badge badge-purple text-[10px]">
          HIPAA & DISHA Compliant
        </span>
      </div>

      <div className="space-y-3">
        {consents.map((consent) => (
          <div
            key={consent.id}
            className="glass-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">{consent.requester}</span>
                <span
                  className={`badge text-[9px] ${
                    consent.status === 'GRANTED' ? 'badge-emerald' : 'badge-saffron'
                  }`}
                >
                  {consent.status}
                </span>
              </div>
              <p className="text-xs text-gray-300">
                <strong className="text-gray-400">Purpose: </strong>
                {consent.purpose}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-gray-400 font-mono">
                <span>Scope: {consent.scope}</span>
                <span>•</span>
                <span>Valid Till: {consent.validTill}</span>
              </div>
            </div>

            {consent.status === 'GRANTED' ? (
              <button
                onClick={() => handleRevoke(consent.id)}
                className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Revoke Access
              </button>
            ) : (
              <span className="text-xs font-semibold text-rose-400 shrink-0">
                Access Revoked
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
