package com.spectra.health.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.spectra.health.model.enums.RecordType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "health_records", indexes = {
    @Index(name = "idx_user_record", columnList = "user_id, recordDate")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RecordType recordType;

    @Column(nullable = false)
    private String title;

    private String doctorName;
    private String doctorSpeciality;
    private String facilityName;
    private String hipId; // Health Information Provider ID (e.g. HIP_AIIMS_DELHI)

    @Column(nullable = false)
    private LocalDate recordDate;

    @Column(length = 1000)
    private String summary;

    private String diagnosis;

    @Column(length = 2000)
    private String prescriptionDetails; // Rx Medicines / Dosages

    @Column(length = 2000)
    private String labResultsJson; // Lab values (e.g. Hb: 14.2 g/dL, Fasting Sugar: 95 mg/dL)

    private String documentUrl;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
