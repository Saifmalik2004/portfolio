package com.saif.portfolio.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.saif.portfolio.model.BlogImage;

public interface BlogImageRepository extends JpaRepository<BlogImage, Integer> {
    BlogImage findByBlogId(Integer blogId);
}
