package com.spectra.health.service;

import com.spectra.health.dto.AppointmentDto;
import com.spectra.health.dto.DoctorDto;
import com.spectra.health.model.Appointment;
import com.spectra.health.model.Doctor;
import com.spectra.health.model.User;
import com.spectra.health.repository.AppointmentRepository;
import com.spectra.health.repository.DoctorRepository;
import com.spectra.health.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final AuditEventService auditEventService;

    public List<DoctorDto> getAllVerifiedDoctors(String speciality) {
        List<Doctor> list;
        if (speciality != null && !speciality.isBlank() && !speciality.equalsIgnoreCase("ALL")) {
            list = doctorRepository.findBySpecialityIgnoreCase(speciality);
        } else {
            list = doctorRepository.findByIsVerifiedTrue();
        }
        return list.stream().map(DoctorDto::fromEntity).collect(Collectors.toList());
    }

    public DoctorDto getDoctorById(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found: " + doctorId));
        return DoctorDto.fromEntity(doctor);
    }

    @Transactional
    public AppointmentDto bookAppointment(Long userId, AppointmentDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found: " + userId));

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found: " + dto.getDoctorId()));

        Appointment appt = Appointment.builder()
                .user(user)
                .doctor(doctor)
                .appointmentDate(dto.getAppointmentDate())
                .appointmentTime(dto.getAppointmentTime() != null ? dto.getAppointmentTime() : "10:30 AM")
                .status("SCHEDULED")
                .appointmentType(dto.getAppointmentType() != null ? dto.getAppointmentType() : "SPECIALIST_REVIEW")
                .symptoms(dto.getSymptoms())
                .notes(dto.getNotes())
                .build();

        Appointment saved = appointmentRepository.save(appt);

        auditEventService.logEvent(
                user.getPatientId(),
                doctor.getDoctorId(),
                doctor.getFullName(),
                "DOCTOR",
                "APPOINTMENT_SCHEDULED",
                "Appointment",
                "Consultation Booking",
                "SUCCESS",
                "Patient booked " + appt.getAppointmentType() + " with " + doctor.getFullName() + " for " + appt.getAppointmentDate() + "."
        );

        return AppointmentDto.fromEntity(saved);
    }

    public List<AppointmentDto> getAppointmentsForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found: " + userId));
        return appointmentRepository.findByUserOrderByAppointmentDateDesc(user)
                .stream()
                .map(AppointmentDto::fromEntity)
                .collect(Collectors.toList());
    }
}
