package com.spectra.health.repository;

import com.spectra.health.model.HealthCard;
import com.spectra.health.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HealthCardRepository extends JpaRepository<HealthCard, Long> {
    Optional<HealthCard> findByUser(User user);
}
