import React, { useState, useEffect } from 'react';
import { History, Shield, FileText, RefreshCw, Eye, CheckCircle2, AlertTriangle, Code, ArrowUpRight } from 'lucide-react';
import { healthBridgeApi } from '../api/healthBridgeApi';

export default function AuditTrail({ user }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await healthBridgeApi.getAuditTrail(user?.patientId || 'HB-2026-89410');
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getEventBadge = (eventType, result) => {
    if (eventType?.includes('EMERGENCY')) {
      return <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800/50 text-[10px] font-bold">EMERGENCY</span>;
    }
    if (eventType?.includes('REVOKED') || result === 'DENIED') {
      return <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800/50 text-[10px] font-bold">REVOKED</span>;
    }
    return <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50 text-[10px] font-bold">VERIFIED</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <History className="w-6 h-6 text-cyan-400" />
            <span>Immutable Security Audit Trail</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Section 12: Every security and healthcare access event is recorded in human-readable language and structured HL7 FHIR AuditEvents.
          </p>
        </div>

        <button
          onClick={loadLogs}
          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Trail</span>
        </button>
      </div>

      {/* Audit Log Timeline */}
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-500">Loading audit trail...</div>
      ) : logs.length === 0 ? (
        <div className="p-8 bg-slate-900/40 rounded-2xl border border-slate-800 text-center text-xs text-slate-400">
          No audit logs recorded yet.
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-4 glass-card rounded-2xl border border-slate-800 hover:border-slate-700 transition-all space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {getEventBadge(log.eventType, log.result)}
                  <span className="text-xs font-bold text-slate-200">{log.actorName}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({log.actorRole})</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                  {log.fhirAuditEventJson && (
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded text-[10px] font-semibold flex items-center gap-1"
                    >
                      <Code className="w-3 h-3" />
                      <span>FHIR JSON</span>
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {log.humanReadableDescription}
              </p>

              <div className="flex items-center gap-4 text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                <span>Action: <strong className="text-slate-400 font-mono">{log.eventType}</strong></span>
                <span>Resource: <strong className="text-slate-400 font-mono">{log.resourceType || 'HealthcareData'}</strong></span>
                <span>Outcome: <strong className="text-emerald-400">{log.result}</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FHIR AuditEvent Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl glass-card rounded-2xl p-6 border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-100">HL7 FHIR R4 AuditEvent Payload</h3>
              </div>
              <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-slate-200 text-xs">
                Close
              </button>
            </div>

            <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-96">
              {(() => {
                try {
                  return JSON.stringify(JSON.parse(selectedLog.fhirAuditEventJson), null, 2);
                } catch {
                  return selectedLog.fhirAuditEventJson;
                }
              })()}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
