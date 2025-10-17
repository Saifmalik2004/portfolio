package com.saif.portfolio.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.saif.portfolio.dto.BlogListResponse;
import com.saif.portfolio.model.Blog;

public interface BlogRepository extends JpaRepository<Blog, Integer> {
    @Query("SELECT new com.saif.portfolio.dto.BlogListResponse(" +
           "b.id, b.title, b.slug, b.summary, b.category, b.readTime, b.author, " +
           "b.createdAt, b.updatedAt, b.image) " +
           "FROM Blog b")
    List<BlogListResponse> findAllSummaries();

    // Fetch blogs by category with summary fields only, directly into DTO
    @Query("SELECT new com.saif.portfolio.dto.BlogListResponse(" +
           "b.id, b.title, b.slug, b.summary, b.category, b.readTime, b.author, " +
           "b.createdAt, b.updatedAt, b.image) " +
           "FROM Blog b WHERE b.category = :category")
    List<BlogListResponse> findSummariesByCategory(String category);


    @Query("SELECT b FROM Blog b WHERE LOWER(b.slug) = LOWER(:slug)")
    Optional<Blog> findBySlug(@Param("slug") String slug);
    

}
