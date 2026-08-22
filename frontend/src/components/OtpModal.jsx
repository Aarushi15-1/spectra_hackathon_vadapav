import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Lock, Smartphone, KeyRound, Sparkles, X, CheckCircle2, Bell } from 'lucide-react';

export function OtpModal({ initiateData, onVerifyOtp, onCancel, loading }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(300);
  const [showToast, setShowToast] = useState(true);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/[^0-9]/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtp(newOtp);
      const nextIdx = Math.min(digits.length, 5);
      inputRefs.current[nextIdx]?.focus();
      return;
    }

    const clean = value.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = clean;
    setOtp(newOtp);

    if (clean && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const fullOtp = otp.join('');
  const isComplete = fullOtp.length === 6;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isComplete) {
      onVerifyOtp(fullOtp);
    }
  };

  const handleAutofillDemo = () => {
    const demoCode = initiateData?.demoOtp || '123456';
    setOtp(demoCode.split(''));
    inputRefs.current[5]?.focus();
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="modal-overlay">
      {/* Simulated Live SMS Push Notification Toast */}
      {showToast && (
        <div className="fixed top-6 right-6 z-[1100] max-w-sm w-full bg-slate-900/95 border border-emerald-500/40 rounded-xl p-4 shadow-2xl backdrop-blur-xl animate-slide-up">
          <div className="flex items-start justify-between gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  {initiateData?.authMethod === 'ABHA_NUMBER' ? 'Govt ABDM SMS' : 'UIDAI OTP Gateway'}
                </span>
                <span className="text-[10px] text-gray-500">Just now</span>
              </div>
              <p className="text-xs text-white mt-1 font-mono">
                Your 6-digit e-KYC authentication OTP is{' '}
                <span className="text-emerald-400 font-bold underline bg-emerald-500/10 px-1 rounded">
                  {initiateData?.demoOtp || '123456'}
                </span>
                . Valid for 5 minutes. Do not share.
              </p>
              <button
                type="button"
                onClick={handleAutofillDemo}
                className="mt-2 text-[11px] text-emerald-300 font-semibold hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" /> Auto-fill this OTP
              </button>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="text-gray-500 hover:text-gray-300 text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main OTP Modal */}
      <div className="glass-panel p-8 max-w-md w-full relative z-10 animate-slide-up">
        <button
          onClick={onCancel}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/10">
            <KeyRound className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Enter Verification Code</h2>
          <p className="text-xs text-gray-400">
            We sent a 6-digit OTP to your linked mobile{' '}
            <span className="text-emerald-400 font-mono font-semibold">
              {initiateData?.maskedMobile || '+91 ******4529'}
            </span>
          </p>
          <div className="mt-2 text-[11px] text-gray-500 font-mono">
            Transaction: {initiateData?.txnId || 'TXN-ABDM-8742'}
          </div>
        </div>

        {/* OTP Inputs */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-11 h-13 sm:w-12 sm:h-14 bg-slate-900/90 border border-white/20 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/25 rounded-xl text-center text-xl sm:text-2xl font-bold font-mono text-emerald-400 outline-none transition-all"
              />
            ))}
          </div>

          {/* Timer & Resend */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>
              Expires in:{' '}
              <span className="font-mono text-emerald-400 font-semibold">{formatTime(timer)}</span>
            </span>
            <button
              type="button"
              disabled={timer > 0}
              onClick={() => setTimer(300)}
              className="text-emerald-400 hover:underline font-semibold disabled:text-gray-600 disabled:no-underline"
            >
              Resend Code
            </button>
          </div>

          {/* Verify CTA */}
          <button
            type="submit"
            disabled={!isComplete || loading}
            className="w-full py-3.5 gradient-btn rounded-xl font-bold text-base shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Verifying PBKDF2 Token...</span>
              </div>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Verify & Proceed</span>
              </>
            )}
          </button>
        </form>

        {/* Security Footer Badge */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <span className="inline-flex items-center gap-1.5 text-[10px] text-gray-400">
            <Lock className="w-3 h-3 text-emerald-400" />
            Protected by PBKDF2 with HMAC-SHA256 (65,536 iterations) & AES-256-GCM
          </span>
        </div>
      </div>
    </div>
  );
}
