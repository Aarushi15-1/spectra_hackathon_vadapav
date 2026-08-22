package com.spectra.health.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignupRequest {

    @NotBlank(message = "Aadhaar TxnId is required from verified OTP step")
    private String txnId;

    @NotBlank(message = "Full Name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Password is required")
    private String password;

    private String gender;
    private String dob;
    private String bloodGroup;
    private Double weightKg;
    private Double heightCm;
    private String allergies;
    private String emergencyContactName;
    private String emergencyContactPhone;
}
