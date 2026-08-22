package com.spectra.health.controller;

import com.spectra.health.dto.AppointmentDto;
import com.spectra.health.dto.DoctorDto;
import com.spectra.health.security.JwtService;
import com.spectra.health.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DoctorController {

    private final DoctorService doctorService;
    private final JwtService jwtService;

    @GetMapping
    public ResponseEntity<List<DoctorDto>> getDoctors(
            @RequestParam(value = "speciality", required = false) String speciality) {
        List<DoctorDto> list = doctorService.getAllVerifiedDoctors(speciality);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{doctorId}")
    public ResponseEntity<DoctorDto> getDoctorById(@PathVariable Long doctorId) {
        DoctorDto doc = doctorService.getDoctorById(doctorId);
        return ResponseEntity.ok(doc);
    }

    @PostMapping("/appointments")
    public ResponseEntity<AppointmentDto> bookAppointment(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestParam(value = "userId", required = false) Long fallbackUserId,
            @RequestBody AppointmentDto dto) {
        
        Long userId = resolveUserId(authHeader, fallbackUserId);
        AppointmentDto saved = doctorService.bookAppointment(userId != null ? userId : 1L, dto);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<AppointmentDto>> getAppointments(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestParam(value = "userId", required = false) Long fallbackUserId) {
        
        Long userId = resolveUserId(authHeader, fallbackUserId);
        List<AppointmentDto> list = doctorService.getAppointmentsForUser(userId != null ? userId : 1L);
        return ResponseEntity.ok(list);
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
