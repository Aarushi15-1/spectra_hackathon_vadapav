package com.spectra.health.model;

import com.spectra.health.model.enums.AuthMethod;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "otp_sessions", indexes = {
    @Index(name = "idx_txn_id", columnList = "txnId", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String txnId;

    @Column(nullable = false)
    private String identifier; // Raw ABHA number or Aadhaar number entered

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuthMethod authMethod;

    @Column(nullable = false)
    private String otpCode; // 6-digit OTP code

    @Column(length = 256)
    private String otpHash; // PBKDF2WithHmacSHA256 hash

    private String maskedMobile;

    @Column(length = 4000)
    private String mockProfileJson; // Simulated ABDM/UIDAI eKYC payload

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Builder.Default
    private Boolean isVerified = false;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
