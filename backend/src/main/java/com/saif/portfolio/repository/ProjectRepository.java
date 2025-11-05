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

    @Query("""
    SELECT new com.saif.portfolio.dto.SimpleProjectResponse(
        p.id,
        p.title,
        p.slug,
        p.description,
        p.githubUrl,
        p.liveDemoUrl,
        p.live,
        p.published,
        p.featured,
        CAST(p.type AS string),
        (SELECT i.url FROM ProjectImage i WHERE i.project.id = p.id ORDER BY i.id ASC LIMIT 1)
    )
    FROM Project p
""")
List<SimpleProjectResponse> findAllSimplified();



    // ✅ Total projects count
    @Query("SELECT COUNT(p) FROM Project p")
    long countProjects();

    // ✅ Featured projects count
    @Query("SELECT COUNT(p) FROM Project p WHERE p.featured = true")
    long countFeaturedProjects();


}

