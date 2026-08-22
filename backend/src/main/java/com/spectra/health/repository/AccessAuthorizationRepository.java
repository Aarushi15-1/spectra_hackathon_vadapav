package com.spectra.health.repository;

import com.spectra.health.model.AccessAuthorization;
import com.spectra.health.model.Doctor;
import com.spectra.health.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccessAuthorizationRepository extends JpaRepository<AccessAuthorization, Long> {
    List<AccessAuthorization> findByUserOrderByCreatedAtDesc(User user);
    List<AccessAuthorization> findByUserAndStatusOrderByCreatedAtDesc(User user, String status);
    Optional<AccessAuthorization> findByUserAndDoctorAndStatus(User user, Doctor doctor, String status);
}
