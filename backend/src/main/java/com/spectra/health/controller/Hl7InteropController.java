package com.spectra.health.controller;

import com.spectra.health.dto.Hl7MessageDto;
import com.spectra.health.service.Hl7InteropService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/interop")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class Hl7InteropController {

    private final Hl7InteropService hl7InteropService;

    /**
     * Section 16: HL7 V2 to FHIR R4 Transformation Pipeline Endpoint
     */
    @PostMapping("/hl7v2-to-fhir")
    public ResponseEntity<Hl7MessageDto> transformHl7V2ToFhir(@RequestBody(required = false) Map<String, String> body) {
        String rawHl7 = body != null ? body.get("rawHl7V2Message") : null;
        Hl7MessageDto dto = hl7InteropService.transformHl7V2ToFhir(rawHl7);
        return ResponseEntity.ok(dto);
    }
}
