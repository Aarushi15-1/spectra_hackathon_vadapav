package com.spectra.health.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "access_authorizations", indexes = {
    @Index(name = "idx_user_auth", columnList = "user_id, status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccessAuthorization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @ManyToOne
    @JoinColumn(name = "qr_session_id")
    private QrSharingSession qrSession;

    @Column(nullable = false)
    private String purpose; // e.g. "Cardiology consultation and medication review"

    // Comma-separated or JSON list of requested scopes (HEALTH_CARD, ALLERGIES, CURRENT_MEDS, LAB_REPORTS, RX_RECORDS)
    @Column(nullable = false, length = 500)
    private String requestedScope;

    @Column(length = 500)
    private String grantedScope; // Patient-approved final scope (can be equal or narrower)

    private Integer durationDays; // e.g. 7 days

    // Status: PENDING, ACTIVE, REVOKED, EXPIRED, DENIED
    @Column(nullable = false, length = 30)
    private String status;

    private LocalDateTime grantedAt;
    private LocalDateTime expiresAt;
    private LocalDateTime revokedAt;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
