package com.spectra.health.dto;

import com.spectra.health.model.enums.AuthMethod;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthVerifyResponse {
    private boolean isNewUser;
    private String token;
    private UserDto user;
    private String message;
    private AuthMethod authMethod;
    private String kycSource; // ABDM_SANDBOX or UIDAI_EKYC
}
