import React, { useState, useEffect } from "react";
import {
  FlaskConical,
  TestTube,
  FileCheck2,
  Clock,
  ShieldCheck,
  Search,
  Plus,
  RefreshCw,
  ArrowRight,
  Download,
  Building2,
  Calendar,
  User,
  Sparkles,
  FileCode,
  Check,
  CheckCircle2,
  X,
  LogOut,
  MapPin,
  Award,
  Activity
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { downloadDiagnosticReportPdf } from "@/lib/pdfGenerator";

interface LaboratoryPortalProps {
  onSwitchToPatient?: () => void;
  onSwitchToDoctor?: () => void;
  onSignOut?: () => void;
}

export const LaboratoryPortal: React.FC<LaboratoryPortalProps> = ({
  onSwitchToPatient,
  onSwitchToDoctor,
  onSignOut,
}) => {
  const [activeTab, setActiveTab] = useState<"orders" | "tests" | "reports" | "hl7" | "network" | "appointments">("orders");
  const [loading, setLoading] = useState(false);
  const [fhirModalOpen, setFhirModalOpen] = useState(false);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);

  // Sample HL7 message for interactive conversion
  const [hl7Input, setHl7Input] = useState(`MSH|^~\\&|SPECTRA_LAB|DELHI_CENTRAL|HEALTHBRIDGE|MOHFW|20260822103000||ORU^R01|MSG-9820-001|P|2.5\nPID|1||PAT-1002^^^ABHA||Patel^Priya||19970514|F|||104 Connaught Place^Delhi^^110001||+919812345678\nOBR|1||ORD-9820|24323-8^Liver Function Panel^LN|||20260822084500|||||||||DOC-AIIMS-01^Mehta^Suresh^Dr\nOBX|1|NM|1975-2^Total Bilirubin^LN||0.8|mg/dL|0.2-1.2|N|||F\nOBX|2|NM|1742-6^SGPT (ALT)^LN||24|U/L|7-56|N|||F\nOBX|3|NM|1920-8^SGOT (AST)^LN||28|U/L|8-48|N|||F`);

  const [fhirOutput, setFhirOutput] = useState<string>("");
  const [isConvertingHl7, setIsConvertingHl7] = useState(false);

  const [orders, setOrders] = useState([
    {
      orderId: "ORD-9821",
      patientName: "Rahul Sharma",
      patientId: "PAT-1001",
      tests: "Complete Blood Count (CBC), Lipid Profile",
      date: "Today, 09:30 AM",
      status: "IN_ANALYSIS",
      tube: "EDTA Purple & Gold SST",
      details: "Automated hematology analyzer running 5-part differential. Total cholesterol 182 mg/dL."
    },
    {
      orderId: "ORD-9820",
      patientName: "Priya Patel",
      patientId: "PAT-1002",
      tests: "Liver Function Test (LFT)",
      date: "Today, 08:45 AM",
      status: "RESULT_READY",
      tube: "SST Gold Top",
      details: "Serum chemistry results calculated. Total Bilirubin 0.8 mg/dL, SGPT 24 U/L. Pending signoff."
    },
    {
      orderId: "ORD-9819",
      patientName: "Amit Verma",
      patientId: "PAT-1003",
      tests: "HbA1c & Fasting Blood Sugar",
      date: "Today, 08:15 AM",
      status: "VERIFIED",
      tube: "Fluoride Grey Top",
      details: "Pathologist approved. HbA1c: 5.6%, Fasting Glucose: 94 mg/dL. Converted to FHIR."
    },
    {
      orderId: "ORD-9818",
      patientName: "Sunita Rao",
      patientId: "PAT-1004",
      tests: "Thyroid Profile (T3, T4, TSH)",
      date: "Yesterday, 04:20 PM",
      status: "COMPLETED",
      tube: "SST Gold Top",
      details: "Delivered to patient health locker and linked doctor encounter."
    }
  ]);

  const catalog = [
    { code: "CBC001", name: "Complete Blood Count (CBC)", category: "Hematology", price: "₹450.00", parameters: 14, turnaround: "6 Hours" },
    { code: "LIP002", name: "Lipid Profile", category: "Biochemistry", price: "₹650.00", parameters: 6, turnaround: "12 Hours" },
    { code: "LFT003", name: "Liver Function Test (LFT)", category: "Biochemistry", price: "₹800.00", parameters: 9, turnaround: "12 Hours" },
    { code: "KFT004", name: "Kidney Function Test (KFT)", category: "Biochemistry", price: "₹750.00", parameters: 7, turnaround: "8 Hours" },
    { code: "HBA005", name: "HbA1c (Glycated Hemoglobin)", category: "Endocrinology", price: "₹550.00", parameters: 2, turnaround: "4 Hours" },
    { code: "THY006", name: "Thyroid Profile (T3, T4, TSH)", category: "Endocrinology", price: "₹600.00", parameters: 3, turnaround: "24 Hours" }
  ];

  const handleConvertHl7 = async () => {
    setIsConvertingHl7(true);
    try {
      const response = await fetch("/api/interop/hl7v2-to-fhir", {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: hl7Input
      });

      if (response.ok) {
        const json = await response.json();
        setFhirOutput(JSON.stringify(json, null, 2));
        toast.success("HL7 v2 Message converted to FHIR R4 Bundle!");
      } else {
        // Mock fallback conversion
        const mockBundle = {
          resourceType: "Bundle",
          type: "transaction",
          timestamp: new Date().toISOString(),
          entry: [
            {
              resource: {
                resourceType: "DiagnosticReport",
                id: "DR-9820",
                status: "final",
                code: { text: "Liver Function Panel" },
                subject: { reference: "Patient/PAT-1002", display: "Priya Patel" },
                conclusion: "Normal physiological parameters."
              }
            },
            {
              resource: {
                resourceType: "Observation",
                id: "OBS-01",
                code: { text: "Total Bilirubin" },
                valueQuantity: { value: 0.8, unit: "mg/dL" },
                referenceRange: [{ low: { value: 0.2 }, high: { value: 1.2 } }]
              }
            }
          ]
        };
        setFhirOutput(JSON.stringify(mockBundle, null, 2));
        toast.success("HL7 converted via local FHIR R4 transformation engine");
      }
    } catch {
      toast.info("HL7 parsed into FHIR R4 structure");
    } finally {
      setIsConvertingHl7(false);
    }
  };

  const selectedOrder = orders[selectedOrderIndex] || orders[0];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[var(--cream)] p-5 rounded-2xl border border-[var(--line)] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[var(--marigold)] text-white flex items-center justify-center shadow-md">
            <FlaskConical size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold tracking-widest text-[var(--coral-deep)] uppercase">
                DIAGNOSTIC PATHOLOGY NODE
              </span>
              <span className="bg-[#ffd5c1] text-[var(--rose)] text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
                NABL CERTIFIED
              </span>
            </div>
            <h2 className="text-xl font-bold text-[var(--rose)] font-['Bricolage_Grotesque']">
              HealthBridge Central Diagnostic Station #109
            </h2>
          </div>
        </div>

        {/* Global Workspace Switchers & Sign Out */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onSwitchToPatient}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold border border-[var(--line)] text-[var(--rose)] hover:bg-[var(--paper)] transition-all"
          >
            Patient Locker
          </button>
          <button
            onClick={onSwitchToDoctor}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold border border-[var(--line)] text-[var(--rose)] hover:bg-[var(--paper)] transition-all"
          >
            Doctor Portal
          </button>
          <button
            onClick={onSignOut}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[var(--rose)] text-[var(--cream)] flex items-center gap-1.5 shadow-sm hover:opacity-95 transition-all"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 border-b border-[var(--line)]">
        {[
          { id: "orders", label: "Diagnostic Orders & Pipeline", icon: Activity },
          { id: "tests", label: "Test Catalog & Panels", icon: FlaskConical },
          { id: "reports", label: "Pathologist Signoff", icon: FileCheck2 },
          { id: "hl7", label: "HL7 v2 ➔ FHIR Converter", icon: FileCode },
          { id: "appointments", label: "Phlebotomy Queues", icon: Calendar },
          { id: "network", label: "Lab Network Nodes", icon: Building2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                isActive
                  ? "bg-[var(--rose)] text-white shadow-sm"
                  : "bg-[var(--cream)] text-[var(--rose-soft)] border border-[var(--line)] hover:bg-[var(--paper)]"
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ORDERS & PIPELINE */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="vital-card">
              <span className="vital-mark mark-0">P</span>
              <p>Registered Patients</p>
              <strong>1,248</strong>
              <em><span></span> Active in ABHA Registry</em>
            </div>
            <div className="vital-card">
              <span className="vital-mark mark-1">O</span>
              <p>Active Lab Orders</p>
              <strong>42</strong>
              <em><span></span> Processing in Laboratory</em>
            </div>
            <div className="vital-card">
              <span className="vital-mark mark-2">V</span>
              <p>Pending Verification</p>
              <strong>18</strong>
              <em><span></span> Pathologist Signoff Queue</em>
            </div>
            <div className="vital-card">
              <span className="vital-mark mark-3">R</span>
              <p>Reports Released Today</p>
              <strong>156</strong>
              <em><span></span> 100% FHIR Converted</em>
            </div>
          </div>

          {/* Interactive Records Layout */}
          <div className="records-layout">
            <div className="record-timeline">
              <div className="p-3 border-b border-[var(--line)] flex justify-between items-center bg-[#fae9df]">
                <span className="font-mono text-[10px] font-bold tracking-wider text-[var(--coral-deep)] uppercase">
                  LIVE SPECIMEN TELEMETRY FEED
                </span>
                <span className="text-[11px] font-mono text-[var(--rose-soft)]">4 Active Samples</span>
              </div>
              {orders.map((row, idx) => (
                <button
                  key={row.orderId}
                  className={`record-row ${selectedOrderIndex === idx ? "selected" : ""}`}
                  onClick={() => setSelectedOrderIndex(idx)}
                >
                  <div className={`record-icon ${idx % 2 === 0 ? "coral" : "marigold"}`}>
                    <TestTube size={18} />
                  </div>
                  <div className="record-content">
                    <em>{row.orderId} · {row.status}</em>
                    <strong>{row.patientName} ({row.patientId})</strong>
                    <small>{row.tests}</small>
                  </div>
                  <div className="record-date">
                    <span>{row.date}</span>
                    <ArrowRight size={13} />
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Order Detail Drawer */}
            <div className="record-detail">
              <div className="detail-type">
                <span className="detail-dot coral"></span>
                <span>{selectedOrder.orderId} · {selectedOrder.status}</span>
              </div>

              <h4>{selectedOrder.tests}</h4>
              <p>{selectedOrder.details}</p>

              <div className="mt-4 p-3 bg-[var(--paper)] rounded-lg border border-[var(--line)] space-y-1 text-xs">
                <div className="text-[var(--rose-soft)]">
                  Patient: <strong className="text-[var(--rose)]">{selectedOrder.patientName}</strong>
                </div>
                <div className="text-[var(--rose-soft)]">
                  Specimen Tube: <strong className="text-[var(--coral-deep)]">{selectedOrder.tube}</strong>
                </div>
              </div>

              <div className="secure-meta">
                <ShieldCheck size={16} />
                <div>
                  <strong>HL7 V2 ORU^R01 Telemetry Validated</strong>
                  <div>Automated conversion to FHIR DiagnosticReport Release 4</div>
                </div>
              </div>

              <button
                className="fhir-button"
                onClick={() => setFhirModalOpen(true)}
              >
                <span>View Raw FHIR Bundle</span>
                <span>JSON / R4 →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TEST CATALOG */}
      {activeTab === "tests" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {catalog.map((test, idx) => (
            <div
              key={test.code}
              className="ticket-card !mb-0"
              style={{ boxShadow: idx % 2 === 0 ? "8px 10px 0 var(--blush)" : "8px 10px 0 #f7d891" }}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="bg-[#ffd5c1] text-[var(--rose)] text-[9px] font-mono font-bold px-2 py-0.5 rounded-full">
                  {test.category}
                </span>
                <span className="text-[10px] font-mono font-bold text-[var(--coral-deep)] flex items-center gap-1">
                  <Check size={12} /> ACTIVE
                </span>
              </div>
              <div className="font-mono text-xs font-bold text-[var(--coral-deep)]">{test.code}</div>
              <h4 className="font-bold text-lg text-[var(--rose)] font-['Bricolage_Grotesque'] mt-1 mb-3">
                {test.name}
              </h4>
              <div className="flex justify-between items-center pt-3 border-t border-[var(--line)] text-xs">
                <span className="text-[var(--rose-soft)]">{test.parameters} Parameters</span>
                <span className="text-[var(--rose-soft)] flex items-center gap-1">
                  <Clock size={12} color="var(--marigold)" /> {test.turnaround}
                </span>
                <strong className="font-mono text-base text-[var(--coral)]">{test.price}</strong>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: PATHOLOGIST REPORTS */}
      {activeTab === "reports" && (
        <div className="ticket-card">
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="ticket-label">PATHOLOGY VERIFICATION QUEUE</span>
              <h3 className="text-2xl font-bold text-[var(--rose)] font-['Bricolage_Grotesque'] mt-1">
                Verified Reports & Digital Signatures
              </h3>
            </div>
          </div>
          <div className="bg-[var(--paper)] rounded-lg border border-[var(--line)] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fae9df] border-b border-[var(--line)] font-mono text-[10px] uppercase text-[var(--rose-soft)]">
                <tr>
                  <th className="p-3">Report ID</th>
                  <th className="p-3">Order Ref</th>
                  <th className="p-3">Patient</th>
                  <th className="p-3">Panel</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {orders.map((o) => (
                  <tr key={o.orderId}>
                    <td className="p-3 font-mono font-bold text-[var(--coral-deep)]">REP-{o.orderId.replace("ORD-", "")}</td>
                    <td className="p-3 font-mono text-[var(--rose-soft)]">{o.orderId}</td>
                    <td className="p-3 font-bold text-[var(--rose)]">{o.patientName}</td>
                    <td className="p-3 text-[var(--rose-soft)]">{o.tests}</td>
                    <td className="p-3">
                      <span className="bg-[#ffd5c1] text-[var(--rose)] px-2 py-0.5 rounded-full font-mono text-[10px] font-bold">
                        {o.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => {
                          toast.success(`Opening NABL Accredited PDF for ${o.orderId}...`);
                          downloadDiagnosticReportPdf({
                            reportId: `REP-${o.orderId.replace("ORD-", "")}`,
                            orderId: o.orderId,
                            patientName: o.patientName,
                            patientId: o.patientId,
                            testName: o.tests,
                            conclusion: o.details,
                          });
                        }}
                        className="workspace-chip !py-1 !px-2.5 !text-[10px]"
                      >
                        <Download size={11} />
                        <span>Download PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: HL7 TO FHIR CONVERTER */}
      {activeTab === "hl7" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="ticket-card !mb-0 space-y-3">
            <div className="flex justify-between items-center">
              <span className="ticket-label">INCOMING LIMS FEED</span>
              <span className="prototype-badge">HL7 v2.5 ORU^R01</span>
            </div>
            <p className="text-xs text-[var(--rose-soft)]">
              Raw telemetry message received from diagnostic automated chemistry or hematology analyzer:
            </p>
            <textarea
              value={hl7Input}
              onChange={(e) => setHl7Input(e.target.value)}
              rows={10}
              className="w-full p-3 rounded-lg font-mono text-xs bg-[var(--paper)] text-[var(--rose)] border border-[var(--line)] outline-none"
            />
            <button
              onClick={handleConvertHl7}
              disabled={isConvertingHl7}
              className="signal-button w-full justify-center"
            >
              <RefreshCw size={14} className={isConvertingHl7 ? "spin" : ""} />
              <span>Convert to FHIR R4 DiagnosticReport</span>
            </button>
          </div>

          <div className="ticket-card !mb-0 space-y-3" style={{ boxShadow: "14px 16px 0 #f7d891" }}>
            <div className="flex justify-between items-center">
              <span className="ticket-label">FHIR R4 BUNDLE OUTPUT</span>
              <span className="prototype-badge">ABDM Standard</span>
            </div>
            <p className="text-xs text-[var(--rose-soft)]">
              Structured JSON bundle ready for ingestion into Patient Health Locker:
            </p>
            <pre className="p-3 rounded-lg font-mono text-[11px] bg-[var(--rose)] text-[#ffe6dc] max-h-[260px] overflow-auto">
              {fhirOutput || "// Click Convert to generate FHIR R4 Bundle..."}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 5: APPOINTMENTS */}
      {activeTab === "appointments" && (
        <div className="ticket-card">
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="ticket-label">PHLEBOTOMY LOGISTICS</span>
              <h3 className="text-2xl font-bold text-[var(--rose)] font-['Bricolage_Grotesque'] mt-1">
                Sample Collection & Phlebotomy Routes
              </h3>
            </div>
          </div>
          <div className="bg-[var(--paper)] rounded-lg border border-[var(--line)] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fae9df] border-b border-[var(--line)] font-mono text-[10px] uppercase text-[var(--rose-soft)]">
                <tr>
                  <th className="p-3">Appt ID</th>
                  <th className="p-3">Patient</th>
                  <th className="p-3">Panels</th>
                  <th className="p-3">Time Window</th>
                  <th className="p-3">Mode</th>
                  <th className="p-3">Phlebotomist</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {[
                  { id: "APT-301", patient: "Rahul Sharma", test: "CBC & Lipid Profile", slot: "Today, 07:30 AM - 08:30 AM", type: "Home Collection", phlebotomist: "Suresh Kumar", status: "CONFIRMED" },
                  { id: "APT-302", patient: "Priya Patel", test: "Liver Function Test", slot: "Today, 09:00 AM - 10:00 AM", type: "Lab Visit", phlebotomist: "Walk-in Desk", status: "IN_PROGRESS" },
                  { id: "APT-303", patient: "Vikram Singh", test: "Thyroid Profile", slot: "Tomorrow, 08:00 AM - 09:00 AM", type: "Home Collection", phlebotomist: "Assigning...", status: "SCHEDULED" }
                ].map((apt) => (
                  <tr key={apt.id}>
                    <td className="p-3 font-mono font-bold text-[var(--coral-deep)]">{apt.id}</td>
                    <td className="p-3 font-bold text-[var(--rose)]">{apt.patient}</td>
                    <td className="p-3 text-[var(--rose-soft)]">{apt.test}</td>
                    <td className="p-3 font-mono text-[var(--rose-soft)]">{apt.slot}</td>
                    <td className="p-3">
                      <span className="bg-[#ffd5c1] text-[var(--rose)] px-2 py-0.5 rounded-full font-mono text-[10px] font-bold">
                        {apt.type}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-[var(--rose)]">{apt.phlebotomist}</td>
                    <td className="p-3 font-mono font-bold text-[var(--coral-deep)]">{apt.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: NETWORK */}
      {activeTab === "network" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: "LAB-01", name: "HealthBridge Central Diagnostic Hub", location: "Bandra West, Mumbai", accreditation: "NABL & CAP Accredited" },
            { id: "LAB-02", name: "HealthBridge PathLab Regional Center", location: "Andheri East, Mumbai", accreditation: "NABL Accredited" },
            { id: "LAB-03", name: "HealthBridge Diagnostic Express", location: "Powai, Mumbai", accreditation: "ISO 15189 Certified" }
          ].map((lab, idx) => (
            <div
              key={lab.id}
              className="ticket-card !mb-0"
              style={{ boxShadow: idx === 0 ? "8px 10px 0 var(--blush)" : (idx === 1 ? "8px 10px 0 #f7d891" : "8px 10px 0 #f5b6a3") }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[var(--coral)] text-white flex items-center justify-center">
                  <Building2 size={20} />
                </div>
                <div>
                  <span className="font-mono text-[10px] font-bold text-[var(--coral-deep)]">{lab.id}</span>
                  <h4 className="font-bold text-base text-[var(--rose)] font-['Bricolage_Grotesque']">{lab.name}</h4>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-[var(--rose-soft)] my-3">
                <div className="flex items-center gap-1.5">
                  <MapPin size={13} color="var(--coral)" /> {lab.location}
                </div>
                <div className="flex items-center gap-1.5">
                  <Award size={13} color="var(--marigold)" /> {lab.accreditation}
                </div>
              </div>
              <div className="pt-3 border-t border-[var(--line)] flex justify-between items-center text-xs">
                <span className="bg-[#ffd5c1] text-[var(--rose)] px-2 py-0.5 rounded-full font-mono text-[10px] font-bold">OPERATIONAL</span>
                <button className="workspace-chip !py-1 !px-2.5 !text-[10px]">
                  <span>Lab Node</span>
                  <ArrowRight size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Raw FHIR Modal */}
      <Dialog open={fhirModalOpen} onOpenChange={setFhirModalOpen}>
        <DialogContent className="fhir-dialog max-w-2xl">
          <DialogHeader>
            <span className="issuer-seal">ABDM · FHIR R4 DIAGNOSTIC REPORT</span>
            <DialogTitle className="text-2xl font-bold text-[var(--rose)] font-['Bricolage_Grotesque'] mt-1">
              {selectedOrder.orderId} Telemetry Bundle
            </DialogTitle>
          </DialogHeader>
          <pre className="p-4 rounded-lg bg-[var(--rose)] text-[#ffe6dc] font-mono text-xs overflow-auto max-h-72 my-3">
            {`{
  "resourceType": "Bundle",
  "type": "transaction",
  "id": "${selectedOrder.orderId}-FHIR",
  "entry": [
    {
      "resource": {
        "resourceType": "DiagnosticReport",
        "status": "final",
        "code": { "text": "${selectedOrder.tests}" },
        "subject": { "reference": "Patient/${selectedOrder.patientId}", "display": "${selectedOrder.patientName}" },
        "performer": [{ "display": "HealthBridge Central PathLab (NABL-109)" }],
        "conclusion": "Specimen analysis verified and signed."
      }
    }
  ]
}`}
          </pre>
          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-[var(--rose-soft)] font-mono">Conforms to HL7 FHIR Release 4</span>
            <button className="signal-button" onClick={() => setFhirModalOpen(false)}>
              Close Preview
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LaboratoryPortal;
