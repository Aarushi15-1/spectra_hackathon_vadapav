import React, { useState } from 'react';
import { Shield, KeyRound, Lock, User, Phone, Mail, ArrowRight, CheckCircle2, AlertCircle, HeartPulse, RefreshCw } from 'lucide-react';
import { healthBridgeApi } from '../api/healthBridgeApi';

export default function AuthGateway({ onLoginSuccess }) {
  const [tab, setTab] = useState('login'); // 'login' or 'signup'
  
  // Login State
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState('aarav.sharma@healthbridge.in');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Signup State (3-Step Onboarding: Aadhaar Input -> OTP Verify -> Account Setup)
  const [signupStep, setSignupStep] = useState(1);
  const [aadhaarNumber, setAadhaarNumber] = useState('5432 1098 7654');
  const [signupTxnId, setSignupTxnId] = useState('');
  const [maskedMobile, setMaskedMobile] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState('');

  // Step 3 Profile Info
  const [signupFullName, setSignupFullName] = useState('Rhea Patel');
  const [signupEmail, setSignupEmail] = useState('rhea.patel@healthbridge.in');
  const [signupPhone, setSignupPhone] = useState('9876543210');
  const [signupPassword, setSignupPassword] = useState('SecurePass@2026');
  const [signupBloodGroup, setSignupBloodGroup] = useState('B+');
  const [signupAllergies, setSignupAllergies] = useState('None reported');
  const [signupEmergencyContact, setSignupEmergencyContact] = useState('Dev Patel (+91 9876543211)');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await healthBridgeApi.login(loginEmailOrPhone, loginPassword);
      onLoginSuccess(res.user, res.token, res.message);
    } catch (err) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleInitiateAadhaar = async (e) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupError('');
    try {
      const cleanAadhaar = aadhaarNumber.replace(/\s+/g, '');
      const res = await healthBridgeApi.initiateAadhaarSignup(cleanAadhaar);
      setSignupTxnId(res.txnId);
      setMaskedMobile(res.maskedMobile);
      setDemoOtp(res.demoOtp);
      setOtpCode(res.demoOtp); // Autofill demo OTP for easy testing
      setSignupStep(2);
    } catch (err) {
      setSignupError(err.message || 'Aadhaar verification failed');
    } finally {
      setSignupLoading(false);
    }
  };

  const handleVerifyAadhaarOtp = async (e) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupError('');
    try {
      await healthBridgeApi.verifyAadhaarOtp(signupTxnId, otpCode);
      setSignupStep(3);
    } catch (err) {
      setSignupError(err.message || 'Invalid OTP code');
    } finally {
      setSignupLoading(false);
    }
  };

  const handleCompleteSignup = async (e) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupError('');
    try {
      const payload = {
        txnId: signupTxnId,
        fullName: signupFullName,
        email: signupEmail,
        phone: signupPhone,
        password: signupPassword,
        bloodGroup: signupBloodGroup,
        allergies: signupAllergies,
        emergencyContactName: signupEmergencyContact.split('(')[0].trim(),
        emergencyContactPhone: signupEmergencyContact.includes('(') ? signupEmergencyContact.split('(')[1].replace(')', '').trim() : signupPhone,
      };
      const res = await healthBridgeApi.completeSignup(payload);
      onLoginSuccess(res.user, res.token, res.message);
    } catch (err) {
      setSignupError(err.message || 'Account registration failed');
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950 relative overflow-hidden">
      {/* Background glowing gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-600/15 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-xl glass-card rounded-2xl p-8 border border-slate-800 shadow-2xl relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/20 mb-4">
            <HeartPulse className="w-9 h-9 text-slate-950 font-bold" />
          </div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">HealthBridge</h1>
          <p className="text-slate-400 text-sm mt-1">Patient-Controlled Healthcare Interoperability & Access System</p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-900/80 rounded-xl mb-6 border border-slate-800">
          <button
            type="button"
            onClick={() => { setTab('login'); setLoginError(''); }}
            className={`py-2.5 text-sm font-semibold rounded-lg transition-all ${
              tab === 'login'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Normal Patient Login
          </button>
          <button
            type="button"
            onClick={() => { setTab('signup'); setSignupError(''); setSignupStep(1); }}
            className={`py-2.5 text-sm font-semibold rounded-lg transition-all ${
              tab === 'signup'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            New Patient Onboarding
          </button>
        </div>

        {/* TAB 1: NORMAL PATIENT LOGIN (Section 2.2: Email or Phone + Password, No Aadhaar needed) */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-xl text-xs text-emerald-300/90 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Section 2.2: Aadhaar is not required for daily login. Use your registered email/phone and password.</span>
            </div>

            {loginError && (
              <div className="p-3 bg-rose-950/40 border border-rose-800/50 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email or Phone Number</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={loginEmailOrPhone}
                  onChange={(e) => setLoginEmailOrPhone(e.target.value)}
                  placeholder="aarav.sharma@healthbridge.in or 9820145290"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              {loginLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              <span>{loginLoading ? 'Authenticating...' : 'Sign In to HealthBridge'}</span>
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setLoginEmailOrPhone('aarav.sharma@healthbridge.in');
                  setLoginPassword('password123');
                }}
                className="text-xs text-emerald-400 hover:underline"
              >
                Auto-fill demo patient (Aarav Sharma - HB-2026-89410)
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: AADHAAR ONBOARDING (Section 2.1: Aadhaar used ONLY during signup) */}
        {tab === 'signup' && (
          <div>
            {/* Step Indicators */}
            <div className="flex items-center justify-between mb-6 px-2">
              <div className={`flex items-center gap-1.5 text-xs font-semibold ${signupStep >= 1 ? 'text-emerald-400' : 'text-slate-500'}`}>
                <span className="w-5 h-5 rounded-full border flex items-center justify-center border-current">1</span>
                <span>Aadhaar e-KYC</span>
              </div>
              <div className="h-[1px] w-8 bg-slate-700" />
              <div className={`flex items-center gap-1.5 text-xs font-semibold ${signupStep >= 2 ? 'text-emerald-400' : 'text-slate-500'}`}>
                <span className="w-5 h-5 rounded-full border flex items-center justify-center border-current">2</span>
                <span>OTP Verification</span>
              </div>
              <div className="h-[1px] w-8 bg-slate-700" />
              <div className={`flex items-center gap-1.5 text-xs font-semibold ${signupStep >= 3 ? 'text-emerald-400' : 'text-slate-500'}`}>
                <span className="w-5 h-5 rounded-full border flex items-center justify-center border-current">3</span>
                <span>Set Password</span>
              </div>
            </div>

            {signupError && (
              <div className="p-3 bg-rose-950/40 border border-rose-800/50 rounded-xl text-xs text-rose-300 flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{signupError}</span>
              </div>
            )}

            {/* STEP 1: Aadhaar Number Input */}
            {signupStep === 1 && (
              <form onSubmit={handleInitiateAadhaar} className="space-y-4">
                <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-xl text-xs text-cyan-300 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>Section 2.1: Aadhaar is used strictly for one-time identity verification. Raw Aadhaar is never stored or exposed to doctors.</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">12-Digit Aadhaar Number</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={aadhaarNumber}
                      onChange={(e) => setAadhaarNumber(e.target.value)}
                      placeholder="5432 1098 7654"
                      maxLength={14}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={signupLoading}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {signupLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                  <span>{signupLoading ? 'Connecting UIDAI Gateway...' : 'Send Verification OTP'}</span>
                </button>
              </form>
            )}

            {/* STEP 2: OTP Verification */}
            {signupStep === 2 && (
              <form onSubmit={handleVerifyAadhaarOtp} className="space-y-4">
                <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-xl text-xs text-emerald-300">
                  <p className="font-semibold">OTP dispatched via UIDAI Gateway to {maskedMobile}</p>
                  <p className="text-[11px] text-emerald-400/80 mt-0.5">Demo OTP: <strong className="underline">{demoOtp}</strong></p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">6-Digit Verification OTP</label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    maxLength={6}
                    placeholder="123456"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-4 text-center text-lg tracking-widest text-emerald-400 font-mono focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSignupStep(1)}
                    className="w-1/3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={signupLoading}
                    className="w-2/3 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
                  >
                    {signupLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>Verify Identity</span>
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Set Password & Generate HealthBridge Patient ID */}
            {signupStep === 3 && (
              <form onSubmit={handleCompleteSignup} className="space-y-3">
                <div className="p-3 bg-teal-950/40 border border-teal-800/50 rounded-xl text-xs text-teal-300">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 inline mr-1" />
                  <span>Aadhaar e-KYC Verified! Establish your credentials & HealthCard summary:</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={signupFullName}
                      onChange={(e) => setSignupFullName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">Email</label>
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">Set Password</label>
                    <input
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">Blood Group</label>
                    <select
                      value={signupBloodGroup}
                      onChange={(e) => setSignupBloodGroup(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">Emergency Contact</label>
                    <input
                      type="text"
                      value={signupEmergencyContact}
                      onChange={(e) => setSignupEmergencyContact(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={signupLoading}
                  className="w-full py-3 mt-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {signupLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <HeartPulse className="w-4 h-4" />}
                  <span>{signupLoading ? 'Creating Account & Patient ID...' : 'Complete Signup & Get Patient ID'}</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* Security Footer */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>🔒 PBKDF2-HMAC-SHA256 Encrypted</span>
          <span>⚡ Connected to Supabase Cloud</span>
        </div>
      </div>
    </div>
  );
}
