package com.spectra.health.controller;

import com.spectra.health.dto.AccessAuthorizationDto;
import com.spectra.health.dto.QrSessionDto;
import com.spectra.health.security.JwtService;
import com.spectra.health.service.QrSharingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/qr")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class QrSharingController {

    private final QrSharingService qrSharingService;
    private final JwtService jwtService;

    /**
     * Section 4: Patient creates temporary high-entropy QR session token (5-min TTL)
     */
    @PostMapping("/create-session")
    public ResponseEntity<QrSessionDto> createSession(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestParam(value = "userId", required = false) Long fallbackUserId) {
        
        Long userId = resolveUserId(authHeader, fallbackUserId);
        QrSessionDto session = qrSharingService.createSharingSession(userId != null ? userId : 1L);
        return ResponseEntity.ok(session);
    }

    /**
     * Section 4 & 5: Verified Doctor scans patient QR code
     */
    @PostMapping("/doctor-scan")
    public ResponseEntity<QrSessionDto> doctorScan(
            @RequestBody Map<String, Object> body) {
        String token = (String) body.get("sessionToken");
        Long doctorId = Long.valueOf(body.getOrDefault("doctorId", 1).toString());

        QrSessionDto result = qrSharingService.doctorScanQr(token, doctorId);
        return ResponseEntity.ok(result);
    }

    /**
     * Section 6: Verified Doctor submits Access Request (Purpose, Requested Scope, Duration)
     */
    @PostMapping("/doctor-request")
    public ResponseEntity<AccessAuthorizationDto> doctorRequest(
            @RequestBody Map<String, Object> body) {
        String token = (String) body.get("sessionToken");
        Long doctorId = Long.valueOf(body.getOrDefault("doctorId", 1).toString());
        String purpose = (String) body.getOrDefault("purpose", "Cardiology consultation and review");
        String scope = (String) body.getOrDefault("requestedScope", "HEALTH_CARD,ALLERGIES,CURRENT_MEDS,CARDIOLOGY_REPORTS");
        int durationDays = Integer.parseInt(body.getOrDefault("durationDays", 7).toString());

        AccessAuthorizationDto auth = qrSharingService.doctorSubmitAccessRequest(token, doctorId, purpose, scope, durationDays);
        return ResponseEntity.ok(auth);
    }

    /**
     * Section 6, 7 & 10: Patient Approves or Denies Doctor Access Request
     */
    @PostMapping("/patient-decision")
    public ResponseEntity<AccessAuthorizationDto> patientDecision(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestParam(value = "userId", required = false) Long fallbackUserId,
            @RequestBody Map<String, Object> body) {
        
        Long userId = resolveUserId(authHeader, fallbackUserId);
        Long authId = Long.valueOf(body.get("authId").toString());
        boolean approve = Boolean.parseBoolean(body.getOrDefault("approve", true).toString());
        String grantedScope = (String) body.get("grantedScope");

        AccessAuthorizationDto result = qrSharingService.patientDecision(authId, userId != null ? userId : 1L, approve, grantedScope);
        return ResponseEntity.ok(result);
    }

    /**
     * Section 11: Patient views active & historical authorizations
     */
    @GetMapping("/authorizations")
    public ResponseEntity<List<AccessAuthorizationDto>> getAuthorizations(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestParam(value = "userId", required = false) Long fallbackUserId) {
        
        Long userId = resolveUserId(authHeader, fallbackUserId);
        List<AccessAuthorizationDto> list = qrSharingService.getAuthorizationsForUser(userId != null ? userId : 1L);
        return ResponseEntity.ok(list);
    }

    /**
     * Section 11: Patient revokes access
     */
    @PostMapping("/revoke/{authId}")
    public ResponseEntity<AccessAuthorizationDto> revokeAccess(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @PathVariable Long authId,
            @RequestParam(value = "userId", required = false) Long fallbackUserId) {
        
        Long userId = resolveUserId(authHeader, fallbackUserId);
        AccessAuthorizationDto revoked = qrSharingService.revokeAuthorization(authId, userId != null ? userId : 1L);
        return ResponseEntity.ok(revoked);
    }

    private Long resolveUserId(String authHeader, Long fallback) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtService.validateToken(token)) {
                return jwtService.extractUserId(token);
            }
        }
        return fallback != null ? fallback : 1L;
    }
}
