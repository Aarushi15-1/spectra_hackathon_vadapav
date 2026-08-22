package com.spectra.health.controller;

import com.spectra.health.dto.HealthCardDto;
import com.spectra.health.security.JwtService;
import com.spectra.health.service.HealthCardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/health-card")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class HealthCardController {

    private final HealthCardService healthCardService;
    private final JwtService jwtService;

    @GetMapping
    public ResponseEntity<HealthCardDto> getHealthCard(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestParam(value = "userId", required = false) Long fallbackUserId) {
        
        Long userId = resolveUserId(authHeader, fallbackUserId);
        HealthCardDto card = healthCardService.getHealthCardForUser(userId != null ? userId : 1L);
        return ResponseEntity.ok(card);
    }

    @PutMapping
    public ResponseEntity<HealthCardDto> updateHealthCard(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestParam(value = "userId", required = false) Long fallbackUserId,
            @RequestBody HealthCardDto dto) {
        
        Long userId = resolveUserId(authHeader, fallbackUserId);
        HealthCardDto updated = healthCardService.updateHealthCard(userId != null ? userId : 1L, dto);
        return ResponseEntity.ok(updated);
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
