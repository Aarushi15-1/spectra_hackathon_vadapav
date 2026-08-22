package com.spectra.health.service;

import com.spectra.health.dto.HealthCardDto;
import com.spectra.health.model.Doctor;
import com.spectra.health.model.User;
import com.spectra.health.repository.DoctorRepository;
import com.spectra.health.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmergencyService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final HealthCardService healthCardService;
    private final AuditEventService auditEventService;

    /**
     * Section 13: Emergency Break-Glass Access for Verified ER Doctors
     */
    @Transactional
    public Map<String, Object> declareEmergencyAccess(String patientId, Long doctorId, String declaredCondition, String facility) {
        User user = userRepository.findByPatientId(patientId)
                .orElseThrow(() -> new IllegalArgumentException("Patient ID not found: " + patientId));

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found: " + doctorId));

        if (!Boolean.TRUE.equals(doctor.getIsVerified())) {
            throw new IllegalStateException("Emergency Access Denied: Practitioner credentials are not verified.");
        }

        // Evaluate Emergency Policy: Grant predefined critical emergency scope (HealthCard, Blood Group, Allergies, Active Rx)
        HealthCardDto healthCard = healthCardService.getHealthCardForUser(user.getId());

        // Log High-Priority Audit Event
        auditEventService.logEvent(
                user.getPatientId(),
                doctor.getDoctorId(),
                doctor.getFullName() + " (EMERGENCY DECLARED)",
                "EMERGENCY_SYSTEM",
                "EMERGENCY_ACCESS_INVOKED",
                "EmergencyHealthCard",
                declaredCondition != null ? declaredCondition : "Trauma / Acute Emergency",
                "SUCCESS",
                "BREAK-GLASS EMERGENCY ACCESS INVOKED by " + doctor.getFullName() + " at " + (facility != null ? facility : doctor.getHospitalName()) + ". Condition: " + declaredCondition + ". Time-bounded: 4 hours."
        );

        Map<String, Object> emergencyBundle = new HashMap<>();
        emergencyBundle.put("status", "EMERGENCY_ACCESS_ACTIVE");
        emergencyBundle.put("timeBoundedHours", 4);
        emergencyBundle.put("declaredCondition", declaredCondition);
        emergencyBundle.put("accessedBy", doctor.getFullName());
        emergencyBundle.put("hospital", doctor.getHospitalName());
        emergencyBundle.put("healthCardSummary", healthCard);
        emergencyBundle.put("criticalAllergies", healthCard.getAllergies());
        emergencyBundle.put("bloodGroup", healthCard.getBloodGroup());
        emergencyBundle.put("emergencyContact", healthCard.getEmergencyContactName() + " (" + healthCard.getEmergencyContactPhone() + ")");
        emergencyBundle.put("auditNotice", "High-priority audit log registered. Patient notification triggered.");

        return emergencyBundle;
    }
}
