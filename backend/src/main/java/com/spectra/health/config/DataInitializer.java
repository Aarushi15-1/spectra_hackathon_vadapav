package com.spectra.health.config;

import com.spectra.health.dto.HealthCardDto;
import com.spectra.health.model.*;
import com.spectra.health.model.enums.Gender;
import com.spectra.health.repository.*;
import com.spectra.health.security.Pbkdf2EncryptionService;
import com.spectra.health.service.AuditEventService;
import com.spectra.health.service.HealthCardService;
import com.spectra.health.service.HealthRecordService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final AccessAuthorizationRepository accessAuthRepository;
    private final HealthCardService healthCardService;
    private final HealthRecordService healthRecordService;
    private final AuditEventService auditEventService;
    private final Pbkdf2EncryptionService encryptionService;

    @Override
    public void run(String... args) {
        seedVerifiedDoctors();
        seedExistingPatient();
    }

    private void seedVerifiedDoctors() {
        if (doctorRepository.count() > 0) return;

        List<Doctor> doctors = List.of(
                Doctor.builder()
                        .doctorId("DOC-AIIMS-01")
                        .fullName("Dr. Ananya Sharma")
                        .speciality("Cardiology")
                        .hospitalName("AIIMS New Delhi")
                        .qualification("MD (Medicine), DM (Cardiology), FACC")
                        .experienceYears(14)
                        .licenseNumber("MCI-DEL-2014-8849")
                        .isVerified(true)
                        .rating(4.9)
                        .reviewCount(142)
                        .consultationFee(1500)
                        .photoUrl("https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300")
                        .bio("Senior Consultant Interventional Cardiologist specializing in preventive cardiology, CAD management, and echocardiography.")
                        .build(),

                Doctor.builder()
                        .doctorId("DOC-FORTIS-02")
                        .fullName("Dr. Rajesh Verma")
                        .speciality("Internal Medicine")
                        .hospitalName("Fortis Memorial Research Institute")
                        .qualification("MD (Internal Medicine), MRCP (UK)")
                        .experienceYears(16)
                        .licenseNumber("MCI-MAH-2011-3901")
                        .isVerified(true)
                        .rating(4.8)
                        .reviewCount(98)
                        .consultationFee(1200)
                        .photoUrl("https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300")
                        .bio("Expert physician specializing in metabolic disorders, type 2 diabetes remission, and adult comprehensive health screenings.")
                        .build(),

                Doctor.builder()
                        .doctorId("DOC-MANIPAL-03")
                        .fullName("Dr. Priya Nair")
                        .speciality("Neurology")
                        .hospitalName("Manipal Hospital, Bengaluru")
                        .qualification("MD, DM (Neurology)")
                        .experienceYears(11)
                        .licenseNumber("KMC-BLR-2016-1120")
                        .isVerified(true)
                        .rating(4.9)
                        .reviewCount(210)
                        .consultationFee(1800)
                        .photoUrl("https://images.unsplash.com/photo-1594824813587-0b17180ff636?auto=format&fit=crop&q=80&w=300")
                        .bio("Consultant Neurologist with clinical focus on migraines, neuro-rehabilitation, and EEG diagnostics.")
                        .build(),

                Doctor.builder()
                        .doctorId("DOC-APOLLO-04")
                        .fullName("Dr. Siddharth Mehra")
                        .speciality("Orthopedics")
                        .hospitalName("Apollo Hospitals, Chennai")
                        .qualification("MS (Ortho), MCh (Joint Replacement)")
                        .experienceYears(18)
                        .licenseNumber("TNMC-CHN-2012-7634")
                        .isVerified(true)
                        .rating(4.7)
                        .reviewCount(85)
                        .consultationFee(1400)
                        .photoUrl("https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300")
                        .bio("Chief Joint Reconstruction Surgeon, robotic arthroplasty specialist.")
                        .build()
        );

        doctorRepository.saveAll(doctors);
        log.info("Seeded {} verified doctor profiles into Supabase Database", doctors.size());
    }

    private void seedExistingPatient() {
        if (userRepository.findByPatientId("HB-2026-89410").isPresent()) return;

        String passwordHash = encryptionService.hashIdentifier("password123");
        String aadhaarHash = encryptionService.hashIdentifier("543210987654");

        User aarav = User.builder()
                .patientId("HB-2026-89410")
                .fullName("Aarav Sharma")
                .gender(Gender.MALE)
                .dob(LocalDate.of(1996, 7, 14))
                .email("aarav.sharma@healthbridge.in")
                .phone("9820145290")
                .passwordHash(passwordHash)
                .aadhaarHash(aadhaarHash)
                .maskedAadhaar("XXXX-XXXX-7654")
                .photoUrl("https://api.dicebear.com/7.x/bottts/svg?seed=AaravSharma")
                .isAadhaarVerified(true)
                .build();

        User savedUser = userRepository.save(aarav);

        // Seed HealthCard (Section 3)
        HealthCardDto cardDto = HealthCardDto.builder()
                .age(29)
                .weightKg(71.5)
                .heightCm(176.0)
                .bloodGroup("O+")
                .allergies("Penicillin, Dust mites")
                .chronicConditions("Stage 1 Hypertension (Controlled)")
                .currentMedications("Telmisartan 40mg OD")
                .primaryContact("+91 9820145290")
                .emergencyContactName("Pooja Sharma")
                .emergencyContactPhone("+91 9820199442")
                .emergencyContactRelation("Spouse")
                .build();
        healthCardService.updateHealthCard(savedUser.getId(), cardDto);

        // Seed FHIR Records
        healthRecordService.seedInitialPatientRecords(savedUser);

        // Seed Scheduled Appointment with Dr. Ananya Sharma
        Doctor docAnanya = doctorRepository.findByDoctorId("DOC-AIIMS-01").orElse(null);
        if (docAnanya != null) {
            Appointment appt = Appointment.builder()
                    .user(savedUser)
                    .doctor(docAnanya)
                    .appointmentDate(LocalDate.now().plusDays(3))
                    .appointmentTime("11:00 AM")
                    .status("SCHEDULED")
                    .appointmentType("SPECIALIST_REVIEW")
                    .symptoms("Routine BP follow-up and ECG review")
                    .notes("Please bring previous lipid profile test results.")
                    .build();
            appointmentRepository.save(appt);

            // Seed an active Authorization (Section 11)
            AccessAuthorization auth = AccessAuthorization.builder()
                    .user(savedUser)
                    .doctor(docAnanya)
                    .purpose("Cardiology consultation and medication review")
                    .requestedScope("HEALTH_CARD,ALLERGIES,CURRENT_MEDS,CARDIOLOGY_REPORTS")
                    .grantedScope("HEALTH_CARD,ALLERGIES,CURRENT_MEDS,CARDIOLOGY_REPORTS")
                    .durationDays(7)
                    .status("ACTIVE")
                    .grantedAt(LocalDateTime.now().minusDays(1))
                    .expiresAt(LocalDateTime.now().plusDays(6))
                    .build();
            accessAuthRepository.save(auth);
        }

        // Seed starter Audit Logs (Section 12)
        auditEventService.logEvent(
                savedUser.getPatientId(),
                savedUser.getPatientId(),
                savedUser.getFullName(),
                "PATIENT",
                "ACCOUNT_CREATED",
                "PatientProfile",
                "Patient Identity Onboarding",
                "SUCCESS",
                "Patient completed Aadhaar verification and established HealthBridge Patient ID HB-2026-89410."
        );

        auditEventService.logEvent(
                savedUser.getPatientId(),
                "DOC-AIIMS-01",
                "Dr. Ananya Sharma",
                "DOCTOR",
                "ACCESS_APPROVED",
                "ConsentAuthorization",
                "Cardiology consultation and medication review",
                "SUCCESS",
                "Patient approved 7-day scoped access [HEALTH_CARD, ALLERGIES, CURRENT_MEDS, CARDIOLOGY_REPORTS] for Dr. Ananya Sharma."
        );

        log.info("Initialized demo patient Aarav Sharma (HB-2026-89410) with HealthCard, appointments, and audit history.");
    }
}
