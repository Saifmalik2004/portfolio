package com.saif.portfolio.service.impl;

import com.saif.portfolio.model.OAuthAccount;
import com.saif.portfolio.model.User;
import com.saif.portfolio.repository.OAuthAccountRepository;
import com.saif.portfolio.service.OAuthAccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OAuthAccountServiceImpl implements OAuthAccountService {

    private final OAuthAccountRepository repository;

    @Override
    @Transactional
    public OAuthAccount save(OAuthAccount account) {
        if (account.getProvider() == null || account.getProvider().isBlank()) {
            throw new IllegalArgumentException("Provider cannot be empty");
        }
        if (account.getProviderUserId() == null || account.getProviderUserId().isBlank()) {
            throw new IllegalArgumentException("Provider user ID cannot be empty");
        }
        if (account.getUser() == null) {
            throw new IllegalArgumentException("User cannot be null");
        }
        return repository.save(account);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<OAuthAccount> findByProviderAndProviderUserId(String provider, String providerUserId) {
        return repository.findByProviderAndProviderUserId(provider, providerUserId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OAuthAccount> findByUser(User user) {
        return repository.findByUser(user);
    }
}