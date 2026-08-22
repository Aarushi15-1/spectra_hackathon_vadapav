package com.healthbridge.labconnect.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "lab_tests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LabTest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "Test code is required")
    @Column(unique = true, nullable = false)
    private String testCode;

    @NotBlank(message = "Test name is required")
    @Column(nullable = false)
    private String testName;

    private String category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "Price is required")
    @PositiveOrZero(message = "Price must be non-negative")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    private Boolean isActive = true;

    @OneToMany(mappedBy = "labTest", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TestParameter> parameters = new ArrayList<>();
}
