package com.saif.portfolio.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.saif.portfolio.service.impl.RefreshTokenServiceImpl;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class TokenCleanupScheduler {

    private final RefreshTokenServiceImpl refreshTokenService;

    @Scheduled(cron = "0 47 9 * * *") // 
    public void cleanupTokens() {
        refreshTokenService.deleteExpiredOrRevoked(); // 7 din se purane delete
    }
}

