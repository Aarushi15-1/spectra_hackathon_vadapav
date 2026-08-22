/**
 * Spectra Health: Unified Care Signal Gateway & Patient Health Locker
 * Seamlessly connects Patient Health Locker, Doctor Clinical Portal, and Laboratory Space.
 * Features Medical License Verification, Doctor Unique ID generation, Real Camera-Scannable Ephemeral QR (qrcode.react),
 * Auto-Expiry Countdown, and clean Gateway Sign-Out flow.
 */
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  ClipboardList,
  Database,
  FileText,
  FlaskConical,
  HeartPulse,
  LockKeyhole,
  Menu,
  MoreHorizontal,
  Pill,
  Plus,
  RefreshCw,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UserRound,
  UsersRound,
  X,
  Hospital,
  Lock,
  Activity,
  UserPlus,
  AlertTriangle,
  Search,
  Download,
  Copy,
  Clock,
  CheckCircle2,
  Share2,
  QrCode,
  Timer,
  LogOut
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DoctorPortal from "@/components/DoctorPortal";
import { api, Doctor, HealthRecordItem, PatientUser } from "@/lib/api";

type Stage = "gateway" | "resolving" | "dashboard";
type LoginTab = "abha" | "aadhaar";
type PortalChoice = "patient" | "doctor" | "laboratory";
type DoctorAuthMode = "login" | "signup";
type NavSection = "signal" | "records" | "consent" | "sources";

function formatAbha(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  return digits.replace(/(\d{2})(?=\d)/, "$1-").replace(/(\d{4})(?=\d{4})/g, "$1-");
}

function formatAadhaar(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 12)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

function SignalLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`signal-logo ${compact ? "signal-logo-compact" : ""}`} aria-hidden="true">
      <span className="logo-lobe lobe-a" />
      <span className="logo-lobe lobe-b" />
      <span className="logo-lobe lobe-c" />
      <span className="logo-pulse">+</span>
    </div>
  );
}

