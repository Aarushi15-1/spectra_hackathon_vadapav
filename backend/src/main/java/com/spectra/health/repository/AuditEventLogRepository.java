package com.spectra.health.repository;

import com.spectra.health.model.AuditEventLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditEventLogRepository extends JpaRepository<AuditEventLog, Long> {
    List<AuditEventLog> findByPatientIdOrderByTimestampDesc(String patientId);
    List<AuditEventLog> findTop20ByPatientIdOrderByTimestampDesc(String patientId);
}
