package com.healthbridge.labconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private long totalPatients;
    private long activeOrders;
    private long pendingVerification;
    private long reportsReleasedToday;
    private List<Map<String, String>> pipelineStages;

    public DashboardStatsResponse() {
    }

    public DashboardStatsResponse(long totalPatients, long activeOrders, long pendingVerification, long reportsReleasedToday, List<Map<String, String>> pipelineStages) {
        this.totalPatients = totalPatients;
        this.activeOrders = activeOrders;
        this.pendingVerification = pendingVerification;
        this.reportsReleasedToday = reportsReleasedToday;
        this.pipelineStages = pipelineStages;
    }

    public long getTotalPatients() { return totalPatients; }
    public void setTotalPatients(long totalPatients) { this.totalPatients = totalPatients; }

    public long getActiveOrders() { return activeOrders; }
    public void setActiveOrders(long activeOrders) { this.activeOrders = activeOrders; }

    public long getPendingVerification() { return pendingVerification; }
    public void setPendingVerification(long pendingVerification) { this.pendingVerification = pendingVerification; }

    public long getReportsReleasedToday() { return reportsReleasedToday; }
    public void setReportsReleasedToday(long reportsReleasedToday) { this.reportsReleasedToday = reportsReleasedToday; }

    public List<Map<String, String>> getPipelineStages() { return pipelineStages; }
    public void setPipelineStages(List<Map<String, String>> pipelineStages) { this.pipelineStages = pipelineStages; }
}
