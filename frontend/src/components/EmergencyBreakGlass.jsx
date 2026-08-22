import React, { useState } from 'react';
import { Siren, AlertTriangle, ShieldAlert, CheckCircle2, Clock, MapPin, X, RefreshCw } from 'lucide-react';
import { healthBridgeApi } from '../api/healthBridgeApi';

export default function EmergencyBreakGlass({ user, onClose, onEmergencyInvoked }) {
  const [declaredCondition, setDeclaredCondition] = useState('Acute Polytrauma / Severe Respiratory Distress');
  const [facility, setFacility] = useState('AIIMS Trauma Center, Emergency Resuscitation Bay');
  const [doctorId, setDoctorId] = useState(1);
  const [loading, setLoading] = useState(false);
  const [emergencyResult, setEmergencyResult] = useState(null);

  const handleDeclare = async (e) => {
    e.preventDefault();
    if (!window.confirm('⚠️ BREAK-GLASS WARNING: Declaring emergency access triggers an immediate high-priority audit event and logs practitioner credentials to regulatory review boards. Proceed only in genuine life-threatening emergencies.')) {
      return;
    }

    setLoading(true);
    try {
      const res = await healthBridgeApi.declareEmergency(
        user?.patientId || 'HB-2026-89410',
        doctorId,
        declaredCondition,
        facility
      );
      setEmergencyResult(res);
      if (onEmergencyInvoked) onEmergencyInvoked();
    } catch (err) {
      alert('Emergency Access Request Failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl glass-card rounded-2xl p-6 border border-rose-800/60 bg-rose-950/20 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-rose-900/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-900/60 border border-rose-700/60 text-rose-300 animate-pulse">
              <Siren className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-rose-200">Emergency Break-Glass Protocol</h3>
              <p className="text-xs text-rose-300/80">Section 13: Time-bounded emergency access with mandatory audit</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {emergencyResult ? (
          <div className="space-y-4">
            <div className="p-4 bg-rose-950/60 border border-rose-700 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-rose-400" />
                <span>Emergency Critical Summary Granted</span>
              </div>
              <p className="text-xs text-slate-300">
                Authorized for <strong>{emergencyResult.accessedBy}</strong> at {emergencyResult.hospital}.
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <Clock className="w-4 h-4" />
                <span>Valid for: {emergencyResult.timeBoundedHours} Hours</span>
              </div>
            </div>

            {/* Critical Emergency Bundle */}
            <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 space-y-3 text-xs">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Emergency Health Summary:</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-slate-800/80 rounded-lg">
                  <span className="text-slate-400 block text-[10px]">Blood Group:</span>
                  <span className="font-bold text-rose-400 text-sm">{emergencyResult.bloodGroup}</span>
                </div>
                <div className="p-2.5 bg-slate-800/80 rounded-lg">
                  <span className="text-slate-400 block text-[10px]">Emergency Contact:</span>
                  <span className="font-semibold text-slate-200 text-xs">{emergencyResult.emergencyContact}</span>
                </div>
              </div>

              <div className="p-2.5 bg-amber-950/30 border border-amber-800/40 rounded-lg text-amber-300">
                <span className="font-bold block text-[10px] uppercase">Critical Allergies:</span>
                <span className="font-semibold">{emergencyResult.criticalAllergies}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-400">
              ⚠️ <strong>Audit Notice:</strong> High-priority audit record registered in immutable log. Patient notification dispatched.
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl"
            >
              Close Protocol
            </button>
          </div>
        ) : (
          <form onSubmit={handleDeclare} className="space-y-4">
            <div className="p-3.5 bg-amber-950/30 border border-amber-800/50 rounded-xl text-xs text-amber-300 space-y-1">
              <div className="flex items-center gap-1 font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>Section 13 Policy Constraints:</span>
              </div>
              <p>• Not a universal bypass — access is strictly limited to predefined emergency summary.</p>
              <p>• Time-bounded to 4 hours maximum.</p>
              <p>• High-priority audit event registered for medical director inspection.</p>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Target Patient ID</label>
              <input
                type="text"
                value={user?.patientId || 'HB-2026-89410'}
                disabled
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-emerald-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Emergency Condition Declared</label>
              <input
                type="text"
                value={declaredCondition}
                onChange={(e) => setDeclaredCondition(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">Emergency Facility / Ward</label>
              <input
                type="text"
                value={facility}
                onChange={(e) => setFacility(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-rose-900/40">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Siren className="w-3.5 h-3.5" />}
                <span>Declare Emergency Access</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
