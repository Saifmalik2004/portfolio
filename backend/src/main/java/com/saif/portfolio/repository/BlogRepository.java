package com.saif.portfolio.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.saif.portfolio.model.Blog;

public interface BlogRepository extends JpaRepository<Blog, Long> {
    @Query("SELECT DISTINCT b FROM Blog b LEFT JOIN FETCH b.images WHERE b.category = :category")
    List<Blog> findByCategory(@Param("category") String category);
    boolean existsBySlugIgnoreCase(String slug);
    Optional<Blog> findBySlugIgnoreCase(String slug);
}
