package com.healthbridge.labconnect.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "specimens")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Specimen {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lab_order_id", nullable = false)
    @JsonIgnore
    @ToString.Exclude
    private LabOrder labOrder;

    @NotBlank(message = "Sample type is required")
    private String sampleType;

    @NotBlank(message = "Barcode is required")
    @Column(unique = true, nullable = false)
    private String barcode;

    private LocalDateTime collectedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collected_by_user_id")
    private User collectedBy;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SpecimenStatus status = SpecimenStatus.COLLECTED;
}
