import React from 'react';
import { Heart, Activity, Droplets, Wind, Scale, CheckCircle2, TrendingUp } from 'lucide-react';

export function VitalsWidget({ vitals }) {
  const defaultVitals = [
    {
      id: 'bp',
      name: 'Blood Pressure',
      value: vitals?.['Blood Pressure'] || '120/80 mmHg',
      status: 'Optimal',
      range: '110-120 / 70-80',
      icon: <Activity className="w-5 h-5 text-emerald-400" />,
      badgeColor: 'badge-emerald'
    },
    {
      id: 'hr',
      name: 'Heart Rate',
      value: vitals?.['Heart Rate'] || '72 bpm',
      status: 'Resting Normal',
      range: '60 - 100 bpm',
      icon: <Heart className="w-5 h-5 text-rose-400 pulse-animation" />,
      badgeColor: 'badge-blue'
    },
    {
      id: 'fbs',
      name: 'Fasting Blood Sugar',
      value: vitals?.['Blood Glucose (F)'] || '94 mg/dL',
      status: 'Non-Diabetic',
      range: '70 - 99 mg/dL',
      icon: <Droplets className="w-5 h-5 text-amber-400" />,
      badgeColor: 'badge-saffron'
    },
    {
      id: 'spo2',
      name: 'Blood Oxygen (SpO2)',
      value: vitals?.['SpO2'] || '99%',
      status: 'Normal Saturation',
      range: '95% - 100%',
      icon: <Wind className="w-5 h-5 text-cyan-400" />,
      badgeColor: 'badge-blue'
    },
    {
      id: 'bmi',
      name: 'Body Mass Index (BMI)',
      value: vitals?.['BMI'] || '22.4 kg/m²',
      status: 'Healthy Weight',
      range: '18.5 - 24.9',
      icon: <Scale className="w-5 h-5 text-purple-400" />,
      badgeColor: 'badge-purple'
    }
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Clinical Vitals & Telemetry</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </h3>
          <p className="text-xs text-gray-400">
            Synced from latest clinical consultations and wearable health monitor
          </p>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
          Last Synced: Today
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {defaultVitals.map((v) => (
          <div
            key={v.id}
            className="glass-card p-4 hover:border-emerald-500/40 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center border border-white/5 shadow-inner">
                {v.icon}
              </div>
              <span className={`badge ${v.badgeColor} text-[9px] px-1.5 py-0.5`}>
                {v.status}
              </span>
            </div>

            <div className="text-[11px] font-medium text-gray-400 truncate">
              {v.name}
            </div>
            <div className="text-base sm:text-lg font-bold font-mono text-white tracking-tight mt-0.5">
              {v.value}
            </div>
            <div className="text-[10px] text-gray-500 font-mono mt-1">
              Normal: {v.range}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
