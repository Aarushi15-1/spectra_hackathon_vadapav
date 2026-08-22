package com.spectra.health.dto;

import com.spectra.health.model.AccessAuthorization;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccessAuthorizationDto {
    private Long id;
    private Long doctorId;
    private String doctorName;
    private String doctorSpeciality;
    private String hospitalName;
    private String licenseNumber;
    private Boolean isDoctorVerified;
    private String purpose;
    private String requestedScope;
    private String grantedScope;
    private Integer durationDays;
    private String status; // PENDING, ACTIVE, REVOKED, EXPIRED
    private LocalDateTime grantedAt;
    private LocalDateTime expiresAt;
    private LocalDateTime revokedAt;

    public static AccessAuthorizationDto fromEntity(AccessAuthorization entity) {
        if (entity == null) return null;
        return AccessAuthorizationDto.builder()
                .id(entity.getId())
                .doctorId(entity.getDoctor() != null ? entity.getDoctor().getId() : null)
                .doctorName(entity.getDoctor() != null ? entity.getDoctor().getFullName() : null)
                .doctorSpeciality(entity.getDoctor() != null ? entity.getDoctor().getSpeciality() : null)
                .hospitalName(entity.getDoctor() != null ? entity.getDoctor().getHospitalName() : null)
                .licenseNumber(entity.getDoctor() != null ? entity.getDoctor().getLicenseNumber() : null)
                .isDoctorVerified(entity.getDoctor() != null ? entity.getDoctor().getIsVerified() : false)
                .purpose(entity.getPurpose())
                .requestedScope(entity.getRequestedScope())
                .grantedScope(entity.getGrantedScope())
                .durationDays(entity.getDurationDays())
                .status(entity.getStatus())
                .grantedAt(entity.getGrantedAt())
                .expiresAt(entity.getExpiresAt())
                .revokedAt(entity.getRevokedAt())
                .build();
    }
}
