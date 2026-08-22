import React, { useState, useEffect } from 'react';
import {
  HeartPulse, Shield, QrCode, Siren, User, FileText, UserCheck, ShieldCheck,
  History, Layers, LogOut, CheckCircle2, AlertCircle, Bell, Calendar, ChevronRight
} from 'lucide-react';
import AuthGateway from './components/AuthGateway';
import HealthCard from './components/HealthCard';
import RecordsVault from './components/RecordsVault';
import DoctorDirectory from './components/DoctorDirectory';
import AccessConsentManager from './components/AccessConsentManager';
import AuditTrail from './components/AuditTrail';
import Hl7TransformSandbox from './components/Hl7TransformSandbox';
import QrSharingModal from './components/QrSharingModal';
import EmergencyBreakGlass from './components/EmergencyBreakGlass';
import { healthBridgeApi } from './api/healthBridgeApi';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [healthCard, setHealthCard] = useState(null);
  const [activeTab, setActiveTab] = useState('healthcard'); // healthcard, records, doctors, access, audit, hl7
  const [toastMessage, setToastMessage] = useState('');

  // Modals
  const [showQrModal, setShowQrModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('hb_token');
    const savedUser = localStorage.getItem('hb_user');
    if (savedToken && savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setToken(savedToken);
      setUser(parsedUser);
      loadHealthCard(savedToken, parsedUser.id);
    }
  }, []);

  const loadHealthCard = async (authToken, userId) => {
    try {
      const card = await healthBridgeApi.getHealthCard(authToken, userId);
      setHealthCard(card);
    } catch (err) {
      console.error('Error fetching HealthCard:', err);
    }
  };

  const handleLoginSuccess = (userData, authToken, message) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('hb_token', authToken);
    localStorage.setItem('hb_user', JSON.stringify(userData));
    loadHealthCard(authToken, userData.id);
    setToastMessage(message || 'Authentication successful');
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setHealthCard(null);
    localStorage.removeItem('hb_token');
    localStorage.removeItem('hb_user');
  };

  if (!user) {
    return <AuthGateway onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 p-4 bg-emerald-950/90 border border-emerald-500/50 rounded-2xl shadow-2xl text-xs text-emerald-200 flex items-center gap-2.5 animate-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <HeartPulse className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-slate-100">HealthBridge</h1>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50 text-[10px] font-mono font-bold">
                  {user.patientId || 'HB-2026-89410'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Patient-Controlled Healthcare Access</p>
            </div>
          </div>

          {/* Quick Actions & User Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Share QR Button */}
            <button
              onClick={() => setShowQrModal(true)}
              className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <QrCode className="w-4 h-4" />
              <span className="hidden sm:inline">Share QR</span>
            </button>

            {/* Break-Glass Emergency */}
            <button
              onClick={() => setShowEmergencyModal(true)}
              className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 text-xs font-bold rounded-xl border border-rose-800/60 transition-all flex items-center gap-1.5"
            >
              <Siren className="w-4 h-4 text-rose-400 animate-pulse" />
              <span className="hidden sm:inline">Emergency Access</span>
            </button>

            {/* User Avatar & Logout */}
            <div className="h-6 w-[1px] bg-slate-800 mx-1 hidden sm:block" />

            <div className="flex items-center gap-2 pl-1">
              <img
                src={user.photoUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=Aarav'}
                alt={user.fullName}
                className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700"
              />
              <span className="text-xs font-semibold text-slate-200 hidden md:inline">{user.fullName}</span>
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Sub-bar */}
      <nav className="border-b border-slate-800 bg-slate-900/40 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-2">
          {[
            { id: 'healthcard', label: 'HealthCard Summary', icon: HeartPulse },
            { id: 'records', label: 'FHIR Medical Records', icon: FileText },
            { id: 'doctors', label: 'Verified Doctors & Appointments', icon: UserCheck },
            { id: 'access', label: 'Access & Consent Control', icon: ShieldCheck },
            { id: 'audit', label: 'Audit Trail', icon: History },
          ].map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  active
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {activeTab === 'healthcard' && (
          <HealthCard
            user={user}
            healthCard={healthCard}
            onCardUpdated={(updated) => setHealthCard(updated)}
          />
        )}

        {activeTab === 'records' && (
          <RecordsVault user={user} />
        )}

        {activeTab === 'doctors' && (
          <DoctorDirectory user={user} />
        )}

        {activeTab === 'access' && (
          <AccessConsentManager user={user} />
        )}

        {activeTab === 'audit' && (
          <AuditTrail user={user} />
        )}
      </main>

      {/* Modals */}
      {showQrModal && (
        <QrSharingModal
          user={user}
          onClose={() => setShowQrModal(false)}
          onAuthorizationCreated={() => {
            setToastMessage('Access authorization active in Supabase and logged in Audit Trail!');
            setTimeout(() => setToastMessage(''), 4000);
          }}
        />
      )}

      {showEmergencyModal && (
        <EmergencyBreakGlass
          user={user}
          onClose={() => setShowEmergencyModal(false)}
          onEmergencyInvoked={() => {
            setToastMessage('🚨 High-Priority Emergency Audit Event Logged!');
            setTimeout(() => setToastMessage(''), 4000);
          }}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 py-4 px-8 text-center text-xs text-slate-600">
        HealthBridge Interoperability Platform • Supabase PostgreSQL • HL7 FHIR R4 • PBKDF2-HMAC-SHA256
      </footer>
    </div>
  );
}
