package com.saif.portfolio.service;

import java.util.List;

import com.saif.portfolio.dto.BlogListResponse;
import com.saif.portfolio.dto.BlogRequest;
import com.saif.portfolio.model.Blog;

public interface BlogService {
    List<BlogListResponse> getAllBlogs();
    Blog getBlogById(Integer id);
    Blog getBlogBySlug(String slug);
    List<BlogListResponse> getBlogsByCategory(String category);
    Blog createBlog(BlogRequest blogRequest);
    Blog updateBlog(Integer id, BlogRequest blogRequest);
    Blog deleteBlog(Integer id);
}
