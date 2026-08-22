package com.spectra.health.controller;

import com.spectra.health.dto.DashboardStatsDto;
import com.spectra.health.security.JwtService;
import com.spectra.health.service.HealthRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {

    private final HealthRecordService healthRecordService;
    private final JwtService jwtService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getStats(
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
            return ResponseEntity.status(401).build();
        }

        DashboardStatsDto stats = healthRecordService.getDashboardStats(userId);
        return ResponseEntity.ok(stats);
    }
}
