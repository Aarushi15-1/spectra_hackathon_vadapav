package com.spectra.health.dto;

import com.spectra.health.model.QrSharingSession;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QrSessionDto {
    private String sessionToken; // High-entropy opaque reference token (e.g. qr-sess-8fbc92...)
    private String status; // ACTIVE, SCANNED, REQUESTED, APPROVED, DENIED, EXPIRED, REVOKED
    private LocalDateTime expiresAt;
    private long expiresInSeconds;
    private String scannedByDoctorName;
    private String scannedByDoctorSpeciality;
    private String scannedByHospital;

    public static QrSessionDto fromEntity(QrSharingSession entity) {
        if (entity == null) return null;
        long remainingSecs = Math.max(0, java.time.Duration.between(LocalDateTime.now(), entity.getExpiresAt()).getSeconds());
        return QrSessionDto.builder()
                .sessionToken(entity.getSessionToken())
                .status(entity.getStatus())
                .expiresAt(entity.getExpiresAt())
                .expiresInSeconds(remainingSecs)
                .scannedByDoctorName(entity.getScannedByDoctor() != null ? entity.getScannedByDoctor().getFullName() : null)
                .scannedByDoctorSpeciality(entity.getScannedByDoctor() != null ? entity.getScannedByDoctor().getSpeciality() : null)
                .scannedByHospital(entity.getScannedByDoctor() != null ? entity.getScannedByDoctor().getHospitalName() : null)
                .build();
    }
}
