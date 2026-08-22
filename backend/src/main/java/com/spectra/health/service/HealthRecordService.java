package com.spectra.health.service;

import com.spectra.health.dto.DashboardStatsDto;
import com.spectra.health.dto.HealthRecordDto;
import com.spectra.health.model.HealthRecord;
import com.spectra.health.model.User;
import com.spectra.health.model.enums.RecordType;
import com.spectra.health.repository.HealthRecordRepository;
import com.spectra.health.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HealthRecordService {

    private final HealthRecordRepository healthRecordRepository;
    private final UserRepository userRepository;

    public List<HealthRecordDto> getRecordsForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        return healthRecordRepository.findByUserOrderByRecordDateDesc(user)
                .stream()
                .map(HealthRecordDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<HealthRecordDto> getRecordsByType(Long userId, RecordType type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        return healthRecordRepository.findByUserAndRecordTypeOrderByRecordDateDesc(user, type)
                .stream()
                .map(HealthRecordDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public HealthRecordDto createRecord(Long userId, HealthRecordDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        HealthRecord record = HealthRecord.builder()
                .user(user)
                .recordType(dto.getRecordType() != null ? dto.getRecordType() : RecordType.OPD_CONSULTATION)
                .title(dto.getTitle())
                .doctorName(dto.getDoctorName() != null ? dto.getDoctorName() : "Dr. S. K. Ramanathan, MD")
                .doctorSpeciality(dto.getDoctorSpeciality() != null ? dto.getDoctorSpeciality() : "General Medicine")
                .facilityName(dto.getFacilityName() != null ? dto.getFacilityName() : "Apollo Spectra Hospital")
                .hipId(dto.getHipId() != null ? dto.getHipId() : "HIP_APOLLO_01")
                .recordDate(dto.getRecordDate() != null ? dto.getRecordDate() : LocalDate.now())
                .summary(dto.getSummary())
                .diagnosis(dto.getDiagnosis())
                .prescriptionDetails(dto.getPrescriptionDetails())
                .labResultsJson(dto.getLabResultsJson())
                .documentUrl(dto.getDocumentUrl())
                .build();

        HealthRecord saved = healthRecordRepository.save(record);
        return HealthRecordDto.fromEntity(saved);
    }

    @Transactional
    public void seedInitialPatientRecords(User user) {
        List<HealthRecord> initialRecords = List.of(
                HealthRecord.builder()
                        .user(user)
                        .recordType(RecordType.OPD_CONSULTATION)
                        .title("Annual Preventive Health Consultation")
                        .doctorName("Dr. Arvind Sengupta, MD")
                        .doctorSpeciality("Internal Medicine")
                        .facilityName("AIIMS New Delhi")
                        .hipId("HIP_AIIMS_DELHI_001")
                        .recordDate(LocalDate.now().minusDays(14))
                        .summary("Routine health evaluation. Mild seasonal allergies noted. Vitals within normal limits.")
                        .diagnosis("Mild Allergic Rhinitis, Normotensive")
                        .prescriptionDetails("Tab. Cetirizine 10mg OD x 5 days\nTab. Multivitamin 1 OD x 30 days")
                        .build(),

                HealthRecord.builder()
                        .user(user)
                        .recordType(RecordType.LAB_REPORT)
                        .title("Comprehensive Metabolic & Lipid Profile")
                        .doctorName("Dr. Nandita Rao, MD (Pathology)")
                        .doctorSpeciality("Clinical Pathology")
                        .facilityName("Max Super Speciality Hospital")
                        .hipId("HIP_MAX_HEALTH_002")
                        .recordDate(LocalDate.now().minusDays(30))
                        .summary("Complete Blood Count and lipid panel within healthy reference ranges.")
                        .diagnosis("Normal Lipid & Metabolic Panel")
                        .labResultsJson("{\"Hb\": \"14.5 g/dL\", \"Fasting Glucose\": \"92 mg/dL\", \"Total Cholesterol\": \"175 mg/dL\", \"HDL\": \"52 mg/dL\", \"Triglycerides\": \"130 mg/dL\"}")
                        .build(),

                HealthRecord.builder()
                        .user(user)
                        .recordType(RecordType.IMMUNIZATION_RECORD)
                        .title("CoWIN National Immunization Certificate")
                        .doctorName("National Health Mission")
                        .doctorSpeciality("Public Health & Immunization")
                        .facilityName("District Hospital & Urban PHC Network")
                        .hipId("HIP_GOV_NHM_99")
                        .recordDate(LocalDate.of(2023, 11, 15))
                        .summary("Covishield / Covid-19 Dose 1, Dose 2 & Precautionary Dose administered.")
                        .diagnosis("Fully Vaccinated (Universal Immunization)")
                        .build()
        );

        healthRecordRepository.saveAll(initialRecords);
    }

    public DashboardStatsDto getDashboardStats(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        List<HealthRecord> records = healthRecordRepository.findByUserOrderByRecordDateDesc(user);

        long prescriptions = records.stream().filter(r -> r.getRecordType() == RecordType.PRESCRIPTION).count();
        long labs = records.stream().filter(r -> r.getRecordType() == RecordType.LAB_REPORT).count();
        long opd = records.stream().filter(r -> r.getRecordType() == RecordType.OPD_CONSULTATION).count();

        Set<String> facilities = records.stream()
                .map(HealthRecord::getFacilityName)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Map<String, String> latestVitals = new LinkedHashMap<>();
        latestVitals.put("Blood Pressure", "120/80 mmHg");
        latestVitals.put("Heart Rate", "72 bpm");
        latestVitals.put("Blood Glucose (F)", "94 mg/dL");
        latestVitals.put("SpO2", "99%");
        latestVitals.put("BMI", "22.4 kg/m²");

        return DashboardStatsDto.builder()
                .totalRecords(records.size())
                .prescriptionsCount(prescriptions)
                .labReportsCount(labs)
                .consultationsCount(opd)
                .connectedHospitalsCount(Math.max(facilities.size(), 3))
                .connectedFacilities(new ArrayList<>(facilities))
                .latestVitals(latestVitals)
                .build();
    }
}
