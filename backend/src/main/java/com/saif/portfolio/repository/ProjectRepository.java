package com.saif.portfolio.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.saif.portfolio.dto.SimpleProjectResponse;
import com.saif.portfolio.model.Project;
import com.saif.portfolio.model.ProjectType;

public interface ProjectRepository extends JpaRepository<Project, Integer> {
    Optional<Project> findBySlug(String slug);
    boolean existsBySlug(String slug);
    List<Project> findByType(ProjectType type);
    List<Project> findByFeaturedTrue();

     // Native SQL query for fastest listing
    @Query(value = """
        SELECT 
            p.id,
            p.title,
            p.slug,
            p.description,
            p.github_url AS githubUrl,
            p.live_demo_url AS liveDemoUrl,
            p.live,
            p.published,
            p.featured,
            p.type,
            (SELECT i.url FROM project_images i WHERE i.project_id = p.id ORDER BY i.id ASC LIMIT 1) AS imageUrl,
            COALESCE(STRING_AGG(s.name, ','), '') AS technologies
        FROM projects p
        LEFT JOIN project_technologies pt ON p.id = pt.project_id
        LEFT JOIN skills s ON pt.skill_id = s.id
        GROUP BY p.id
        ORDER BY p.id DESC
        """, nativeQuery = true)
    List<Object[]> findAllSimpleProjectsNative();


    // ✅ Total projects count
    @Query("SELECT COUNT(p) FROM Project p")
    long countProjects();

    // ✅ Featured projects count
    @Query("SELECT COUNT(p) FROM Project p WHERE p.featured = true")
    long countFeaturedProjects();


}

