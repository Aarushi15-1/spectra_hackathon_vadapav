import React, { useState } from 'react';
import { Plus, X, Upload, Stethoscope, FileText, CheckCircle2 } from 'lucide-react';

export function AddRecordModal({ onClose, onSubmitRecord }) {
  const [formData, setFormData] = useState({
    title: '',
    recordType: 'OPD_CONSULTATION',
    doctorName: '',
    doctorSpeciality: 'General Medicine',
    facilityName: 'Apollo Spectra Hospitals',
    recordDate: new Date().toISOString().split('T')[0],
    summary: '',
    diagnosis: '',
    prescriptionDetails: '',
    labResultsJson: ''
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return;

    setSubmitting(true);
    try {
      await onSubmitRecord(formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto relative animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Upload New Health Record</h2>
            <p className="text-xs text-gray-400">
              Create an ABDM & FHIR-compliant record linked to your ABHA profile
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
              Document / Consultation Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Annual Health Checkup or Chest X-Ray Report"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/15 focus:border-emerald-500 rounded-xl text-sm text-white placeholder-gray-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                Record Category (FHIR Resource)
              </label>
              <select
                name="recordType"
                value={formData.recordType}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/15 focus:border-emerald-500 rounded-xl text-sm text-white outline-none transition-all"
              >
                <option value="OPD_CONSULTATION">OPD Consultation (Encounter)</option>
                <option value="PRESCRIPTION">Prescription (MedicationRequest)</option>
                <option value="LAB_REPORT">Lab Report (DiagnosticReport)</option>
                <option value="IMMUNIZATION_RECORD">Immunization Certificate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                Record Date
              </label>
              <input
                type="date"
                name="recordDate"
                value={formData.recordDate}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/15 focus:border-emerald-500 rounded-xl text-sm text-white outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                Treating Doctor / Practitioner
              </label>
              <input
                type="text"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleChange}
                placeholder="e.g. Dr. Rajesh Khanna, MD"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/15 focus:border-emerald-500 rounded-xl text-sm text-white placeholder-gray-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
                Healthcare Facility / Hospital
              </label>
              <input
                type="text"
                name="facilityName"
                value={formData.facilityName}
                onChange={handleChange}
                placeholder="e.g. Max Super Speciality"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/15 focus:border-emerald-500 rounded-xl text-sm text-white placeholder-gray-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1">
              Clinical Findings & Diagnosis
            </label>
            <textarea
              name="summary"
              rows={2}
              value={formData.summary}
              onChange={handleChange}
              placeholder="Clinical summary, symptoms discussed, and diagnosis..."
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/15 focus:border-emerald-500 rounded-xl text-sm text-white placeholder-gray-500 outline-none transition-all"
            />
          </div>

          {formData.recordType === 'PRESCRIPTION' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
                Rx Prescribed Medicines & Dosages
              </label>
              <textarea
                name="prescriptionDetails"
                rows={2}
                value={formData.prescriptionDetails}
                onChange={handleChange}
                placeholder="e.g. Tab. Paracetamol 650mg TDS x 3 days"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-blue-500/30 focus:border-blue-400 rounded-xl text-sm font-mono text-blue-200 outline-none transition-all"
              />
            </div>
          )}

          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="gradient-btn px-6 py-2.5 text-xs font-bold rounded-xl flex items-center gap-2"
            >
              {submitting ? 'Encrypting & Saving...' : 'Save into Health Locker'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
