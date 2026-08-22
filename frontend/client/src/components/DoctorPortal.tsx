import React, { useState, useEffect } from "react";
import {
  Stethoscope,
  BadgeCheck,
  ShieldCheck,
  QrCode,
  ScanLine,
  Database,
  Calendar,
  FilePlus,
  AlertTriangle,
  Users,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  RefreshCw,
  FlaskConical,
  Pill,
  ClipboardList,
  Sparkles,
  Lock,
  ChevronRight,
  X,
  FileText,
  Hospital,
  User,
  Plus,
  Trash2,
  Activity,
  LogOut,
  KeyRound
} from "lucide-react";
import { toast } from "sonner";
import { api, Doctor, HealthRecordItem, AppointmentItem, PatientUser, PrescriptionItem } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface DoctorPortalProps {
  onSwitchToPatient?: () => void;
  onSignOut?: () => void;
  initialDoctorId?: number;
}

export const DoctorPortal: React.FC<DoctorPortalProps> = ({ onSwitchToPatient, onSignOut, initialDoctorId }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [patients, setPatients] = useState<PatientUser[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientUser | null>(null);
  const [activeTab, setActiveTab] = useState<"scan" | "records" | "write" | "emergency" | "appointments">("write");
  
  // Patient Scan & Ingestion State
  const [qrToken, setQrToken] = useState("QR-ABDM-AARAV-8910");
  const [isScanning, setIsScanning] = useState(false);
  const [scannedPatient, setScannedPatient] = useState<any>(null);

  // Access Request Form State
  const [purpose, setPurpose] = useState("Cardiac Evaluation & Routine Review");
  const [durationDays, setDurationDays] = useState(30);
  const [scopeDiagnostic, setScopeDiagnostic] = useState(true);
  const [scopePrescription, setScopePrescription] = useState(true);
  const [scopeEncounters, setScopeEncounters] = useState(true);
  const [accessGranted, setAccessGranted] = useState(true);

  // Patient Records State
  const [patientRecords, setPatientRecords] = useState<HealthRecordItem[]>([]);
  const [selectedRecordIndex, setSelectedRecordIndex] = useState(0);
  const [fhirModalOpen, setFhirModalOpen] = useState(false);

  // Patient Consent OTP Challenge State
  const [consentOtpModalOpen, setConsentOtpModalOpen] = useState(false);
  const [consentOtp, setConsentOtp] = useState(["1", "2", "3", "4", "5", "6"]);
  const [isVerifyingConsent, setIsVerifyingConsent] = useState(false);

  // Write Encounter & Prescription Authoring State
  const [newTitle, setNewTitle] = useState("Cardiology Review & Antihypertensive Prescription");
  const [newType, setNewType] = useState<HealthRecordItem["recordType"]>("MEDICATION_REQUEST");
  const [newDiagnosis, setNewDiagnosis] = useState("I10 - Essential (Primary) Hypertension");
  const [newIcdCode, setNewIcdCode] = useState("I10");
  const [newDescription, setNewDescription] = useState("Patient presented for routine cardiovascular evaluation. Resting blood pressure recorded at 135/88 mmHg. Advised dietary sodium restriction, 30 minutes daily aerobic activity, and started on oral antihypertensive regimen.");
  
  // Vitals State
  const [vitalBp, setVitalBp] = useState("135/88 mmHg");
  const [vitalPulse, setVitalPulse] = useState("76 bpm");
  const [vitalSpo2, setVitalSpo2] = useState("99%");
  const [vitalTemp, setVitalTemp] = useState("98.6 °F");

  // Dynamic Prescriptions Array
  const [prescriptionList, setPrescriptionList] = useState<PrescriptionItem[]>([
    {
      medicineName: "Telmisartan 40mg Oral Tablet",
      dosage: "40mg",
      frequency: "OD (Once Daily)",
      durationDays: 90,
      instructions: "Take 1 tablet every morning after breakfast"
    },
    {
      medicineName: "Atorvastatin 10mg Oral Tablet",
      dosage: "10mg",
      frequency: "OD (Once Daily)",
      durationDays: 90,
      instructions: "Take 1 tablet at bedtime"
    }
  ]);

  const [isSubmittingRecord, setIsSubmittingRecord] = useState(false);

  // Emergency Break Glass State
  const [emergencyCondition, setEmergencyCondition] = useState("Acute Coronary Syndrome / Unresponsive Trauma");
  const [emergencyFacility, setEmergencyFacility] = useState("HIP_AIIMS_EMERGENCY_01");
  const [isBreakGlassActive, setIsBreakGlassActive] = useState(false);

  // Appointments State
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);

  useEffect(() => {
    loadDoctors();
    loadPatients();
    loadRecords();
    loadAppointments();

    const unsubscribe = api.subscribeRecords(() => {
      loadRecords();
    });
    return unsubscribe;
  }, []);

  const loadDoctors = async () => {
    const list = await api.getDoctors();
    setDoctors(list);
    if (initialDoctorId) {
      const found = list.find(d => d.id === initialDoctorId);
      if (found) setSelectedDoctor(found);
      else if (list.length > 0) setSelectedDoctor(list[0]);
    } else if (list.length > 0) {
      setSelectedDoctor(list[0]);
    }
  };

  const loadPatients = () => {
    const list = api.getPatients();
    setPatients(list);
    if (list.length > 0) setSelectedPatient(list[0]);
  };

  const loadRecords = async () => {
    const list = await api.getRecords(1);
    setPatientRecords(list);
  };

  const loadAppointments = async () => {
    const list = await api.getAppointments(1);
    setAppointments(list);
  };

  const handleScanPatient = async () => {
    if (!qrToken.trim()) {
      toast.error("Please enter or scan a valid QR token.");
      return;
    }
    setIsScanning(true);
    try {
      const data = await api.doctorScanQr(qrToken, selectedDoctor?.id || 1);
      setScannedPatient(data);
      
      // Auto match patient if exists
      const match = patients.find(p => p.patientId === data.patientId || p.fullName === data.patientName);
      if (match) setSelectedPatient(match);

      toast.success("Patient QR Verified via ABDM Gateway", {
        description: `Identified: ${data.patientName} (${data.abhaNumber})`
      });
    } catch (e) {
      toast.error("Failed to verify patient QR");
    } finally {
      setIsScanning(false);
    }
  };

  const handleInitiateConsent = () => {
    if (!qrToken.trim()) {
      toast.error("Please scan or enter a patient QR token first.");
      return;
    }
    setConsentOtpModalOpen(true);
    toast.info("ABDM Consent OTP Dispatched", {
      description: `6-Digit authorization PIN sent to patient's registered mobile (+91 ••••••4529)`
    });
  };

  const handleVerifyConsentOtp = async () => {
    const fullOtp = consentOtp.join("");
    if (fullOtp.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP.");
      return;
    }

    setIsVerifyingConsent(true);
    const scopes: string[] = [];
    if (scopeDiagnostic) scopes.push("DIAGNOSTIC_REPORTS");
    if (scopePrescription) scopes.push("PRESCRIPTIONS");
    if (scopeEncounters) scopes.push("ENCOUNTERS");

    try {
      await api.doctorRequestAccess(
        qrToken,
        selectedDoctor?.id || 1,
        purpose,
        scopes.join(", "),
        durationDays
      );
      setAccessGranted(true);
      setConsentOtpModalOpen(false);
      toast.success("Patient Verified & Consent Granted! 🎉", {
        description: `Scoped access approved for ${durationDays} days · Decrypting locker...`
      });
      setActiveTab("records");
    } catch (e) {
      toast.error("Consent verification failed. Invalid OTP or session expired.");
    } finally {
      setIsVerifyingConsent(false);
    }
  };

  const addPrescriptionRow = () => {
    setPrescriptionList([
      ...prescriptionList,
      {
        medicineName: "",
        dosage: "500mg",
        frequency: "BD (Twice Daily)",
        durationDays: 5,
        instructions: "After food"
      }
    ]);
  };

  const removePrescriptionRow = (index: number) => {
    setPrescriptionList(prescriptionList.filter((_, i) => i !== index));
  };

  const updatePrescriptionRow = (index: number, field: keyof PrescriptionItem, val: any) => {
    const updated = [...prescriptionList];
    updated[index] = { ...updated[index], [field]: val };
    setPrescriptionList(updated);
  };

  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) {
      toast.error("Please provide both title and clinical note details.");
      return;
    }

    const patient = selectedPatient || patients[0];

    setIsSubmittingRecord(true);
    try {
      // Build HL7 FHIR R4 Bundle Payload
      const fhirPayload = {
        resourceType: "Bundle",
        type: "document",
        timestamp: new Date().toISOString(),
        entry: [
          {
            resource: {
              resourceType: newType === "MEDICATION_REQUEST" ? "MedicationRequest" : newType === "DIAGNOSTIC_REPORT" ? "DiagnosticReport" : "Encounter",
              status: "final",
              subject: { reference: `Patient/${patient.patientId}`, display: patient.fullName },
              performer: [
                {
                  display: selectedDoctor?.fullName || "Dr. Ananya Sharma",
                  identifier: { system: "https://hpr.abdm.gov.in", value: selectedDoctor?.doctorId || "DOC-AIIMS-01" }
                }
              ],
              diagnosis: [{ condition: { text: newDiagnosis }, code: newIcdCode }],
              vitals: { bp: vitalBp, pulse: vitalPulse, spo2: vitalSpo2, temp: vitalTemp },
              medications: prescriptionList,
              clinicalNotes: newDescription
            }
          }
        ]
      };

      const newRecord: HealthRecordItem = {
        patientId: patient.patientId,
        patientName: patient.fullName,
        patientAbha: patient.abhaNumber,
        title: newTitle,
        recordType: newType,
        facilityName: selectedDoctor?.hospitalName || "AIIMS New Delhi",
        doctorName: selectedDoctor?.fullName,
        doctorSpeciality: selectedDoctor?.speciality,
        doctorId: selectedDoctor?.doctorId,
        doctorLicense: selectedDoctor?.licenseNumber,
        recordDate: new Date().toISOString().split("T")[0],
        diagnosis: newDiagnosis,
        icdCode: newIcdCode,
        vitalsSummary: { bp: vitalBp, pulse: vitalPulse, spo2: vitalSpo2, temp: vitalTemp },
        prescriptions: newType === "MEDICATION_REQUEST" ? prescriptionList : undefined,
        description: `${newDescription} ${
          prescriptionList.length > 0
            ? `· Prescriptions: ${prescriptionList.map(p => `${p.medicineName} (${p.frequency}, ${p.durationDays}d)`).join(", ")}`
            : ""
        }`,
        fhirResourceJson: JSON.stringify(fhirPayload, null, 2)
      };

      const saved = await api.createRecord(newRecord, patient.id);
      setPatientRecords([saved, ...patientRecords]);
      
      toast.success(`🎉 Prescription & Encounter Committed for ${patient.fullName}!`, {
        description: `Diagnosis: ${newDiagnosis} · Viewable live in Patient Dashboard.`
      });
      
      setActiveTab("records");
    } catch (e) {
      toast.error("Failed to commit clinical record");
    } finally {
      setIsSubmittingRecord(false);
    }
  };

  const handleDeclareEmergency = async () => {
    const patient = selectedPatient || patients[0];
    try {
      await api.declareEmergency(
        patient.patientId,
        selectedDoctor?.doctorId || "DOC-AIIMS-01",
        emergencyCondition,
        emergencyFacility
      );
      setIsBreakGlassActive(true);
      setAccessGranted(true);
      toast.warning("🚨 EMERGENCY BREAK-GLASS ACTIVATED", {
        description: `Audit trail record created for patient ${patient.fullName}.`
      });
      setActiveTab("records");
    } catch (e) {
      toast.error("Emergency override failed");
    }
  };

  const selectedRecord = patientRecords[selectedRecordIndex] || patientRecords[0];

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--rose)] flex flex-col">
      {/* Top Bar / Header */}
      <header className="border-b border-[var(--line)] bg-[var(--cream)] px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--coral)] text-white flex items-center justify-center font-bold">
            <Stethoscope size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black font-['Bricolage_Grotesque'] tracking-tight">
                Spectra Clinical Space
              </h1>
              <span className="bg-[var(--blush)] text-[var(--coral-deep)] text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Doctor Portal
              </span>
            </div>
            <p className="text-xs text-[var(--rose-soft)]">
              ABDM Healthcare Professionals Registry (HPR) Verified Portal
            </p>
          </div>
        </div>

        {/* Doctor Switcher & Role Navigation */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-[var(--paper)] px-3 py-1.5 rounded-lg border border-[var(--line)]">
            <span className="text-[11px] font-mono text-[var(--rose-soft)] uppercase font-semibold">Active Doctor:</span>
            <select
              className="bg-transparent text-xs font-bold text-[var(--rose)] outline-none cursor-pointer"
              value={selectedDoctor?.id || ""}
              onChange={(e) => {
                const found = doctors.find((d) => d.id === Number(e.target.value));
                if (found) setSelectedDoctor(found);
              }}
            >
              {doctors.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.fullName} ({doc.speciality} · {doc.hospitalName?.split(" ")[0]})
                </option>
              ))}
            </select>
          </div>

          {onSignOut && (
            <button
              onClick={onSignOut}
              className="text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 px-3.5 py-2 rounded-xl border border-red-200 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <LogOut size={15} /> Doctor Sign Out
            </button>
          )}
        </div>
      </header>

      {/* Doctor Portfolio Credentials Banner */}
      {selectedDoctor && (
        <section className="bg-gradient-to-r from-[#ffeade] via-[#fff4ec] to-[#ffe9e0] border-b border-[var(--line)] px-6 py-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Doctor Identity & Affiliations */}
            <div className="lg:col-span-2 flex items-start gap-4">
              <img
                src={selectedDoctor.photoUrl || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300"}
                alt={selectedDoctor.fullName}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-[var(--coral)] shadow-md flex-shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl font-bold font-['Bricolage_Grotesque']">{selectedDoctor.fullName}</h2>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <BadgeCheck size={12} /> HPR Verified
                  </span>
                  <span className="text-xs font-mono font-bold text-[var(--coral-deep)] bg-white px-2.5 py-0.5 rounded-md border border-[var(--line)] shadow-2xs">
                    Unique ID: {selectedDoctor.doctorId}
                  </span>
                </div>
                <p className="text-xs font-semibold text-[var(--rose-soft)] mt-1">
                  {selectedDoctor.qualification} · <strong className="text-[var(--rose)]">{selectedDoctor.speciality}</strong>
                </p>
                <div className="flex items-center gap-4 text-xs text-[var(--rose-soft)] mt-2 flex-wrap">
                  <span className="flex items-center gap-1"><Hospital size={13} className="text-[var(--coral)]" /> {selectedDoctor.hospitalName}</span>
                  <span>•</span>
                  <span>Medical License: <strong className="font-mono text-[var(--rose)]">{selectedDoctor.licenseNumber}</strong></span>
                  <span>•</span>
                  <span>Experience: <strong>{selectedDoctor.experienceYears} Years</strong></span>
                </div>
              </div>
            </div>

            {/* Quick Consultation Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/80 backdrop-blur rounded-xl p-3 border border-[var(--line)] text-center shadow-xs">
                <span className="text-[10px] font-mono text-[var(--rose-soft)] block uppercase">Rating</span>
                <strong className="text-xl font-bold font-['Bricolage_Grotesque'] text-[var(--marigold)]">
                  {selectedDoctor.rating || 4.9} ★
                </strong>
                <small className="text-[10px] text-[var(--rose-soft)] block">({selectedDoctor.reviewCount || 120}+ reviews)</small>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-xl p-3 border border-[var(--line)] text-center shadow-xs">
                <span className="text-[10px] font-mono text-[var(--rose-soft)] block uppercase">Active Consents</span>
                <strong className="text-xl font-bold font-['Bricolage_Grotesque'] text-[var(--coral)]">
                  {accessGranted ? "3 Active" : "0 Active"}
                </strong>
                <small className="text-[10px] text-[var(--rose-soft)] block">ABDM Verified</small>
              </div>
              <div className="bg-white/80 backdrop-blur rounded-xl p-3 border border-[var(--line)] text-center shadow-xs">
                <span className="text-[10px] font-mono text-[var(--rose-soft)] block uppercase">Fee</span>
                <strong className="text-xl font-bold font-['Bricolage_Grotesque'] text-emerald-700">
                  ₹{selectedDoctor.consultationFee || 1500}
                </strong>
                <small className="text-[10px] text-[var(--rose-soft)] block">Per Session</small>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Navigation Tabs for Clinical Tasks */}
      <div className="border-b border-[var(--line)] bg-[var(--cream)] px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2">
          {[
            { id: "write", label: "✍️ Write Encounter & Prescriptions", icon: FilePlus, highlight: true },
            { id: "records", label: "📊 Consented FHIR Records", icon: Database, badge: patientRecords.length },
            { id: "scan", label: "🔍 Patient QR Ingestion", icon: QrCode },
            { id: "appointments", label: "📅 Consultation Queue", icon: Calendar, badge: appointments.length },
            { id: "emergency", label: "🚨 Break-Glass Protocol", icon: AlertTriangle, danger: true },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                  isActive
                    ? tab.danger
                      ? "bg-red-600 text-white shadow-sm"
                      : tab.highlight
                      ? "bg-[var(--coral)] text-white shadow-sm"
                      : "bg-[var(--rose)] text-[var(--cream)] shadow-sm"
                    : tab.danger
                    ? "text-red-700 hover:bg-red-50"
                    : "text-[var(--rose-soft)] hover:bg-[var(--blush)] hover:text-[var(--rose)]"
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-[var(--line)] text-[var(--rose)]"
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Clinical Canvas */}
      <main className="max-w-7xl mx-auto w-full p-6 flex-1">

        {/* TAB 1: AUTHOR CLINICAL ENCOUNTER / PRESCRIPTION / DIAGNOSIS (COMMITS TO DATABASE & PATIENT DASHBOARD) */}
        {activeTab === "write" && (
          <div className="max-w-4xl mx-auto bg-[var(--cream)] border border-[var(--line)] rounded-2xl p-8 shadow-sm space-y-6">
            <div className="border-b border-[var(--line)] pb-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--coral-deep)] font-bold">
                  CLINICAL AUTHORING & E-PRESCRIPTION WORKBENCH
                </span>
                <h3 className="text-2xl font-bold font-['Bricolage_Grotesque'] mt-1">
                  Author Encounter, Diagnosis & Prescription
                </h3>
                <p className="text-xs text-[var(--rose-soft)] mt-0.5">
                  Signed with Doctor Unique ID: <strong>{selectedDoctor?.doctorId}</strong> (Medical License: {selectedDoctor?.licenseNumber})
                </p>
              </div>

              {/* Live Target Patient Selector */}
              <div className="bg-white px-4 py-2 rounded-xl border border-[var(--coral)] shadow-2xs">
                <span className="text-[10px] font-mono uppercase text-[var(--rose-soft)] block font-bold">Target Patient:</span>
                <select
                  value={selectedPatient?.patientId || ""}
                  onChange={(e) => {
                    const found = patients.find(p => p.patientId === e.target.value);
                    if (found) setSelectedPatient(found);
                  }}
                  className="bg-transparent text-xs font-bold text-[var(--rose)] outline-none cursor-pointer"
                >
                  {patients.map(p => (
                    <option key={p.patientId} value={p.patientId}>
                      {p.fullName} (ABHA: {p.abhaNumber})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selected Patient Clinical Profile Banner */}
            {selectedPatient && (
              <div className="bg-[#fff5ee] p-4 rounded-xl border border-[var(--line)] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[var(--coral)] text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    {selectedPatient.fullName.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-sm font-bold text-[var(--rose)]">{selectedPatient.fullName}</strong>
                      <span className="text-[10px] font-mono text-[var(--rose-soft)]">({selectedPatient.patientId})</span>
                    </div>
                    <div className="text-xs text-[var(--rose-soft)] flex gap-2 mt-0.5">
                      <span>ABHA: <strong>{selectedPatient.abhaNumber}</strong></span>
                      <span>•</span>
                      <span>Age/Gender: <strong>{selectedPatient.age}y / {selectedPatient.gender}</strong></span>
                      <span>•</span>
                      <span>Blood: <strong className="text-[var(--coral)]">{selectedPatient.bloodGroup}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-[var(--rose-soft)] flex flex-col items-end">
                  {selectedPatient.allergies && selectedPatient.allergies.length > 0 && (
                    <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200 text-[10px] font-bold">
                      ⚠️ Allergy: {selectedPatient.allergies.join(", ")}
                    </span>
                  )}
                  {selectedPatient.chronicConditions && selectedPatient.chronicConditions.length > 0 && (
                    <span className="text-[10px] text-[var(--rose-soft)] mt-0.5">
                      Condition: {selectedPatient.chronicConditions.join(", ")}
                    </span>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleCreateRecord} className="space-y-6">
              {/* Row 1: Title, Record Type, Diagnosis ICD-10 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1">
                  <label className="text-xs font-bold block mb-1">Encounter Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-white border border-[var(--line)] rounded-xl px-4 py-2.5 text-xs text-[var(--rose)] outline-none focus:ring-2 focus:ring-[var(--coral)] font-bold cursor-pointer"
                  >
                    <option value="MEDICATION_REQUEST">MedicationRequest (Prescription)</option>
                    <option value="ENCOUNTER">Encounter (Consultation Note)</option>
                    <option value="DIAGNOSTIC_REPORT">DiagnosticReport (Lab Order / Results)</option>
                    <option value="CARE_PLAN">CarePlan (Treatment Regimen)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold block mb-1">Clinical Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Cardiology Outpatient Consultation & Antihypertensive Rx"
                    className="w-full bg-white border border-[var(--line)] rounded-xl px-4 py-2.5 text-xs text-[var(--rose)] outline-none focus:ring-2 focus:ring-[var(--coral)] font-medium"
                  />
                </div>
              </div>

              {/* Row 2: Diagnosis & ICD-10 Code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold block mb-1">Diagnosis & Assessment</label>
                  <input
                    type="text"
                    required
                    value={newDiagnosis}
                    onChange={(e) => setNewDiagnosis(e.target.value)}
                    placeholder="e.g. I10 - Essential (Primary) Hypertension"
                    className="w-full bg-white border border-[var(--line)] rounded-xl px-4 py-2.5 text-xs text-[var(--rose)] outline-none focus:ring-2 focus:ring-[var(--coral)] font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1">ICD-10 Code</label>
                  <input
                    type="text"
                    value={newIcdCode}
                    onChange={(e) => setNewIcdCode(e.target.value)}
                    placeholder="e.g. I10, E11, J20"
                    className="w-full bg-white border border-[var(--line)] rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-[var(--rose)] outline-none focus:ring-2 focus:ring-[var(--coral)]"
                  />
                </div>
              </div>

              {/* Row 3: Recorded Vitals */}
              <div className="bg-white p-4 rounded-xl border border-[var(--line)] space-y-2">
                <span className="text-[11px] font-mono uppercase font-bold text-[var(--rose-soft)] flex items-center gap-1.5">
                  <Activity size={14} className="text-[var(--coral)]" /> Recorded Vitals During Encounter
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] text-[var(--rose-soft)] block font-semibold">Blood Pressure</label>
                    <input
                      type="text"
                      value={vitalBp}
                      onChange={(e) => setVitalBp(e.target.value)}
                      placeholder="120/80 mmHg"
                      className="w-full bg-[var(--paper)] border border-[var(--line)] rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[var(--rose-soft)] block font-semibold">Pulse / Heart Rate</label>
                    <input
                      type="text"
                      value={vitalPulse}
                      onChange={(e) => setVitalPulse(e.target.value)}
                      placeholder="72 bpm"
                      className="w-full bg-[var(--paper)] border border-[var(--line)] rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[var(--rose-soft)] block font-semibold">SpO₂ Oxygen</label>
                    <input
                      type="text"
                      value={vitalSpo2}
                      onChange={(e) => setVitalSpo2(e.target.value)}
                      placeholder="99%"
                      className="w-full bg-[var(--paper)] border border-[var(--line)] rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[var(--rose-soft)] block font-semibold">Body Temp</label>
                    <input
                      type="text"
                      value={vitalTemp}
                      onChange={(e) => setVitalTemp(e.target.value)}
                      placeholder="98.6 °F"
                      className="w-full bg-[var(--paper)] border border-[var(--line)] rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Clinical Examination & Doctor Notes */}
              <div>
                <label className="text-xs font-bold block mb-1">Clinical Findings & Consultation Notes</label>
                <textarea
                  rows={3}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Record symptoms, physical examination findings, lifestyle recommendations..."
                  className="w-full bg-white border border-[var(--line)] rounded-xl p-4 text-xs text-[var(--rose)] outline-none focus:ring-2 focus:ring-[var(--coral)] leading-relaxed font-sans"
                />
              </div>

              {/* Row 5: Dynamic Multi-Drug Prescriptions */}
              <div className="bg-[#fff3eb] border border-[var(--coral)]/30 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Pill size={18} className="text-[var(--coral)]" />
                    <div>
                      <strong className="text-sm font-bold text-[var(--rose)]">Prescription Medication Orders</strong>
                      <p className="text-[11px] text-[var(--rose-soft)]">These prescribed medications will appear in the patient's Medicine Vault</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addPrescriptionRow}
                    className="bg-[var(--coral)] hover:bg-[var(--coral-deep)] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-2xs"
                  >
                    <Plus size={14} /> Add Medicine
                  </button>
                </div>

                <div className="space-y-3">
                  {prescriptionList.map((med, index) => (
                    <div key={index} className="bg-white p-3.5 rounded-xl border border-[var(--line)] grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                      <div className="sm:col-span-4">
                        <label className="text-[10px] text-[var(--rose-soft)] block font-semibold">Medicine Name & Formulation</label>
                        <input
                          type="text"
                          required
                          value={med.medicineName}
                          onChange={(e) => updatePrescriptionRow(index, "medicineName", e.target.value)}
                          placeholder="e.g. Telmisartan 40mg Tab"
                          className="w-full bg-[var(--paper)] border border-[var(--line)] rounded-lg px-3 py-1.5 text-xs font-bold"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="text-[10px] text-[var(--rose-soft)] block font-semibold">Frequency</label>
                        <select
                          value={med.frequency}
                          onChange={(e) => updatePrescriptionRow(index, "frequency", e.target.value)}
                          className="w-full bg-[var(--paper)] border border-[var(--line)] rounded-lg px-2 py-1.5 text-xs font-semibold cursor-pointer"
                        >
                          <option value="OD (Once Daily)">OD (Once Daily)</option>
                          <option value="BD (Twice Daily)">BD (Twice Daily)</option>
                          <option value="TDS (Thrice Daily)">TDS (Thrice Daily)</option>
                          <option value="QID (4 Times Daily)">QID (4 Times Daily)</option>
                          <option value="SOS (As Needed)">SOS (As Needed)</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-[var(--rose-soft)] block font-semibold">Duration (Days)</label>
                        <input
                          type="number"
                          value={med.durationDays}
                          onChange={(e) => updatePrescriptionRow(index, "durationDays", Number(e.target.value))}
                          className="w-full bg-[var(--paper)] border border-[var(--line)] rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-[var(--rose-soft)] block font-semibold">Instructions</label>
                        <input
                          type="text"
                          value={med.instructions}
                          onChange={(e) => updatePrescriptionRow(index, "instructions", e.target.value)}
                          placeholder="After breakfast"
                          className="w-full bg-[var(--paper)] border border-[var(--line)] rounded-lg px-2.5 py-1.5 text-xs"
                        />
                      </div>

                      <div className="sm:col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removePrescriptionRow(index)}
                          className="text-red-500 hover:text-red-700 p-1 rounded-md"
                          title="Remove Medicine"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit & Sign */}
              <div className="pt-4 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-[var(--rose-soft)]">
                  <Lock size={14} className="text-emerald-700" />
                  <span>Will be cryptographically signed and added to <strong>{selectedPatient?.fullName}'s</strong> locker</span>
                </div>
                <button
                  type="submit"
                  disabled={isSubmittingRecord}
                  className="bg-[var(--coral)] hover:bg-[var(--coral-deep)] text-white font-bold text-xs px-8 py-3.5 rounded-xl flex items-center gap-2 transition-transform active:scale-95 shadow-md"
                >
                  {isSubmittingRecord ? <RefreshCw className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                  Sign & Commit to Patient Locker <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: CONSENTED PATIENT FHIR RECORDS */}
        {activeTab === "records" && (
          <div className="space-y-6">
            <div className="bg-[var(--cream)] border border-[var(--line)] rounded-2xl p-6 shadow-sm flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--coral-deep)] font-bold">
                  PATIENT LONGITUDINAL RECORD
                </span>
                <h3 className="text-2xl font-bold font-['Bricolage_Grotesque'] mt-1">
                  {selectedPatient?.fullName || "Aarav Sharma"} · ABHA {selectedPatient?.abhaNumber || "91-4523-8910-1123"}
                </h3>
                <p className="text-xs text-[var(--rose-soft)] mt-0.5">
                  Consented Scope: Diagnostics, Prescriptions, Encounters · Valid until {new Date(Date.now() + 30 * 86400000).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFhirModalOpen(true)}
                  className="bg-white border border-[var(--line)] hover:bg-[var(--paper)] text-[var(--rose)] text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <Database size={15} className="text-[var(--coral)]" /> Inspect Raw FHIR Bundle
                </button>
                <button
                  onClick={() => setActiveTab("write")}
                  className="bg-[var(--coral)] hover:bg-[var(--coral-deep)] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow-sm"
                >
                  <FilePlus size={15} /> Add Clinical Note / Rx
                </button>
              </div>
            </div>

            {/* Records Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Timeline List */}
              <div className="lg:col-span-1 bg-[var(--cream)] border border-[var(--line)] rounded-2xl p-4 space-y-3">
                <span className="text-xs font-mono font-bold text-[var(--rose-soft)] block px-2 uppercase tracking-wider">
                  Timeline Entries ({patientRecords.length})
                </span>

                <div className="space-y-2">
                  {patientRecords.map((record, index) => {
                    const isSelected = selectedRecordIndex === index;
                    return (
                      <div
                        key={record.id || index}
                        onClick={() => setSelectedRecordIndex(index)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? "bg-[#fff0e7] border-[var(--coral)] shadow-xs"
                            : "bg-white border-[var(--line)] hover:bg-[var(--paper)]"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono font-bold text-[var(--coral-deep)]">{record.recordType}</span>
                          <span className="font-mono text-[var(--rose-soft)]">{record.recordDate}</span>
                        </div>
                        <h4 className="text-sm font-bold text-[var(--rose)] mt-1 line-clamp-1">{record.title}</h4>
                        {record.diagnosis && (
                          <span className="text-[10px] text-[var(--marigold)] font-bold block mt-0.5">
                            🩺 {record.diagnosis}
                          </span>
                        )}
                        <p className="text-xs text-[var(--rose-soft)] mt-0.5 line-clamp-1">{record.facilityName}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Record Detail & Deep Observations */}
              {selectedRecord && (
                <div className="lg:col-span-2 bg-[var(--cream)] border border-[var(--line)] rounded-2xl p-6 space-y-6">
                  <div className="flex items-start justify-between border-b border-[var(--line)] pb-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--coral-deep)] font-bold">
                        {selectedRecord.recordType}
                      </span>
                      <h3 className="text-2xl font-bold font-['Bricolage_Grotesque'] mt-1 text-[var(--rose)]">
                        {selectedRecord.title}
                      </h3>
                      <p className="text-xs text-[var(--rose-soft)] mt-0.5">
                        Authored by <strong>{selectedRecord.doctorName || "Verified Clinician"}</strong> ({selectedRecord.doctorSpeciality || "Specialist"}) at {selectedRecord.facilityName}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold bg-[var(--paper)] text-[var(--rose)] px-3 py-1.5 rounded-lg border border-[var(--line)]">
                      {selectedRecord.recordDate}
                    </span>
                  </div>

                  {/* Diagnosis & Findings */}
                  <div className="space-y-4">
                    {selectedRecord.diagnosis && (
                      <div className="bg-[#fff9f4] p-3.5 rounded-xl border border-[var(--marigold)]/40 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-[var(--rose-soft)] uppercase block font-bold">Assessed Diagnosis:</span>
                          <strong className="text-sm text-[var(--rose)] font-bold">{selectedRecord.diagnosis}</strong>
                        </div>
                        {selectedRecord.icdCode && (
                          <span className="text-xs font-mono bg-white px-2.5 py-1 rounded border border-[var(--line)] font-bold">
                            ICD-10: {selectedRecord.icdCode}
                          </span>
                        )}
                      </div>
                    )}

                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-[var(--rose-soft)] mb-1.5">
                        Clinical Consultation Details
                      </h4>
                      <div className="bg-white rounded-xl p-4 border border-[var(--line)] text-sm leading-relaxed text-[var(--rose)]">
                        {selectedRecord.description}
                      </div>
                    </div>

                    {/* Prescriptions View if present */}
                    {selectedRecord.prescriptions && selectedRecord.prescriptions.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-[var(--rose-soft)]">
                          Prescribed Medication Regimen
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          {selectedRecord.prescriptions.map((p, i) => (
                            <div key={i} className="bg-white p-3 rounded-xl border border-[var(--line)] flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <Pill size={16} className="text-[var(--coral)]" />
                                <div>
                                  <strong className="text-xs font-bold block">{p.medicineName}</strong>
                                  <span className="text-[11px] text-[var(--rose-soft)]">{p.instructions}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-mono font-bold text-[var(--coral-deep)] block">{p.frequency}</span>
                                <small className="text-[10px] text-[var(--rose-soft)] font-mono">{p.durationDays} Days</small>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* FHIR Snippet */}
                  {selectedRecord.fhirResourceJson && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-[var(--rose-soft)]">
                          FHIR R4 JSON Resource
                        </h4>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(selectedRecord.fhirResourceJson || "");
                            toast.success("FHIR JSON copied to clipboard");
                          }}
                          className="text-xs text-[var(--coral-deep)] hover:underline font-mono"
                        >
                          Copy JSON
                        </button>
                      </div>
                      <pre className="bg-[var(--rose)] text-[#ffe6dc] p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-60 leading-relaxed">
                        {selectedRecord.fhirResourceJson}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: PATIENT QR SCAN & ACCESS REQUEST */}
        {activeTab === "scan" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* QR Scanner / Token Input Card */}
            <div className="bg-[var(--cream)] border border-[var(--line)] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--coral-deep)] font-bold">
                    01 · INGESTION GATEWAY
                  </span>
                  <span className="text-xs bg-[var(--paper)] text-[var(--rose-soft)] px-2.5 py-1 rounded-full font-mono">
                    ABDM Ephemeral Protocol
                  </span>
                </div>
                <h3 className="text-2xl font-bold font-['Bricolage_Grotesque'] mt-3">
                  Scan Patient Health QR
                </h3>
                <p className="text-xs text-[var(--rose-soft)] mt-1.5 leading-relaxed">
                  Patients present an ephemeral, cryptographic QR code from their Spectra health locker. Scan or enter the temporary session token below.
                </p>

                {/* Simulated Scanner Window */}
                <div className="my-6 p-6 rounded-xl border-2 border-dashed border-[var(--coral)] bg-[#fff3ec] flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[var(--coral)]/10 text-[var(--coral)] flex items-center justify-center mb-3 animate-pulse">
                    <ScanLine size={32} />
                  </div>
                  <strong className="text-sm font-bold">Ready for Optical Camera Scan</strong>
                  <p className="text-xs text-[var(--rose-soft)] mt-1 max-w-xs">
                    Optical sensor active. Enter or use test session token below to simulate instant capture.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold block">Patient Session QR Token</label>
                    <button
                      type="button"
                      onClick={() => {
                        const active = localStorage.getItem("spectra_active_qr_token") || "QR-ABDM-AARAV-4891";
                        setQrToken(active);
                        toast.info(`Active Patient QR loaded: ${active}`);
                      }}
                      className="text-[11px] font-mono text-[var(--coral-deep)] font-bold hover:underline flex items-center gap-1"
                    >
                      <Sparkles size={12} /> Auto-Fill Live Patient QR
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={qrToken}
                      onChange={(e) => setQrToken(e.target.value)}
                      placeholder="e.g. QR-ABDM-AARAV-8910"
                      className="flex-1 bg-white border border-[var(--line)] rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-[var(--rose)] outline-none focus:ring-2 focus:ring-[var(--coral)]"
                    />
                    <button
                      type="button"
                      onClick={handleScanPatient}
                      disabled={isScanning}
                      className="bg-[var(--coral)] hover:bg-[var(--coral-deep)] text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 transition-transform active:scale-95 shadow-sm"
                    >
                      {isScanning ? <RefreshCw className="animate-spin" size={16} /> : <ScanLine size={16} />}
                      Verify QR
                    </button>
                  </div>
                </div>
              </div>

              {/* Scanned Patient Identity Preview */}
              {scannedPatient && (
                <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase flex items-center gap-1">
                      <CheckCircle2 size={13} /> Patient Identity Verified
                    </span>
                    <span className="text-xs font-mono text-emerald-700">Expires in 04:59</span>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-base">
                      {scannedPatient.patientName.split(" ").map((n: string) => n[0]).join("")}
                    </div>
                    <div>
                      <strong className="text-base font-bold text-emerald-950 block">{scannedPatient.patientName}</strong>
                      <span className="text-xs font-mono text-emerald-800">ABHA: {scannedPatient.abhaNumber}</span>
                      <div className="text-[11px] text-emerald-700 mt-0.5 flex gap-2">
                        <span>Age: {scannedPatient.age} ({scannedPatient.gender})</span>
                        <span>•</span>
                        <span>Blood: {scannedPatient.bloodGroup}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Request Scoped Access Card */}
            <div className="bg-[var(--cream)] border border-[var(--line)] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--coral-deep)] font-bold">
                  02 · SCOPED CONSENT REQUEST
                </span>
                <h3 className="text-2xl font-bold font-['Bricolage_Grotesque'] mt-3">
                  Request Clinical Record Access
                </h3>
                <p className="text-xs text-[var(--rose-soft)] mt-1.5 leading-relaxed">
                  Under ABDM rules, clinicians must specify purpose, scope, and duration before medical records are decrypted.
                </p>

                <div className="space-y-4 mt-6">
                  <div>
                    <label className="text-xs font-bold block mb-1">Clinical Consultation Purpose</label>
                    <input
                      type="text"
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      placeholder="e.g. Cardiac Review & Prescription Refill"
                      className="w-full bg-white border border-[var(--line)] rounded-xl px-4 py-2.5 text-xs font-medium text-[var(--rose)] outline-none focus:ring-2 focus:ring-[var(--coral)]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold block mb-1.5">Required Data Scopes</label>
                    <div className="grid grid-cols-1 gap-2">
                      <label className="flex items-center gap-2 text-xs bg-white p-2.5 rounded-xl border border-[var(--line)] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={scopeDiagnostic}
                          onChange={(e) => setScopeDiagnostic(e.target.checked)}
                          className="accent-[var(--coral)] w-4 h-4"
                        />
                        <FlaskConical size={16} className="text-[var(--marigold)]" />
                        <span><strong>Diagnostic Reports:</strong> Blood panels, ECG, Lab markers</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs bg-white p-2.5 rounded-xl border border-[var(--line)] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={scopePrescription}
                          onChange={(e) => setScopePrescription(e.target.checked)}
                          className="accent-[var(--coral)] w-4 h-4"
                        />
                        <Pill size={16} className="text-[var(--coral)]" />
                        <span><strong>Prescriptions & Medications:</strong> Active drugs, dosage history</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs bg-white p-2.5 rounded-xl border border-[var(--line)] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={scopeEncounters}
                          onChange={(e) => setScopeEncounters(e.target.checked)}
                          className="accent-[var(--coral)] w-4 h-4"
                        />
                        <ClipboardList size={16} className="text-[var(--papaya)]" />
                        <span><strong>Past Clinical Encounters:</strong> Discharge notes, physician summaries</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold block mb-1">Access Duration Validity</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 7, 30, 90].map((days) => (
                        <button
                          key={days}
                          type="button"
                          onClick={() => setDurationDays(days)}
                          className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                            durationDays === days
                              ? "bg-[var(--coral)] text-white border-[var(--coral)]"
                              : "bg-white text-[var(--rose)] border-[var(--line)] hover:bg-[var(--paper)]"
                          }`}
                        >
                          {days === 1 ? "24 Hours" : `${days} Days`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[var(--line)] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-[var(--rose-soft)]">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  <span>ABDM Cryptographic Consent Protocol</span>
                </div>
                <button
                  type="button"
                  onClick={handleInitiateConsent}
                  className="bg-[var(--rose)] hover:bg-black text-[var(--cream)] font-bold text-xs px-6 py-3 rounded-xl flex items-center gap-2 transition-transform active:scale-95 shadow-sm"
                >
                  <KeyRound size={16} className="text-[var(--marigold)]" />
                  Request Access & Dispatch Patient OTP <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CONSULTATION QUEUE & APPOINTMENTS */}
        {activeTab === "appointments" && (
          <div className="space-y-6">
            <div className="bg-[var(--cream)] border border-[var(--line)] rounded-2xl p-6 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--coral-deep)] font-bold">
                  DAILY CLINICAL QUEUE
                </span>
                <h3 className="text-2xl font-bold font-['Bricolage_Grotesque'] mt-1">
                  Scheduled Consultations for {selectedDoctor?.fullName}
                </h3>
                <p className="text-xs text-[var(--rose-soft)] mt-0.5">
                  Synchronized with OPD Hospital Scheduling System
                </p>
              </div>
              <button
                onClick={loadAppointments}
                className="bg-white border border-[var(--line)] hover:bg-[var(--paper)] text-[var(--rose)] text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5"
              >
                <RefreshCw size={14} /> Refresh Schedule
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appointments.map((apt) => (
                <div key={apt.id} className="bg-[var(--cream)] border border-[var(--line)] rounded-2xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[var(--coral-deep)] bg-[var(--paper)] px-2.5 py-1 rounded-md border border-[var(--line)]">
                      {apt.appointmentTime} · {apt.appointmentDate}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      apt.status === "CONFIRMED" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                  <div>
                    <strong className="text-base font-bold text-[var(--rose)] block">{apt.purpose}</strong>
                    <span className="text-xs text-[var(--rose-soft)] font-mono">Patient ID: {apt.patientId}</span>
                  </div>
                  {apt.notes && (
                    <p className="text-xs text-[var(--rose-soft)] bg-white p-3 rounded-xl border border-[var(--line)] italic">
                      "{apt.notes}"
                    </p>
                  )}
                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        const target = patients.find(p => p.patientId === apt.patientId) || patients[0];
                        setSelectedPatient(target);
                        setActiveTab("write");
                        toast.success(`Consultation workspace opened for ${target.fullName}`);
                      }}
                      className="text-xs font-bold text-[var(--coral-deep)] hover:underline flex items-center gap-1"
                    >
                      Write Encounter for {apt.patientId} <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: EMERGENCY BREAK-GLASS OVERRIDE */}
        {activeTab === "emergency" && (
          <div className="max-w-2xl mx-auto bg-red-50/70 border-2 border-red-300 rounded-2xl p-8 shadow-sm space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-red-700 font-bold">
                  CRITICAL CARE PROTOCOL
                </span>
                <h3 className="text-2xl font-bold font-['Bricolage_Grotesque'] text-red-950 mt-0.5">
                  Emergency Break-Glass Override
                </h3>
                <p className="text-xs text-red-800 mt-1 leading-relaxed">
                  Use strictly in life-threatening emergencies (e.g. unconscious patient, trauma, acute arrest). This action bypasses patient OTP consent and is permanently logged in the ABDM audit trail.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-red-200 space-y-4">
              <div>
                <label className="text-xs font-bold text-red-950 block mb-1">Target Patient ABHA / ID</label>
                <select
                  value={selectedPatient?.patientId || ""}
                  onChange={(e) => {
                    const found = patients.find(p => p.patientId === e.target.value);
                    if (found) setSelectedPatient(found);
                  }}
                  className="w-full bg-red-50/50 border border-red-200 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-red-900 outline-none"
                >
                  {patients.map(p => (
                    <option key={p.patientId} value={p.patientId}>
                      {p.patientId} ({p.fullName} · {p.abhaNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-red-950 block mb-1">Declared Critical Clinical Condition</label>
                <input
                  type="text"
                  value={emergencyCondition}
                  onChange={(e) => setEmergencyCondition(e.target.value)}
                  className="w-full bg-white border border-red-300 rounded-xl px-4 py-2.5 text-xs text-red-950 font-bold outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-red-950 block mb-1">Healthcare Facility Code</label>
                <input
                  type="text"
                  value={emergencyFacility}
                  onChange={(e) => setEmergencyFacility(e.target.value)}
                  className="w-full bg-white border border-red-300 rounded-xl px-4 py-2.5 text-xs font-mono text-red-950 font-bold outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-red-700 font-mono flex items-center gap-1.5">
                <Lock size={13} /> Legal Notice: Section 13 ABDM Emergency Protocol
              </span>
              <button
                type="button"
                onClick={handleDeclareEmergency}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-6 py-3 rounded-xl flex items-center gap-2 shadow-md transition-transform active:scale-95"
              >
                <AlertTriangle size={16} /> Execute Break-Glass Override
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Raw FHIR Bundle Modal */}
      <Dialog open={fhirModalOpen} onOpenChange={setFhirModalOpen}>
        <DialogContent className="max-w-2xl bg-[var(--cream)] border border-[var(--line)] text-[var(--rose)]">
          <DialogHeader>
            <DialogTitle className="font-['Bricolage_Grotesque'] text-xl font-bold flex items-center gap-2">
              <Database size={18} className="text-[var(--coral)]" /> FHIR R4 Bundle Record
            </DialogTitle>
            <DialogDescription className="text-xs text-[var(--rose-soft)]">
              Structured HL7 FHIR Bundle transmitted through ABDM Gateway.
            </DialogDescription>
          </DialogHeader>

          <pre className="bg-[var(--rose)] text-[#ffe6dc] p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-96 leading-relaxed">
            {selectedRecord?.fhirResourceJson || JSON.stringify(patientRecords, null, 2)}
          </pre>
        </DialogContent>
      </Dialog>

      {/* ABDM Patient Consent OTP Verification Challenge Modal */}
      <Dialog open={consentOtpModalOpen} onOpenChange={setConsentOtpModalOpen}>
        <DialogContent className="max-w-md bg-[var(--cream)] border border-[var(--line)] text-[var(--rose)] p-6 rounded-3xl">
          <DialogHeader>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-3">
              <ShieldCheck size={26} />
            </div>
            <DialogTitle className="font-['Bricolage_Grotesque'] text-2xl font-bold">
              Patient Consent Verification
            </DialogTitle>
            <DialogDescription className="text-xs text-[var(--rose-soft)] leading-relaxed">
              An ABDM Scoped Consent challenge has been dispatched to <strong>{scannedPatient?.patientName || "Aarav Sharma"}</strong>'s registered mobile number (<strong>+91 ••••••4529</strong>).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4">
            <div className="bg-[var(--paper)] p-3.5 rounded-2xl border border-[var(--line)] space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--rose-soft)]">Purpose:</span>
                <span className="font-bold text-[var(--rose)]">{purpose}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--rose-soft)]">Requested Scopes:</span>
                <span className="font-bold text-[var(--coral-deep)]">
                  {[
                    scopeDiagnostic && "Diagnostic",
                    scopePrescription && "Prescriptions",
                    scopeEncounters && "Encounters"
                  ].filter(Boolean).join(", ")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--rose-soft)]">Validity:</span>
                <span className="font-bold text-[var(--rose)]">{durationDays} Days</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-[var(--rose)]">Enter 6-Digit Patient OTP</label>
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Demo Code: 123456
                </span>
              </div>
              <div className="flex gap-2 justify-center">
                {consentOtp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`consent-otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const val = e.target.value;
                      const next = [...consentOtp];
                      next[idx] = val;
                      setConsentOtp(next);
                      if (val && idx < 5) {
                        const nextEl = document.getElementById(`consent-otp-${idx + 1}`);
                        if (nextEl) nextEl.focus();
                      }
                    }}
                    className="w-11 h-13 text-center text-lg font-mono font-bold bg-white border border-[var(--line)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--coral)]"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setConsentOtpModalOpen(false)}
              className="flex-1 bg-white border border-[var(--line)] hover:bg-[var(--paper)] text-[var(--rose)] font-bold text-xs py-3 rounded-xl transition-colors"
            >
              Cancel Request
            </button>
            <button
              type="button"
              onClick={handleVerifyConsentOtp}
              disabled={isVerifyingConsent}
              className="flex-1 bg-[var(--coral-deep)] hover:bg-[var(--coral)] text-white font-bold text-xs py-3 rounded-xl transition-transform active:scale-95 shadow-sm flex items-center justify-center gap-1.5"
            >
              {isVerifyingConsent ? "Decrypting..." : "Verify & Decrypt Locker"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorPortal;
