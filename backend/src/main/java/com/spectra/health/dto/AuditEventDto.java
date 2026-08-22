package com.spectra.health.dto;

import com.spectra.health.model.AuditEventLog;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditEventDto {
    private Long id;
    private String patientId;
    private String actorId;
    private String actorName;
    private String actorRole;
    private String eventType;
    private String resourceType;
    private String purpose;
    private String result;
    private String humanReadableDescription;
    private String fhirAuditEventJson;
    private LocalDateTime timestamp;

    public static AuditEventDto fromEntity(AuditEventLog entity) {
        if (entity == null) return null;
        return AuditEventDto.builder()
                .id(entity.getId())
                .patientId(entity.getPatientId())
                .actorId(entity.getActorId())
                .actorName(entity.getActorName())
                .actorRole(entity.getActorRole())
                .eventType(entity.getEventType())
                .resourceType(entity.getResourceType())
                .purpose(entity.getPurpose())
                .result(entity.getResult())
                .humanReadableDescription(entity.getHumanReadableDescription())
                .fhirAuditEventJson(entity.getFhirAuditEventJson())
                .timestamp(entity.getTimestamp())
                .build();
    }
}