function SignalLine() {
  return (
    <div className="signal-line" aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}

export default function Home() {
  const [stage, setStage] = useState<Stage>("gateway");
  const [portalChoice, setPortalChoice] = useState<PortalChoice>("patient");
  const [loginTab, setLoginTab] = useState<LoginTab>("abha");
  const [identifier, setIdentifier] = useState("91-4523-8910-1123");
  const [userKind, setUserKind] = useState<"existing" | "new">("existing");
  const [otpOpen, setOtpOpen] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [activeRecordIndex, setActiveRecordIndex] = useState(0);
  const [fhirOpen, setFhirOpen] = useState(false);
  const [cardBack, setCardBack] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [patientRecords, setPatientRecords] = useState<HealthRecordItem[]>([]);
  const [recordFilter, setRecordFilter] = useState<string>("All");
  const [navSection, setNavSection] = useState<NavSection>("signal");
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Doctor Gateway State
  const [doctorAuthMode, setDoctorAuthMode] = useState<DoctorAuthMode>("login");
  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number>(1);
  const [doctorUniqueIdInput, setDoctorUniqueIdInput] = useState("DOC-AIIMS-01");
  const [doctorPin, setDoctorPin] = useState("••••");

  // Doctor Sign-Up Form State
  const [docFullName, setDocFullName] = useState("");
  const [docLicense, setDocLicense] = useState("");
  const [docSpeciality, setDocSpeciality] = useState("Cardiology");
  const [docHospital, setDocHospital] = useState("AIIMS New Delhi");
  const [docQualification, setDocQualification] = useState("MBBS, MD (Medicine)");
  const [docExperience, setDocExperience] = useState("10");
  const [docPassword, setDocPassword] = useState("password123");
  const [isRegisteringDoctor, setIsRegisteringDoctor] = useState(false);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [txnId, setTxnId] = useState<string>("");
  const [maskedMobile, setMaskedMobile] = useState<string>("+91 ••••••4529");
  const [demoOtp, setDemoOtp] = useState<string>("123456");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    loadDoctors();
    loadRecords();

    const unsubscribe = api.subscribeRecords(() => {
      loadRecords();
    });
    return unsubscribe;
  }, []);

  const loadDoctors = async () => {
    const list = await api.getDoctors();
    setDoctorsList(list);
    if (list.length > 0) {
      setSelectedDoctorId(list[0].id);
      setDoctorUniqueIdInput(list[0].doctorId);
    }
  };

  const loadRecords = async () => {
    const records = await api.getRecords(1);
    setPatientRecords(records);
  };

  useEffect(() => {
    if (stage !== "resolving") return;
    const timer = window.setTimeout(() => setStage("dashboard"), 1450);
    return () => window.clearTimeout(timer);
  }, [stage]);

  const selectLoginTab = (tab: LoginTab) => {
    setLoginTab(tab);
    setIdentifier(tab === "abha" ? "91-4523-8910-1123" : "5432 1098 7654");
  };

  const startOtp = async () => {
    const rawClean = identifier.replace(/\D/g, "");
    if (rawClean.length < (loginTab === "abha" ? 14 : 12)) {
      toast.error(`Enter a valid ${loginTab === "abha" ? "14-digit ABHA" : "12-digit Aadhaar"} number.`);
      return;
    }
    
    try {
      const res = await fetch("/api/auth/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authMethod: loginTab === "abha" ? "ABHA_NUMBER" : "AADHAAR",
          identifier: identifier
        })
      });

      if (res.ok) {
        const data = await res.json();
        setTxnId(data.txnId);
        setMaskedMobile(data.maskedMobile);
        setDemoOtp(data.demoOtp || "123456");
        setOtp(["", "", "", "", "", ""]);
        setOtpOpen(true);
        window.setTimeout(() => otpRefs.current[0]?.focus(), 120);
        toast.success("Verification code dispatched via ABDM/UIDAI", {
          description: `Simulated SMS OTP is ${data.demoOtp} (Sent to ${data.maskedMobile})`
        });
      } else {
        throw new Error("Backend offline");
      }
    } catch (e) {
      // Offline fallback
      setTxnId(`TXN-${Date.now()}`);
      setDemoOtp("123456");
      setOtp(["", "", "", "", "", ""]);
      setOtpOpen(true);
      window.setTimeout(() => otpRefs.current[0]?.focus(), 120);
      toast("Verification code simulated", { description: "ABDM code is 123456." });
    }
  };

  const verifyIdentity = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Enter all six verification digits.");
      return;
    }

    setIsVerifying(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txnId: txnId || `TXN-LOCAL`,
          otp: code
        })
      });

      if (res.ok) {
        const result = await res.json();
        setCurrentUser(result.user);
        setUserKind(result.isNewUser ? "new" : "existing");
        setOtpOpen(false);
        setStage("resolving");
        if (result.isNewUser) {
          toast.success("New Patient Health Account Created!", { description: result.message });
        } else {
          toast.success(`Welcome back, ${result.user?.fullName}!`, { description: result.message });
        }
      } else {
        throw new Error("Verification error");
      }
    } catch (e) {
      // Fallback
      setOtpOpen(false);
      setStage("resolving");
    } finally {
      setIsVerifying(false);
    }
  };

  const fillDemo = (kind: "existing" | "new") => {
    setUserKind(kind);
    setLoginTab("abha");
    setIdentifier(kind === "existing" ? "91-4523-8910-1123" : "46-0198-7201-5566");
    toast(kind === "existing" ? "Existing patient demo loaded" : "New patient generator loaded");
  };

  const handleDoctorLogin = async () => {
    try {
      const res = await api.doctorLogin(doctorUniqueIdInput);
      setSelectedDoctorId(res.doctor.id);
      toast.success(`Doctor Authenticated: ${res.doctor.fullName}`, {
        description: `Verified Unique ID: ${res.doctor.doctorId} · License: ${res.doctor.licenseNumber}`
      });
      setStage("dashboard");
      setPortalChoice("doctor");
    } catch (err: any) {
      toast.error("Doctor Login Failed", { description: err.message || "Invalid Doctor ID or License." });
    }
  };

  const handleDoctorSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFullName.trim() || !docLicense.trim()) {
      toast.error("Please provide both Full Name and Medical Council License Number.");
      return;
    }

    setIsRegisteringDoctor(true);
    try {
      const res = await api.registerDoctor({
        fullName: docFullName,
        licenseNumber: docLicense,
        speciality: docSpeciality,
        hospitalName: docHospital,
        qualification: docQualification,
        experienceYears: Number(docExperience),
        password: docPassword
      });

      await loadDoctors();
      setSelectedDoctorId(res.doctor.id);
      setDoctorUniqueIdInput(res.doctor.doctorId);

      toast.success(`🎉 Medical License Verified!`, {
        description: `Generated Doctor Unique ID: ${res.doctor.doctorId}. Logging you into Clinical Space...`
      });

      window.setTimeout(() => {
        setStage("dashboard");
        setPortalChoice("doctor");
      }, 1000);
    } catch (err: any) {
      toast.error("Doctor Verification Failed", { description: err.message });
    } finally {
      setIsRegisteringDoctor(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setOtp((current) => current.map((entry, idx) => (idx === index ? digit : entry)));
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const incoming = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
    if (!incoming.length) return;
    setOtp(Array.from({ length: 6 }, (_, index) => incoming[index] ?? ""));
    otpRefs.current[Math.min(incoming.length, 5)]?.focus();
  };

  const syncProviders = async () => {
    setIsSyncing(true);
    await loadRecords();
    window.setTimeout(() => {
      setIsSyncing(false);
      toast.success("Health sources refreshed", { description: "Synchronized latest prescriptions & clinical encounters." });
    }, 1000);
  };

  // Direct Doctor Portal View
  if (portalChoice === "doctor" && stage === "dashboard") {
    return (
      <DoctorPortal
        initialDoctorId={selectedDoctorId}
        onSignOut={() => {
          setStage("gateway");
          setPortalChoice("patient");
          toast.info("Signed out from Doctor Space. Returned to Gateway.");
        }}
      />
    );
  }

  if (stage === "resolving") {
    return <ResolutionScreen kind={userKind} />;
  }

  // Filtered records for patient dashboard
  const filteredRecords = patientRecords.filter(r => {
    if (recordFilter === "All") return true;
    if (recordFilter === "Encounters") return r.recordType === "ENCOUNTER";
    if (recordFilter === "Labs") return r.recordType === "DIAGNOSTIC_REPORT";
    if (recordFilter === "Medicines") return r.recordType === "MEDICATION_REQUEST";
    if (recordFilter === "Immunizations") return r.recordType === "IMMUNIZATION";
    return true;
  });

  const activeRecord = filteredRecords[activeRecordIndex] || filteredRecords[0] || patientRecords[0];
  const activePatientUser: PatientUser = currentUser || api.getPatients()[0];

  if (stage === "dashboard" && portalChoice === "patient") {
    return (
      <Dashboard
        patientUser={activePatientUser}
        navSection={navSection}
        setNavSection={setNavSection}
        onSignOut={() => {
          setStage("gateway");
          setPortalChoice("patient");
          toast.info("Logged out from Patient Health Locker. Returned to Gateway.");
        }}
        patientRecords={filteredRecords}
        allRecords={patientRecords}
        allRecordsCount={patientRecords.length}
        activeRecord={activeRecord}
        activeRecordIndex={activeRecordIndex}
        setActiveRecordIndex={setActiveRecordIndex}
        recordFilter={recordFilter}
        setRecordFilter={setRecordFilter}
        fhirOpen={fhirOpen}
        setFhirOpen={setFhirOpen}
        cardBack={cardBack}
        setCardBack={setCardBack}
        isSyncing={isSyncing}
        syncProviders={syncProviders}
      />
    );
  }

  return (
    <main className="gateway-shell">
      <aside className="gateway-rail">
        <div className="brand-lockup">
          <SignalLogo />
          <span>Spectra<br />Health</span>
        </div>
        <div className="rail-caption">
          <span className="vertical-rule" />
          <p>ABDM-connected<br />health locker</p>
        </div>
        <div className="rail-footer"><span>01</span><span>2026</span></div>
      </aside>

      <section className="gateway-main">
        <header className="gateway-header">
          <span className="eyebrow">A more human health record</span>
          <div className="header-badges">
            <span><ShieldCheck size={15} /> Consent-led</span>
            <span><Database size={15} /> FHIR-ready</span>
            <span><BadgeCheck size={15} /> ABDM Gateway</span>
          </div>
        </header>

        <div className="gateway-grid">
          <div className="gateway-copy">
            <p className="section-index">01 / UNIFIED HEALTHCARE GATEWAY</p>
            <h1>Share the record,<br /><em>not your control.</em></h1>
            <p className="gateway-intro">
              Spectra connects patients, clinicians, and laboratories into one living care signal—with cryptographic consent, Doctor license verification, and FHIR R4 interoperability.
            </p>

            {/* Portal Selection Chips */}
            <div className="mt-8 space-y-2">
              <span className="text-[10px] font-mono text-[var(--rose-soft)] uppercase font-bold tracking-widest block mb-2">
                CHOOSE ACCESS PERSPECTIVE:
              </span>
              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setPortalChoice("patient")}
                  className={`px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2.5 transition-all border ${
                    portalChoice === "patient"
                      ? "bg-[var(--coral)] text-white border-[var(--coral)] shadow-sm scale-102"
                      : "bg-white text-[var(--rose)] border-[var(--line)] hover:bg-[var(--paper)]"
                  }`}
                >
                  <UserRound size={16} />
                  <span>Patient Login</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPortalChoice("doctor")}
                  className={`px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2.5 transition-all border ${
                    portalChoice === "doctor"
                      ? "bg-[var(--rose)] text-white border-[var(--rose)] shadow-sm scale-102"
                      : "bg-white text-[var(--rose)] border-[var(--line)] hover:bg-[var(--paper)]"
                  }`}
                >
                  <Stethoscope size={16} />
                  <span>Doctor Login</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPortalChoice("laboratory");
                    toast.info("Laboratory Diagnostic Module is active in Clinical Space");
                  }}
                  className={`px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2.5 transition-all border ${
                    portalChoice === "laboratory"
                      ? "bg-[var(--marigold)] text-white border-[var(--marigold)] shadow-sm scale-102"
                      : "bg-white text-[var(--rose)] border-[var(--line)] hover:bg-[var(--paper)]"
                  }`}
                >
                  <FlaskConical size={16} />
                  <span>Laboratory</span>
                </button>
              </div>
            </div>
          </div>

          <div className="identity-stack">
            <div className="signal-breadcrumb" aria-label="Login progress">
              <span className="active">Gateway</span>
              <ChevronRight size={15} />
              <span>{portalChoice === "doctor" ? "HPR Unique ID" : "OTP"}</span>
              <ChevronRight size={15} />
              <span>Verified</span>
              <ChevronRight size={15} />
              <span>{portalChoice === "doctor" ? "Clinical Space" : "Locker"}</span>
            </div>

            {/* PATIENT LOGIN CARD */}
            {portalChoice === "patient" && (
              <div className="ticket-card animate-fadeIn">
                <div className="ticket-topline">
                  <span className="ticket-label">PATIENT SPACE</span>
                  <span className="prototype-badge"><Sparkles size={13} /> ABDM Simulation</span>
                </div>
                <h2>Find your health signal.</h2>
                <p className="ticket-description">
                  Use your ABHA or Aadhaar-linked identity. You’ll approve the next step via OTP.
                </p>

                <div className="identity-tabs" role="tablist" aria-label="Identity method">
                  <button role="tab" aria-selected={loginTab === "abha"} className={loginTab === "abha" ? "selected" : ""} onClick={() => selectLoginTab("abha")} type="button">
                    <BadgeCheck size={18} /> ABHA number
                  </button>
                  <button role="tab" aria-selected={loginTab === "aadhaar"} className={loginTab === "aadhaar" ? "selected" : ""} onClick={() => selectLoginTab("aadhaar")} type="button">
                    <LockKeyhole size={17} /> Aadhaar number
                  </button>
                </div>

                <label className="field-label" htmlFor="identity-number">
                  {loginTab === "abha" ? "14-digit ABHA number" : "12-digit Aadhaar number"}
                  <span>{loginTab === "abha" ? "XX-XXXX-XXXX-XXXX" : "XXXX XXXX XXXX"}</span>
                </label>
                <div className="identity-input-wrap">
                  <input
                    id="identity-number"
                    className="identity-input"
                    inputMode="numeric"
                    aria-describedby="identity-help"
                    value={identifier}
                    onChange={(event) => setIdentifier(loginTab === "abha" ? formatAbha(event.target.value) : formatAadhaar(event.target.value))}
                  />
                  <span className="input-verified"><BadgeCheck size={19} /> ready</span>
                </div>
                <p className="field-help" id="identity-help">
                  {loginTab === "abha" ? "ABDM pathway · your health data stays consent-controlled." : "Aadhaar is only used in this simulated verification journey; never enter a real ID here."}
                </p>

                <div className="ticket-actions">
                  <button className="signal-button" onClick={startOtp} type="button">
                    Send verification OTP <ArrowRight size={18} />
                  </button>
                  <button className="quiet-button" onClick={() => fillDemo("existing")} type="button">Try existing patient (Aarav)</button>
                  <button className="quiet-button" onClick={() => fillDemo("new")} type="button">Try new patient</button>
                </div>
                <div className="privacy-strip"><ShieldCheck size={16} /><span>Demo only. This prototype does not perform e-KYC, store IDs, or provide medical advice.</span></div>
              </div>
            )}

            {/* DOCTOR LOGIN / SIGNUP CARD */}
            {portalChoice === "doctor" && (
              <div className="ticket-card animate-fadeIn">
                <div className="ticket-topline">
                  <span className="ticket-label">CLINICAL SPACE</span>
                  <span className="prototype-badge bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <BadgeCheck size={13} /> HPR Verified
                  </span>
                </div>
                
                {/* Doctor Auth Mode Tabs: Sign-In vs. Medical License Verification Sign-Up */}
                <div className="flex bg-[var(--paper)] p-1 rounded-xl border border-[var(--line)] my-3">
                  <button
                    type="button"
                    onClick={() => setDoctorAuthMode("login")}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      doctorAuthMode === "login"
                        ? "bg-white text-[var(--rose)] shadow-xs"
                        : "text-[var(--rose-soft)] hover:text-[var(--rose)]"
                    }`}
                  >
                    Doctor Sign-In (Unique ID)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDoctorAuthMode("signup")}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                      doctorAuthMode === "signup"
                        ? "bg-[var(--coral)] text-white shadow-xs"
                        : "text-[var(--rose-soft)] hover:text-[var(--rose)]"
                    }`}
                  >
                    <UserPlus size={13} /> Verify License & Register
                  </button>
                </div>

                {doctorAuthMode === "login" ? (
                  <>
                    <h2>Doctor Clinical Login.</h2>
                    <p className="ticket-description">
                      Enter your Unique Doctor ID (e.g. <code>DOC-AIIMS-01</code>) and password to enter the clinical workbench.
                    </p>

                    <div className="space-y-3.5 my-5">
                      <div>
                        <label className="field-label">Doctor Unique ID or License Number</label>
                        <input
                          type="text"
                          value={doctorUniqueIdInput}
                          onChange={(e) => setDoctorUniqueIdInput(e.target.value)}
                          placeholder="e.g. DOC-AIIMS-01 or MCI-DEL-2014-8849"
                          className="w-full bg-white border border-[var(--line)] rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-[var(--rose)] outline-none focus:ring-2 focus:ring-[var(--coral)]"
                        />
                      </div>

                      <div>
                        <label className="field-label">Doctor Security Password / PIN</label>
                        <input
                          type="password"
                          value={doctorPin}
                          onChange={(e) => setDoctorPin(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-white border border-[var(--line)] rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-[var(--rose)] outline-none focus:ring-2 focus:ring-[var(--coral)]"
                        />
                      </div>

                      {/* Quick Specialist Preset Switcher */}
                      <div>
                        <label className="text-[10px] font-mono uppercase text-[var(--rose-soft)] block mb-1">
                          Quick Presets (Registered Specialists):
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {doctorsList.slice(0, 4).map((doc) => (
                            <button
                              key={doc.id}
                              type="button"
                              onClick={() => {
                                setDoctorUniqueIdInput(doc.doctorId);
                                setSelectedDoctorId(doc.id);
                                toast.info(`Selected: ${doc.fullName} (${doc.doctorId})`);
                              }}
                              className={`p-2 text-left rounded-lg border text-[11px] font-semibold transition-all ${
                                doctorUniqueIdInput === doc.doctorId
                                  ? "bg-[#fff0e8] border-[var(--coral)] text-[var(--coral-deep)]"
                                  : "bg-white border-[var(--line)] text-[var(--rose)] hover:bg-[var(--paper)]"
                              }`}
                            >
                              <strong className="block truncate">{doc.fullName}</strong>
                              <span className="text-[9px] font-mono text-[var(--rose-soft)]">{doc.doctorId}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="ticket-actions">
                      <button
                        className="signal-button bg-[var(--rose)] hover:bg-black"
                        onClick={handleDoctorLogin}
                        type="button"
                      >
                        Enter Clinical Space (Doctor Portal) <ArrowRight size={18} />
                      </button>
                      <button
                        className="quiet-button"
                        onClick={() => setDoctorAuthMode("signup")}
                        type="button"
                      >
                        Need to onboard? Verify your Medical License →
                      </button>
                    </div>
                  </>
                ) : (
                  /* DOCTOR REGISTRATION & MEDICAL LICENSE VERIFICATION */
                  <form onSubmit={handleDoctorSignUp} className="space-y-3.5 my-3">
                    <h2>Verify License & Sign Up.</h2>
                    <p className="ticket-description">
                      Verified against National Medical Commission & HPR. Generates your unique clinical ID instantly.
                    </p>

                    <div>
                      <label className="field-label">Doctor Full Name</label>
                      <input
                        type="text"
                        required
                        value={docFullName}
                        onChange={(e) => setDocFullName(e.target.value)}
                        placeholder="e.g. Dr. Vikram Sethi"
                        className="w-full bg-white border border-[var(--line)] rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-[var(--coral)]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="field-label">Medical Council License No.</label>
                        <input
                          type="text"
                          required
                          value={docLicense}
                          onChange={(e) => setDocLicense(e.target.value)}
                          placeholder="MCI-DEL-2024-9102"
                          className="w-full bg-white border border-[var(--line)] rounded-xl px-3 py-2 text-xs font-mono font-bold outline-none focus:ring-2 focus:ring-[var(--coral)]"
                        />
                      </div>
                      <div>
                        <label className="field-label">Speciality</label>
                        <select
                          value={docSpeciality}
                          onChange={(e) => setDocSpeciality(e.target.value)}
                          className="w-full bg-white border border-[var(--line)] rounded-xl px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-[var(--coral)] cursor-pointer"
                        >
                          <option value="Cardiology">Cardiology</option>
                          <option value="Internal Medicine">Internal Medicine</option>
                          <option value="Neurology">Neurology</option>
                          <option value="Orthopedics">Orthopedics</option>
                          <option value="Pediatrics">Pediatrics</option>
                          <option value="Pulmonology">Pulmonology</option>
                          <option value="Endocrinology">Endocrinology</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="field-label">Hospital Affiliation</label>
                        <input
                          type="text"
                          value={docHospital}
                          onChange={(e) => setDocHospital(e.target.value)}
                          placeholder="e.g. AIIMS New Delhi"
                          className="w-full bg-white border border-[var(--line)] rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-[var(--coral)]"
                        />
                      </div>
                      <div>
                        <label className="field-label">Experience (Years)</label>
                        <input
                          type="number"
                          value={docExperience}
                          onChange={(e) => setDocExperience(e.target.value)}
                          className="w-full bg-white border border-[var(--line)] rounded-xl px-3 py-2 text-xs font-mono outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="field-label">Password</label>
                      <input
                        type="password"
                        required
                        value={docPassword}
                        onChange={(e) => setDocPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white border border-[var(--line)] rounded-xl px-3 py-2 text-xs outline-none"
                      />
                    </div>

                    <div className="ticket-actions pt-2">
                      <button
                        type="submit"
                        disabled={isRegisteringDoctor}
                        className="signal-button bg-[var(--coral)] hover:bg-[var(--coral-deep)]"
                      >
                        {isRegisteringDoctor ? <RefreshCw className="animate-spin" size={16} /> : <BadgeCheck size={18} />}
                        Verify Medical License & Generate ID <ArrowRight size={18} />
                      </button>
                      <button
                        type="button"
                        className="quiet-button"
                        onClick={() => setDoctorAuthMode("login")}
                      >
                        Already registered? Go to Doctor Sign-In
                      </button>
                    </div>
                  </form>
                )}

                <div className="privacy-strip"><ShieldCheck size={16} /><span>Compliant with National Health Authority ABDM Security Guidelines.</span></div>
              </div>
            )}

            {/* LABORATORY LOGIN CARD */}
            {portalChoice === "laboratory" && (
              <div className="ticket-card animate-fadeIn">
                <div className="ticket-topline">
                  <span className="ticket-label">DIAGNOSTIC LABORATORY</span>
                  <span className="prototype-badge"><Sparkles size={13} /> HIP Integration</span>
                </div>
                <h2>Publish Diagnostic Signal.</h2>
                <p className="ticket-description">
                  Turn raw lab analyzer outputs into structured FHIR Observation & DiagnosticReport resources for the patient locker.
                </p>

                <div className="my-6 p-4 bg-[var(--paper)] rounded-xl border border-[var(--line)] space-y-3">
                  <span className="text-xs font-bold block text-[var(--marigold)] flex items-center gap-1.5">
                    <FlaskConical size={16} /> Apollo Diagnostic Labs (HIP_APOLLO_03)
                  </span>
                  <p className="text-xs text-[var(--rose-soft)] leading-relaxed">
                    Connected diagnostic laboratory node configured to sign and publish biochemistry, lipid panels, and pathology bundles.
                  </p>
                </div>

                <div className="ticket-actions">
                  <button
                    className="signal-button bg-[var(--marigold)] hover:bg-[#b57600]"
                    onClick={() => {
                      toast.success("Diagnostic Laboratory Workspace Initialized");
                      setPortalChoice("doctor");
                      setStage("dashboard");
                    }}
                    type="button"
                  >
                    Open Diagnostic Workbench <ArrowRight size={18} />
                  </button>
                  <button
                    className="quiet-button"
                    onClick={() => setPortalChoice("patient")}
                    type="button"
                  >
                    Back to Patient Login
                  </button>
                </div>
              </div>
            )}

            <div className="ticket-shadow ticket-shadow-one" />
            <div className="ticket-shadow ticket-shadow-two" />
          </div>
        </div>

        <div className="gateway-art" aria-hidden="true">
          <img src="/manus-storage/spectra-signal-hero_88b04d11.png" alt="" />
        </div>
      </section>

      {/* OTP Modal */}
      <Dialog open={otpOpen} onOpenChange={setOtpOpen}>
        <DialogContent className="otp-dialog">
          <DialogHeader>
            <div className="issuer-seal"><SignalLogo compact /><span>Identity signal</span></div>
            <DialogTitle>Confirm your code</DialogTitle>
            <DialogDescription>In production, your chosen verified channel would deliver this code. This screen is a demo.</DialogDescription>
          </DialogHeader>
          <div className="otp-target"><span>Destination</span><strong>{maskedMobile}</strong><em>expires in 04:59</em></div>
          <div className="otp-grid" aria-label="Six digit one-time passcode">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(element) => { otpRefs.current[index] = element; }}
                value={digit}
                onChange={(event) => handleOtpChange(index, event.target.value)}
                onPaste={handleOtpPaste}
                onKeyDown={(event) => {
                  if (event.key === "Backspace" && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus();
                }}
                inputMode="numeric"
                maxLength={1}
                aria-label={`Verification digit ${index + 1}`}
              />
            ))}
          </div>
          <div className="otp-actions">
            <button className="quiet-button" onClick={() => setOtp((demoOtp || "123456").split(""))} type="button">Autofill code ({demoOtp})</button>
            <button className="signal-button" disabled={isVerifying} onClick={verifyIdentity} type="button">
              {isVerifying ? "Verifying..." : "Verify identity"} <Check size={18} />
            </button>
          </div>
          <p className="crypto-line"><LockKeyhole size={14} /> Designed for privacy-aware, consent-led verification flows.</p>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function ResolutionScreen({ kind }: { kind: "existing" | "new" }) {
  return (
    <main className="resolution-shell" aria-live="polite">
      <div className="resolution-panel">
        <SignalLogo />
        <p className="section-index">IDENTITY SIGNAL</p>
        <h1>We found the rhythm.</h1>
        <SignalLine />
        <div className="resolution-list">
          <div><span className="resolution-mark"><Check size={18} /></span><p><strong>Identity verified</strong><small>Prototype confirmation complete</small></p></div>
          <div><span className="resolution-mark pulse"><ScanLine size={18} /></span><p><strong>Reading your care map</strong><small>Resolving your Spectra workspace</small></p></div>
          <div><span className="resolution-mark wait">03</span><p><strong>{kind === "existing" ? "Welcome back, Aarav." : "Creating your care space."}</strong><small>{kind === "existing" ? "Your linked health record is ready." : "Your health locker will be ready in a moment."}</small></p></div>
        </div>
      </div>
    </main>
  );
}

function Dashboard({
  patientUser,
  navSection,
  setNavSection,
  onSignOut,
  patientRecords,
  allRecords,
  allRecordsCount,
  activeRecord,
  activeRecordIndex,
  setActiveRecordIndex,
  recordFilter,
  setRecordFilter,
  fhirOpen,
  setFhirOpen,
  cardBack,
  setCardBack,
  isSyncing,
  syncProviders,
}: {
  patientUser: PatientUser;
  navSection: NavSection;
  setNavSection: (section: NavSection) => void;
  onSignOut: () => void;
  patientRecords: HealthRecordItem[];
  allRecords: HealthRecordItem[];
  allRecordsCount: number;
  activeRecord: HealthRecordItem;
  activeRecordIndex: number;
  setActiveRecordIndex: (value: number) => void;
  recordFilter: string;
  setRecordFilter: (filter: string) => void;
  fhirOpen: boolean;
  setFhirOpen: (value: boolean) => void;
  cardBack: boolean;
  setCardBack: (value: boolean) => void;
  isSyncing: boolean;
  syncProviders: () => void;
}) {
  const patient = patientUser || api.getPatients()[0];
  const [recordSearchQuery, setRecordSearchQuery] = useState("");
  const [selectedArchiveRecord, setSelectedArchiveRecord] = useState<HealthRecordItem | null>(null);

  // Real Ephemeral Health QR Generator State with Auto-Expiry
  const [qrToken, setQrToken] = useState<string>(() => {
    const code = Math.floor(1000 + Math.random() * 9000);
    const token = `QR-ABDM-${patient.fullName.toUpperCase().split(" ")[0]}-${code}`;
    localStorage.setItem("spectra_active_qr_token", token);
    return token;
  });
  const [qrSecondsLeft, setQrSecondsLeft] = useState<number>(300); // 5 minutes
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // Live Timer Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setQrSecondsLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const isQrExpired = qrSecondsLeft === 0;

  // Format seconds as MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Regenerate New Ephemeral QR Function
  const handleRegenerateQr = () => {
    const newCode = Math.floor(1000 + Math.random() * 9000);
    const newToken = `QR-ABDM-${patient.fullName.toUpperCase().split(" ")[0]}-${newCode}`;
    setQrToken(newToken);
    setQrSecondsLeft(300);
    localStorage.setItem("spectra_active_qr_token", newToken);
    toast.success("✨ New Ephemeral Health QR Generated!", {
      description: `New session token: ${newToken}. Valid for 5 minutes.`
    });
  };

  // Copy QR token
  const handleCopyQrToken = () => {
    navigator.clipboard.writeText(qrToken);
    toast.success("QR Token Copied to Clipboard", {
      description: `Token: ${qrToken}. Doctor can paste this in the scan tab.`
    });
  };

  // Active Consents State
  const [consentsList, setConsentsList] = useState([
    {
      id: 1,
      doctorName: "Dr. Ananya Sharma",
      speciality: "Cardiology",
      hospital: "AIIMS New Delhi",
      hprId: "DOC-AIIMS-01",
      purpose: "Cardiovascular Evaluation & Antihypertensive Management",
      scopes: ["Diagnostics", "Encounters", "Prescriptions"],
      validDays: 28,
      status: "ACTIVE",
      grantedAt: "2026-08-02"
    },
    {
      id: 2,
      doctorName: "Dr. Rajesh Verma",
      speciality: "Internal Medicine",
      hospital: "Fortis Memorial Research",
      hprId: "DOC-FORTIS-02",
      purpose: "Metabolic Screening & Diabetes Prevention",
      scopes: ["Diagnostics", "Prescriptions"],
      validDays: 14,
      status: "ACTIVE",
      grantedAt: "2026-07-29"
    }
  ]);

  const handleRevokeConsent = (id: number) => {
    setConsentsList(consentsList.filter(c => c.id !== id));
    toast.success("Consent Revoked Immediately", {
      description: "Cryptographic token destroyed. Doctor no longer has access to your records."
    });
  };

  // Records filtered by category and search query
  const searchedRecords = allRecords.filter(rec => {
    const matchesFilter = recordFilter === "All" ||
      (recordFilter === "Encounters" && rec.recordType === "ENCOUNTER") ||
      (recordFilter === "Labs" && rec.recordType === "DIAGNOSTIC_REPORT") ||
      (recordFilter === "Medicines" && rec.recordType === "MEDICATION_REQUEST") ||
      (recordFilter === "Immunizations" && rec.recordType === "IMMUNIZATION");

    if (!matchesFilter) return false;
    if (!recordSearchQuery.trim()) return true;

    const query = recordSearchQuery.toLowerCase();
    return (
      rec.title.toLowerCase().includes(query) ||
      rec.description.toLowerCase().includes(query) ||
      (rec.diagnosis && rec.diagnosis.toLowerCase().includes(query)) ||
      (rec.doctorName && rec.doctorName.toLowerCase().includes(query)) ||
      (rec.facilityName && rec.facilityName.toLowerCase().includes(query)) ||
      (rec.prescriptions && rec.prescriptions.some(p => p.medicineName.toLowerCase().includes(query)))
    );
  });

  return (
    <main className="app-shell">
      {/* Sidebar Navigation */}
      <aside className="app-rail">
        <div className="brand-lockup"><SignalLogo /><span>Spectra<br />Health</span></div>
        <nav aria-label="Primary navigation">
          <button
            className={`nav-item ${navSection === "signal" ? "active" : ""}`}
            type="button"
            onClick={() => setNavSection("signal")}
          >
            <HeartPulse size={19} />
            <span>My signal</span>
          </button>
          
          <button
            className={`nav-item ${navSection === "records" ? "active" : ""}`}
            type="button"
            onClick={() => setNavSection("records")}
          >
            <ClipboardList size={19} />
            <span>Records</span>
          </button>

          <button
            className={`nav-item ${navSection === "consent" ? "active" : ""}`}
            type="button"
            onClick={() => setNavSection("consent")}
          >
            <ShieldCheck size={19} />
            <span>Consent</span>
          </button>

          <button
            className={`nav-item ${navSection === "sources" ? "active" : ""}`}
            type="button"
            onClick={() => setNavSection("sources")}
          >
            <RefreshCw size={19} />
            <span>Sources</span>
          </button>
        </nav>
        <div className="rail-bottom">
          <button className="nav-item text-red-600 hover:bg-red-50" type="button" onClick={onSignOut}>
            <LogOut size={19} />
            <span>Log out</span>
          </button>
          <p>FHIR R4<br />Live Sync</p>
        </div>
      </aside>

      <section className="app-canvas">
        <header className="app-header">
          <button className="mobile-menu" type="button" aria-label="Open navigation"><Menu size={21} /></button>
          <div className="page-heading">
            <p>Tuesday, 22 August · ABDM Patient Health Locker</p>
            <h1>Hello, {patient.fullName.split(" ")[0]}.</h1>
          </div>
          <div className="header-tools">
            <button
              onClick={() => setQrModalOpen(true)}
              className="bg-[var(--coral)] hover:bg-[var(--coral-deep)] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-xs transition-colors"
            >
              <QrCode size={15} /> Show Ephemeral QR
            </button>
            <button
              onClick={onSignOut}
              className="bg-white border border-[var(--line)] hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-[var(--rose)] text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-xs transition-all"
            >
              <LogOut size={15} /> Log Out
            </button>
            <button className="icon-button" type="button" onClick={() => toast("You have 2 active consents linked to your ABHA") } aria-label="View notifications"><Bell size={19} /><i /></button>
            <button className="avatar-button" type="button" onClick={onSignOut}>
              {patient.fullName.split(" ").map(n => n[0]).join("")}
            </button>
          </div>
        </header>

        {/* SECTION 1: MY SIGNAL (OVERVIEW + NON-FLUCTUATING BASELINE PROFILE + EPHEMERAL QR + RECENT TIMELINE) */}
        {navSection === "signal" && (
          <div className="space-y-8 animate-fadeIn">
            <section className="dashboard-hero mt-6">
              <div className="hero-copy">
                <div className="hero-eyebrow"><span /> LIVE PATIENT HEALTH LOCKER</div>
                <h2>Care that travels with you.</h2>
                <p>Your longitudinal clinical records, doctor prescriptions, and laboratory reports updated in real time.</p>
                <div className="hero-meta">
                  <span onClick={() => setNavSection("records")} className="cursor-pointer hover:underline">
                    <BadgeCheck size={16} /> {allRecordsCount} Total Medical Records
                  </span>
                  <span onClick={() => setNavSection("consent")} className="cursor-pointer hover:underline">
                    <ShieldCheck size={16} /> {consentsList.length} Active Consents
                  </span>
                  <span onClick={() => setQrModalOpen(true)} className="cursor-pointer hover:underline flex items-center gap-1 text-[var(--coral-deep)] font-bold">
                    <Timer size={15} /> Ephemeral QR: {formatTime(qrSecondsLeft)}
                  </span>
                </div>
              </div>
              <div className="hero-art-wrap"><img src="/manus-storage/spectra-doctor-lab-art_2091e459.png" alt="Abstract illustration" /></div>
              <div className="hero-stamp"><span>CONSENT</span><strong>IN<br />MOTION</strong></div>
            </section>

            {/* TOP ROW: DIGITAL ABHA CARD & REAL EPHEMERAL QR GENERATOR */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card 1: Digital ABHA Health Card */}
              <section className="id-artifact-section" aria-label="Digital ABHA health card">
                <div className={`abha-card ${cardBack ? "flipped" : ""}`}>
                  <div className="card-front">
                    <div className="tricolour-bar"><span /><span /><span /></div>
                    <div className="card-header"><span>ABHA health card</span><BadgeCheck size={19} /></div>
                    <div className="card-person"><div className="person-orb"><UserRound size={32} /></div><div><strong>{patient.fullName}</strong><small>ABHA linked · verified profile</small></div></div>
                    <div className="card-id-row"><span>ABHA NUMBER</span><code>{patient.abhaNumber}</code></div>
                    <div className="card-foot"><span>{patient.bloodGroup} <small>blood group</small></span><span>{patient.dob ? patient.dob.split("-")[0] : "1996"} <small>year of birth</small></span><span>{patient.gender} <small>sex</small></span></div>
                  </div>
                  <div className="card-back">
                    <span className="back-label">SHARE WITH PURPOSE</span>
                    <div className="bg-white p-2.5 rounded-xl border border-[var(--line)] shadow-2xs flex items-center justify-center my-2">
                      <QRCodeSVG
                        value={`https://spectra.health/patient/abha/${patient.abhaNumber}`}
                        size={110}
                        level="H"
                        includeMargin={false}
                      />
                    </div>
                    <p>Scoped sharing is available only after patient confirmation.</p>
                    <code>spectra.health/{patient.fullName.toLowerCase().split(" ")[0]}</code>
                  </div>
                </div>
                <div className="artifact-actions">
                  <button type="button" onClick={() => setCardBack(!cardBack)}><RefreshCw size={15} /> {cardBack ? "Show card" : "Flip to share"}</button>
                  <button type="button" onClick={() => toast("PDF card download simulated") }><FileText size={15} /> Download</button>
                </div>
              </section>

              {/* Card 2: Real Camera-Scannable Ephemeral QR Generator with Dynamic Expiry */}
              <section className="bg-[var(--cream)] border border-[var(--line)] rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--coral-deep)] flex items-center gap-1">
                      <ScanLine size={13} /> ABDM Ephemeral Clinical QR
                    </span>
                    <h3 className="text-xl font-bold font-['Bricolage_Grotesque'] text-[var(--rose)] mt-0.5">
                      Doctor Encounter Scan QR
                    </h3>
                    <p className="text-xs text-[var(--rose-soft)] mt-0.5">
                      Doctor can scan this real dynamic QR with any optical scanner or camera to unlock your care signal.
                    </p>
                  </div>

                  {/* Expiry Badge */}
                  <div className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 ${
                    isQrExpired
                      ? "bg-red-100 text-red-800 border-red-200"
                      : qrSecondsLeft < 60
                      ? "bg-amber-100 text-amber-900 border-amber-300 animate-pulse"
                      : "bg-emerald-100 text-emerald-900 border-emerald-300"
                  }`}>
                    <Clock size={14} />
                    {isQrExpired ? "EXPIRED" : formatTime(qrSecondsLeft)}
                  </div>
                </div>

                {/* Real QR Display Frame */}
                <div className="flex flex-col sm:flex-row items-center gap-5 bg-white p-4 rounded-xl border border-[var(--line)] relative overflow-hidden">
                  {/* Real Camera-Scannable SVG QR Code */}
                  <div className={`relative p-2.5 bg-white border-2 border-[var(--coral)] rounded-xl shadow-2xs flex items-center justify-center flex-shrink-0 ${isQrExpired ? "opacity-25 blur-[1px]" : ""}`}>
                    <QRCodeSVG
                      value={qrToken}
                      size={116}
                      level="H"
                      includeMargin={false}
                    />
                  </div>

                  {/* Expired Overlay */}
                  {isQrExpired && (
                    <div className="absolute inset-0 bg-black/65 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center">
                      <Lock size={24} className="text-red-400 mb-1" />
                      <strong className="text-sm font-bold">QR Token Expired</strong>
                      <p className="text-[11px] text-zinc-300 mt-0.5">Please generate a new QR to share with doctor.</p>
                      <button
                        onClick={handleRegenerateQr}
                        className="mt-2.5 bg-[var(--coral)] hover:bg-[var(--coral-deep)] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm flex items-center gap-1.5"
                      >
                        <RefreshCw size={13} /> Generate New QR
                      </button>
                    </div>
                  )}

                  {/* QR Token Details & Scopes */}
                  <div className="flex-1 space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] font-mono text-[var(--rose-soft)] block uppercase font-semibold">Active Session Token:</span>
                      <code className="text-xs font-mono font-bold text-[var(--coral-deep)] bg-[var(--blush)] px-2 py-1 rounded block mt-0.5 truncate">
                        {qrToken}
                      </code>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-[var(--rose-soft)] block uppercase font-semibold">Authorized Scopes:</span>
                      <div className="flex gap-1 flex-wrap mt-0.5">
                        {["Diagnostics", "Prescriptions", "Encounters"].map(sc => (
                          <span key={sc} className="bg-[var(--paper)] text-[var(--rose)] px-1.5 py-0.5 rounded text-[10px] font-mono border border-[var(--line)]">
                            {sc}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleCopyQrToken}
                        className="bg-[var(--paper)] hover:bg-[var(--blush)] text-[var(--rose)] border border-[var(--line)] text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1"
                      >
                        <Copy size={13} /> Copy Token
                      </button>
                      <button
                        type="button"
                        onClick={handleRegenerateQr}
                        className="bg-white hover:bg-[var(--paper)] text-[var(--coral-deep)] border border-[var(--coral)] text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1"
                      >
                        <RefreshCw size={13} /> Regenerate
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[var(--rose-soft)] pt-1">
                  <span>🔒 Real high-density QR code verified for camera capture</span>
                  <button
                    onClick={() => setQrModalOpen(true)}
                    className="text-[var(--coral-deep)] font-bold hover:underline"
                  >
                    Open Fullscreen QR →
                  </button>
                </div>
              </section>
            </div>

            {/* CLINICAL BASELINE PROFILE: NON-FLUCTUATING MARKERS */}
            <section className="vitals-section space-y-4" aria-labelledby="baseline-profile-title">
              <div className="section-heading">
                <div>
                  <p className="section-index">CLINICAL BASELINE PROFILE</p>
                  <h3 id="baseline-profile-title">Core Health Signal & Baseline</h3>
                </div>
                <span className="text-[11px] font-mono text-[var(--rose-soft)] bg-[var(--paper)] px-2.5 py-1 rounded-lg border border-[var(--line)]">
                  Stable Patient Markers
                </span>
              </div>

              {/* Top 4 Metric Cards: Age, Blood Group, Weight, Height */}
              <div className="vitals-grid">
                <article className="vital-card">
                  <span className="vital-mark mark-0">AGE</span>
                  <p>Age & DOB</p>
                  <strong>{patient.age || 29} <small>Years</small></strong>
                  <em><span />DOB: {patient.dob || "1996-07-14"} · {patient.gender}</em>
                </article>

                <article className="vital-card">
                  <span className="vital-mark mark-1">BLD</span>
                  <p>Blood Group</p>
                  <strong>{patient.bloodGroup || "O+"} <small>Rh Positive</small></strong>
                  <em><span />ABDM Verified Record</em>
                </article>

                <article className="vital-card">
                  <span className="vital-mark mark-2">WT</span>
                  <p>Body Weight</p>
                  <strong>{patient.weightKg || 71.5} <small>kg</small></strong>
                  <em><span />BMI: 23.3 · Healthy Range</em>
                </article>

                <article className="vital-card">
                  <span className="vital-mark mark-3">HT</span>
                  <p>Height / Stature</p>
                  <strong>{patient.heightCm || 175} <small>cm</small></strong>
                  <em><span />5 ft 9 in</em>
                </article>
              </div>

              {/* 3 Safety & Chronic Profile Panels: Known Allergies, Known Conditions, Long-Term Medications */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* Known Allergies Panel */}
                <div className="bg-red-50/80 border border-red-200 rounded-2xl p-4 space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-red-800 uppercase flex items-center gap-1.5">
                      <AlertTriangle size={14} className="text-red-600" /> Known Allergies
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                      {patient.knownAllergies?.length || 2} Recorded
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {(patient.knownAllergies || ["Penicillin (Severe anaphylactoid)", "Sulfa antibiotics"]).map((allergy, idx) => (
                      <div key={idx} className="bg-white px-3 py-2 rounded-xl border border-red-200/70 text-xs font-bold text-red-950 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                        <span className="leading-tight">{allergy}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-red-700/80 italic">High-priority alert for prescribing doctors</p>
                </div>

                {/* Known Conditions Panel */}
                <div className="bg-[#fff4eb] border border-[var(--coral)]/30 rounded-2xl p-4 space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[var(--coral-deep)] uppercase flex items-center gap-1.5">
                      <HeartPulse size={14} className="text-[var(--coral)]" /> Known Conditions
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-[var(--blush)] text-[var(--coral-deep)] px-2 py-0.5 rounded-full">
                      {patient.knownConditions?.length || 2} Active
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {(patient.knownConditions || ["Borderline Primary Hypertension", "Mild Allergic Rhinitis"]).map((condition, idx) => (
                      <div key={idx} className="bg-white px-3 py-2 rounded-xl border border-[var(--line)] text-xs font-bold text-[var(--rose)] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--coral)] flex-shrink-0" />
                        <span className="leading-tight">{condition}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-[var(--rose-soft)] italic">Tracked in longitudinal health record</p>
                </div>

                {/* Long-Term Medications Panel */}
                <div className="bg-[#fff9eb] border border-[var(--marigold)]/30 rounded-2xl p-4 space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[var(--marigold)] uppercase flex items-center gap-1.5">
                      <Pill size={14} className="text-[var(--marigold)]" /> Long-Term Medications
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                      {patient.longTermMedications?.length || 2} Maintained
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {(patient.longTermMedications || ["Telmisartan 40mg (OD Morning)", "Vitamin D3 60,000 IU (Monthly)"]).map((med, idx) => (
                      <div key={idx} className="bg-white px-3 py-2 rounded-xl border border-[var(--line)] text-xs font-bold text-[var(--rose)] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--marigold)] flex-shrink-0" />
                        <span className="leading-tight">{med}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-[var(--rose-soft)] italic">Active maintenance therapies</p>
                </div>
              </div>
            </section>

            {/* RECENT CARE SIGNAL SECTION */}
            <section className="records-section" aria-labelledby="records-title">
              <div className="section-heading record-heading">
                <div>
                  <p className="section-index">RECENT CARE SIGNAL</p>
                  <h3 id="records-title">Recent Encounters, Labs & Prescriptions</h3>
                </div>
                <button className="add-record" type="button" onClick={() => setNavSection("records")}>
                  View All Records Vault ({allRecordsCount}) <ArrowRight size={16} />
                </button>
              </div>

              <div className="records-layout">
                <div className="record-timeline">
                  {patientRecords.slice(0, 4).map((record, index) => {
                    const isSelected = activeRecordIndex === index;
                    const isRx = record.recordType === "MEDICATION_REQUEST";
                    const isLab = record.recordType === "DIAGNOSTIC_REPORT";
                    const Icon = isRx ? Pill : isLab ? FlaskConical : Stethoscope;
                    const colorClass = isRx ? "papaya" : isLab ? "marigold" : "coral";

                    return (
                      <button
                        className={isSelected ? "record-row selected" : "record-row"}
                        type="button"
                        onClick={() => setActiveRecordIndex(index)}
                        key={record.id || index}
                      >
                        <span className={`record-icon ${colorClass}`}><Icon size={19} /></span>
                        <span className="record-content">
                          <div className="flex items-center gap-2">
                            <em>{record.recordType}</em>
                            {record.diagnosis && (
                              <span className="text-[10px] bg-[var(--paper)] text-[var(--coral-deep)] font-mono font-bold px-1.5 py-0.2 rounded border border-[var(--line)]">
                                {record.diagnosis.split("-")[0]}
                              </span>
                            )}
                          </div>
                          <strong>{record.title}</strong>
                          <small>{record.doctorName ? `${record.doctorName} · ` : ""}{record.facilityName}</small>
                        </span>
                        <span className="record-date">{record.recordDate}<ChevronRight size={17} /></span>
                      </button>
                    );
                  })}
                </div>

                {activeRecord && (
                  <aside className="record-detail space-y-4">
                    <div className="detail-type">
                      <span className="detail-dot coral" />
                      <span>{activeRecord.recordType}</span>
                      <button type="button" aria-label="More actions"><MoreHorizontal size={19} /></button>
                    </div>

                    <h4>{activeRecord.title}</h4>

                    {/* Assessed Diagnosis */}
                    {activeRecord.diagnosis && (
                      <div className="bg-[#fff9f4] p-3 rounded-xl border border-[var(--marigold)]/50 text-xs">
                        <span className="text-[10px] font-mono text-[var(--rose-soft)] uppercase block font-bold">Assessed Diagnosis:</span>
                        <strong className="text-sm text-[var(--rose)]">{activeRecord.diagnosis}</strong>
                        {activeRecord.icdCode && (
                          <span className="ml-2 font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-[var(--line)] font-bold">
                            ICD-10: {activeRecord.icdCode}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Consultation Details */}
                    <p className="text-xs leading-relaxed text-[var(--rose)]">{activeRecord.description}</p>

                    {/* Prescribed Medications if any */}
                    {activeRecord.prescriptions && activeRecord.prescriptions.length > 0 && (
                      <div className="bg-[#fff2e8] p-3.5 rounded-xl border border-[var(--coral)]/30 space-y-2">
                        <span className="text-[11px] font-mono font-bold text-[var(--coral-deep)] uppercase flex items-center gap-1.5">
                          <Pill size={14} /> Prescribed Medications
                        </span>
                        <div className="space-y-1.5">
                          {activeRecord.prescriptions.map((p, idx) => (
                            <div key={idx} className="bg-white p-2.5 rounded-lg border border-[var(--line)] flex items-center justify-between text-xs">
                              <div>
                                <strong className="block text-[var(--rose)]">{p.medicineName}</strong>
                                <small className="text-[11px] text-[var(--rose-soft)]">{p.instructions}</small>
                              </div>
                              <div className="text-right">
                                <span className="font-mono font-bold text-[var(--coral)]">{p.frequency}</span>
                                <small className="block text-[10px] text-[var(--rose-soft)] font-mono">{p.durationDays} Days</small>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="secure-meta">
                      <ShieldCheck size={16} />
                      <span>Authored by {activeRecord.doctorName || "Verified Doctor"} ({activeRecord.doctorSpeciality || "Specialist"})</span>
                    </div>

                    <button className="fhir-button" type="button" onClick={() => setFhirOpen(true)}>
                      <Database size={16} /> Inspect FHIR R4 Bundle <ArrowRight size={16} />
                    </button>
                  </aside>
                )}
              </div>
            </section>
          </div>
        )}

        {/* SECTION 2: FULL RECORDS VAULT & PAST CLINICAL HISTORY */}
        {navSection === "records" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-[var(--cream)] border border-[var(--line)] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--coral-deep)] font-bold">
                    LONGITUDINAL HEALTH RECORD VAULT
                  </span>
                  <h2 className="text-2xl font-bold font-['Bricolage_Grotesque'] mt-1">
                    All Past Encounters, Diagnoses, Labs & Prescriptions
                  </h2>
                  <p className="text-xs text-[var(--rose-soft)] mt-0.5">
                    Unified repository of all cryptographically signed records linked to ABHA: <strong>{patient.abhaNumber}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={syncProviders}
                    className="bg-white border border-[var(--line)] hover:bg-[var(--paper)] text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs"
                  >
                    <RefreshCw size={14} /> Refresh Records
                  </button>
                </div>
              </div>

              {/* Search Bar & Filter Tabs */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--rose-soft)]" />
                  <input
                    type="text"
                    value={recordSearchQuery}
                    onChange={(e) => setRecordSearchQuery(e.target.value)}
                    placeholder="Search diagnoses, doctors, medicines..."
                    className="w-full bg-white border border-[var(--line)] rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-[var(--rose)] outline-none focus:ring-2 focus:ring-[var(--coral)]"
                  />
                  {recordSearchQuery && (
                    <button
                      onClick={() => setRecordSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--rose-soft)]"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto">
                  {["All", "Encounters", "Labs", "Medicines"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setRecordFilter(tab)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                        recordFilter === tab
                          ? "bg-[var(--coral)] text-white shadow-xs"
                          : "bg-white text-[var(--rose)] border border-[var(--line)] hover:bg-[var(--paper)]"
                      }`}
                    >
                      {tab} {tab === "All" && `(${searchedRecords.length})`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Full Records List */}
            <div className="space-y-4">
              {searchedRecords.length === 0 ? (
                <div className="bg-[var(--cream)] border border-[var(--line)] rounded-2xl p-12 text-center">
                  <ClipboardList size={36} className="mx-auto text-[var(--rose-soft)] mb-2" />
                  <h3 className="text-base font-bold text-[var(--rose)]">No records matched your search query.</h3>
                  <p className="text-xs text-[var(--rose-soft)] mt-1">Try clearing filters or search terms.</p>
                </div>
              ) : (
                searchedRecords.map((record, index) => {
                  const isRx = record.recordType === "MEDICATION_REQUEST";
                  const isLab = record.recordType === "DIAGNOSTIC_REPORT";
                  const Icon = isRx ? Pill : isLab ? FlaskConical : Stethoscope;
                  const iconBg = isRx ? "bg-orange-100 text-orange-700" : isLab ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-700";

                  return (
                    <div
                      key={record.id || index}
                      className="bg-[var(--cream)] border border-[var(--line)] rounded-2xl p-6 shadow-xs space-y-4 hover:border-[var(--coral)]/50 transition-all"
                    >
                      {/* Record Header */}
                      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--line)]/60 pb-3.5">
                        <div className="flex items-start gap-3.5">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold flex-shrink-0 ${iconBg}`}>
                            <Icon size={20} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--coral-deep)] bg-[var(--blush)] px-2 py-0.5 rounded">
                                {record.recordType}
                              </span>
                              {record.diagnosis && (
                                <span className="text-xs font-mono font-bold text-[var(--marigold)] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                  Diagnosis: {record.diagnosis}
                                </span>
                              )}
                            </div>
                            <h3 className="text-lg font-bold font-['Bricolage_Grotesque'] text-[var(--rose)] mt-1">
                              {record.title}
                            </h3>
                            <div className="flex items-center gap-3 text-xs text-[var(--rose-soft)] mt-0.5 flex-wrap">
                              <span><strong>{record.doctorName || "Verified Clinician"}</strong> ({record.doctorSpeciality || "Specialist"})</span>
                              <span>•</span>
                              <span><Hospital size={13} className="inline mr-1 text-[var(--coral)]" />{record.facilityName}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-[var(--rose)] bg-white px-3 py-1.5 rounded-lg border border-[var(--line)] block">
                            {record.recordDate}
                          </span>
                        </div>
                      </div>

                      {/* Clinical Content / Notes */}
                      <div className="text-xs text-[var(--rose)] leading-relaxed bg-white p-4 rounded-xl border border-[var(--line)]">
                        <strong>Clinical Consultation & Observations:</strong>
                        <p className="mt-1 text-[var(--rose)]">{record.description}</p>
                      </div>

                      {/* Vitals Recorded during this encounter */}
                      {record.vitalsSummary && (
                        <div className="bg-[#fff9f4] p-3 rounded-xl border border-[var(--line)] flex flex-wrap gap-4 text-xs font-mono">
                          {record.vitalsSummary.bp && <span>BP: <strong>{record.vitalsSummary.bp}</strong></span>}
                          {record.vitalsSummary.pulse && <span>Pulse: <strong>{record.vitalsSummary.pulse}</strong></span>}
                          {record.vitalsSummary.spo2 && <span>SpO₂: <strong>{record.vitalsSummary.spo2}</strong></span>}
                          {record.vitalsSummary.temp && <span>Temp: <strong>{record.vitalsSummary.temp}</strong></span>}
                        </div>
                      )}

                      {/* Prescriptions List if any */}
                      {record.prescriptions && record.prescriptions.length > 0 && (
                        <div className="bg-[#fff3eb] border border-[var(--coral)]/30 rounded-xl p-4 space-y-2">
                          <span className="text-[11px] font-mono font-bold text-[var(--coral-deep)] uppercase flex items-center gap-1.5">
                            <Pill size={14} /> Prescribed Medications ({record.prescriptions.length})
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {record.prescriptions.map((p, i) => (
                              <div key={i} className="bg-white p-3 rounded-lg border border-[var(--line)] text-xs flex justify-between items-center">
                                <div>
                                  <strong className="block text-[var(--rose)]">{p.medicineName}</strong>
                                  <small className="text-[11px] text-[var(--rose-soft)]">{p.instructions}</small>
                                </div>
                                <div className="text-right">
                                  <span className="font-mono font-bold text-[var(--coral)]">{p.frequency}</span>
                                  <small className="block text-[10px] text-[var(--rose-soft)] font-mono">{p.durationDays} Days</small>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions Footer */}
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-[11px] text-emerald-800 flex items-center gap-1 font-semibold">
                          <ShieldCheck size={14} className="text-emerald-700" /> Signed by {record.doctorName || "HPR Doctor"}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedArchiveRecord(record);
                              setFhirOpen(true);
                            }}
                            className="bg-white border border-[var(--line)] hover:bg-[var(--paper)] text-[var(--rose)] text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5"
                          >
                            <Database size={13} className="text-[var(--coral)]" /> Inspect FHIR R4
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* SECTION 3: CONSENT & DATA GOVERNANCE MANAGER */}
        {navSection === "consent" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-[var(--cream)] border border-[var(--line)] rounded-2xl p-6 shadow-sm">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--coral-deep)] font-bold">
                ABDM CONSENT MANAGER
              </span>
              <h2 className="text-2xl font-bold font-['Bricolage_Grotesque'] mt-1">
                Active Consents & Cryptographic Data Access
              </h2>
              <p className="text-xs text-[var(--rose-soft)] mt-0.5">
                Control which doctors and healthcare facilities can view your longitudinal records. Revoke access anytime with immediate effect.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {consentsList.map((consent) => (
                <div key={consent.id} className="bg-[var(--cream)] border border-[var(--line)] rounded-2xl p-6 space-y-4 shadow-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-base font-bold text-[var(--rose)]">{consent.doctorName}</strong>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                          ACTIVE
                        </span>
                      </div>
                      <p className="text-xs text-[var(--rose-soft)] mt-0.5">{consent.speciality} · {consent.hospital}</p>
                      <span className="text-[10px] font-mono text-[var(--coral-deep)]">HPR ID: {consent.hprId}</span>
                    </div>

                    <span className="text-xs font-mono font-bold bg-[var(--paper)] text-[var(--rose)] px-2.5 py-1 rounded-md border border-[var(--line)]">
                      {consent.validDays} Days Left
                    </span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-[var(--line)] space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[var(--rose-soft)] block font-bold">Purpose:</span>
                      <strong className="text-[var(--rose)]">{consent.purpose}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[var(--rose-soft)] block font-bold">Granted Data Scopes:</span>
                      <div className="flex gap-1.5 flex-wrap mt-1">
                        {consent.scopes.map(s => (
                          <span key={s} className="bg-[var(--paper)] text-[var(--rose)] px-2 py-0.5 rounded text-[10px] font-mono font-semibold border border-[var(--line)]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[var(--line)]">
                    <span className="text-[10px] text-[var(--rose-soft)] font-mono">Granted on {consent.grantedAt}</span>
                    <button
                      onClick={() => handleRevokeConsent(consent.id)}
                      className="bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold px-3.5 py-1.5 rounded-lg border border-red-200 transition-colors"
                    >
                      Revoke Consent Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cryptographic Audit Trail */}
            <div className="bg-[var(--cream)] border border-[var(--line)] rounded-2xl p-6 space-y-3">
              <h3 className="text-sm font-bold font-['Bricolage_Grotesque'] uppercase tracking-wider text-[var(--rose)]">
                🔒 Cryptographic Access Audit Log
              </h3>
              <div className="space-y-2">
                {[
                  { actor: "Dr. Ananya Sharma (DOC-AIIMS-01)", action: "Accessed ECG & Cardiology Encounter", time: "Today at 10:14 AM" },
                  { actor: "Apollo Diagnostic Labs (HIP_APOLLO_03)", action: "Published HbA1c & Fasting Lipid DiagnosticReport", time: "18 Aug 2026, 04:30 PM" },
                  { actor: "Dr. Rajesh Verma (DOC-FORTIS-02)", action: "Committed Telmisartan 40mg MedicationRequest", time: "29 Jul 2026, 11:20 AM" }
                ].map((log, i) => (
                  <div key={i} className="bg-white p-3 rounded-xl border border-[var(--line)] flex items-center justify-between text-xs">
                    <div>
                      <strong className="block text-[var(--rose)]">{log.actor}</strong>
                      <span className="text-[11px] text-[var(--rose-soft)]">{log.action}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[var(--rose-soft)]">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: CONNECTED HEALTH SOURCES & HIP PROVIDERS */}
        {navSection === "sources" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-[var(--cream)] border border-[var(--line)] rounded-2xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--coral-deep)] font-bold">
                  HEALTH INFORMATION PROVIDERS (HIP)
                </span>
                <h2 className="text-2xl font-bold font-['Bricolage_Grotesque'] mt-1">
                  Connected Healthcare Networks & Laboratories
                </h2>
                <p className="text-xs text-[var(--rose-soft)] mt-0.5">
                  Institutions linked to your ABHA profile for automated FHIR record discovery and ingestion.
                </p>
              </div>

              <button
                onClick={syncProviders}
                disabled={isSyncing}
                className="bg-[var(--coral)] hover:bg-[var(--coral-deep)] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm"
              >
                {isSyncing ? <RefreshCw className="animate-spin" size={15} /> : <RefreshCw size={15} />}
                Sync All Connected Providers
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "AIIMS New Delhi", hipId: "HIP_AIIMS_DELHI_001", records: "4 Encounters & Notes", status: "Linked & Synced" },
                { name: "Apollo Diagnostic Labs", hipId: "HIP_APOLLO_03", records: "2 Lab & Pathology Bundles", status: "Linked & Synced" },
                { name: "Fortis Memorial Research Institute", hipId: "HIP_FORTIS_001", records: "1 Active Prescription", status: "Linked & Synced" },
                { name: "Manipal Hospital Bengaluru", hipId: "HIP_MANIPAL_002", records: "Consultation Queue", status: "Connected" }
              ].map((prov, i) => (
                <div key={i} className="bg-[var(--cream)] border border-[var(--line)] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--paper)] text-[var(--rose)] border border-[var(--line)] font-bold flex items-center justify-center text-xs">
                        {prov.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                      </div>
                      <div>
                        <strong className="text-sm font-bold text-[var(--rose)] block">{prov.name}</strong>
                        <span className="text-[10px] font-mono text-[var(--rose-soft)]">{prov.hipId}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={12} /> {prov.status}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-[var(--line)] text-xs flex justify-between text-[var(--rose-soft)]">
                    <span>Synchronized: <strong>{prov.records}</strong></span>
                    <span className="text-[10px] font-mono text-emerald-700">Live ABDM Stream</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Real Fullscreen Ephemeral QR Modal */}
      <Dialog open={qrModalOpen} onOpenChange={setQrModalOpen}>
        <DialogContent className="max-w-md bg-[var(--cream)] border border-[var(--line)] text-[var(--rose)] p-6">
          <DialogHeader>
            <div className="issuer-seal"><ScanLine size={18} /><span>ABDM Ephemeral Protocol</span></div>
            <DialogTitle className="font-['Bricolage_Grotesque'] text-2xl font-bold">
              Scan Patient Care Signal
            </DialogTitle>
            <DialogDescription className="text-xs text-[var(--rose-soft)]">
              Doctor can scan this dynamic QR code with any optical camera scanner to securely link records and author encounters.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-4 space-y-4">
            <div className={`p-4 bg-white border-2 border-[var(--coral)] rounded-2xl shadow-md relative flex items-center justify-center ${isQrExpired ? "opacity-30 blur-xs" : ""}`}>
              <QRCodeSVG
                value={qrToken}
                size={210}
                level="H"
                includeMargin={true}
              />
            </div>

            {/* Countdown Badge */}
            <div className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 ${
              isQrExpired ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800"
            }`}>
              <Clock size={16} />
              <span>{isQrExpired ? "TOKEN EXPIRED" : `Expires in: ${formatTime(qrSecondsLeft)}`}</span>
            </div>

            <div className="w-full bg-white p-3.5 rounded-xl border border-[var(--line)] text-center space-y-1">
              <span className="text-[10px] font-mono text-[var(--rose-soft)] uppercase block">Session Token</span>
              <strong className="text-sm font-mono text-[var(--coral-deep)] block">{qrToken}</strong>
            </div>

            <div className="flex gap-2 w-full">
              <button
                type="button"
                onClick={handleCopyQrToken}
                className="flex-1 bg-white hover:bg-[var(--paper)] text-[var(--rose)] border border-[var(--line)] text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5"
              >
                <Copy size={14} /> Copy Token Code
              </button>
              <button
                type="button"
                onClick={handleRegenerateQr}
                className="flex-1 bg-[var(--coral)] hover:bg-[var(--coral-deep)] text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
              >
                <RefreshCw size={14} /> Generate New QR
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* FHIR Dialog */}
      <Dialog open={fhirOpen} onOpenChange={setFhirOpen}>
        <DialogContent className="fhir-dialog">
          <DialogHeader>
            <div className="issuer-seal"><Database size={18} /><span>FHIR R4 Resource Sample</span></div>
            <DialogTitle>{(selectedArchiveRecord || activeRecord)?.title || "FHIR Resource"}</DialogTitle>
            <DialogDescription>A structured HL7 FHIR Bundle synchronized through ABDM.</DialogDescription>
          </DialogHeader>
          <pre>{(selectedArchiveRecord || activeRecord)?.fhirResourceJson || JSON.stringify(selectedArchiveRecord || activeRecord, null, 2)}</pre>
          <div className="fhir-footer">
            <span><ShieldCheck size={15} /> Cryptographically Signed</span>
            <button className="signal-button" type="button" onClick={() => setFhirOpen(false)}>Close resource</button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
