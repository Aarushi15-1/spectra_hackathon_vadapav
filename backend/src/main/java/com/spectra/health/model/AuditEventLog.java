package com.spectra.health.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_event_logs", indexes = {
    @Index(name = "idx_audit_user", columnList = "patientId, timestamp")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditEventLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String patientId; // HealthBridge Patient ID (e.g. HB-2026-89410)

    @Column(nullable = false)
    private String actorId; // Doctor ID, Lab ID, Patient ID, or SYSTEM

    @Column(nullable = false)
    private String actorName; // e.g. "Dr. Ananya Sharma", "Apollo Labs", "Patient (Self)"

    @Column(nullable = false)
    private String actorRole; // PATIENT, DOCTOR, LABORATORY, EMERGENCY_SYSTEM

    // Event Types: QR_GENERATED, QR_SCANNED, ACCESS_REQUEST_CREATED, ACCESS_APPROVED, ACCESS_DENIED, RESOURCE_ACCESSED, ACCESS_REVOKED, EMERGENCY_ACCESS_INVOKED, RECORD_UPLOADED
    @Column(nullable = false, length = 50)
    private String eventType;

    private String resourceType; // HealthCard, MedicationRequest, DiagnosticReport, Observation, Consent
    private String purpose; // Reason for access
    private String result; // SUCCESS, DENIED, REVOKED, EXPIRED

    @Column(length = 1000)
    private String humanReadableDescription; // Patient-facing friendly explanation

    @Column(length = 2000)
    private String fhirAuditEventJson; // Structured HL7 FHIR AuditEvent resource payload

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime timestamp;
}
