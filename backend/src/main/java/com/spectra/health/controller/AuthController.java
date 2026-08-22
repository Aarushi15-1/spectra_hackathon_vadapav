package com.spectra.health.controller;

import com.spectra.health.dto.*;
import com.spectra.health.security.JwtService;
import com.spectra.health.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    /**
     * Section 2.1: Step 1 of Signup - Aadhaar OTP Dispatch
     */
    @PostMapping("/signup/initiate-aadhaar")
    public ResponseEntity<AuthInitiateResponse> initiateAadhaarSignup(@RequestBody AuthInitiateRequest request) {
        AuthInitiateResponse res = authService.initiateAadhaarSignup(request.getIdentifier());
        return ResponseEntity.ok(res);
    }

    /**
     * Section 2.1: Step 2 of Signup - Verify Aadhaar OTP
     */
    @PostMapping("/signup/verify-aadhaar")
    public ResponseEntity<Boolean> verifyAadhaarOtp(@RequestBody AuthVerifyRequest request) {
        boolean valid = authService.verifyAadhaarOtp(request.getTxnId(), request.getOtp());
        return ResponseEntity.ok(valid);
    }

    /**
     * Section 2.1 & 2.3: Step 3 of Signup - Create Account & HealthBridge Patient ID (HB-2026-XXXXX)
     */
    @PostMapping("/signup/complete")
    public ResponseEntity<AuthVerifyResponse> completeSignup(@Valid @RequestBody SignupRequest request) {
        AuthVerifyResponse res = authService.completeSignup(request);
        return ResponseEntity.ok(res);
    }

    /**
     * Section 2.2: Normal Patient Login (Email or Phone + Password) - No Aadhaar required
     */
    @PostMapping("/login")
    public ResponseEntity<AuthVerifyResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthVerifyResponse res = authService.login(request);
        return ResponseEntity.ok(res);
    }

    /**
     * Get Current Authenticated Patient Profile
     */
    @GetMapping("/me")
    public ResponseEntity<UserDto> getMe(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestParam(value = "userId", required = false) Long fallbackUserId) {
        
        Long userId = fallbackUserId;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtService.validateToken(token)) {
                userId = jwtService.extractUserId(token);
            }
        }

        if (userId == null) {
            userId = 1L; // Demo fallback
        }

        UserDto user = authService.getCurrentUser(userId);
        return ResponseEntity.ok(user);
    }
}
