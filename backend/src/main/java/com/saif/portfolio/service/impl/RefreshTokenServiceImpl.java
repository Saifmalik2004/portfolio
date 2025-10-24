package com.saif.portfolio.service.impl;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.saif.portfolio.model.RefreshToken;
import com.saif.portfolio.repository.RefreshTokenRepository;
import com.saif.portfolio.service.RefreshTokenService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
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
    public void deleteExpiredOrRevoked() {
      Instant sevenDaysAgo = Instant.now().minus(7, ChronoUnit.DAYS);
    int deletedCount = repository.deleteExpiredOrRevoked(sevenDaysAgo);
    log.info("Deleted {} old or revoked refresh tokens", deletedCount);
    }

    @Override
    @Transactional(readOnly = true)
    public int countActiveByUserId(Long userId, Instant now) {
        return repository.countActiveByUserId(userId, now);
    }

    @Override
@Transactional
public void deleteByTokenHash(String tokenHash) {
    repository.deleteByTokenHash(tokenHash);
}

}