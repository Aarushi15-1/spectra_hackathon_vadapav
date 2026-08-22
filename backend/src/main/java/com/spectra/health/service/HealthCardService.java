package com.spectra.health.service;

import com.spectra.health.dto.HealthCardDto;
import com.spectra.health.model.HealthCard;
import com.spectra.health.model.User;
import com.spectra.health.repository.HealthCardRepository;
import com.spectra.health.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class HealthCardService {

    private final HealthCardRepository healthCardRepository;
    private final UserRepository userRepository;
    private final AuditEventService auditEventService;

    public HealthCardDto getHealthCardForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found: " + userId));

        HealthCard card = healthCardRepository.findByUser(user)
                .orElseGet(() -> createDefaultHealthCard(user));

        return HealthCardDto.fromEntity(card);
    }

    @Transactional
    public HealthCardDto updateHealthCard(Long userId, HealthCardDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found: " + userId));

        HealthCard card = healthCardRepository.findByUser(user)
                .orElseGet(() -> HealthCard.builder().user(user).build());

        if (dto.getAge() != null) card.setAge(dto.getAge());
        if (dto.getWeightKg() != null) card.setWeightKg(dto.getWeightKg());
        if (dto.getHeightCm() != null) card.setHeightCm(dto.getHeightCm());
        if (dto.getBloodGroup() != null) card.setBloodGroup(dto.getBloodGroup());
        if (dto.getAllergies() != null) card.setAllergies(dto.getAllergies());
        if (dto.getChronicConditions() != null) card.setChronicConditions(dto.getChronicConditions());
        if (dto.getCurrentMedications() != null) card.setCurrentMedications(dto.getCurrentMedications());
        if (dto.getPrimaryContact() != null) card.setPrimaryContact(dto.getPrimaryContact());
        if (dto.getEmergencyContactName() != null) card.setEmergencyContactName(dto.getEmergencyContactName());
        if (dto.getEmergencyContactPhone() != null) card.setEmergencyContactPhone(dto.getEmergencyContactPhone());
        if (dto.getEmergencyContactRelation() != null) card.setEmergencyContactRelation(dto.getEmergencyContactRelation());

        HealthCard saved = healthCardRepository.save(card);

        auditEventService.logEvent(
                user.getPatientId(),
                user.getPatientId(),
                user.getFullName(),
                "PATIENT",
                "RECORD_UPLOADED",
                "HealthCard",
                "Patient summary update",
                "SUCCESS",
                "Patient updated HealthCard emergency details and summary."
        );

        return HealthCardDto.fromEntity(saved);
    }

    public HealthCard createDefaultHealthCard(User user) {
        HealthCard card = HealthCard.builder()
                .user(user)
                .age(29)
                .weightKg(71.5)
                .heightCm(176.0)
                .bloodGroup("O+")
                .allergies("Penicillin, Dust mites")
                .chronicConditions("Stage 1 Hypertension (Controlled)")
                .currentMedications("Telmisartan 40mg OD")
                .primaryContact(user.getPhone())
                .emergencyContactName("Pooja Sharma")
                .emergencyContactPhone("+91 9820199442")
                .emergencyContactRelation("Spouse")
                .build();
        return healthCardRepository.save(card);
    }
}
