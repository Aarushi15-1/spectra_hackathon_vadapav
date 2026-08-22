package com.spectra.health.dto;

import com.spectra.health.model.User;
import com.spectra.health.model.enums.Gender;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Long id;
    private String patientId; // e.g. HB-2026-89410
    private String fullName;
    private Gender gender;
    private LocalDate dob;
    private String phone;
    private String email;
    private String maskedAadhaar;
    private String photoUrl;
    private Boolean isAadhaarVerified;

    public static UserDto fromEntity(User user) {
        if (user == null) return null;
        return UserDto.builder()
                .id(user.getId())
                .patientId(user.getPatientId())
                .fullName(user.getFullName())
                .gender(user.getGender())
                .dob(user.getDob())
                .phone(user.getPhone())
                .email(user.getEmail())
                .maskedAadhaar(user.getMaskedAadhaar())
                .photoUrl(user.getPhotoUrl())
                .isAadhaarVerified(user.getIsAadhaarVerified())
                .build();
    }
}
