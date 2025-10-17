package com.saif.portfolio.service.impl;

import java.time.Instant;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.saif.portfolio.model.EmailVerification;
import com.saif.portfolio.model.User;
import com.saif.portfolio.repository.EmailVerificationRepository;
import com.saif.portfolio.service.EmailVerificationService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailVerificationServiceImpl implements EmailVerificationService {

    private final EmailVerificationRepository repository;

    @Override
    @Transactional
    public EmailVerification save(EmailVerification verification) {
        if (verification.getOtpHash() == null || verification.getOtpHash().isBlank()) {
            throw new IllegalArgumentException("OTP hash cannot be empty");
        }
        if (verification.getUser() == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        return repository.save(verification);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<EmailVerification> findActiveByUser(User user, Instant now) {
        return repository.findByUserAndConsumedFalseAndNotExpired(user, now);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<EmailVerification> findByOtpHash(String otpHash) {
        return repository.findByOtpHashAndConsumedFalse(otpHash);
                
    }

    @Override
    @Transactional
    public void deleteExpiredOrConsumed(Instant before) {
        repository.deleteByConsumedTrueOrExpiresAtBefore(before);
    }
}