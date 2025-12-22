package com.saif.portfolio.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.HexFormat;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SecurityUtil {

    private final PasswordEncoder encoder; // BCrypt
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    public String maskEmail(String email) {
        int index = email.indexOf("@");
        if (index <= 2) return "***" + email.substring(index);
        return email.substring(0, 2) + "***" + email.substring(index);
    }

    // Password hashing
    public String hashPassword(String raw) {
        return encoder.encode(raw);
    }

    public boolean matchesPassword(String raw, String hashed) {
        return encoder.matches(raw, hashed);
    }

    public String hashToken(String raw) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(raw.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    public boolean matchesToken(String raw, String hashedHex) {
        String candidateHash = hashToken(raw);
        return java.security.MessageDigest.isEqual(candidateHash.getBytes(StandardCharsets.UTF_8),
                                                   hashedHex.getBytes(StandardCharsets.UTF_8));
    }

    // OTP generator using SecureRandom for cryptographic safety
    public String generateOtp(int length) {
        StringBuilder otp = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            otp.append(SECURE_RANDOM.nextInt(10));
        }
        return otp.toString();
    }
}
