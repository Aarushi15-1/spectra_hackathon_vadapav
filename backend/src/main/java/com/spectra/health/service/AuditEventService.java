package com.spectra.health.service;

import com.spectra.health.dto.AuditEventDto;
import com.spectra.health.model.AuditEventLog;
import com.spectra.health.repository.AuditEventLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditEventService {

    private final AuditEventLogRepository auditEventLogRepository;

    @Transactional
    public void logEvent(
            String patientId,
            String actorId,
            String actorName,
            String actorRole,
            String eventType,
            String resourceType,
            String purpose,
            String result,
            String humanReadableDesc) {

        // Build FHIR R4 AuditEvent JSON representation
        String fhirJson = String.format(
                "{\"resourceType\":\"AuditEvent\",\"type\":{\"code\":\"%s\"},\"action\":\"%s\",\"recorded\":\"%s\",\"outcome\":\"%s\",\"agent\":[{\"who\":{\"identifier\":\"%s\",\"display\":\"%s\"},\"role\":\"%s\"}],\"entity\":[{\"what\":{\"reference\":\"Patient/%s\"},\"type\":\"%s\"}],\"purposeOfUse\":[{\"text\":\"%s\"}]}",
                eventType,
                eventType.contains("ACCESSED") ? "R" : eventType.contains("REVOKED") ? "D" : "E",
                LocalDateTime.now(),
                result,
                actorId,
                actorName,
                actorRole,
                patientId,
                resourceType != null ? resourceType : "HealthcareData",
                purpose != null ? purpose : "ClinicalCare"
        );

        AuditEventLog event = AuditEventLog.builder()
                .patientId(patientId)
                .actorId(actorId)
                .actorName(actorName)
                .actorRole(actorRole)
                .eventType(eventType)
                .resourceType(resourceType)
                .purpose(purpose)
                .result(result)
                .humanReadableDescription(humanReadableDesc)
                .fhirAuditEventJson(fhirJson)
                .build();

        auditEventLogRepository.save(event);
        log.info("AUDIT EVENT [{}]: patient={}, actor={}, purpose={}", eventType, patientId, actorName, purpose);
    }

    public List<AuditEventDto> getAuditTrail(String patientId) {
        return auditEventLogRepository.findByPatientIdOrderByTimestampDesc(patientId)
                .stream()
                .map(AuditEventDto::fromEntity)
                .collect(Collectors.toList());
    }
}
