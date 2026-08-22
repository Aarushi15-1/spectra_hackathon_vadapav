import React, { useState, useEffect } from 'react';
import { UserCheck, Star, Calendar, Clock, MapPin, Search, Stethoscope, CheckCircle2, ChevronRight, X, AlertCircle } from 'lucide-react';
import { healthBridgeApi } from '../api/healthBridgeApi';

export default function DoctorDirectory({ user }) {
  const [doctors, setDoctors] = useState([]);
  const [speciality, setSpeciality] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Booking Modal State
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState(new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]);
  const [appointmentTime, setAppointmentTime] = useState('11:00 AM');
  const [appointmentType, setAppointmentType] = useState('SPECIALIST_REVIEW');
  const [symptoms, setSymptoms] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    loadDoctors();
  }, [speciality]);

  const loadDoctors = async () => {
    setLoading(true);
    try {
      const data = await healthBridgeApi.getDoctors(speciality === 'ALL' ? '' : speciality);
      setDoctors(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    try {
      const token = localStorage.getItem('hb_token');
      await healthBridgeApi.bookAppointment(token, user?.id, {
        doctorId: selectedDoctor.id,
        appointmentDate,
        appointmentTime,
        appointmentType,
        symptoms: symptoms || 'Consultation review',
      });
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSuccess(false);
        setSelectedDoctor(null);
        setSymptoms('');
      }, 2500);
    } catch (err) {
      alert('Booking failed: ' + err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  const specialities = ['ALL', 'Cardiology', 'Internal Medicine', 'Neurology', 'Orthopedics'];

  const filteredDoctors = doctors.filter(d =>
    d.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.speciality.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-emerald-400" />
            <span>Verified Doctor Directory</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Section 5: Only verified healthcare practitioners can participate in HealthBridge access requests.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search doctor or hospital..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Speciality Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {specialities.map((spec) => (
          <button
            key={spec}
            onClick={() => setSpeciality(spec)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              speciality === spec
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            {spec === 'ALL' ? 'All Specialities' : spec}
          </button>
        ))}
      </div>

      {/* Doctors Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading verified medical practitioners...</div>
      ) : filteredDoctors.length === 0 ? (
        <div className="p-12 text-center text-slate-400 text-xs">No verified doctors found matching criteria.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="glass-card rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={doc.photoUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2'}
                      alt={doc.fullName}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-slate-100">{doc.fullName}</h3>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50 text-[10px] font-semibold flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                        </span>
                      </div>
                      <p className="text-xs text-emerald-400 font-medium">{doc.speciality}</p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{doc.hospitalName}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end text-amber-400 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{doc.rating || 4.9}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">({doc.reviewCount || 100}+ reviews)</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300/80 mt-3 leading-relaxed line-clamp-2">
                  {doc.bio}
                </p>

                <div className="flex items-center gap-4 mt-3 text-[11px] text-slate-400">
                  <span>Exp: <strong className="text-slate-200">{doc.experienceYears} yrs</strong></span>
                  <span>License: <strong className="text-slate-200 font-mono">{doc.licenseNumber}</strong></span>
                  <span>Fee: <strong className="text-emerald-400">₹{doc.consultationFee}</strong></span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Next Available: <strong className="text-emerald-300">Tomorrow</strong></span>
                <button
                  onClick={() => setSelectedDoctor(doc)}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Appointment</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Appointment Booking Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-card rounded-2xl p-6 border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-100">Schedule with {selectedDoctor.fullName}</h3>
                <p className="text-xs text-emerald-400">{selectedDoctor.speciality} • {selectedDoctor.hospitalName}</p>
              </div>
              <button onClick={() => setSelectedDoctor(null)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="p-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-100">Appointment Confirmed!</h4>
                <p className="text-xs text-slate-400">
                  Scheduled with {selectedDoctor.fullName} for {appointmentDate} at {appointmentTime}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBook} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">Date</label>
                    <input
                      type="date"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">Time Slot</label>
                    <select
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
                    >
                      <option value="09:30 AM">09:30 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="02:30 PM">02:30 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                      <option value="06:00 PM">06:00 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Consultation Type</label>
                  <select
                    value={appointmentType}
                    onChange={(e) => setAppointmentType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"
                  >
                    <option value="SPECIALIST_REVIEW">Specialist Review & Consultation</option>
                    <option value="ROUTINE_CONSULTATION">Routine Consultation</option>
                    <option value="FOLLOW_UP">Follow-up Visit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-300 mb-1">Symptoms / Purpose</label>
                  <textarea
                    rows={2}
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Brief description of symptoms or test review..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 placeholder-slate-500"
                  />
                </div>

                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Consultation Fee</span>
                  <span className="font-bold text-emerald-400">₹{selectedDoctor.consultationFee}</span>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedDoctor(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{bookingLoading ? 'Confirming...' : 'Confirm Appointment'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
