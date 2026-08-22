package com.spectra.health.controller;

import com.spectra.health.service.EmergencyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/emergency")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EmergencyController {

    private final EmergencyService emergencyService;

    /**
     * Section 13: Emergency Break-Glass Access for Verified Doctors
     */
    @PostMapping("/declare")
    public ResponseEntity<Map<String, Object>> declareEmergency(@RequestBody Map<String, Object> body) {
        String patientId = (String) body.getOrDefault("patientId", "HB-2026-89410");
        Long doctorId = Long.valueOf(body.getOrDefault("doctorId", 1).toString());
        String declaredCondition = (String) body.getOrDefault("declaredCondition", "Severe Acute Coronary Syndrome / Trauma");
        String facility = (String) body.getOrDefault("facility", "AIIMS Trauma Center, Emergency Ward");

        Map<String, Object> result = emergencyService.declareEmergencyAccess(patientId, doctorId, declaredCondition, facility);
        return ResponseEntity.ok(result);
    }
}
