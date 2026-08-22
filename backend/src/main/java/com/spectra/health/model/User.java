package com.spectra.health.model;

import com.spectra.health.model.enums.Gender;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_patient_id", columnList = "patientId", unique = true),
    @Index(name = "idx_email", columnList = "email"),
    @Index(name = "idx_phone", columnList = "phone"),
    @Index(name = "idx_aadhaar_hash", columnList = "aadhaarHash")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // HealthBridge Patient ID (e.g. HB-2026-89410) - Primary application-level reference
    @Column(nullable = false, unique = true, length = 50)
    private String patientId;

    @Column(nullable = false)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;

    private LocalDate dob;

    @Column(nullable = false, unique = true)
    private String phone;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash; // PBKDF2WithHmacSHA256 password hash

    // Aadhaar is strictly used during signup verification only (never general login)
    @Column(length = 256)
    private String aadhaarHash; // PBKDF2 hash of Aadhaar for deduplication

    private String maskedAadhaar; // XXXX-XXXX-1234 (display only, never exposed to doctors/labs)

    @Column(length = 500)
    private String photoUrl;

    @Builder.Default
    private Boolean isAadhaarVerified = true;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
