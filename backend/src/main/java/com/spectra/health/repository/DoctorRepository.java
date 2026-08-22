package com.spectra.health.repository;

import com.spectra.health.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByDoctorId(String doctorId);
    List<Doctor> findBySpecialityIgnoreCase(String speciality);
    List<Doctor> findByIsVerifiedTrue();
}
