package com.healthbridge.labconnect.controller;

import com.healthbridge.labconnect.dto.HealthResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public HealthResponse getHealthStatus() {
        return new HealthResponse("HealthBridge LabConnect backend is running");
    }
}
