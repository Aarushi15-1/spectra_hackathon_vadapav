package com.spectra.health.repository;

import com.spectra.health.model.HealthRecord;
import com.spectra.health.model.User;
import com.spectra.health.model.enums.RecordType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthRecordRepository extends JpaRepository<HealthRecord, Long> {
    List<HealthRecord> findByUserOrderByRecordDateDesc(User user);
    List<HealthRecord> findByUserAndRecordTypeOrderByRecordDateDesc(User user, RecordType recordType);
    long countByUser(User user);
}
