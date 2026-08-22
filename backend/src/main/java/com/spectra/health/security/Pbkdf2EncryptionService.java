package com.spectra.health.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.util.HexFormat;

@Service
public class Pbkdf2EncryptionService {

    private final String globalSalt;
    private final int iterations;
    private final int keyLength;
    private final SecureRandom secureRandom = new SecureRandom();

    public Pbkdf2EncryptionService(
            @Value("${app.security.pbkdf2.salt:SpectraHealthSecuredSaltABDM2026!#$}") String globalSalt,
            @Value("${app.security.pbkdf2.iterations:65536}") int iterations,
            @Value("${app.security.pbkdf2.key-length:256}") int keyLength) {
        this.globalSalt = globalSalt;
        this.iterations = iterations;
        this.keyLength = keyLength;
    }

    /**
     * Compute PBKDF2 with HMAC-SHA256 hash for secure matching of Aadhaar / sensitive identifiers.
     */
    public String hashIdentifier(String rawIdentifier) {
        if (rawIdentifier == null) return null;
        String clean = rawIdentifier.replaceAll("[^0-9a-zA-Z]", "");
        return pbkdf2HmacSha256(clean, globalSalt.getBytes(), iterations, keyLength);
    }

    /**
     * Hash OTP with transaction-specific salt using PBKDF2WithHmacSHA256
     */
    public String hashOtp(String otp, String txnId) {
        String saltCombined = globalSalt + ":" + txnId;
        return pbkdf2HmacSha256(otp, saltCombined.getBytes(), 10000, 256);
    }

    /**
     * Constant-time verification of PBKDF2 OTP hash
     */
    public boolean verifyOtp(String enteredOtp, String storedHash, String txnId) {
        if (enteredOtp == null || storedHash == null) return false;
        String computedHash = hashOtp(enteredOtp, txnId);
        return constantTimeEquals(computedHash, storedHash);
    }

    /**
     * Generate secure 6-digit numeric OTP
     */
    public String generate6DigitOtp() {
        int code = 100000 + secureRandom.nextInt(900000);
        return String.valueOf(code);
    }

    /**
     * Format raw 14 digit string into standard ABHA: 12-3456-7890-1234
     */
    public String formatAbhaNumber(String raw) {
        if (raw == null) return "";
        String digits = raw.replaceAll("[^0-9]", "");
        if (digits.length() != 14) return raw;
        return digits.substring(0, 2) + "-" +
               digits.substring(2, 6) + "-" +
               digits.substring(6, 10) + "-" +
               digits.substring(10, 14);
    }

    /**
     * Mask 12 digit Aadhaar: XXXX-XXXX-1234
     */
    public String maskAadhaarNumber(String raw) {
        if (raw == null) return "";
        String digits = raw.replaceAll("[^0-9]", "");
        if (digits.length() < 4) return "XXXX-XXXX-XXXX";
        String last4 = digits.substring(digits.length() - 4);
        return "XXXX-XXXX-" + last4;
    }

    /**
     * Mask Mobile Number: +91 ******4521
     */
    public String maskMobileNumber(String raw) {
        if (raw == null) return "+91 ******0000";
        String digits = raw.replaceAll("[^0-9]", "");
        if (digits.length() < 4) return "+91 ******0000";
        String last4 = digits.substring(digits.length() - 4);
        return "+91 ******" + last4;
    }

    private String pbkdf2HmacSha256(String password, byte[] salt, int iters, int keyLen) {
        try {
            PBEKeySpec spec = new PBEKeySpec(password.toCharArray(), salt, iters, keyLen);
            SecretKeyFactory skf = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
            byte[] hash = skf.generateSecret(spec).getEncoded();
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            throw new RuntimeException("PBKDF2WithHmacSHA256 hashing algorithm failure", e);
        }
    }

    private boolean constantTimeEquals(String a, String b) {
        if (a.length() != b.length()) return false;
        int result = 0;
        for (int i = 0; i < a.length(); i++) {
            result |= a.charAt(i) ^ b.charAt(i);
        }
        return result == 0;
    }
}
