package com.saif.portfolio.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

/**
 * Evict dashboard cache when mutating operations occur in service layer.
 */
@Aspect
@Component
@RequiredArgsConstructor
public class DashboardCacheEvictAspect {

    private final CacheManager cacheManager;

    // Matches create*, update*, delete*, toggle*, mark*, save* methods in service package
    @AfterReturning(
        "execution(* com.saif.portfolio.service.*.create*(..)) || "
      + "execution(* com.saif.portfolio.service.*.update*(..)) || "
      + "execution(* com.saif.portfolio.service.*.delete*(..)) || "
      + "execution(* com.saif.portfolio.service.*.toggle*(..)) || "
      + "execution(* com.saif.portfolio.service.*.mark*(..)) || "
      + "execution(* com.saif.portfolio.service.*.save*(..))"
    )
    public void evictCacheAfterMutation(JoinPoint jp) {
        var cache = cacheManager.getCache("dashboardStats");
        if (cache != null) {
            cache.clear();
        }
    }
}
