package com.spectra.health.service;

import com.spectra.health.model.User;
import com.spectra.health.model.enums.Gender;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Random;

@Service
public class AbdmSimulationService {

    private static final String[] FIRST_NAMES_M = {"Aarav", "Kabir", "Arjun", "Reyansh", "Vihaan", "Aditya", "Rudra"};
    private static final String[] FIRST_NAMES_F = {"Ananya", "Diya", "Saanvi", "Aadhya", "Pari", "Isha", "Tara"};
    private static final String[] LAST_NAMES = {"Sharma", "Verma", "Kapoor", "Chatterjee", "Bose", "Menon", "Reddy", "Singhania"};

    public User generateMockAbdmProfile(String abhaNumber, String abhaHash, String mobile) {
        Random r = new Random();
        boolean isMale = r.nextBoolean();
        String firstName = isMale ? FIRST_NAMES_M[r.nextInt(FIRST_NAMES_M.length)] : FIRST_NAMES_F[r.nextInt(FIRST_NAMES_F.length)];
        String lastName = LAST_NAMES[r.nextInt(LAST_NAMES.length)];
        String fullName = firstName + " " + lastName;
        String username = (firstName + "." + lastName + (10 + r.nextInt(90))).toLowerCase();

        int birthYear = 1980 + r.nextInt(25);
        int birthMonth = 1 + r.nextInt(12);
        int birthDay = 1 + r.nextInt(28);
        LocalDate dob = LocalDate.of(birthYear, birthMonth, birthDay);

        int randomId = 10000 + r.nextInt(89999);
        String patientId = "HB-2026-" + randomId;

        return User.builder()
                .patientId(patientId)
                .fullName(fullName)
                .gender(isMale ? Gender.MALE : Gender.FEMALE)
                .dob(dob)
                .phone(mobile)
                .email(username + "@healthbridge.in")
                .passwordHash("password123")
                .maskedAadhaar("XXXX-XXXX-" + (1000 + r.nextInt(9000)))
                .aadhaarHash(abhaHash)
                .photoUrl("https://api.dicebear.com/7.x/bottts/svg?seed=" + username)
                .isAadhaarVerified(true)
                .build();
    }
}
