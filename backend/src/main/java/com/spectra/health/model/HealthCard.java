package com.spectra.health.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "health_cards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnore
    private User user;

    private Integer age;
    private Double weightKg;
    private Double heightCm;
    private String bloodGroup;

    @Column(length = 1000)
    private String allergies; // Comma-separated or JSON list of allergies

    @Column(length = 1000)
    private String chronicConditions; // Comma-separated or JSON list

    @Column(length = 1000)
    private String currentMedications; // Comma-separated or JSON list

    private String primaryContact;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String emergencyContactRelation;

    @UpdateTimestamp
    private LocalDateTime lastUpdated;
}
