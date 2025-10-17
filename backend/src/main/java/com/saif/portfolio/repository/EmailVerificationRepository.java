package com.saif.portfolio.repository;

import java.time.Instant;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.saif.portfolio.model.EmailVerification;
import com.saif.portfolio.model.User;

@Repository
public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {

    Optional<EmailVerification> findByUserAndConsumedFalse(User user);

    @Query("SELECT ev FROM EmailVerification ev WHERE ev.user = :user AND ev.consumed = false AND ev.expiresAt > :now")
    Optional<EmailVerification> findByUserAndConsumedFalseAndNotExpired(User user, Instant now);

    @Modifying
    @Query("DELETE FROM EmailVerification ev WHERE ev.consumed = true OR ev.expiresAt < :before")
    void deleteByConsumedTrueOrExpiresAtBefore(Instant before);

    
    Optional<EmailVerification> findByOtpHashAndConsumedFalse(String otpHash);
}
