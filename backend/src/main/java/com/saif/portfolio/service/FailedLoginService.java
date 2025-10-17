package com.saif.portfolio.service;

import java.time.Instant;

import com.saif.portfolio.model.FailedLogin;

public interface FailedLoginService {
    int countRecentByUserId(Long userId, Instant since);
    int countRecentByIp(String ip, Instant since);
    int countRecentByUserIdAndIp(Long userId, String ip, Instant since);
    void deleteOlderThan(Instant before);
    FailedLogin save(FailedLogin failedLogin);
}
