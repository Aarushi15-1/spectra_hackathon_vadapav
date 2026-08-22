package com.spectra.health.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginRequest {

    @NotBlank(message = "Email or Phone Number is required")
    private String emailOrPhone;

    @NotBlank(message = "Password is required")
    private String password;
}
