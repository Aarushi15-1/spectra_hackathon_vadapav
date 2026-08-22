package com.spectra.health.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthVerifyRequest {

    @NotBlank(message = "txnId is required")
    private String txnId;

    @NotBlank(message = "otp is required")
    private String otp;
}
