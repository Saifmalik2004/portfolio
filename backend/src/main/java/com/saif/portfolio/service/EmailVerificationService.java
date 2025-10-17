package com.saif.portfolio.service;

import com.saif.portfolio.model.EmailVerification;
import com.saif.portfolio.model.User;
import java.time.Instant;
import java.util.Optional;

public interface EmailVerificationService {
    EmailVerification save(EmailVerification verification);
    Optional<EmailVerification> findActiveByUser(User user, Instant now);
    Optional<EmailVerification> findByOtpHash(String otpHash);
    void deleteExpiredOrConsumed(Instant before);
}