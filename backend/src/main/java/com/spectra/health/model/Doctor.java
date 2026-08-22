package com.spectra.health.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "doctors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String doctorId; // e.g. DOC-AIIMS-01

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String speciality; // Cardiology, Internal Medicine, Neurology, Pediatrics, etc.

    @Column(nullable = false)
    private String hospitalName;

    private String qualification; // MD, DM, FRCP
    private Integer experienceYears;
    private String licenseNumber; // Verified Medical Council Registration

    @Builder.Default
    private Boolean isVerified = true; // Verified-Provider Identity Requirement

    private Double rating;
    private Integer reviewCount;
    private Integer consultationFee;
    private String photoUrl;
    private String bio;
}
