package com.healthbridge.labconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderSummaryDto {
    private String orderId;
    private String patientName;
    private String tests;
    private String date;
    private String status;

    public OrderSummaryDto() {
    }

    public OrderSummaryDto(String orderId, String patientName, String tests, String date, String status) {
        this.orderId = orderId;
        this.patientName = patientName;
        this.tests = tests;
        this.date = date;
        this.status = status;
    }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getTests() { return tests; }
    public void setTests(String tests) { this.tests = tests; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
