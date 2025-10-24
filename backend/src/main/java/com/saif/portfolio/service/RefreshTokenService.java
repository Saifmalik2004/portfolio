package com.saif.portfolio.service;

import java.time.Instant;
import java.util.Optional;

import com.saif.portfolio.model.RefreshToken;

public interface RefreshTokenService {
    RefreshToken save(RefreshToken token);
    Optional<RefreshToken> findByTokenHash(String tokenHash);
    Optional<RefreshToken> findActiveByUserIdAndTokenHash(Long userId, String tokenHash, Instant now);
    void revokeAllByUserId(Long userId);
    void deleteExpiredOrRevoked();
    void revokeAllExcept(Long userId, String currentTokenHash);
    int countActiveByUserId(Long userId, Instant now);
    void deleteByTokenHash(String tokenHash);

}
