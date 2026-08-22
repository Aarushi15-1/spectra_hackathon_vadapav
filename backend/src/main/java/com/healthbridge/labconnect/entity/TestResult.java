package com.healthbridge.labconnect.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "test_results")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestResult {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_item_id", nullable = false)
    @JsonIgnore
    @ToString.Exclude
    private OrderItem orderItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_parameter_id", nullable = false)
    private TestParameter testParameter;

    @NotBlank(message = "Result value is required")
    @Column(nullable = false)
    private String resultValue;

    @Enumerated(EnumType.STRING)
    private ResultFlag flag;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entered_by_user_id")
    private User enteredBy;

    private LocalDateTime enteredAt;
}
