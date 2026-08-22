package com.spectra.health.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "qr_sharing_sessions", indexes = {
    @Index(name = "idx_qr_token", columnList = "sessionToken", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QrSharingSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    // High-entropy opaque reference token (e.g. qr-sess-9f8e12a7bc41)
    @Column(nullable = false, unique = true, length = 100)
    private String sessionToken;

    // Status: ACTIVE, SCANNED, REQUESTED, APPROVED, DENIED, EXPIRED, REVOKED
    @Column(nullable = false, length = 30)
    private String status;

    @ManyToOne
    @JoinColumn(name = "scanned_by_doctor_id")
    private Doctor scannedByDoctor;

    @Column(nullable = false)
    private LocalDateTime expiresAt; // Practical 5-minute TTL

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
