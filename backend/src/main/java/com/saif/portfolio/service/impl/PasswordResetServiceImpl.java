package com.saif.portfolio.service.impl;

import com.saif.portfolio.model.PasswordReset;
import com.saif.portfolio.model.User;
import com.saif.portfolio.repository.PasswordResetRepository;
import com.saif.portfolio.service.PasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PasswordResetServiceImpl implements PasswordResetService {

    private final PasswordResetRepository repository;

    @Override
    @Transactional
    public PasswordReset save(PasswordReset reset) {
        if (reset.getTokenHash() == null || reset.getTokenHash().isBlank()) {
            throw new IllegalArgumentException("Token hash cannot be empty");
        }
        if (reset.getUser() == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        return repository.save(reset);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PasswordReset> findActiveByUser(User user) {
        return repository.findActiveByUserId(user.getId(), Instant.now());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PasswordReset> findByTokenHash(String tokenHash) {
        return repository.findByTokenHashAndConsumedFalse(tokenHash)
                .filter(pr -> pr.getExpiresAt().isAfter(Instant.now()));
    }

    @Override
    @Transactional
    public void deleteExpiredOrConsumed(Instant before) {
        repository.deleteExpiredOrConsumed(before);
    }
}
