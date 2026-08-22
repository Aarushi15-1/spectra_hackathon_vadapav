import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, ShieldCheck, ExternalLink, Building2 } from 'lucide-react';

export function HospitalNetwork({ onSyncData }) {
  const [isSyncing, setIsSyncing] = useState(false);

  const hospitals = [
    {
      id: 'aiims',
      name: 'AIIMS New Delhi',
      hipId: 'HIP_AIIMS_DELHI_001',
      status: 'Connected & Active',
      lastSync: '10 mins ago',
      recordsCount: 2,
      type: 'Government Apex Institute'
    },
    {
      id: 'fortis',
      name: 'Fortis Healthcare Hospital',
      hipId: 'HIP_FORTIS_001',
      status: 'Connected & Active',
      lastSync: '2 hours ago',
      recordsCount: 1,
      type: 'Super Speciality Hospital'
    },
    {
      id: 'apollo',
      name: 'Apollo Diagnostic Labs & Clinics',
      hipId: 'HIP_APOLLO_03',
      status: 'Connected & Active',
      lastSync: 'Yesterday',
      recordsCount: 1,
      type: 'Diagnostic Network'
    },
    {
      id: 'max',
      name: 'Max Super Speciality Hospital',
      hipId: 'HIP_MAX_HEALTH_002',
      status: 'Connected & Active',
      lastSync: '3 days ago',
      recordsCount: 1,
      type: 'Tertiary Care Centre'
    },
    {
      id: 'cowin',
      name: 'National Health Mission / CoWIN',
      hipId: 'HIP_GOV_COWIN_01',
      status: 'Verified Govt Node',
      lastSync: 'Permanent Record',
      recordsCount: 1,
      type: 'Universal Immunization Node'
    }
  ];

  const handleSyncClick = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      onSyncData?.();
    }, 1200);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>Connected Health Information Providers (ABDM HIP Network)</span>
          </h3>
          <p className="text-xs text-gray-400">
            Hospitals and clinics authorized to transmit encrypted FHIR medical data into your HealthBridge Locker
          </p>
        </div>

        <button
          onClick={handleSyncClick}
          disabled={isSyncing}
          className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
          <span>{isSyncing ? 'Syncing Network...' : 'Pull Fresh Health Data'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {hospitals.map((h) => (
          <div
            key={h.id}
            className="glass-card p-4 hover:border-emerald-500/40 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="w-9 h-9 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="badge badge-emerald text-[9px]">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  {h.status}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white leading-snug">{h.name}</h4>
              <p className="text-[11px] text-gray-400">{h.type}</p>
            </div>

            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-gray-400">
              <span className="text-emerald-400 font-semibold">{h.hipId}</span>
              <span>{h.lastSync}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
