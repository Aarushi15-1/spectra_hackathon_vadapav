package com.spectra.health.dto;

import com.spectra.health.model.Doctor;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorDto {
    private Long id;
    private String doctorId;
    private String fullName;
    private String speciality;
    private String hospitalName;
    private String qualification;
    private Integer experienceYears;
    private String licenseNumber;
    private Boolean isVerified;
    private Double rating;
    private Integer reviewCount;
    private Integer consultationFee;
    private String photoUrl;
    private String bio;

    public static DoctorDto fromEntity(Doctor entity) {
        if (entity == null) return null;
        return DoctorDto.builder()
                .id(entity.getId())
                .doctorId(entity.getDoctorId())
                .fullName(entity.getFullName())
                .speciality(entity.getSpeciality())
                .hospitalName(entity.getHospitalName())
                .qualification(entity.getQualification())
                .experienceYears(entity.getExperienceYears())
                .licenseNumber(entity.getLicenseNumber())
                .isVerified(entity.getIsVerified())
                .rating(entity.getRating())
                .reviewCount(entity.getReviewCount())
                .consultationFee(entity.getConsultationFee())
                .photoUrl(entity.getPhotoUrl())
                .bio(entity.getBio())
                .build();
    }
}
