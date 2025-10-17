package com.saif.portfolio.service.impl;

import com.saif.portfolio.model.FailedLogin;
import com.saif.portfolio.repository.FailedLoginRepository;
import com.saif.portfolio.service.FailedLoginService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class FailedLoginServiceImpl implements FailedLoginService {

    private final FailedLoginRepository repository;

    @Override
    @Transactional
    public FailedLogin save(FailedLogin failedLogin) {
        if (failedLogin.getIp() == null || failedLogin.getIp().isBlank()) {
            throw new IllegalArgumentException("IP address cannot be empty");
        }
        return repository.save(failedLogin);
    }

    @Override
    @Transactional(readOnly = true)
    public int countRecentByUserId(Long userId, Instant since) {
        return repository.countRecentByUserId(userId, since);
    }

    @Override
    @Transactional(readOnly = true)
    public int countRecentByIp(String ip, Instant since) {
        return repository.countRecentByIp(ip, since);
    }

    @Override
    @Transactional(readOnly = true)
    public int countRecentByUserIdAndIp(Long userId, String ip, Instant since) {
        return repository.countRecentByUserIdAndIp(userId, ip, since);
    }

    @Override
    @Transactional
    public void deleteOlderThan(Instant before) {
        repository.deleteOlderThan(before);
    }
}