package com.spectra.health.controller;

import com.spectra.health.dto.AuditEventDto;
import com.spectra.health.service.AuditEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuditController {

    private final AuditEventService auditEventService;

    /**
     * Section 12: View patient-facing audit history and structured HL7 FHIR AuditEvents
     */
    @GetMapping("/trail")
    public ResponseEntity<List<AuditEventDto>> getAuditTrail(
            @RequestParam(value = "patientId", defaultValue = "HB-2026-89410") String patientId) {
        List<AuditEventDto> list = auditEventService.getAuditTrail(patientId);
        return ResponseEntity.ok(list);
    }
}
