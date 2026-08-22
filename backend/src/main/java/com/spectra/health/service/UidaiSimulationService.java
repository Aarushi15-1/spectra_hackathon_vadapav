package com.spectra.health.service;

import com.spectra.health.model.User;
import com.spectra.health.model.enums.Gender;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Random;

@Service
public class UidaiSimulationService {

    private static final String[] FIRST_NAMES_M = {"Vikram", "Rohan", "Siddharth", "Ankit", "Aditya", "Karan", "Manish"};
    private static final String[] FIRST_NAMES_F = {"Pooja", "Neha", "Ananya", "Rhea", "Sneha", "Kavita", "Divya"};
    private static final String[] LAST_NAMES = {"Sharma", "Verma", "Patel", "Mehta", "Iyer", "Nair", "Deshmukh", "Gupta"};

    public User generateMockEkycProfile(String maskedAadhaar, String aadhaarHash, String mobile) {
        Random r = new Random();
        boolean isMale = r.nextBoolean();
        String firstName = isMale ? FIRST_NAMES_M[r.nextInt(FIRST_NAMES_M.length)] : FIRST_NAMES_F[r.nextInt(FIRST_NAMES_F.length)];
        String lastName = LAST_NAMES[r.nextInt(LAST_NAMES.length)];
        String fullName = firstName + " " + lastName;
        String username = (firstName + "." + lastName + (10 + r.nextInt(90))).toLowerCase();

        int birthYear = 1975 + r.nextInt(30);
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
                .email(username + "@outlook.com")
                .passwordHash("password123")
                .maskedAadhaar(maskedAadhaar)
                .aadhaarHash(aadhaarHash)
                .photoUrl("https://api.dicebear.com/7.x/bottts/svg?seed=" + username)
                .isAadhaarVerified(true)
                .build();
    }
}
