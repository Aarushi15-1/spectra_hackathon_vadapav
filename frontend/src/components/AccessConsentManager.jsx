import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Key, Trash2, Calendar, Clock, RefreshCw, CheckCircle2, UserCheck, AlertTriangle } from 'lucide-react';
import { healthBridgeApi } from '../api/healthBridgeApi';

export default function AccessConsentManager({ user }) {
  const [authorizations, setAuthorizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    loadAuthorizations();
  }, []);

  const loadAuthorizations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('hb_token');
      const data = await healthBridgeApi.getAuthorizations(token, user?.id);
      setAuthorizations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (authId, doctorName) => {
    if (!window.confirm(`Are you sure you want to revoke data access for ${doctorName}? Future retrieval will be immediately blocked.`)) {
      return;
    }
    setRevokingId(authId);
    try {
      const token = localStorage.getItem('hb_token');
      await healthBridgeApi.revokeAccess(token, user?.id, authId);
      setMsg(`Access revoked for ${doctorName}. Recorded in audit trail.`);
      setTimeout(() => setMsg(''), 4000);
      loadAuthorizations();
    } catch (err) {
      alert('Revocation failed: ' + err.message);
    } finally {
      setRevokingId(null);
    }
  };

  const activeAuths = authorizations.filter(a => a.status === 'ACTIVE');
  const pastAuths = authorizations.filter(a => a.status !== 'ACTIVE');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span>Access & Consent Management</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Section 11: Inspect current and historical provider access authorizations with immediate server-side revocation.
          </p>
        </div>

        <button
          onClick={loadAuthorizations}
          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{msg}</span>
        </div>
      )}

      {/* ACTIVE AUTHORIZATIONS */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Active Provider Authorizations ({activeAuths.length})</span>
        </h3>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading access authorizations...</div>
        ) : activeAuths.length === 0 ? (
          <div className="p-8 bg-slate-900/40 rounded-2xl border border-slate-800 text-center text-xs text-slate-400">
            No active provider authorizations. Generate a QR session to share health records with a doctor.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeAuths.map((auth) => (
              <div
                key={auth.id}
                className="glass-card rounded-2xl p-5 border border-emerald-900/40 bg-emerald-950/10 shadow-lg space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-slate-100">{auth.doctorName}</h4>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50 text-[10px] font-semibold">
                        Verified
                      </span>
                    </div>
                    <p className="text-xs text-emerald-400/90">{auth.doctorSpeciality} • {auth.hospitalName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">License: {auth.licenseNumber}</p>
                  </div>

                  <button
                    onClick={() => handleRevoke(auth.id, auth.doctorName)}
                    disabled={revokingId === auth.id}
                    className="px-2.5 py-1 bg-rose-950/50 hover:bg-rose-900/70 text-rose-300 text-xs font-bold rounded-lg border border-rose-800/50 flex items-center gap-1 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{revokingId === auth.id ? 'Revoking...' : 'Revoke'}</span>
                  </button>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs space-y-1.5">
                  <p className="text-slate-300"><strong>Purpose:</strong> {auth.purpose}</p>
                  <div>
                    <span className="text-slate-400 text-[11px] block mb-1">Permitted Scope:</span>
                    <div className="flex flex-wrap gap-1">
                      {auth.grantedScope?.split(',').map((s) => (
                        <span key={s} className="px-2 py-0.5 bg-slate-800 text-emerald-300 rounded text-[10px] font-mono border border-slate-700">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Granted: {auth.grantedAt ? new Date(auth.grantedAt).toLocaleDateString() : 'Active'}</span>
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Expires: {auth.expiresAt ? new Date(auth.expiresAt).toLocaleDateString() : '7 Days'}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PAST & REVOKED AUTHORIZATIONS */}
      {pastAuths.length > 0 && (
        <div className="space-y-3 pt-4">
          <h3 className="text-sm font-bold text-slate-400">Past / Revoked Access History ({pastAuths.length})</h3>
          <div className="space-y-2">
            {pastAuths.map((auth) => (
              <div
                key={auth.id}
                className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-300">{auth.doctorName}</span>
                  <span className="text-slate-500 ml-2">({auth.purpose})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    auth.status === 'REVOKED' ? 'bg-rose-950 text-rose-400 border border-rose-800/50' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {auth.status}
                  </span>
                  <span className="text-[11px] text-slate-500">{new Date(auth.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
