package com.spectra.health.dto;

import com.spectra.health.model.enums.AuthMethod;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthInitiateResponse {
    private String txnId;
    private AuthMethod authMethod;
    private String maskedIdentifier;
    private String maskedMobile;
    private String message;
    private String demoOtp; // Provided for frictionless hackathon demonstration
    private int expiresInSeconds;
}
