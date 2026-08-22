package com.spectra.health.controller;

import com.spectra.health.dto.HealthRecordDto;
import com.spectra.health.model.enums.RecordType;
import com.spectra.health.security.JwtService;
import com.spectra.health.service.HealthRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/records")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class HealthRecordController {

    private final HealthRecordService healthRecordService;
    private final JwtService jwtService;

    @GetMapping
    public ResponseEntity<List<HealthRecordDto>> getRecords(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestParam(value = "userId", required = false) Long fallbackUserId,
            @RequestParam(value = "type", required = false) RecordType type) {
        
        Long userId = resolveUserId(authHeader, fallbackUserId);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        List<HealthRecordDto> list = type != null ?
                healthRecordService.getRecordsByType(userId, type) :
                healthRecordService.getRecordsForUser(userId);

        return ResponseEntity.ok(list);
    }

    @PostMapping
    public ResponseEntity<HealthRecordDto> createRecord(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestParam(value = "userId", required = false) Long fallbackUserId,
            @RequestBody HealthRecordDto dto) {
        
        Long userId = resolveUserId(authHeader, fallbackUserId);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }

        HealthRecordDto created = healthRecordService.createRecord(userId, dto);
        return ResponseEntity.ok(created);
    }

    private Long resolveUserId(String authHeader, Long fallback) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtService.validateToken(token)) {
                return jwtService.extractUserId(token);
            }
        }
        return fallback;
    }
}
