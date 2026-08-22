import React, { useState, useEffect } from 'react';
import { QrCode, Shield, Clock, CheckCircle2, XCircle, AlertTriangle, Stethoscope, ArrowRight, UserCheck, RefreshCw, X } from 'lucide-react';
import { healthBridgeApi } from '../api/healthBridgeApi';

export default function QrSharingModal({ user, onClose, onAuthorizationCreated }) {
  const [sessionToken, setSessionToken] = useState('');
  const [sessionStatus, setSessionStatus] = useState('ACTIVE');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [loading, setLoading] = useState(true);

  // Doctor Simulator State
  const [simDoctorId, setSimDoctorId] = useState(1);
  const [simPurpose, setSimPurpose] = useState('Cardiology consultation and medication review');
  const [simScope, setSimScope] = useState('HEALTH_CARD,ALLERGIES,CURRENT_MEDS,CARDIOLOGY_REPORTS');
  const [simDuration, setSimDuration] = useState(7);
  const [simStep, setSimStep] = useState('IDLE'); // IDLE, SCANNED, REQUESTED, DECIDED
  const [simLoading, setSimLoading] = useState(false);

  // Incoming Access Request State
  const [pendingAuth, setPendingAuth] = useState(null);
  const [customScope, setCustomScope] = useState('HEALTH_CARD,ALLERGIES,CURRENT_MEDS,CARDIOLOGY_REPORTS');
  const [decisionLoading, setDecisionLoading] = useState(false);

  useEffect(() => {
    generateNewSession();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const generateNewSession = async () => {
    setLoading(true);
    setSimStep('IDLE');
    setPendingAuth(null);
    try {
      const token = localStorage.getItem('hb_token');
      const session = await healthBridgeApi.createQrSession(token, user?.id);
      setSessionToken(session.sessionToken);
      setSessionStatus(session.status);
      setTimeLeft(session.expiresInSeconds || 300);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Doctor Scans QR
  const handleSimDoctorScan = async () => {
    setSimLoading(true);
    try {
      await healthBridgeApi.doctorScanQr(sessionToken, simDoctorId);
      setSimStep('SCANNED');
      setSessionStatus('SCANNED');
    } catch (err) {
      alert('Doctor Scan Error: ' + err.message);
    } finally {
      setSimLoading(false);
    }
  };

  // Step 2: Doctor Submits Access Request
  const handleSimSubmitRequest = async () => {
    setSimLoading(true);
    try {
      const auth = await healthBridgeApi.doctorRequestAccess(sessionToken, simDoctorId, simPurpose, simScope, simDuration);
      setPendingAuth(auth);
      setCustomScope(auth.requestedScope);
      setSimStep('REQUESTED');
      setSessionStatus('REQUESTED');
    } catch (err) {
      alert('Request Submission Error: ' + err.message);
    } finally {
      setSimLoading(false);
    }
  };

  // Step 3: Patient Decision (Approve or Deny)
  const handlePatientDecision = async (approve) => {
    setDecisionLoading(true);
    try {
      const token = localStorage.getItem('hb_token');
      const res = await healthBridgeApi.patientDecision(token, user?.id, pendingAuth.id, approve, customScope);
      setSimStep('DECIDED');
      setSessionStatus(approve ? 'APPROVED' : 'DENIED');
      if (onAuthorizationCreated) onAuthorizationCreated(res);
    } catch (err) {
      alert('Decision registration error: ' + err.message);
    } finally {
      setDecisionLoading(false);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl glass-card rounded-2xl p-6 border border-slate-700 shadow-2xl space-y-6 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-800/60 text-emerald-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">QR-Based Provider Access Protocol</h3>
              <p className="text-xs text-slate-400">Section 4: Short-lived access session token (Possession ≠ Authorization)</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top QR Display & Security Notice */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          {/* QR Display Card */}
          <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 flex flex-col items-center text-center">
            {loading ? (
              <div className="w-48 h-48 flex items-center justify-center text-xs text-slate-500">Generating session...</div>
            ) : (
              <>
                <div className="p-3 bg-white rounded-xl shadow-lg mb-3">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(sessionToken)}`}
                    alt="Ephemeral Access QR"
                    className="w-36 h-36"
                  />
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Expires in: {minutes}:{seconds < 10 ? '0' : ''}{seconds}</span>
                </div>
                <p className="text-[10px] text-slate-500 font-mono mt-1 break-all px-2">
                  Token: {sessionToken}
                </p>
              </>
            )}

            <button
              onClick={generateNewSession}
              className="mt-3 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold rounded-lg flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Regenerate QR</span>
            </button>
          </div>

          {/* Non-Negotiable Security Rules Box */}
          <div className="space-y-3">
            <div className="p-3.5 bg-cyan-950/20 border border-cyan-800/40 rounded-xl text-xs space-y-1.5 text-cyan-200/90">
              <span className="font-bold text-cyan-400 flex items-center gap-1">
                <Shield className="w-4 h-4" /> Section 4.2 Security Rules:
              </span>
              <p>• <strong>Zero Medical Data:</strong> QR does NOT embed medical records or Aadhaar.</p>
              <p>• <strong>Ephemeral:</strong> Session strictly expires in 5 minutes.</p>
              <p>• <strong>Verified Doctor Only:</strong> Only authenticated verified doctor accounts can submit access requests.</p>
              <p>• <strong>Patient Gatekeeper:</strong> Access requires explicit patient-approved scope.</p>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
              <span className="text-slate-400">Current QR Status:</span>
              <span className="font-bold text-emerald-400 uppercase tracking-wider">{sessionStatus}</span>
            </div>
          </div>
        </div>

        {/* Section 6 & 20: Interactive Doctor Simulation Dock */}
        <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
              <Stethoscope className="w-4 h-4 text-emerald-400" />
              <span>Provider Simulation Terminal (Section 6 & 20 Flow)</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">Judge / Demo Tool</span>
          </div>

          {/* STEP 1: Scan Simulation */}
          {simStep === 'IDLE' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-300">
                Simulate a verified doctor (e.g. <strong>Dr. Ananya Sharma — AIIMS Cardiologist</strong>) scanning the patient's ephemeral QR code:
              </p>
              <button
                onClick={handleSimDoctorScan}
                disabled={simLoading || timeLeft <= 0}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
              >
                {simLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                <span>Simulate Verified Doctor Scan</span>
              </button>
            </div>
          )}

          {/* STEP 2: Doctor Requests Access Scope */}
          {simStep === 'SCANNED' && (
            <div className="space-y-3">
              <div className="p-2.5 bg-emerald-950/30 border border-emerald-800/40 rounded-xl text-xs text-emerald-300">
                ✓ QR Bound to Verified Doctor: <strong>Dr. Ananya Sharma (License: MCI-DEL-2014-8849)</strong>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">Clinical Purpose</label>
                <input
                  type="text"
                  value={simPurpose}
                  onChange={(e) => setSimPurpose(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Requested Scopes</label>
                  <input
                    type="text"
                    value={simScope}
                    onChange={(e) => setSimScope(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    value={simDuration}
                    onChange={(e) => setSimDuration(parseInt(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
                  />
                </div>
              </div>

              <button
                onClick={handleSimSubmitRequest}
                disabled={simLoading}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                {simLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                <span>Doctor Submits Access Request to Patient</span>
              </button>
            </div>
          )}

          {/* STEP 3: Real-Time Patient Consent Prompt (WHO, WHY, WHAT, HOW LONG) */}
          {simStep === 'REQUESTED' && pendingAuth && (
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/50 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Shield className="w-5 h-5" />
                <span>Patient Access Request Received (Real-Time Authorization)</span>
              </div>

              <div className="text-xs text-slate-200 space-y-1.5 p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <p>• <strong>WHO:</strong> {pendingAuth.doctorName} ({pendingAuth.doctorSpeciality} - {pendingAuth.hospitalName})</p>
                <p>• <strong>WHY (Purpose):</strong> {pendingAuth.purpose}</p>
                <p>• <strong>WHAT (Scope):</strong> <span className="font-mono text-emerald-300">{pendingAuth.requestedScope}</span></p>
                <p>• <strong>HOW LONG:</strong> {pendingAuth.durationDays} Days</p>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-300 mb-1">Refine / Narrow Granted Scope (Patient Discretion)</label>
                <input
                  type="text"
                  value={customScope}
                  onChange={(e) => setCustomScope(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => handlePatientDecision(false)}
                  disabled={decisionLoading}
                  className="w-1/2 py-2.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-bold rounded-xl border border-rose-800/50 flex items-center justify-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Deny Access</span>
                </button>
                <button
                  onClick={() => handlePatientDecision(true)}
                  disabled={decisionLoading}
                  className="w-1/2 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                >
                  {decisionLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>Allow Scoped Access</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Completed Decision */}
          {simStep === 'DECIDED' && (
            <div className="p-4 bg-emerald-950/40 border border-emerald-800/50 rounded-xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-slate-100">
                {sessionStatus === 'APPROVED' ? 'Authorization Active!' : 'Access Request Denied'}
              </h4>
              <p className="text-xs text-slate-300">
                {sessionStatus === 'APPROVED'
                  ? `Dr. Ananya Sharma has been granted scoped access for ${simDuration} days. Recorded in Supabase & Audit Trail.`
                  : 'Access denied. Doctor received no patient data.'}
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
              >
                Close & View Authorizations
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
