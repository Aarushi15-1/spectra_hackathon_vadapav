package com.healthbridge.labconnect.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.UUID;

@Entity
@Table(name = "test_parameters")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestParameter {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "Parameter name is required")
    @Column(nullable = false)
    private String parameterName;

    private String unit;

    private Double minReferenceValue;

    private Double maxReferenceValue;

    private String textReferenceRange;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lab_test_id", nullable = false)
    @JsonIgnore
    @ToString.Exclude
    private LabTest labTest;
}
