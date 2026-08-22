package com.spectra.health.service;

import com.spectra.health.dto.AccessAuthorizationDto;
import com.spectra.health.dto.QrSessionDto;
import com.spectra.health.model.*;
import com.spectra.health.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class QrSharingService {

    private final QrSharingSessionRepository qrSessionRepository;
    private final AccessAuthorizationRepository accessAuthRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final AuditEventService auditEventService;

    /**
     * Section 4: Patient generates a temporary, high-entropy opaque QR reference token (5-min TTL)
     */
    @Transactional
    public QrSessionDto createSharingSession(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found: " + userId));

        // Generate opaque token: qr-sess-xxxxxxxxxxxx
        String token = "qr-sess-" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);

        QrSharingSession session = QrSharingSession.builder()
                .user(user)
                .sessionToken(token)
                .status("ACTIVE")
                .expiresAt(LocalDateTime.now().plusMinutes(5)) // 5 minutes TTL
                .build();

        QrSharingSession saved = qrSessionRepository.save(session);

        auditEventService.logEvent(
                user.getPatientId(),
                user.getPatientId(),
                user.getFullName(),
                "PATIENT",
                "QR_GENERATED",
                "QrSessionToken",
                "Patient initiated health sharing",
                "SUCCESS",
                "Patient generated a 5-minute ephemeral QR sharing token (" + token + ")."
        );

        return QrSessionDto.fromEntity(saved);
    }

    /**
     * Section 4 & 5: Verified Doctor scans QR code
     */
    @Transactional
    public QrSessionDto doctorScanQr(String sessionToken, Long doctorId) {
        QrSharingSession session = qrSessionRepository.findBySessionToken(sessionToken)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired QR session"));

        if (session.getExpiresAt().isBefore(LocalDateTime.now())) {
            session.setStatus("EXPIRED");
            qrSessionRepository.save(session);
            throw new IllegalStateException("QR session has expired. Ask patient to refresh QR.");
        }

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found: " + doctorId));

        if (!Boolean.TRUE.equals(doctor.getIsVerified())) {
            throw new IllegalStateException("Access Denied: Doctor account is not verified.");
        }

        session.setScannedByDoctor(doctor);
        session.setStatus("SCANNED");
        QrSharingSession saved = qrSessionRepository.save(session);

        auditEventService.logEvent(
                session.getUser().getPatientId(),
                doctor.getDoctorId(),
                doctor.getFullName(),
                "DOCTOR",
                "QR_SCANNED",
                "QrSessionToken",
                "Doctor scanned QR",
                "SUCCESS",
                "Verified Doctor " + doctor.getFullName() + " scanned patient QR code."
        );

        return QrSessionDto.fromEntity(saved);
    }

    /**
     * Section 6: Doctor submits an Access Request with Purpose, Requested Scope, and Duration
     */
    @Transactional
    public AccessAuthorizationDto doctorSubmitAccessRequest(String sessionToken, Long doctorId, String purpose, String requestedScope, int durationDays) {
        QrSharingSession session = qrSessionRepository.findBySessionToken(sessionToken)
                .orElseThrow(() -> new IllegalArgumentException("Invalid QR session"));

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found: " + doctorId));

        session.setStatus("REQUESTED");
        qrSessionRepository.save(session);

        AccessAuthorization auth = AccessAuthorization.builder()
                .user(session.getUser())
                .doctor(doctor)
                .qrSession(session)
                .purpose(purpose != null ? purpose : "Cardiology consultation and prescription review")
                .requestedScope(requestedScope != null ? requestedScope : "HEALTH_CARD,ALLERGIES,CURRENT_MEDS,CARDIOLOGY_REPORTS")
                .durationDays(durationDays > 0 ? durationDays : 7)
                .status("PENDING")
                .build();

        AccessAuthorization saved = accessAuthRepository.save(auth);

        auditEventService.logEvent(
                session.getUser().getPatientId(),
                doctor.getDoctorId(),
                doctor.getFullName(),
                "DOCTOR",
                "ACCESS_REQUEST_CREATED",
                "ConsentRequest",
                purpose,
                "PENDING",
                "Doctor " + doctor.getFullName() + " requested access for [" + auth.getRequestedScope() + "] for " + auth.getDurationDays() + " days."
        );

        return AccessAuthorizationDto.fromEntity(saved);
    }

    /**
     * Section 6, 7 & 10: Patient Approves or Denies Doctor Access Request
     */
    @Transactional
    public AccessAuthorizationDto patientDecision(Long authId, Long userId, boolean approve, String grantedScope) {
        AccessAuthorization auth = accessAuthRepository.findById(authId)
                .orElseThrow(() -> new IllegalArgumentException("Access request not found: " + authId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        if (!auth.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized decision attempt");
        }

        if (approve) {
            auth.setStatus("ACTIVE");
            auth.setGrantedScope(grantedScope != null && !grantedScope.isBlank() ? grantedScope : auth.getRequestedScope());
            auth.setGrantedAt(LocalDateTime.now());
            auth.setExpiresAt(LocalDateTime.now().plusDays(auth.getDurationDays()));

            if (auth.getQrSession() != null) {
                auth.getQrSession().setStatus("APPROVED");
                qrSessionRepository.save(auth.getQrSession());
            }

            auditEventService.logEvent(
                    user.getPatientId(),
                    user.getPatientId(),
                    user.getFullName(),
                    "PATIENT",
                    "ACCESS_APPROVED",
                    "ConsentAuthorization",
                    auth.getPurpose(),
                    "GRANTED",
                    "Patient approved access for Dr. " + auth.getDoctor().getFullName() + " with scope [" + auth.getGrantedScope() + "] valid for " + auth.getDurationDays() + " days."
            );
        } else {
            auth.setStatus("DENIED");
            if (auth.getQrSession() != null) {
                auth.getQrSession().setStatus("DENIED");
                qrSessionRepository.save(auth.getQrSession());
            }

            auditEventService.logEvent(
                    user.getPatientId(),
                    user.getPatientId(),
                    user.getFullName(),
                    "PATIENT",
                    "ACCESS_DENIED",
                    "ConsentAuthorization",
                    auth.getPurpose(),
                    "DENIED",
                    "Patient denied access request from Dr. " + auth.getDoctor().getFullName() + "."
            );
        }

        AccessAuthorization saved = accessAuthRepository.save(auth);
        return AccessAuthorizationDto.fromEntity(saved);
    }

    /**
     * Section 11: Patient revokes access
     */
    @Transactional
    public AccessAuthorizationDto revokeAuthorization(Long authId, Long userId) {
        AccessAuthorization auth = accessAuthRepository.findById(authId)
                .orElseThrow(() -> new IllegalArgumentException("Authorization not found: " + authId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!auth.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized revocation");
        }

        auth.setStatus("REVOKED");
        auth.setRevokedAt(LocalDateTime.now());
        AccessAuthorization saved = accessAuthRepository.save(auth);

        auditEventService.logEvent(
                user.getPatientId(),
                user.getPatientId(),
                user.getFullName(),
                "PATIENT",
                "ACCESS_REVOKED",
                "ConsentAuthorization",
                "Patient Revocation",
                "REVOKED",
                "Patient revoked data access for Dr. " + auth.getDoctor().getFullName() + " immediately."
        );

        return AccessAuthorizationDto.fromEntity(saved);
    }

    public List<AccessAuthorizationDto> getAuthorizationsForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return accessAuthRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(AccessAuthorizationDto::fromEntity)
                .collect(Collectors.toList());
    }
}
