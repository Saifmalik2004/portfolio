package com.saif.portfolio.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.saif.portfolio.dto.BlogListResponse;
import com.saif.portfolio.model.Blog;

public interface BlogRepository extends JpaRepository<Blog, Integer> {

    // ✅ Get all blogs (summary + image)
    @Query("SELECT new com.saif.portfolio.dto.BlogListResponse(" +
           "b.id, b.title, b.slug, b.summary, b.category, b.readTime, b.author, " +
           "b.createdAt, b.updatedAt, " +
           "new com.saif.portfolio.dto.ImageUploadResponse(i.publicId, i.url)) " +
           "FROM Blog b LEFT JOIN b.image i")
    List<BlogListResponse> findAllSummaries();

    // ✅ Get blogs by category (summary + image)
    @Query("SELECT new com.saif.portfolio.dto.BlogListResponse(" +
           "b.id, b.title, b.slug, b.summary, b.category, b.readTime, b.author, " +
           "b.createdAt, b.updatedAt, " +
           "new com.saif.portfolio.dto.ImageUploadResponse(i.publicId, i.url)) " +
           "FROM Blog b LEFT JOIN b.image i WHERE b.category = :category")
    List<BlogListResponse> findSummariesByCategory(@Param("category") String category);

    // ✅ Find by slug (full blog with content)
    @Query("SELECT b FROM Blog b WHERE LOWER(b.slug) = LOWER(:slug)")
    Optional<Blog> findBySlug(@Param("slug") String slug);
}
