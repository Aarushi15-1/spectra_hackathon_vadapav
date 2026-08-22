package com.healthbridge.labconnect.controller;

import com.healthbridge.labconnect.dto.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class LabConnectApiController {

    @GetMapping("/dashboard/stats")
    public DashboardStatsResponse getDashboardStats() {
        List<Map<String, String>> pipeline = List.of(
            Map.of("label", "PENDING", "desc", "Order Created", "color", "#64748b", "bg", "#f1f5f9"),
            Map.of("label", "SAMPLE_COLLECTED", "desc", "Specimen Drawn", "color", "#ea580c", "bg", "#ffedd5"),
            Map.of("label", "IN_ANALYSIS", "desc", "Lab Processing", "color", "#d97706", "bg", "#fef3c7"),
            Map.of("label", "RESULT_READY", "desc", "Values Entered", "color", "#e11d48", "bg", "#ffe4e6"),
            Map.of("label", "VERIFIED", "desc", "Pathologist Approved", "color", "#059669", "bg", "#d1fae5"),
            Map.of("label", "COMPLETED", "desc", "Report Delivered", "color", "#10b981", "bg", "#ecfdf5")
        );

        return new DashboardStatsResponse(1248L, 42L, 18L, 156L, pipeline);
    }

    @GetMapping("/patients")
    public List<PatientDto> getPatients() {
        return List.of(
            new PatientDto("PAT-1001", "Rahul Sharma", 34, "MALE", "O+", "+91 98765 43210", 4, "2026-08-20"),
            new PatientDto("PAT-1002", "Priya Patel", 29, "FEMALE", "A+", "+91 98123 45678", 2, "2026-08-22"),
            new PatientDto("PAT-1003", "Amit Verma", 52, "MALE", "B+", "+91 97654 32109", 6, "2026-08-19"),
            new PatientDto("PAT-1004", "Sunita Rao", 45, "FEMALE", "AB+", "+91 99887 76655", 1, "2026-08-15"),
            new PatientDto("PAT-1005", "Vikram Singh", 38, "MALE", "O-", "+91 91234 56789", 3, "2026-08-10")
        );
    }

    @GetMapping("/tests")
    public List<LabTestDto> getLabTests() {
        return List.of(
            new LabTestDto("CBC001", "Complete Blood Count (CBC)", "Hematology", new BigDecimal("450.00"), 14, "6 Hours", true),
            new LabTestDto("LIP002", "Lipid Profile", "Biochemistry", new BigDecimal("650.00"), 6, "12 Hours", true),
            new LabTestDto("LFT003", "Liver Function Test (LFT)", "Biochemistry", new BigDecimal("800.00"), 9, "12 Hours", true),
            new LabTestDto("KFT004", "Kidney Function Test (KFT)", "Biochemistry", new BigDecimal("750.00"), 7, "8 Hours", true),
            new LabTestDto("HBA005", "HbA1c (Glycated Hemoglobin)", "Endocrinology", new BigDecimal("550.00"), 2, "4 Hours", true),
            new LabTestDto("THY006", "Thyroid Profile (T3, T4, TSH)", "Endocrinology", new BigDecimal("600.00"), 3, "24 Hours", true)
        );
    }

    @GetMapping("/orders/recent")
    public List<OrderSummaryDto> getRecentOrders() {
        return List.of(
            new OrderSummaryDto("ORD-9821", "Rahul Sharma", "CBC, Lipid Profile", "Today, 09:30 AM", "IN_ANALYSIS"),
            new OrderSummaryDto("ORD-9820", "Priya Patel", "Liver Function Test (LFT)", "Today, 08:45 AM", "RESULT_READY"),
            new OrderSummaryDto("ORD-9819", "Amit Verma", "HbA1c, Fasting Blood Sugar", "Today, 08:15 AM", "VERIFIED"),
            new OrderSummaryDto("ORD-9818", "Sunita Rao", "Thyroid Profile (T3, T4, TSH)", "Yesterday, 04:20 PM", "COMPLETED")
        );
    }
}
