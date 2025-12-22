package com.saif.portfolio.service;

import org.springframework.data.domain.Page;

import com.saif.portfolio.dto.BlogListResponse;
import com.saif.portfolio.dto.BlogRequest;
import com.saif.portfolio.model.Blog;

public interface BlogService {
    Page<BlogListResponse> getAllBlogs(int page,int size);
    Blog getBlogById(Integer id);
    Blog getBlogBySlug(String slug);
    Page<BlogListResponse> getBlogsByCategory(String category,int page,int size);
    Blog createBlog(BlogRequest blogRequest);
    Blog updateBlog(Integer id, BlogRequest blogRequest);
    Blog deleteBlog(Integer id);
}
