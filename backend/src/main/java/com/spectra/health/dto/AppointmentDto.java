package com.spectra.health.dto;

import com.spectra.health.model.Appointment;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentDto {
    private Long id;
    private Long doctorId;
    private String doctorName;
    private String doctorSpeciality;
    private String hospitalName;
    private LocalDate appointmentDate;
    private String appointmentTime;
    private String status;
    private String appointmentType;
    private String symptoms;
    private String notes;
    private LocalDateTime createdAt;

    public static AppointmentDto fromEntity(Appointment entity) {
        if (entity == null) return null;
        return AppointmentDto.builder()
                .id(entity.getId())
                .doctorId(entity.getDoctor() != null ? entity.getDoctor().getId() : null)
                .doctorName(entity.getDoctor() != null ? entity.getDoctor().getFullName() : null)
                .doctorSpeciality(entity.getDoctor() != null ? entity.getDoctor().getSpeciality() : null)
                .hospitalName(entity.getDoctor() != null ? entity.getDoctor().getHospitalName() : null)
                .appointmentDate(entity.getAppointmentDate())
                .appointmentTime(entity.getAppointmentTime())
                .status(entity.getStatus())
                .appointmentType(entity.getAppointmentType())
                .symptoms(entity.getSymptoms())
                .notes(entity.getNotes())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
