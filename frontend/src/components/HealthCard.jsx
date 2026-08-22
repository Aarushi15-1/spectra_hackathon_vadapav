import React, { useState } from 'react';
import { HeartPulse, Shield, AlertTriangle, Pill, Activity, User, Phone, Edit3, Save, X, CheckCircle2 } from 'lucide-react';
import { healthBridgeApi } from '../api/healthBridgeApi';

export default function HealthCard({ user, healthCard, onCardUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...healthCard });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('hb_token');
      const updated = await healthBridgeApi.updateHealthCard(token, user?.id, formData);
      onCardUpdated(updated);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert('Failed to update HealthCard: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <HeartPulse className="w-6 h-6 text-rose-400" />
            <span>HealthCard — Structured Patient Summary</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Section 3: Concise health summary (not complete record). Minimum-necessary disclosure for emergency and consultation contexts.
          </p>
        </div>

        <button
          onClick={() => { setFormData({ ...healthCard }); setIsEditing(true); }}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Summary</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>HealthCard summary updated successfully in Supabase PostgreSQL!</span>
        </div>
      )}

      {/* Main Glassmorphic HealthCard */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 relative overflow-hidden shadow-2xl">
        {/* Glowing badge */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Identification Bar */}
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 gap-4">
          <div className="flex items-center gap-3">
            <img
              src={user?.photoUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=Aarav'}
              alt={user?.fullName}
              className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 p-0.5"
            />
            <div>
              <h3 className="text-base font-bold text-slate-100">{user?.fullName || 'Patient Name'}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                  {user?.patientId || 'HB-2026-89410'}
                </span>
                <span className="text-[11px] text-slate-400">Gender: {user?.gender || 'MALE'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-rose-950/50 border border-rose-800/50 text-center">
              <span className="text-[10px] text-rose-300 uppercase block font-semibold">Blood Group</span>
              <span className="text-base font-bold text-rose-400">{healthCard?.bloodGroup || 'O+'}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase block">Age / BMI</span>
              <span className="text-xs font-semibold text-slate-200">{healthCard?.age || 29} yrs • 23.1</span>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block mb-1">Weight</span>
            <span className="text-sm font-bold text-slate-200">{healthCard?.weightKg || 71.5} kg</span>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block mb-1">Height</span>
            <span className="text-sm font-bold text-slate-200">{healthCard?.heightCm || 176} cm</span>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block mb-1">Primary Contact</span>
            <span className="text-xs font-semibold text-slate-200">{healthCard?.primaryContact || user?.phone || '+91 9820145290'}</span>
          </div>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block mb-1">Source of Truth</span>
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Verified Profile
            </span>
          </div>
        </div>

        {/* Clinical Summary Tags */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Allergies */}
          <div className="p-4 bg-amber-950/20 border border-amber-800/40 rounded-xl">
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Known Allergies</span>
            </div>
            <p className="text-xs text-amber-200/90 leading-relaxed font-medium">
              {healthCard?.allergies || 'Penicillin, Dust mites'}
            </p>
          </div>

          {/* Chronic Conditions */}
          <div className="p-4 bg-cyan-950/20 border border-cyan-800/40 rounded-xl">
            <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-bold mb-2">
              <Activity className="w-4 h-4" />
              <span>Chronic Conditions</span>
            </div>
            <p className="text-xs text-cyan-200/90 leading-relaxed font-medium">
              {healthCard?.chronicConditions || 'Stage 1 Hypertension (Controlled)'}
            </p>
          </div>

          {/* Current Medications */}
          <div className="p-4 bg-indigo-950/20 border border-indigo-800/40 rounded-xl">
            <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-bold mb-2">
              <Pill className="w-4 h-4" />
              <span>Current Medications</span>
            </div>
            <p className="text-xs text-indigo-200/90 leading-relaxed font-medium">
              {healthCard?.currentMedications || 'Telmisartan 40mg OD'}
            </p>
          </div>
        </div>

        {/* Emergency Contact Bar */}
        <div className="mt-5 p-3.5 bg-rose-950/30 border border-rose-800/40 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-rose-300 font-semibold">
            <Phone className="w-4 h-4 text-rose-400" />
            <span>Emergency Contact: {healthCard?.emergencyContactName || 'Pooja Sharma'} ({healthCard?.emergencyContactRelation || 'Spouse'})</span>
          </div>
          <span className="font-mono font-bold text-rose-400">{healthCard?.emergencyContactPhone || '+91 9820199442'}</span>
        </div>
      </div>

      {/* Edit HealthCard Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-card rounded-2xl p-6 border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-100">Edit HealthCard Summary</h3>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Age</label>
                  <input
                    type="number"
                    value={formData.age || ''}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weightKg || ''}
                    onChange={(e) => setFormData({ ...formData, weightKg: parseFloat(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.heightCm || ''}
                    onChange={(e) => setFormData({ ...formData, heightCm: parseFloat(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">Allergies</label>
                <input
                  type="text"
                  value={formData.allergies || ''}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">Chronic Conditions</label>
                <input
                  type="text"
                  value={formData.chronicConditions || ''}
                  onChange={(e) => setFormData({ ...formData, chronicConditions: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">Current Medications</label>
                <input
                  type="text"
                  value={formData.currentMedications || ''}
                  onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Emergency Contact Name</label>
                  <input
                    type="text"
                    value={formData.emergencyContactName || ''}
                    onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Emergency Phone</label>
                  <input
                    type="text"
                    value={formData.emergencyContactPhone || ''}
                    onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
