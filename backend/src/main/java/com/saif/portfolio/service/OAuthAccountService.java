package com.saif.portfolio.service;

import com.saif.portfolio.model.OAuthAccount;
import com.saif.portfolio.model.User;
import java.util.List;
import java.util.Optional;

public interface OAuthAccountService {
    OAuthAccount save(OAuthAccount account);
    Optional<OAuthAccount> findByProviderAndProviderUserId(String provider, String providerUserId);
    List<OAuthAccount> findByUser(User user);
}
