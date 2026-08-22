package com.spectra.health.repository;

import com.spectra.health.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByPatientId(String patientId);
    Optional<User> findByEmail(String email);
    Optional<User> findByPhone(String phone);
    Optional<User> findByAadhaarHash(String aadhaarHash);
    
    // Support lookup by either email or phone for normal login
    Optional<User> findByEmailOrPhone(String email, String phone);
}
