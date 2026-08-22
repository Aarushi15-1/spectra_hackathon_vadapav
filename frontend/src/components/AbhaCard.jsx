import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, Download, Share2, Sparkles, CheckCircle2, RotateCw } from 'lucide-react';

export function AbhaCard({ user }) {
  const [isFlipped, setIsFlipped] = useState(false);

  if (!user) return null;

  // Build QR Code Payload (ABDM Compliant)
  const qrData = JSON.stringify({
    hidn: user.abhaNumber,
    hid: user.abhaAddress,
    name: user.fullName,
    gender: user.gender,
    dob: user.dob,
    state: user.state,
    dist: user.district,
    kyc: 'VERIFIED'
  });

  const handlePrintCard = () => {
    window.print();
  };

  return (
    <div className="w-full">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Active Digital Health ID
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 font-semibold border border-white/10 flex items-center gap-1.5 transition-all"
          >
            <RotateCw className="w-3.5 h-3.5" />
            {isFlipped ? 'Show Front' : 'Flip Card'}
          </button>
          <button
            onClick={handlePrintCard}
            className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-xs text-emerald-300 font-semibold border border-emerald-500/30 flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Save Card
          </button>
        </div>
      </div>

      {/* Interactive ABHA Card */}
      <div className="relative w-full max-w-lg mx-auto aspect-[1.586/1] rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 transform hover:scale-[1.01] group">
        {!isFlipped ? (
          /* FRONT SIDE */
          <div className="w-full h-full p-6 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/80 border border-emerald-500/40 rounded-2xl flex flex-col justify-between relative text-white">
            {/* National Tricolor Top Stripe */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF9933] via-white to-[#10B981]" />

            {/* Card Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-md">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-emerald-400 font-extrabold text-sm">
                    ABHA
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-extrabold tracking-wide uppercase text-white">
                    Ayushman Bharat Health Account
                  </h3>
                  <p className="text-[10px] text-gray-400 font-medium">
                    National Health Authority (NHA) • Govt. of India
                  </p>
                </div>
              </div>
              <div className="px-2 py-1 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold tracking-wider uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                e-KYC Verified
              </div>
            </div>

            {/* Card Body */}
            <div className="grid grid-cols-12 gap-4 items-center my-auto">
              {/* Photo */}
              <div className="col-span-3">
                <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-xl bg-slate-800 border-2 border-emerald-400/50 overflow-hidden shadow-inner relative group-hover:border-emerald-400 transition-all">
                  <img
                    src={user.photoUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.fullName}`}
                    alt={user.fullName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border border-white flex items-center justify-center">
                    <ShieldCheck className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
              </div>

              {/* Patient Details */}
              <div className="col-span-6 space-y-1">
                <h4 className="text-base sm:text-lg font-bold text-white leading-tight">
                  {user.fullName}
                </h4>
                <div className="text-xs text-gray-300">
                  <span className="text-gray-400">Gender:</span> {user.gender} &nbsp;|&nbsp;{' '}
                  <span className="text-gray-400">DOB:</span> {user.dob || '14/07/1996'}
                </div>
                <div className="text-xs text-gray-300">
                  <span className="text-gray-400">Blood Group:</span>{' '}
                  <span className="font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">
                    {user.bloodGroup || 'O+'}
                  </span>
                </div>
                <div className="text-[11px] text-gray-400">
                  <span className="text-gray-500">Address:</span> {user.district}, {user.state}
                </div>
              </div>

              {/* Dynamic QR Code */}
              <div className="col-span-3 flex justify-end">
                <div className="p-2 bg-white rounded-xl shadow-lg">
                  <QRCodeSVG value={qrData} size={76} level="M" />
                </div>
              </div>
            </div>

            {/* Card Footer: Identifiers */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-gray-400 block font-semibold">
                  ABHA Number
                </span>
                <span className="font-mono text-sm sm:text-base font-extrabold text-emerald-400 tracking-wider">
                  {user.abhaNumber || '91-4523-8910-1123'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase tracking-wider text-gray-400 block font-semibold">
                  ABHA Address
                </span>
                <span className="font-mono text-xs sm:text-sm font-bold text-teal-300">
                  {user.abhaAddress || 'aarav.sharma@abdm'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* BACK SIDE */
          <div className="w-full h-full p-6 bg-gradient-to-br from-slate-900 to-slate-950 border border-white/20 rounded-2xl flex flex-col justify-between relative text-white">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FF9933] via-white to-[#10B981]" />

            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 mb-2">
                Card Holder Emergency Contacts & Terms
              </h4>
              <div className="space-y-1.5 text-xs text-gray-300">
                <p>
                  <strong className="text-white">Linked Mobile:</strong> {user.mobileNumber}
                </p>
                <p>
                  <strong className="text-white">Masked Aadhaar:</strong> {user.maskedAadhaar || 'XXXX-XXXX-7654'}
                </p>
                <p>
                  <strong className="text-white">Address:</strong> {user.addressLine}, {user.pincode}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-[10px] text-gray-400 leading-relaxed">
              This digital ABHA Health Card enables seamless consent-based health record exchange across all ABDM-compliant hospitals, diagnostic centers, and telemedicine platforms under the National Digital Health Ecosystem.
            </div>

            <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono pt-2 border-t border-white/10">
              <span>ABDM Helpline: 14477 / 1800-11-4477</span>
              <span>www.abdm.gov.in</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
