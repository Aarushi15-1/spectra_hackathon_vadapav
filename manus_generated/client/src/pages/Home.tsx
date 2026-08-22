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
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  return (
    <main className="app-shell">
      <aside className="app-rail">
        <div className="brand-lockup"><SignalLogo /><span>Spectra<br />Health</span></div>
        <nav aria-label="Primary navigation">
          <button className="nav-item active" type="button"><HeartPulse size={19} /><span>My signal</span></button>
          <button className="nav-item" type="button" onClick={() => toast("Records are shown below") }><ClipboardList size={19} /><span>Records</span></button>
          <button className="nav-item" type="button" onClick={() => toast("Consent panel is shown below") }><ShieldCheck size={19} /><span>Consent</span></button>
          <button className="nav-item" type="button" onClick={syncProviders}><RefreshCw size={19} /><span>Sources</span></button>
        </nav>
        <div className="rail-bottom">
          <button className="nav-item" type="button" onClick={onSignOut}><X size={19} /><span>Exit demo</span></button>
          <p>FHIR R4<br />Demo build</p>
        </div>
      </aside>

      <section className="app-canvas">
        <header className="app-header">
          <button className="mobile-menu" type="button" aria-label="Open navigation"><Menu size={21} /></button>
          <div className="page-heading"><p>Tuesday, 22 August</p><h1>Hello, Aarav.</h1></div>
          <div className="header-tools">
            <span className="demo-label"><Sparkles size={14} /> Interactive prototype</span>
            <button className="icon-button" type="button" onClick={() => toast("You have 2 consent updates") } aria-label="View notifications"><Bell size={19} /><i /></button>
            <button className="avatar-button" type="button" onClick={onSignOut}>AS</button>
          </div>
        </header>

        <div className="workspace-strip" aria-label="Switch dashboard perspective">
          <span>VIEW</span>
          {(["patient", "doctor", "laboratory"] as Workspace[]).map((item) => (
            <button key={item} type="button" onClick={() => setWorkspace(item)} className={workspace === item ? "view-button selected" : "view-button"}>
              {item === "patient" ? <UserRound size={15} /> : item === "doctor" ? <Stethoscope size={15} /> : <FlaskConical size={15} />}{item}
            </button>
          ))}
          <span className="workspace-note">Demo perspective only</span>
        </div>

        <section className="dashboard-hero">
          <div className="hero-copy">
            <div className="hero-eyebrow"><span /> LIVE HEALTH LOCKER</div>
            <h2>{workspace === "patient" ? "Care that travels with you." : workspace === "doctor" ? "The whole story, with consent." : "Results that become useful care."}</h2>
            <p>{workspace === "patient" ? "Your data is connected, organized, and ready only when you say so." : workspace === "doctor" ? "Review longitudinal FHIR resources with clear provenance and patient control." : "Publish structured diagnostic resources to the connected care story."}</p>
            <div className="hero-meta"><span><BadgeCheck size={16} /> 4 connected sources</span><span><ShieldCheck size={16} /> 3 active consents</span></div>
          </div>
          <div className="hero-art-wrap"><img src="/manus-storage/spectra-doctor-lab-art_2091e459.png" alt="Abstract illustration of people connected through a health signal" /></div>
          <div className="hero-stamp"><span>CONSENT</span><strong>IN<br />MOTION</strong></div>
        </section>

        <div className="overview-grid">
          <section className="id-artifact-section" aria-label="Digital ABHA health card">
            <div className={`abha-card ${cardBack ? "flipped" : ""}`}>
              <div className="card-front">
                <div className="tricolour-bar"><span /><span /><span /></div>
                <div className="card-header"><span>ABHA health card</span><BadgeCheck size={19} /></div>
                <div className="card-person"><div className="person-orb"><UserRound size={32} /></div><div><strong>Aarav Sharma</strong><small>ABHA linked · verified profile</small></div></div>
                <div className="card-id-row"><span>ABHA NUMBER</span><code>91-4523-8910-1123</code></div>
                <div className="card-foot"><span>O+ <small>blood group</small></span><span>1996 <small>year of birth</small></span><span>Male <small>sex</small></span></div>
              </div>
              <div className="card-back">
                <span className="back-label">SHARE WITH PURPOSE</span>
                <div className="mini-qr" aria-label="Demo QR pattern">
                  {Array.from({ length: 81 }, (_, index) => <i key={index} className={(index * 7 + index % 5) % 4 === 0 ? "filled" : ""} />)}
                </div>
                <p>Scoped sharing is available only after patient confirmation.</p>
                <code>spectra.demo/aarav</code>
              </div>
            </div>
            <div className="artifact-actions"><button type="button" onClick={() => setCardBack(!cardBack)}><RefreshCw size={15} /> {cardBack ? "Show card" : "Flip to share"}</button><button type="button" onClick={() => toast("PDF card download is a prototype action") }><FileText size={15} /> Download</button></div>
          </section>

          <section className="vitals-section" aria-labelledby="vitals-title">
            <div className="section-heading"><div><p className="section-index">TODAY’S SIGNAL</p><h3 id="vitals-title">Vitals, at a glance</h3></div><button type="button" onClick={() => toast("Trend view is coming next")}>View trend <ArrowRight size={15} /></button></div>
            <div className="vitals-grid">
              {vitals.map((vital, index) => <article className="vital-card" key={vital.label}><span className={`vital-mark mark-${index}`}>{vital.detail}</span><p>{vital.label}</p><strong>{vital.value} <small>{vital.unit}</small></strong><em><span />{vital.note}</em></article>)}
            </div>
          </section>
        </div>

        <section className="records-section" aria-labelledby="records-title">
          <div className="section-heading record-heading"><div><p className="section-index">FHIR RESOURCE VAULT</p><h3 id="records-title">Your recent care signal</h3></div><button className="add-record" type="button" onClick={() => toast("Secure record linking is a prototype action") }><Plus size={17} /> Link a health record</button></div>
          <div className="record-filter" role="tablist" aria-label="Filter health records"><button className="selected" type="button">All <span>4</span></button><button type="button">Encounters</button><button type="button">Labs</button><button type="button">Medicines</button><button type="button">Immunizations</button></div>
          <div className="records-layout">
            <div className="record-timeline">
              {records.map((record, index) => {
                const Icon = record.icon;
                return <button className={activeRecord === index ? "record-row selected" : "record-row"} type="button" onClick={() => setActiveRecord(index)} key={record.title}><span className={`record-icon ${record.color}`}><Icon size={19} /></span><span className="record-content"><em>{record.type}</em><strong>{record.title}</strong><small>{record.source}</small></span><span className="record-date">{record.date}<ChevronRight size={17} /></span></button>;
              })}
            </div>
            <aside className="record-detail">
              <div className="detail-type"><span className={`detail-dot ${selected.color}`} /><span>{selected.type}</span><button type="button" aria-label="More actions"><MoreHorizontal size={19} /></button></div>
              <h4>{selected.title}</h4><p>{selected.note}</p>
              <div className="secure-meta"><ShieldCheck size={16} /><span>Source linked & recorded in the consent trail</span></div>
              <button className="fhir-button" type="button" onClick={() => setFhirOpen(true)}><Database size={16} /> Inspect FHIR resource <ArrowRight size={16} /></button>
            </aside>
          </div>
        </section>

        <div className="lower-grid">
          <section className="provider-card" aria-labelledby="provider-title">
            <div className="section-heading"><div><p className="section-index">CONNECTED SOURCES</p><h3 id="provider-title">Where your signal flows</h3></div><button type="button" onClick={syncProviders} disabled={isSyncing}>{isSyncing ? <RefreshCw className="spin" size={16} /> : <RefreshCw size={16} />} {isSyncing ? "Syncing" : "Refresh"}</button></div>
            <div className="provider-list">
              {["AIIMS New Delhi", "Apollo Diagnostic Labs", "Max Super Speciality Hospital", "National Health Mission"].map((provider, index) => <div key={provider} className="provider-row"><span className={`provider-glyph glyph-${index}`}>{provider.split(" ").map((word) => word[0]).slice(0, 2).join("")}</span><div><strong>{provider}</strong><small>{index === 1 ? "Synced today" : index === 0 ? "Synced 2h ago" : "Verified connection"}</small></div><span className="connection-status"><i />linked</span></div>)}
            </div>
          </section>
          <section className="consent-card" aria-labelledby="consent-title">
            <div className="consent-top"><div><p className="section-index">YOU DECIDE</p><h3 id="consent-title">Consent in motion</h3></div><div className="consent-count">03<small>active</small></div></div>
            <p>Dr. Meera Iyer has access to your prescriptions and lab reports for a cardiology consultation.</p>
            <div className="consent-tags"><span>6 months</span><span>Labs + Rx</span><span>Cardiology</span></div>
            <div className="consent-actions"><button type="button" onClick={() => toast("Consent detail is a prototype action")}>Review</button><button type="button" onClick={() => toast.warning("Revoke confirmation would appear here")}>Revoke</button></div>
          </section>
        </div>
      </section>

      <Dialog open={fhirOpen} onOpenChange={setFhirOpen}>
        <DialogContent className="fhir-dialog">
          <DialogHeader><div className="issuer-seal"><Database size={18} /><span>FHIR R4 sample</span></div><DialogTitle>{selected.title}</DialogTitle><DialogDescription>A simplified resource bundle included for the interactive prototype.</DialogDescription></DialogHeader>
          <pre>{fhirPreview}</pre>
          <div className="fhir-footer"><span><ShieldCheck size={15} /> Illustrative data only</span><button className="signal-button" type="button" onClick={() => setFhirOpen(false)}>Close resource</button></div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
