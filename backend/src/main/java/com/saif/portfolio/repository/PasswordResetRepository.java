package com.saif.portfolio.repository;

import java.time.Instant;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.saif.portfolio.model.PasswordReset;

@Repository
public interface PasswordResetRepository extends JpaRepository<PasswordReset, Long> {

    // Latest active reset token for user (not expired, not consumed)
    @Query("""
        SELECT pr FROM PasswordReset pr
        WHERE pr.user.id = :userId
        AND pr.consumed = false
        AND pr.expiresAt > :now
        ORDER BY pr.createdAt DESC
        LIMIT 1
        """)
    Optional<PasswordReset> findActiveByUserId(Long userId, Instant now);

    Optional<PasswordReset> findByTokenHashAndConsumedFalse(String tokenHash);

    @Modifying
    @Query("DELETE FROM PasswordReset pr WHERE pr.expiresAt < :before OR pr.consumed = true")
    void deleteExpiredOrConsumed(Instant before);
}
