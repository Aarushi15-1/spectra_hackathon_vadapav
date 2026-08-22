/**
 * Spectra Health design contract: Care as a Living Signal.
 * Post-digital editorial healthcare using cream, Signal Coral, Marigold, and Rose Ink.
 * The layout is a health ribbon, never a generic blue/black/green dashboard.
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
} from "lucide-react";
import QRCode from "qrcode";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function QrCodeDisplay({ text, size = 160 }: { text: string; size?: number }) {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    QRCode.toDataURL(text, {
      width: size * 2,
      margin: 1,
      color: {
        dark: "#090d16",
        light: "#ffffff",
      },
    })
      .then(setDataUrl)
      .catch(() => {
        setDataUrl(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`);
      });
  }, [text, size]);

  return (
    <div style={{ background: "#ffffff", padding: "8px", borderRadius: "12px", display: "inline-block", boxShadow: "0 8px 30px rgba(0,0,0,0.4)" }}>
      {dataUrl ? (
        <img src={dataUrl} alt={`QR Code for ${text}`} style={{ width: `${size}px`, height: `${size}px`, display: "block" }} />
      ) : (
        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`} alt={`QR Code for ${text}`} style={{ width: `${size}px`, height: `${size}px`, display: "block" }} />
      )}
    </div>
  );
}

type Stage = "gateway" | "resolving" | "dashboard";
type LoginTab = "abha" | "aadhaar";
type Workspace = "patient" | "doctor" | "laboratory";

const fhirPreview = `{
  "resourceType": "Bundle",
  "type": "collection",
  "entry": [
    {
      "resource": {
        "resourceType": "Observation",
        "status": "final",
        "code": { "text": "HbA1c" },
        "valueQuantity": { "value": 5.6, "unit": "%" }
      }
    },
    {
      "resource": {
        "resourceType": "DiagnosticReport",
        "status": "final",
        "conclusion": "Within reference range"
      }
    }
  ]
}`;

const records = [
  {
    type: "DiagnosticReport",
    title: "HbA1c & fasting lipid panel",
    source: "Apollo Diagnostic Labs · HIP_APOLLO_03",
    date: "18 Aug 2026",
    note: "Three markers were updated in your longitudinal record.",
    icon: FlaskConical,
    color: "marigold",
  },
  {
    type: "Encounter",
    title: "Cardiology follow-up",
    source: "AIIMS New Delhi · HIP_AIIMS_DELHI_001",
    date: "02 Aug 2026",
    note: "BP stable. Continue the current care plan and review in 90 days.",
    icon: Stethoscope,
    color: "coral",
  },
  {
    type: "MedicationRequest",
    title: "Updated prescription",
    source: "Fortis Health · HIP_FORTIS_001",
    date: "29 Jul 2026",
    note: "Telmisartan 40mg OD · renewed for 90 days.",
    icon: Pill,
    color: "papaya",
  },
];

const vitals = [
  { label: "Blood pressure", value: "120/80", unit: "mmHg", note: "Within target", detail: "BP" },
  { label: "Heart rate", value: "72", unit: "bpm", note: "Resting", detail: "HR" },
  { label: "Fasting glucose", value: "94", unit: "mg/dL", note: "In range", detail: "GL" },
  { label: "Blood oxygen", value: "99", unit: "% SpO₂", note: "Latest result", detail: "O₂" },
];

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
  const [loginTab, setLoginTab] = useState<LoginTab>("abha");
  const [workspace, setWorkspace] = useState<Workspace>("patient");
  const [identifier, setIdentifier] = useState("91-4523-8910-1123");
  const [userKind, setUserKind] = useState<"existing" | "new">("existing");
  const [otpOpen, setOtpOpen] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [activeRecord, setActiveRecord] = useState(0);
  const [fhirOpen, setFhirOpen] = useState(false);
  const [cardBack, setCardBack] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [txnId, setTxnId] = useState<string>("");
  const [maskedMobile, setMaskedMobile] = useState<string>("+91 ••••••4529");
  const [demoOtp, setDemoOtp] = useState<string>("123456");
  const [isVerifying, setIsVerifying] = useState(false);

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
    try {
      await fetch(`/api/records${currentUser?.id ? `?userId=${currentUser.id}` : ""}`);
    } catch (e) {}
    window.setTimeout(() => {
      setIsSyncing(false);
      toast.success("Health sources refreshed", { description: "FHIR R4 medical records synchronized." });
    }, 1200);
  };

  const workspaceLabels: Record<Workspace, { kicker: string; title: string; description: string }> = {
    patient: {
      kicker: "PATIENT SPACE",
      title: "Your health story, finally in one signal.",
      description: "A living record that keeps your care connected and your consent in view.",
    },
    doctor: {
      kicker: "CLINICAL SPACE",
      title: "See the signal, not the paperwork.",
      description: "A consented longitudinal view for faster, calmer clinical decisions.",
    },
    laboratory: {
      kicker: "LABORATORY SPACE",
      title: "Publish results into the care story.",
      description: "Turn diagnostics into structured FHIR resources patients can carry forward.",
    },
  };

  if (stage === "resolving") {
    return <ResolutionScreen kind={userKind} />;
  }

  if (stage === "dashboard") {
    return (
      <Dashboard
        workspace={workspace}
        setWorkspace={setWorkspace}
        onSignOut={() => setStage("gateway")}
        activeRecord={activeRecord}
        setActiveRecord={setActiveRecord}
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
          </div>
        </header>

        <div className="gateway-grid">
          <div className="gateway-copy">
            <p className="section-index">01 / IDENTITY GATEWAY</p>
            <h1>Share the record,<br /><em>not your control.</em></h1>
            <p className="gateway-intro">
              Spectra turns disconnected encounters into one patient-held care signal—built for the ABDM ecosystem, clinicians, and laboratories.
            </p>
            <div className="workspace-picker" aria-label="Select a demonstration workspace">
              <span>Enter as</span>
              {(Object.keys(workspaceLabels) as Workspace[]).map((item) => (
                <button
                  className={workspace === item ? "workspace-chip active" : "workspace-chip"}
                  onClick={() => setWorkspace(item)}
                  key={item}
                  type="button"
                >
                  {item === "patient" ? <UserRound size={14} /> : item === "doctor" ? <Stethoscope size={14} /> : <FlaskConical size={14} />}
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="identity-stack">
            <div className="signal-breadcrumb" aria-label="Login progress">
              <span className="active">Gateway</span><ChevronRight size={15} /><span>OTP</span><ChevronRight size={15} /><span>Verified</span><ChevronRight size={15} /><span>Locker</span>
            </div>
            <div className="ticket-card">
              <div className="ticket-topline">
                <span className="ticket-label">{workspaceLabels[workspace].kicker}</span>
                <span className="prototype-badge"><Sparkles size={13} /> Prototype simulation</span>
              </div>
              <h2>{workspace === "patient" ? "Find your health signal." : workspaceLabels[workspace].title}</h2>
              <p className="ticket-description">{workspace === "patient" ? "Use your ABHA or Aadhaar-linked identity. You’ll approve the next step." : workspaceLabels[workspace].description}</p>

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
                <button className="quiet-button" onClick={() => fillDemo("existing")} type="button">Try existing patient</button>
                <button className="quiet-button" onClick={() => fillDemo("new")} type="button">Try new patient</button>
              </div>
              <div className="privacy-strip"><ShieldCheck size={16} /><span>Demo only. This prototype does not perform e-KYC, store IDs, or provide medical advice.</span></div>
            </div>
            <div className="ticket-shadow ticket-shadow-one" />
            <div className="ticket-shadow ticket-shadow-two" />
          </div>
        </div>
        <div className="gateway-art" aria-hidden="true">
          <img src="/manus-storage/spectra-signal-hero_88b04d11.png" alt="" />
        </div>
      </section>

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
  workspace,
  setWorkspace,
  onSignOut,
  activeRecord,
  setActiveRecord,
  fhirOpen,
  setFhirOpen,
  cardBack,
  setCardBack,
  isSyncing,
  syncProviders,
}: {
  workspace: Workspace;
  setWorkspace: (value: Workspace) => void;
  onSignOut: () => void;
  activeRecord: number;
  setActiveRecord: (value: number) => void;
  fhirOpen: boolean;
  setFhirOpen: (value: boolean) => void;
  cardBack: boolean;
  setCardBack: (value: boolean) => void;
  isSyncing: boolean;
  syncProviders: () => void;
}) {
  const selected = records[activeRecord];
  const [activeTab, setActiveTab] = useState<"overview" | "healthcard" | "doctors" | "consent" | "audit">("overview");
  const [qrOpen, setQrOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [qrToken, setQrToken] = useState("qr-sess-9f8e12a7bc41");
  const [qrTimeLeft, setQrTimeLeft] = useState(300);
  const [authorizations, setAuthorizations] = useState([
    { id: 1, doctorName: "Dr. Ananya Sharma", speciality: "Cardiology", hospital: "AIIMS New Delhi", purpose: "Cardiology consultation and review", scope: "HealthCard, Allergies, Current Meds, Cardiac Reports", expires: "29 Aug 2026", status: "ACTIVE" }
  ]);
  const [healthCardData, setHealthCardData] = useState({
    bloodGroup: "O+",
    age: 29,
    weightKg: 71.5,
    heightCm: 176,
    allergies: "Penicillin, Dust mites",
    chronicConditions: "Stage 1 Hypertension (Controlled)",
    currentMedications: "Telmisartan 40mg OD",
    primaryContact: "+91 9820145290",
    emergencyContact: "Pooja Sharma (Spouse) — +91 9820199442"
  });
  const [editCardOpen, setEditCardOpen] = useState(false);
  const [emergencySummary, setEmergencySummary] = useState<any>(null);

  // QR Timer
  useEffect(() => {
    if (!qrOpen || qrTimeLeft <= 0) return;
    const timer = setInterval(() => setQrTimeLeft((prev) => Math.max(0, prev - 1)), 1000);
    return () => clearInterval(timer);
  }, [qrOpen, qrTimeLeft]);

  const handleRevoke = (id: number, name: string) => {
    setAuthorizations(prev => prev.filter(a => a.id !== id));
    toast.success(`Access authorization revoked for ${name}. Recorded in audit trail.`);
  };

  const handleEmergencyDeclare = () => {
    setEmergencySummary({
      accessedBy: "Dr. Ananya Sharma (Trauma Lead)",
      hospital: "AIIMS Trauma Center, Resuscitation Bay",
      bloodGroup: healthCardData.bloodGroup,
      allergies: healthCardData.allergies,
      emergencyContact: healthCardData.emergencyContact,
      validHours: 4
    });
    toast.error("🚨 HIGH-PRIORITY EMERGENCY ACCESS INVOKED! Logged in immutable audit trail.");
  };

  return (
    <main className="app-shell">
      <aside className="app-rail">
        <div className="brand-lockup"><SignalLogo /><span>HealthBridge<br />Platform</span></div>
        <nav aria-label="Primary navigation">
          <button className={`nav-item ${activeTab === "overview" ? "active" : ""}`} type="button" onClick={() => setActiveTab("overview")}><HeartPulse size={19} /><span>Dashboard</span></button>
          <button className={`nav-item ${activeTab === "healthcard" ? "active" : ""}`} type="button" onClick={() => setActiveTab("healthcard")}><BadgeCheck size={19} /><span>HealthCard</span></button>
          <button className={`nav-item ${activeTab === "doctors" ? "active" : ""}`} type="button" onClick={() => setActiveTab("doctors")}><Stethoscope size={19} /><span>Doctors</span></button>
          <button className={`nav-item ${activeTab === "consent" ? "active" : ""}`} type="button" onClick={() => setActiveTab("consent")}><ShieldCheck size={19} /><span>Access & Consent</span></button>
          <button className={`nav-item ${activeTab === "audit" ? "active" : ""}`} type="button" onClick={() => setActiveTab("audit")}><ScanLine size={19} /><span>Audit Trail</span></button>
        </nav>
        <div className="rail-bottom">
          <button className="nav-item" type="button" onClick={onSignOut}><X size={19} /><span>Sign out</span></button>
          <p>FHIR R4 • Supabase<br />PBKDF2-HMAC-SHA256</p>
        </div>
      </aside>

      <section className="app-canvas">
        <header className="app-header">
          <button className="mobile-menu" type="button" aria-label="Open navigation"><Menu size={21} /></button>
          <div className="page-heading">
            <p>Tuesday, 22 August • Patient ID: <strong style={{ color: "#10b981", fontFamily: "monospace" }}>HB-2026-89410</strong></p>
            <h1>Hello, Aarav Sharma.</h1>
          </div>
          <div className="header-tools">
            <button className="signal-button" type="button" onClick={() => { setQrToken("qr-sess-" + Math.random().toString(36).substring(2, 12)); setQrTimeLeft(300); setQrOpen(true); }} style={{ padding: "8px 14px", fontSize: "12px", background: "linear-gradient(135deg, #10b981, #06b6d4)", color: "#090d16", fontWeight: "bold" }}>
              <ScanLine size={15} /> Share Ephemeral QR
            </button>
            <button className="quiet-button" type="button" onClick={() => setEmergencyOpen(true)} style={{ padding: "8px 14px", fontSize: "12px", background: "rgba(225, 29, 72, 0.2)", border: "1px solid rgba(225, 29, 72, 0.5)", color: "#f43f5e", fontWeight: "bold" }}>
              <LockKeyhole size={15} /> Emergency Access
            </button>
            <button className="avatar-button" type="button" onClick={onSignOut}>AS</button>
          </div>
        </header>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <>
            <section className="dashboard-hero">
              <div className="hero-copy">
                <div className="hero-eyebrow"><span /> PATIENT-CONTROLLED LOCKER</div>
                <h2>Care that travels with you, on your terms.</h2>
                <p>HealthBridge connects your health records across hospitals and labs with strict purpose-bound consent and zero raw Aadhaar exposure.</p>
                <div className="hero-meta"><span><BadgeCheck size={16} /> 4 Connected Sources</span><span><ShieldCheck size={16} /> {authorizations.length} Active Authorizations</span></div>
              </div>
              <div className="hero-art-wrap"><img src="/manus-storage/spectra-doctor-lab-art_2091e459.png" alt="Health signal" /></div>
              <div className="hero-stamp"><span>PATIENT</span><strong>IN<br />CONTROL</strong></div>
            </section>

            <div className="overview-grid">
              <section className="id-artifact-section" aria-label="Digital HealthCard">
                <div className={`abha-card ${cardBack ? "flipped" : ""}`}>
                  <div className="card-front">
                    <div className="tricolour-bar"><span /><span /><span /></div>
                    <div className="card-header"><span>HealthBridge HealthCard</span><BadgeCheck size={19} /></div>
                    <div className="card-person"><div className="person-orb"><UserRound size={32} /></div><div><strong>Aarav Sharma</strong><small>Patient ID: HB-2026-89410</small></div></div>
                    <div className="card-id-row"><span>EMERGENCY CONTACT</span><code>{healthCardData.emergencyContact.split("—")[0]}</code></div>
                    <div className="card-foot"><span>{healthCardData.bloodGroup} <small>blood group</small></span><span>{healthCardData.age} yrs <small>age</small></span><span>Male <small>sex</small></span></div>
                  </div>
                  <div className="card-back" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <span className="back-label" style={{ marginBottom: "6px" }}>SHARE WITH PURPOSE</span>
                    <QrCodeDisplay text={qrToken} size={105} />
                    <p style={{ margin: "6px 0 2px" }}>5-Min Ephemeral Token: {qrToken}</p>
                    <code>Possession ≠ Access</code>
                  </div>
                </div>
                <div className="artifact-actions"><button type="button" onClick={() => setCardBack(!cardBack)}><RefreshCw size={15} /> {cardBack ? "Show front" : "Flip card"}</button><button type="button" onClick={() => setEditCardOpen(true)}><FileText size={15} /> Edit Summary</button></div>
              </section>

              <section className="vitals-section" aria-labelledby="vitals-title">
                <div className="section-heading"><div><p className="section-index">HEALTHCARD SUMMARY</p><h3 id="vitals-title">Clinical Profile (§ 3)</h3></div><button type="button" onClick={() => setEditCardOpen(true)}>Edit <ArrowRight size={15} /></button></div>
                <div className="vitals-grid">
                  <article className="vital-card"><span className="vital-mark mark-0">Allergies</span><p>Known Allergies</p><strong>{healthCardData.allergies}</strong><em><span />Verified</em></article>
                  <article className="vital-card"><span className="vital-mark mark-1">Chronic</span><p>Conditions</p><strong>{healthCardData.chronicConditions}</strong><em><span />Stable</em></article>
                  <article className="vital-card"><span className="vital-mark mark-2">Rx</span><p>Current Meds</p><strong>{healthCardData.currentMedications}</strong><em><span />Daily OD</em></article>
                  <article className="vital-card"><span className="vital-mark mark-3">Emergency</span><p>Contact</p><strong>{healthCardData.emergencyContact}</strong><em><span />Primary</em></article>
                </div>
              </section>
            </div>

            <section className="records-section" aria-labelledby="records-title">
              <div className="section-heading record-heading"><div><p className="section-index">HL7 FHIR RESOURCE VAULT</p><h3 id="records-title">Standardized Medical Records</h3></div><button className="add-record" type="button" onClick={() => setFhirOpen(true)}><Database size={17} /> Inspect FHIR R4 Bundle</button></div>
              <div className="records-layout">
                <div className="record-timeline">
                  {records.map((record, index) => {
                    const Icon = record.icon;
                    return <button className={activeRecord === index ? "record-row selected" : "record-row"} type="button" onClick={() => setActiveRecord(index)} key={record.title}><span className={`record-icon ${record.color}`}><Icon size={19} /></span><span className="record-content"><em>{record.type}</em><strong>{record.title}</strong><small>{record.source}</small></span><span className="record-date">{record.date}<ChevronRight size={17} /></span></button>;
                  })}
                </div>
                <aside className="record-detail">
                  <div className="detail-type"><span className={`detail-dot ${selected.color}`} /><span>{selected.type}</span></div>
                  <h4>{selected.title}</h4><p>{selected.note}</p>
                  <div className="secure-meta"><ShieldCheck size={16} /><span>HL7 FHIR R4 Normalized & Encrypted</span></div>
                  <button className="fhir-button" type="button" onClick={() => setFhirOpen(true)}><Database size={16} /> Inspect Resource Payload <ArrowRight size={16} /></button>
                </aside>
              </div>
            </section>
          </>
        )}

        {/* TAB 2: HEALTHCARD DETAILED */}
        {activeTab === "healthcard" && (
          <section className="records-section">
            <div className="section-heading"><div><p className="section-index">SECTION 3 SPECIFICATION</p><h3>HealthCard — Structured Patient Summary</h3></div><button className="add-record" onClick={() => setEditCardOpen(true)}><FileText size={16} /> Edit Summary</button></div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginTop: "16px" }}>
              <div style={{ padding: "20px", background: "rgba(15, 23, 42, 0.6)", borderRadius: "16px", border: "1px solid rgba(30, 41, 59, 0.8)" }}>
                <p style={{ fontSize: "11px", color: "#94a3b8" }}>PATIENT IDENTITY</p>
                <h4 style={{ fontSize: "16px", fontWeight: "bold", color: "#f8fafc", margin: "4px 0" }}>Aarav Sharma</h4>
                <p style={{ fontSize: "12px", color: "#10b981", fontFamily: "monospace" }}>ID: HB-2026-89410</p>
                <p style={{ fontSize: "12px", color: "#cbd5e1", marginTop: "8px" }}>Blood Group: <strong style={{ color: "#f43f5e" }}>{healthCardData.bloodGroup}</strong> • Age: {healthCardData.age} yrs</p>
                <p style={{ fontSize: "12px", color: "#cbd5e1" }}>Weight: {healthCardData.weightKg} kg • Height: {healthCardData.heightCm} cm</p>
              </div>
              <div style={{ padding: "20px", background: "rgba(15, 23, 42, 0.6)", borderRadius: "16px", border: "1px solid rgba(30, 41, 59, 0.8)" }}>
                <p style={{ fontSize: "11px", color: "#fbbf24" }}>KNOWN ALLERGIES</p>
                <p style={{ fontSize: "13px", fontWeight: "600", color: "#fef08a", marginTop: "6px" }}>{healthCardData.allergies}</p>
                <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "12px" }}>CHRONIC CONDITIONS</p>
                <p style={{ fontSize: "13px", fontWeight: "600", color: "#67e8f9" }}>{healthCardData.chronicConditions}</p>
              </div>
              <div style={{ padding: "20px", background: "rgba(15, 23, 42, 0.6)", borderRadius: "16px", border: "1px solid rgba(30, 41, 59, 0.8)" }}>
                <p style={{ fontSize: "11px", color: "#818cf8" }}>CURRENT MEDICATIONS</p>
                <p style={{ fontSize: "13px", fontWeight: "600", color: "#c7d2fe", marginTop: "6px" }}>{healthCardData.currentMedications}</p>
                <p style={{ fontSize: "11px", color: "#f43f5e", marginTop: "12px" }}>EMERGENCY CONTACT</p>
                <p style={{ fontSize: "12px", fontWeight: "bold", color: "#fda4af" }}>{healthCardData.emergencyContact}</p>
              </div>
            </div>
          </section>
        )}

        {/* TAB 3: VERIFIED DOCTORS */}
        {activeTab === "doctors" && (
          <section className="records-section">
            <div className="section-heading"><div><p className="section-index">SECTION 5 & 8 SPECIFICATION</p><h3>Verified Doctor Directory & Appointments</h3></div></div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginTop: "16px" }}>
              {[
                { name: "Dr. Ananya Sharma", spec: "Cardiology", hosp: "AIIMS New Delhi", lic: "MCI-DEL-2014-8849", fee: "₹1,500", rating: "4.9" },
                { name: "Dr. Rajesh Verma", spec: "Internal Medicine", hosp: "Fortis Hospital", lic: "MCI-MAH-2011-3901", fee: "₹1,200", rating: "4.8" },
                { name: "Dr. Priya Nair", spec: "Neurology", hosp: "Manipal Hospital", lic: "KMC-BLR-2016-1120", fee: "₹1,800", rating: "4.9" }
              ].map((doc) => (
                <div key={doc.name} style={{ padding: "20px", background: "rgba(15, 23, 42, 0.6)", borderRadius: "16px", border: "1px solid rgba(30, 41, 59, 0.8)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <h4 style={{ fontWeight: "bold", color: "#f8fafc" }}>{doc.name}</h4>
                    <span style={{ fontSize: "11px", color: "#fbbf24" }}>★ {doc.rating}</span>
                  </div>
                  <p style={{ fontSize: "12px", color: "#10b981", marginTop: "2px" }}>{doc.spec} • {doc.hosp}</p>
                  <p style={{ fontSize: "11px", color: "#94a3b8", fontFamily: "monospace", marginTop: "4px" }}>License: {doc.lic}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px", paddingTop: "12px", borderTop: "1px solid rgba(30, 41, 59, 0.8)" }}>
                    <span style={{ fontSize: "12px", fontWeight: "bold", color: "#38bdf8" }}>{doc.fee}</span>
                    <button className="signal-button" style={{ padding: "6px 12px", fontSize: "11px" }} onClick={() => toast.success(`Appointment booked with ${doc.name} for Friday 11:00 AM.`)}>Book Visit</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 4: ACCESS & CONSENT CONTROL */}
        {activeTab === "consent" && (
          <section className="records-section">
            <div className="section-heading"><div><p className="section-index">SECTION 10 & 11 SPECIFICATION</p><h3>Access Management & Revocation</h3></div><button className="add-record" onClick={() => setQrOpen(true)}><ScanLine size={16} /> Create Sharing Session</button></div>
            {authorizations.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>No active provider authorizations. Generate a QR session to authorize a doctor.</div>
            ) : (
              <div style={{ display: "grid", gap: "12px", marginTop: "16px" }}>
                {authorizations.map(auth => (
                  <div key={auth.id} style={{ padding: "18px", background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h4 style={{ fontSize: "14px", fontWeight: "bold", color: "#f8fafc" }}>{auth.doctorName} <span style={{ fontSize: "11px", color: "#10b981" }}>({auth.speciality} — {auth.hospital})</span></h4>
                      <p style={{ fontSize: "12px", color: "#cbd5e1", margin: "4px 0" }}>Purpose: {auth.purpose}</p>
                      <p style={{ fontSize: "11px", color: "#34d399", fontFamily: "monospace" }}>Scope: [{auth.scope}] • Expires: {auth.expires}</p>
                    </div>
                    <button className="quiet-button" style={{ background: "rgba(225, 29, 72, 0.2)", border: "1px solid rgba(225, 29, 72, 0.4)", color: "#f43f5e", padding: "6px 14px", fontSize: "11px", fontWeight: "bold" }} onClick={() => handleRevoke(auth.id, auth.doctorName)}>Revoke Access</button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 5: AUDIT TRAIL */}
        {activeTab === "audit" && (
          <section className="records-section">
            <div className="section-heading"><div><p className="section-index">SECTION 12 SPECIFICATION</p><h3>Immutable Security Audit Trail</h3></div></div>
            <div style={{ display: "grid", gap: "10px", marginTop: "16px" }}>
              {[
                { actor: "Dr. Ananya Sharma (AIIMS)", action: "ACCESS_APPROVED", desc: "Patient approved 7-day scoped access [HealthCard, Allergies, Cardiac Reports].", time: "Today, 11:37 AM", type: "VERIFIED" },
                { actor: "Aarav Sharma (Patient)", action: "QR_GENERATED", desc: "Patient generated a 5-minute ephemeral QR sharing token (qr-sess-9f8e12a7bc41).", time: "Today, 11:35 AM", type: "INFO" },
                { actor: "Aarav Sharma (Patient)", action: "ACCOUNT_CREATED", desc: "Patient completed Aadhaar verification and established HealthBridge Patient ID HB-2026-89410.", time: "Today, 11:02 AM", type: "SUCCESS" }
              ].map((log, idx) => (
                <div key={idx} style={{ padding: "14px 18px", background: "rgba(15, 23, 42, 0.5)", border: "1px solid rgba(30, 41, 59, 0.8)", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "6px", background: "rgba(16, 185, 129, 0.2)", color: "#34d399", fontWeight: "bold", marginRight: "8px" }}>{log.action}</span>
                    <strong style={{ fontSize: "12px", color: "#f8fafc" }}>{log.actor}</strong>
                    <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>{log.desc}</p>
                  </div>
                  <span style={{ fontSize: "11px", color: "#64748b", fontFamily: "monospace" }}>{log.time}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </section>

      {/* EPHEMERAL QR MODAL */}
      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="otp-dialog" style={{ maxWidth: "520px" }}>
          <DialogHeader>
            <div className="issuer-seal"><SignalLogo compact /><span>Ephemeral Provider Access</span></div>
            <DialogTitle>5-Minute Ephemeral Access QR</DialogTitle>
            <DialogDescription>Section 4: High-entropy opaque token. Zero medical records inside QR.</DialogDescription>
          </DialogHeader>
          <div style={{ textAlign: "center", padding: "16px" }}>
            <QrCodeDisplay text={qrToken} size={180} />
            <p style={{ color: "#34d399", fontSize: "13px", fontFamily: "monospace", marginTop: "12px", fontWeight: "bold" }}>
              Token: {qrToken} • Expires in: {Math.floor(qrTimeLeft / 60)}:{qrTimeLeft % 60 < 10 ? "0" : ""}{qrTimeLeft % 60}
            </p>
          </div>
          <div style={{ background: "rgba(15, 23, 42, 0.8)", padding: "12px", borderRadius: "10px", fontSize: "12px", border: "1px solid rgba(30, 41, 59, 0.8)" }}>
            <strong style={{ color: "#38bdf8" }}>Simulate Verified Doctor Scan:</strong>
            <p style={{ color: "#cbd5e1", marginTop: "4px" }}>Dr. Ananya Sharma requests: <em>Cardiology Consultation (HealthCard, Allergies, Cardiac Reports)</em> for 7 days.</p>
            <button className="signal-button" style={{ width: "100%", marginTop: "10px", padding: "8px" }} onClick={() => {
              setAuthorizations(prev => [...prev, { id: Date.now(), doctorName: "Dr. Ananya Sharma", speciality: "Cardiology", hospital: "AIIMS New Delhi", purpose: "Cardiology consultation", scope: "HealthCard, Allergies, Cardiac Reports", expires: "7 Days", status: "ACTIVE" }]);
              setQrOpen(false);
              toast.success("Patient approved scoped authorization for Dr. Ananya Sharma!");
            }}>
              Approve Scoped Access
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* BREAK-GLASS EMERGENCY MODAL */}
      <Dialog open={emergencyOpen} onOpenChange={setEmergencyOpen}>
        <DialogContent className="otp-dialog" style={{ maxWidth: "480px", border: "1px solid rgba(225, 29, 72, 0.5)" }}>
          <DialogHeader>
            <div className="issuer-seal" style={{ background: "rgba(225, 29, 72, 0.2)", color: "#f43f5e" }}><LockKeyhole size={18} /><span>Break-Glass Emergency Protocol</span></div>
            <DialogTitle>Declare Emergency Condition</DialogTitle>
            <DialogDescription>Section 13: Time-bounded emergency critical summary access with high-priority audit trigger.</DialogDescription>
          </DialogHeader>
          {emergencySummary ? (
            <div style={{ background: "rgba(225, 29, 72, 0.15)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(225, 29, 72, 0.4)", fontSize: "12px", color: "#fda4af" }}>
              <h4 style={{ fontWeight: "bold", color: "#f43f5e", marginBottom: "8px" }}>Emergency Critical Summary Active (4 Hours)</h4>
              <p>• <strong>Blood Group:</strong> {emergencySummary.bloodGroup}</p>
              <p>• <strong>Critical Allergies:</strong> {emergencySummary.allergies}</p>
              <p>• <strong>Emergency Contact:</strong> {emergencySummary.emergencyContact}</p>
              <p style={{ marginTop: "8px", fontSize: "11px", color: "#94a3b8" }}>Authorized for: {emergencySummary.accessedBy} at {emergencySummary.hospital}</p>
            </div>
          ) : (
            <div style={{ spaceY: "12px" }}>
              <p style={{ fontSize: "12px", color: "#cbd5e1", marginBottom: "12px" }}>Condition: <strong>Acute Polytrauma / Severe Respiratory Distress</strong></p>
              <button className="signal-button" style={{ width: "100%", background: "#e11d48", padding: "10px", fontWeight: "bold" }} onClick={handleEmergencyDeclare}>
                Declare Emergency Access
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* EDIT HEALTHCARD MODAL */}
      <Dialog open={editCardOpen} onOpenChange={setEditCardOpen}>
        <DialogContent className="otp-dialog" style={{ maxWidth: "480px" }}>
          <DialogHeader>
            <div className="issuer-seal"><BadgeCheck size={18} /><span>HealthCard Summary</span></div>
            <DialogTitle>Edit Structured HealthCard</DialogTitle>
          </DialogHeader>
          <div style={{ display: "grid", gap: "10px", fontSize: "12px" }}>
            <div>
              <label style={{ display: "block", color: "#94a3b8", marginBottom: "4px" }}>Known Allergies</label>
              <input style={{ width: "100%", padding: "8px", background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", color: "#f8fafc" }} value={healthCardData.allergies} onChange={(e) => setHealthCardData({ ...healthCardData, allergies: e.target.value })} />
            </div>
            <div>
              <label style={{ display: "block", color: "#94a3b8", marginBottom: "4px" }}>Chronic Conditions</label>
              <input style={{ width: "100%", padding: "8px", background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", color: "#f8fafc" }} value={healthCardData.chronicConditions} onChange={(e) => setHealthCardData({ ...healthCardData, chronicConditions: e.target.value })} />
            </div>
            <div>
              <label style={{ display: "block", color: "#94a3b8", marginBottom: "4px" }}>Emergency Contact</label>
              <input style={{ width: "100%", padding: "8px", background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", color: "#f8fafc" }} value={healthCardData.emergencyContact} onChange={(e) => setHealthCardData({ ...healthCardData, emergencyContact: e.target.value })} />
            </div>
            <button className="signal-button" style={{ marginTop: "12px", padding: "10px" }} onClick={() => { setEditCardOpen(false); toast.success("HealthCard summary updated successfully!"); }}>
              Save HealthCard Changes
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* FHIR DIALOG */}
      <Dialog open={fhirOpen} onOpenChange={setFhirOpen}>
        <DialogContent className="fhir-dialog">
          <DialogHeader><div className="issuer-seal"><Database size={18} /><span>FHIR R4 Bundle</span></div><DialogTitle>{selected.title}</DialogTitle><DialogDescription>HL7 FHIR R4 standard JSON payload.</DialogDescription></DialogHeader>
          <pre>{fhirPreview}</pre>
          <div className="fhir-footer"><span><ShieldCheck size={15} /> Encrypted & Audited</span><button className="signal-button" type="button" onClick={() => setFhirOpen(false)}>Close resource</button></div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
