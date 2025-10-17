package com.saif.portfolio.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.saif.portfolio.model.OAuthAccount;
import com.saif.portfolio.model.User;

@Repository
public interface OAuthAccountRepository extends JpaRepository<OAuthAccount, Long> {
    // Find by provider and external ID (for linking accounts)
    Optional<OAuthAccount> findByProviderAndProviderUserId(String provider, String providerUserId);
    List<OAuthAccount> findByUser(User user);
}