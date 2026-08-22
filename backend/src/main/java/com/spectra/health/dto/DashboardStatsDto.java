package com.spectra.health.dto;

import lombok.*;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDto {
    private long totalRecords;
    private long prescriptionsCount;
    private long labReportsCount;
    private long consultationsCount;
    private long connectedHospitalsCount;
    private Map<String, String> latestVitals;
    private List<String> connectedFacilities;
}
