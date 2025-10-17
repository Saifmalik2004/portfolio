package com.saif.portfolio.service;

import java.time.Instant;
import java.util.Optional;

import com.saif.portfolio.model.PasswordReset;
import com.saif.portfolio.model.User;

public interface PasswordResetService {
    PasswordReset save(PasswordReset reset);
    Optional<PasswordReset> findActiveByUser(User user);
    Optional<PasswordReset> findByTokenHash(String tokenHash);
    void deleteExpiredOrConsumed(Instant before);
}
