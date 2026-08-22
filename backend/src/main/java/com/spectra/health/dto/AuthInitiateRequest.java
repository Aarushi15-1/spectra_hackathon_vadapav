package com.spectra.health.dto;

import com.spectra.health.model.enums.AuthMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthInitiateRequest {

    @NotNull(message = "authMethod is required (ABHA_NUMBER or AADHAAR)")
    private AuthMethod authMethod;

    @NotBlank(message = "identifier (ABHA number or Aadhaar number) is required")
    private String identifier;
}
