package com.saif.portfolio.service.impl;

import java.util.HashMap;
import java.util.Map;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

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

    @Override
    @Cacheable("dashboardStats")
    public Map<String, Long> getDashboardStats() {
        Map<String, Long> stats = new HashMap<>();

        // Projects
        stats.put("totalProjects", projectRepository.countProjects());
        stats.put("featuredProjects", projectRepository.countFeaturedProjects());

        // Skills
        skillRepository.countSkillsByCategory().forEach(obj -> {
            String category = (String) obj[0];
            Long count = (Long) obj[1];
            stats.put(category.toLowerCase() + "Skills", count);
        });

        // Users
        stats.put("verifiedUsers", userRepository.countVerifyUser());
        stats.put("totalUsers", userRepository.countAllRegisterUser());

        // Contacts
        stats.put("totalContacts", contactRepository.countContact());
        stats.put("unreadMessages", contactRepository.countUnreadMessages());

        // Certificates
        stats.put("totalCertificates", certificateRepository.countCertificate());

        // Blogs
        stats.put("totalBlogs", blogRepository.countBlogs());

        return stats;
    }

    // Called by AOP to evict cache
    @Override
    @CacheEvict(value = "dashboardStats", allEntries = true)
    public void clearDashboardCache() {
        // intentionally empty, AOP triggers this
    }
}
