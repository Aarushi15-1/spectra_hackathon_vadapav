-- ==============================================================================
-- HEALTHBRIDGE DOCTOR & CLINICAL ACCESS TABLES FOR SUPABASE CLOUD
-- Run this in Supabase Dashboard -> SQL Editor -> Run
-- ==============================================================================

-- 1. Create 'doctors' Table
CREATE TABLE IF NOT EXISTS public.doctors (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    speciality VARCHAR(100) NOT NULL,
    hospital_affiliation VARCHAR(200) NOT NULL,
    medical_council_license VARCHAR(100) UNIQUE NOT NULL,
    verified_status BOOLEAN DEFAULT TRUE,
    rating NUMERIC(3,2) DEFAULT 4.90,
    consultation_fee NUMERIC(8,2) DEFAULT 1500.00,
    available_slots VARCHAR(100) DEFAULT 'Mon-Fri 09:00 - 14:00',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Create 'appointments' Table
CREATE TABLE IF NOT EXISTS public.appointments (
    id BIGSERIAL PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL,
    doctor_id BIGINT REFERENCES public.doctors(id) ON DELETE SET NULL,
    doctor_name VARCHAR(150) NOT NULL,
    hospital VARCHAR(200) NOT NULL,
    appointment_date VARCHAR(50) NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'CONFIRMED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Create 'access_authorizations' Table (Doctor Scoped Permissions)
CREATE TABLE IF NOT EXISTS public.access_authorizations (
    id BIGSERIAL PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL,
    doctor_id BIGINT REFERENCES public.doctors(id) ON DELETE SET NULL,
    doctor_name VARCHAR(150) NOT NULL,
    purpose TEXT NOT NULL,
    scope TEXT NOT NULL,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    revoked_at TIMESTAMP WITH TIME ZONE
);

-- 4. Create 'health_cards' Table (Structured Patient Summary § 3)
CREATE TABLE IF NOT EXISTS public.health_cards (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES public.users(id) ON DELETE CASCADE,
    blood_group VARCHAR(10) NOT NULL DEFAULT 'O+',
    age INT NOT NULL DEFAULT 29,
    gender VARCHAR(20) NOT NULL DEFAULT 'Male',
    weight_kg NUMERIC(5,2) DEFAULT 71.50,
    height_cm NUMERIC(5,2) DEFAULT 176.00,
    allergies TEXT DEFAULT 'Penicillin, Dust mites',
    chronic_conditions TEXT DEFAULT 'Stage 1 Hypertension (Controlled)',
    current_medications TEXT DEFAULT 'Telmisartan 40mg OD',
    primary_contact VARCHAR(50) DEFAULT '+91 9820145290',
    emergency_contact TEXT DEFAULT 'Pooja Sharma (Spouse) — +91 9820199442',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Create 'audit_event_logs' Table (Immutable Audit Trail § 12)
CREATE TABLE IF NOT EXISTS public.audit_event_logs (
    id BIGSERIAL PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL,
    actor VARCHAR(150) NOT NULL,
    action_type VARCHAR(100) NOT NULL,
    purpose TEXT,
    description TEXT NOT NULL,
    fhir_audit_event_json TEXT,
    ip_address VARCHAR(50) DEFAULT '127.0.0.1',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. Create 'qr_sharing_sessions' Table (5-Minute Ephemeral Sessions § 4)
CREATE TABLE IF NOT EXISTS public.qr_sharing_sessions (
    id BIGSERIAL PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL,
    session_token VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE'
);

-- Enable Row Level Security (optional for Supabase best practice)
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_authorizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_event_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read access for demo tables
CREATE POLICY "Allow public read doctors" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Allow public insert appointments" ON public.appointments FOR ALL USING (true);
CREATE POLICY "Allow public all access_authorizations" ON public.access_authorizations FOR ALL USING (true);
CREATE POLICY "Allow public all health_cards" ON public.health_cards FOR ALL USING (true);
CREATE POLICY "Allow public all audit_event_logs" ON public.audit_event_logs FOR ALL USING (true);

-- ==============================================================================
-- SEED VERIFIED DOCTOR PROFILES & INITIAL APPOINTMENTS
-- ==============================================================================

INSERT INTO public.doctors (full_name, speciality, hospital_affiliation, medical_council_license, rating, consultation_fee, available_slots)
VALUES 
('Dr. Ananya Sharma', 'Cardiology', 'AIIMS New Delhi', 'MCI-DEL-2014-8849', 4.90, 1500.00, 'Mon-Fri 09:00 - 14:00'),
('Dr. Rajesh Verma', 'Internal Medicine', 'Fortis Hospital', 'MCI-MAH-2011-3901', 4.80, 1200.00, 'Tue-Sat 10:00 - 16:00'),
('Dr. Priya Nair', 'Neurology', 'Manipal Hospital', 'KMC-BLR-2016-1120', 4.90, 1800.00, 'Mon-Wed-Fri 11:00 - 17:00'),
('Dr. Siddharth Mehra', 'Orthopedics', 'Apollo Hospital', 'DMC-2018-7712', 4.70, 1400.00, 'Mon-Thu 09:00 - 13:00')
ON CONFLICT (medical_council_license) DO NOTHING;

-- Seed Sample Appointment
INSERT INTO public.appointments (patient_id, doctor_name, hospital, appointment_date, time_slot, status)
VALUES 
('HB-2026-89410', 'Dr. Ananya Sharma', 'AIIMS New Delhi', '2026-08-28', '11:00 AM', 'CONFIRMED');

-- Seed Sample Doctor Authorization
INSERT INTO public.access_authorizations (patient_id, doctor_name, purpose, scope, expires_at, status)
VALUES 
('HB-2026-89410', 'Dr. Ananya Sharma', 'Cardiology consultation and medication review', 'HealthCard, Allergies, Current Meds, Cardiac Reports', now() + interval '7 days', 'ACTIVE');
