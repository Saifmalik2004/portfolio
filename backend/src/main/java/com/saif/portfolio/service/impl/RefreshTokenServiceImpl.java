package com.saif.portfolio.service.impl;

import java.time.Instant;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.saif.portfolio.model.RefreshToken;
import com.saif.portfolio.repository.RefreshTokenRepository;
import com.saif.portfolio.service.RefreshTokenService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final RefreshTokenRepository repository;

    @Override
    @Transactional
    public RefreshToken save(RefreshToken token) {
        if (token.getTokenHash() == null || token.getTokenHash().isBlank()) {
            throw new IllegalArgumentException("Token hash cannot be empty");
        }
        return repository.save(token);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<RefreshToken> findByTokenHash(String tokenHash) {
        return repository.findByTokenHash(tokenHash)
                .filter(rt -> !rt.getRevoked() && rt.getExpiresAt().isAfter(Instant.now()));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<RefreshToken> findActiveByUserIdAndTokenHash(Long userId, String tokenHash, Instant now) {
        return repository.findActiveByUserIdAndTokenHash(userId, tokenHash, now);
    }

    @Override
    @Transactional
    public void revokeAllByUserId(Long userId) {
        repository.revokeAllByUserId(userId);
    }

    @Override
@Transactional
public void revokeAllExcept(Long userId, String currentTokenHash) {
    repository.revokeAllExcept(userId, currentTokenHash);
}


    @Override
    @Transactional
    public void deleteExpiredOrRevoked(Instant before) {
        repository.deleteExpiredOrRevoked(before);
    }

    @Override
    @Transactional(readOnly = true)
    public int countActiveByUserId(Long userId, Instant now) {
        return repository.countActiveByUserId(userId, now);
    }
}