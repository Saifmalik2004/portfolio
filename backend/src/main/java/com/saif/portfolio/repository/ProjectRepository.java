package com.saif.portfolio.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.saif.portfolio.model.Project;
import com.saif.portfolio.model.ProjectType;

public interface ProjectRepository extends JpaRepository<Project, Integer> {

    Optional<Project> findBySlugIgnoreCase(String slug);

    boolean existsBySlugIgnoreCase(String slug);

    List<Project> findByType(ProjectType type);

    List<Project> findByFeaturedTrue();
    
    // ✅ Featured projects count
    @Query("SELECT COUNT(p) FROM Project p WHERE p.featured = true")
    long countFeaturedProjects();

    @Query(
        value = """
            SELECT 
                p.id,
                p.title,
                p.slug,
                p.description,
                p.github_url,
                p.live_demo_url,
                p.live,
                p.published,
                p.featured,
                p.type,
                img.url,
                COALESCE(STRING_AGG(DISTINCT s.name, ','), '')
            FROM projects p
            LEFT JOIN (
                SELECT project_id, MIN(id) AS first_image_id
                FROM project_images
                GROUP BY project_id
            ) fi ON fi.project_id = p.id
            LEFT JOIN project_images img ON img.id = fi.first_image_id
            LEFT JOIN project_technologies pt ON p.id = pt.project_id
            LEFT JOIN skills s ON pt.skill_id = s.id
            GROUP BY p.id, img.url
            ORDER BY p.id DESC
        """,
        countQuery = "SELECT COUNT(*) FROM projects",
        nativeQuery = true
    )
    Page<Object[]> findAllSimpleProjectsNative(Pageable pageable);
}
