package com.spectra.health.repository;

import com.spectra.health.model.OtpSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OtpSessionRepository extends JpaRepository<OtpSession, Long> {
    Optional<OtpSession> findByTxnId(String txnId);
    void deleteByExpiresAtBefore(LocalDateTime time);
}
