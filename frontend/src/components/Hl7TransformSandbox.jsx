import React, { useState } from 'react';
import { Layers, ArrowRight, CheckCircle2, Code, Sparkles, RefreshCw, FileCode } from 'lucide-react';
import { healthBridgeApi } from '../api/healthBridgeApi';

export default function Hl7TransformSandbox() {
  const defaultHl7 = `MSH|^~\\&|APOLLO_HOSPITAL|LAB|HEALTHBRIDGE|CLOUD|20260822110000||ORU^R01|MSG00192|P|2.5
PID|1||HB-2026-89410^^^HEALTHBRIDGE||SHARMA^AARAV||19960714|M|||BANDRA WEST^MUMBAI^MH^400050||9820145290
OBR|1||LAB88491|LIPID_PROFILE^Comprehensive Lipid Panel|||20260822100000
OBX|1|NM|CHOL^Total Cholesterol||168|mg/dL|125-200|N|||F
OBX|2|NM|HDL^HDL Cholesterol||52|mg/dL|>40|N|||F
OBX|3|NM|GLU_FAST^Fasting Glucose||94|mg/dL|70-99|N|||F`;

  const [rawHl7, setRawHl7] = useState(defaultHl7);
  const [transformedResult, setTransformedResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTransform = async () => {
    setLoading(true);
    try {
      const res = await healthBridgeApi.transformHl7V2(rawHl7);
      setTransformedResult(res);
    } catch (err) {
      alert('Transformation error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Layers className="w-6 h-6 text-indigo-400" />
          <span>HL7 V2 ➔ FHIR R4 Transformation Engine</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Section 16: Interoperability layer for legacy hospital & laboratory systems (ADT/ORU to FHIR Bundle normalization).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input HL7 V2 Message */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-amber-400" />
              <span>Legacy HL7 V2 Message (Pipe-Delimited)</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">ORU^R01 / ADT^A01</span>
          </div>

          <textarea
            rows={12}
            value={rawHl7}
            onChange={(e) => setRawHl7(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3.5 text-xs font-mono text-amber-300 leading-relaxed focus:outline-none focus:border-indigo-500"
          />

          <button
            onClick={handleTransform}
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Execute Transformation Pipeline ➔ FHIR R4 Bundle</span>
          </button>
        </div>

        {/* Right: Output FHIR R4 Bundle */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Code className="w-4 h-4 text-emerald-400" />
                <span>Normalized HL7 FHIR R4 Bundle</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50 font-mono">
                {transformedResult ? transformedResult.status : 'Ready to Transform'}
              </span>
            </div>

            {transformedResult ? (
              <pre className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-[340px] mt-3">
                {(() => {
                  try {
                    return JSON.stringify(JSON.parse(transformedResult.transformedFhirBundleJson), null, 2);
                  } catch {
                    return transformedResult.transformedFhirBundleJson;
                  }
                })()}
              </pre>
            ) : (
              <div className="p-12 text-center text-xs text-slate-500 space-y-2 mt-6">
                <Layers className="w-8 h-8 text-slate-600 mx-auto" />
                <p>Click "Execute Transformation" to view generated FHIR R4 resources.</p>
              </div>
            )}
          </div>

          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] text-slate-400">
            ✓ <strong>Standards Compliance:</strong> Patient identity maps to FHIR <code>Patient</code>, Lab segments map to <code>DiagnosticReport</code> & <code>Observation</code> resources.
          </div>
        </div>
      </div>
    </div>
  );
}
