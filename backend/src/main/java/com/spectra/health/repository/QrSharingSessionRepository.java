package com.spectra.health.repository;

import com.spectra.health.model.QrSharingSession;
import com.spectra.health.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface QrSharingSessionRepository extends JpaRepository<QrSharingSession, Long> {
    Optional<QrSharingSession> findBySessionToken(String sessionToken);
    Optional<QrSharingSession> findTopByUserAndStatusOrderByCreatedAtDesc(User user, String status);
}
