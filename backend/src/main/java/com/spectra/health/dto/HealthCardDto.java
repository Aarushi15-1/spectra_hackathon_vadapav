package com.spectra.health.dto;

import com.spectra.health.model.HealthCard;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthCardDto {
    private Long id;
    private Integer age;
    private Double weightKg;
    private Double heightCm;
    private String bloodGroup;
    private String allergies;
    private String chronicConditions;
    private String currentMedications;
    private String primaryContact;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String emergencyContactRelation;
    private LocalDateTime lastUpdated;

    public static HealthCardDto fromEntity(HealthCard entity) {
        if (entity == null) return null;
        return HealthCardDto.builder()
                .id(entity.getId())
                .age(entity.getAge())
                .weightKg(entity.getWeightKg())
                .heightCm(entity.getHeightCm())
                .bloodGroup(entity.getBloodGroup())
                .allergies(entity.getAllergies())
                .chronicConditions(entity.getChronicConditions())
                .currentMedications(entity.getCurrentMedications())
                .primaryContact(entity.getPrimaryContact())
                .emergencyContactName(entity.getEmergencyContactName())
                .emergencyContactPhone(entity.getEmergencyContactPhone())
                .emergencyContactRelation(entity.getEmergencyContactRelation())
                .lastUpdated(entity.getLastUpdated())
                .build();
    }
}
