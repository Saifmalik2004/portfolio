package com.saif.portfolio.service.impl;

import java.util.HashMap;
import java.util.Map;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.saif.portfolio.repository.BlogRepository;
import com.saif.portfolio.repository.CertificateRepository;
import com.saif.portfolio.repository.ContactRepository;
import com.saif.portfolio.repository.ProjectRepository;
import com.saif.portfolio.repository.SkillRepository;
import com.saif.portfolio.repository.UserRepository;
import com.saif.portfolio.service.DashboardService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final BlogRepository blogRepository;
    private final ProjectRepository projectRepository;
    private final ContactRepository contactRepository;
    private final SkillRepository skillRepository;
    private final CertificateRepository certificateRepository;
    private final UserRepository userRepository;

    // -------------------------------------------------
    // DASHBOARD STATS
    // -------------------------------------------------
    @Override
    @Cacheable("dashboardStats")
    @Transactional(readOnly = true)
    public Map<String, Long> getDashboardStats() {

        // initial capacity to avoid resizing
        Map<String, Long> stats = new HashMap<>(16);

        // ---------------- Projects ----------------
        stats.put("totalProjects", projectRepository.count());
        stats.put("featuredProjects", projectRepository.countFeaturedProjects());

        // ---------------- Skills (category wise) ----------------
        skillRepository.countSkillsByCategory().forEach(row -> {
            String category = (String) row[0];
            Long count = ((Number) row[1]).longValue();
            stats.put(category.toLowerCase() + "Skills", count);
        });

        // ---------------- Users ----------------
        stats.put("totalUsers", userRepository.countAllRegisterUser());
        stats.put("verifiedUsers", userRepository.countVerifyUser());

        // ---------------- Contacts ----------------
        stats.put("totalContacts", contactRepository.countContact());
        stats.put("unreadMessages", contactRepository.countUnreadMessages());

        // ---------------- Certificates ----------------
        stats.put("totalCertificates", certificateRepository.count());

        // ---------------- Blogs ----------------
        stats.put("totalBlogs", blogRepository.count());

        return stats;
    }

    // -------------------------------------------------
    // CACHE CLEAR
    // -------------------------------------------------
    @Override
    @CacheEvict(value = "dashboardStats", allEntries = true)
    public void clearDashboardCache() {
        // cache eviction only
    }
}
