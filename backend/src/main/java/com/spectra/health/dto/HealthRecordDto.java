package com.spectra.health.dto;

import com.spectra.health.model.HealthRecord;
import com.spectra.health.model.enums.RecordType;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthRecordDto {
    private Long id;
    private RecordType recordType;
    private String title;
    private String doctorName;
    private String doctorSpeciality;
    private String facilityName;
    private String hipId;
    private LocalDate recordDate;
    private String summary;
    private String diagnosis;
    private String prescriptionDetails;
    private String labResultsJson;
    private String documentUrl;
    private LocalDateTime createdAt;

    public static HealthRecordDto fromEntity(HealthRecord entity) {
        if (entity == null) return null;
        return HealthRecordDto.builder()
                .id(entity.getId())
                .recordType(entity.getRecordType())
                .title(entity.getTitle())
                .doctorName(entity.getDoctorName())
                .doctorSpeciality(entity.getDoctorSpeciality())
                .facilityName(entity.getFacilityName())
                .hipId(entity.getHipId())
                .recordDate(entity.getRecordDate())
                .summary(entity.getSummary())
                .diagnosis(entity.getDiagnosis())
                .prescriptionDetails(entity.getPrescriptionDetails())
                .labResultsJson(entity.getLabResultsJson())
                .documentUrl(entity.getDocumentUrl())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
