package com.saif.portfolio.repository;

import java.time.Instant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.saif.portfolio.model.FailedLogin;

@Repository
public interface FailedLoginRepository extends JpaRepository<FailedLogin, Long> {
    @Query("SELECT COUNT(fl) FROM FailedLogin fl WHERE fl.user.id = :userId AND fl.occurredAt > :since")
    int countRecentByUserId(Long userId, Instant since);

    @Query("SELECT COUNT(fl) FROM FailedLogin fl WHERE fl.ip = :ip AND fl.occurredAt > :since")
    int countRecentByIp(String ip, Instant since);

    @Query("SELECT COUNT(fl) FROM FailedLogin fl WHERE fl.user.id = :userId AND fl.ip = :ip AND fl.occurredAt > :since")
    int countRecentByUserIdAndIp(Long userId, String ip, Instant since);

    @Query("DELETE FROM FailedLogin fl WHERE fl.occurredAt < :before")
    void deleteOlderThan(Instant before);
}