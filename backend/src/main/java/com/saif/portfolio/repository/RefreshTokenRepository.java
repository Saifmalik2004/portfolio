package com.saif.portfolio.repository;

import java.time.Instant;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.saif.portfolio.model.RefreshToken;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByTokenHash(String tokenHash);

    @Query("SELECT rt FROM RefreshToken rt WHERE rt.user.id = :userId AND rt.tokenHash = :tokenHash AND rt.revoked = false AND rt.expiresAt > :now")
    Optional<RefreshToken> findActiveByUserIdAndTokenHash(Long userId, String tokenHash, Instant now);

    @Modifying
    @Query("UPDATE RefreshToken rt SET rt.revoked = true WHERE rt.user.id = :userId")
    void revokeAllByUserId(@Param("userId") Long userId);

    @Query("DELETE FROM RefreshToken rt WHERE rt.expiresAt < :before OR rt.revoked = true")
    void deleteExpiredOrRevoked(Instant before);

    @Query("SELECT COUNT(rt) FROM RefreshToken rt WHERE rt.user.id = :userId AND rt.revoked = false AND rt.expiresAt > :now")
    int countActiveByUserId(Long userId, Instant now);

    @Modifying
    @Query("UPDATE RefreshToken rt SET rt.revoked = true WHERE rt.user.id = :userId AND rt.tokenHash <> :currentTokenHash")
    void revokeAllExcept(@Param("userId") Long userId, @Param("currentTokenHash") String currentTokenHash);

    @Modifying
@Query("DELETE FROM RefreshToken rt WHERE rt.tokenHash = :tokenHash")
void deleteByTokenHash(@Param("tokenHash") String tokenHash);

}
