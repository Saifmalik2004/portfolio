package com.saif.portfolio.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.saif.portfolio.dto.BlogListResponse;
import com.saif.portfolio.model.Blog;

public interface BlogRepository extends JpaRepository<Blog, Integer> {

    // ✅ Get all blogs (summary + image) with pagination (LATEST FIRST)
    @Query("""
        SELECT new com.saif.portfolio.dto.BlogListResponse(
            b.id, b.title, b.slug, b.summary, b.category, b.readTime, b.author,
            b.createdAt, b.updatedAt,
            new com.saif.portfolio.dto.ImageUploadResponse(i.publicId, i.url)
        )
        FROM Blog b
        LEFT JOIN b.image i
        ORDER BY b.createdAt DESC
    """)
    Page<BlogListResponse> findAllSummaries(Pageable pageable);

    // ✅ Get blogs by category (summary + image) with pagination (LATEST FIRST)
    @Query("""
        SELECT new com.saif.portfolio.dto.BlogListResponse(
            b.id, b.title, b.slug, b.summary, b.category, b.readTime, b.author,
            b.createdAt, b.updatedAt,
            new com.saif.portfolio.dto.ImageUploadResponse(i.publicId, i.url)
        )
        FROM Blog b
        LEFT JOIN b.image i
        WHERE LOWER(b.category) = LOWER(:category)
        ORDER BY b.createdAt DESC
    """)
    Page<BlogListResponse> findSummariesByCategory(
            @Param("category") String category,
            Pageable pageable
    );

    // ✅ Blog detail by slug (image eagerly fetched, N+1 safe)
    @EntityGraph(attributePaths = "image")
    @Query("SELECT b FROM Blog b WHERE LOWER(b.slug) = LOWER(:slug)")
    Optional<Blog> findBySlug(@Param("slug") String slug);

    // ✅ Slug uniqueness check (use in service before create/update)
    boolean existsBySlugIgnoreCase(String slug);
}
