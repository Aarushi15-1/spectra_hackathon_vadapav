import React, { useState, useEffect } from 'react';
import { FileText, Pill, FlaskConical, Stethoscope, Code, Calendar, Download, Search, Filter, ShieldCheck, Eye } from 'lucide-react';
import { healthBridgeApi } from '../api/healthBridgeApi';

export default function RecordsVault({ user }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');
  const [selectedFhirJson, setSelectedFhirJson] = useState(null);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('hb_token');
      const data = await healthBridgeApi.getRecords(token, user?.id);
      setRecords(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRecordIcon = (type) => {
    switch (type) {
      case 'PRESCRIPTION':
      case 'MedicationRequest':
        return <Pill className="w-5 h-5 text-indigo-400" />;
      case 'LAB_REPORT':
      case 'DiagnosticReport':
      case 'Observation':
        return <FlaskConical className="w-5 h-5 text-teal-400" />;
      default:
        return <Stethoscope className="w-5 h-5 text-emerald-400" />;
    }
  };

  const filteredRecords = records.filter(r => {
    if (filterType === 'ALL') return true;
    return r.recordType === filterType || r.fhirResourceType === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-teal-400" />
            <span>FHIR R4 Medical Records Vault</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Section 14 & 15: Normalized clinical records from verified doctors & laboratories.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {['ALL', 'PRESCRIPTION', 'LAB_REPORT', 'ENCOUNTER'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterType === type
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {type === 'ALL' ? 'All Records' : type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Records List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Loading interoperable medical records...</div>
      ) : filteredRecords.length === 0 ? (
        <div className="p-12 bg-slate-900/40 rounded-2xl border border-slate-800 text-center text-xs text-slate-400">
          No medical records found in this category.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex-shrink-0">
                  {getRecordIcon(record.recordType)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-100">{record.title}</h3>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-300 text-[10px] font-mono border border-slate-700">
                      FHIR/{record.fhirResourceType || 'Resource'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300/90 mt-1">{record.description}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-400">
                    <span>Provider: <strong className="text-slate-200">{record.providerName}</strong></span>
                    <span>Facility: <strong className="text-slate-200">{record.hospitalName}</strong></span>
                    <span>Date: <strong className="text-slate-200">{record.recordDate}</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                {record.fhirResourceJson && (
                  <button
                    onClick={() => setSelectedFhirJson(record.fhirResourceJson)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-teal-400 text-xs font-semibold rounded-xl border border-slate-800 flex items-center gap-1.5 transition-all"
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>View FHIR JSON</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FHIR JSON Modal */}
      {selectedFhirJson && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl glass-card rounded-2xl p-6 border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-teal-400" />
                <h3 className="text-sm font-bold text-slate-100">HL7 FHIR R4 Resource Representation</h3>
              </div>
              <button onClick={() => setSelectedFhirJson(null)} className="text-slate-400 hover:text-slate-200 text-xs">
                Close
              </button>
            </div>

            <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-teal-300 overflow-x-auto max-h-96">
              {(() => {
                try {
                  return JSON.stringify(JSON.parse(selectedFhirJson), null, 2);
                } catch {
                  return selectedFhirJson;
                }
              })()}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
