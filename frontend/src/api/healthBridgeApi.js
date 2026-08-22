const API_BASE = '/api';

export const healthBridgeApi = {
  // --- Section 2: Identity & Authentication ---
  initiateAadhaarSignup: async (aadhaarNumber) => {
    const res = await fetch(`${API_BASE}/auth/signup/initiate-aadhaar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: aadhaarNumber, authMethod: 'AADHAAR' }),
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Failed to dispatch Aadhaar OTP');
    return res.json();
  },

  verifyAadhaarOtp: async (txnId, otp) => {
    const res = await fetch(`${API_BASE}/auth/signup/verify-aadhaar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ txnId, otp }),
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Invalid Aadhaar OTP');
    return res.json();
  },

  completeSignup: async (signupData) => {
    const res = await fetch(`${API_BASE}/auth/signup/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signupData),
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Failed to complete registration');
    return res.json();
  },

  login: async (emailOrPhone, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrPhone, password }),
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Invalid login credentials');
    return res.json();
  },

  getMe: async (token, userId) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(`${API_BASE}/auth/me?userId=${userId || 1}`, { headers });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },

  // --- Section 3: HealthCard Summary ---
  getHealthCard: async (token, userId) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(`${API_BASE}/health-card?userId=${userId || 1}`, { headers });
    if (!res.ok) throw new Error('Failed to fetch HealthCard');
    return res.json();
  },

  updateHealthCard: async (token, userId, cardData) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
    const res = await fetch(`${API_BASE}/health-card?userId=${userId || 1}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(cardData),
    });
    if (!res.ok) throw new Error('Failed to update HealthCard');
    return res.json();
  },

  // --- Section 5 & 8: Doctor Discovery & Appointments ---
  getDoctors: async (speciality) => {
    const url = speciality ? `${API_BASE}/doctors?speciality=${speciality}` : `${API_BASE}/doctors`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch doctors');
    return res.json();
  },

  bookAppointment: async (token, userId, appointmentData) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
    const res = await fetch(`${API_BASE}/doctors/appointments?userId=${userId || 1}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(appointmentData),
    });
    if (!res.ok) throw new Error('Failed to book appointment');
    return res.json();
  },

  getAppointments: async (token, userId) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(`${API_BASE}/doctors/appointments?userId=${userId || 1}`, { headers });
    if (!res.ok) throw new Error('Failed to fetch appointments');
    return res.json();
  },

  // --- Section 4, 6, 7, 10, 11: Ephemeral QR Sharing & Access Control ---
  createQrSession: async (token, userId) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(`${API_BASE}/qr/create-session?userId=${userId || 1}`, {
      method: 'POST',
      headers,
    });
    if (!res.ok) throw new Error('Failed to create QR session');
    return res.json();
  },

  doctorScanQr: async (sessionToken, doctorId) => {
    const res = await fetch(`${API_BASE}/qr/doctor-scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionToken, doctorId }),
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Doctor scan failed');
    return res.json();
  },

  doctorRequestAccess: async (sessionToken, doctorId, purpose, requestedScope, durationDays) => {
    const res = await fetch(`${API_BASE}/qr/doctor-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionToken, doctorId, purpose, requestedScope, durationDays }),
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Access request submission failed');
    return res.json();
  },

  patientDecision: async (token, userId, authId, approve, grantedScope) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
    const res = await fetch(`${API_BASE}/qr/patient-decision?userId=${userId || 1}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ authId, approve, grantedScope }),
    });
    if (!res.ok) throw new Error('Failed to register decision');
    return res.json();
  },

  getAuthorizations: async (token, userId) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(`${API_BASE}/qr/authorizations?userId=${userId || 1}`, { headers });
    if (!res.ok) throw new Error('Failed to fetch authorizations');
    return res.json();
  },

  revokeAccess: async (token, userId, authId) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(`${API_BASE}/qr/revoke/${authId}?userId=${userId || 1}`, {
      method: 'POST',
      headers,
    });
    if (!res.ok) throw new Error('Failed to revoke access');
    return res.json();
  },

  // --- Section 13: Emergency Break-Glass Access ---
  declareEmergency: async (patientId, doctorId, declaredCondition, facility) => {
    const res = await fetch(`${API_BASE}/emergency/declare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId, doctorId, declaredCondition, facility }),
    });
    if (!res.ok) throw new Error((await res.json()).message || 'Emergency declaration failed');
    return res.json();
  },

  // --- Section 12: Audit Trail ---
  getAuditTrail: async (patientId) => {
    const res = await fetch(`${API_BASE}/audit/trail?patientId=${patientId || 'HB-2026-89410'}`);
    if (!res.ok) throw new Error('Failed to fetch audit trail');
    return res.json();
  },

  // --- Section 14 & 15: FHIR Records ---
  getRecords: async (token, userId) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(`${API_BASE}/records?userId=${userId || 1}`, { headers });
    if (!res.ok) throw new Error('Failed to fetch FHIR records');
    return res.json();
  },

  // --- Section 16: HL7 V2 to FHIR R4 Sandbox ---
  transformHl7V2: async (rawHl7V2Message) => {
    const res = await fetch(`${API_BASE}/interop/hl7v2-to-fhir`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawHl7V2Message }),
    });
    if (!res.ok) throw new Error('HL7 transformation failed');
    return res.json();
  },
};
