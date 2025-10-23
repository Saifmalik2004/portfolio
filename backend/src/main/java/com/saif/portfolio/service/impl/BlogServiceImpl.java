package com.saif.portfolio.service.impl;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import com.saif.portfolio.dto.BlogListResponse;
import com.saif.portfolio.dto.BlogRequest;
import com.saif.portfolio.exception.ResourceNotFoundException;
import com.saif.portfolio.model.Blog;
import com.saif.portfolio.model.BlogImage;
import com.saif.portfolio.repository.BlogRepository;
import com.saif.portfolio.service.BlogService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BlogServiceImpl implements BlogService {

    private final BlogRepository blogRepository;

    // ✅ Get all blogs (summary only)
    @Transactional
    @Cacheable(value = "blogList")
    @Override
    public List<BlogListResponse> getAllBlogs() {
        return blogRepository.findAllSummaries();
    }

    @Transactional
    @Override
    public Blog getBlogById(Integer id) {
        return blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found with id: " + id));
    }

    @Cacheable(value = "blogs", key = "#slug")
    @Transactional
    @Override
    public Blog getBlogBySlug(String slug) {
        return blogRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found with slug: " + slug));
    }

    // ✅ Get blogs by category (summary only)
    @Transactional
    @Override
    public List<BlogListResponse> getBlogsByCategory(String category) {
        return blogRepository.findSummariesByCategory(category);
    }

    // ✅ Create Blog (with image)
    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "blogList", allEntries = true)
    })
    @Override
    public Blog createBlog(BlogRequest blogRequest) {
        // 1️⃣ Create Blog
        Blog blog = new Blog();
        blog.setTitle(blogRequest.getTitle());
        blog.setSlug(blogRequest.getSlug().toLowerCase());
        blog.setSummary(blogRequest.getSummary());
        blog.setContent(blogRequest.getContent());
        blog.setCategory(blogRequest.getCategory());
        blog.setReadTime(blogRequest.getReadTime());
        blog.setAuthor(blogRequest.getAuthor());

        // 2️⃣ Create BlogImage
        BlogImage image = new BlogImage();
        image.setPublicId(blogRequest.getImage().getPublicId());
        image.setUrl(blogRequest.getImage().getUrl());
        image.setBlog(blog);

        // 3️⃣ Set image reference
        blog.setImage(image);

        // 4️⃣ Save (Cascade saves both)
        return blogRepository.save(blog);
    }

    // ✅ Update Blog (with image update)
    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "blogs", key = "#result.slug"),
        @CacheEvict(value = "blogList", allEntries = true)
    })
    @Override
    public Blog updateBlog(Integer id, BlogRequest blogRequest) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found with id: " + id));

        // Update base fields
        blog.setTitle(blogRequest.getTitle());
        blog.setSlug(blogRequest.getSlug().toLowerCase());
        blog.setCategory(blogRequest.getCategory());
        blog.setReadTime(blogRequest.getReadTime());
        blog.setAuthor(blogRequest.getAuthor());
        blog.setSummary(blogRequest.getSummary());
        blog.setContent(blogRequest.getContent());

        // Handle image update
        BlogImage existingImage = blog.getImage();
        if (existingImage == null) {
            existingImage = new BlogImage();
            existingImage.setBlog(blog);
        }

        existingImage.setPublicId(blogRequest.getImage().getPublicId());
        existingImage.setUrl(blogRequest.getImage().getUrl());

        blog.setImage(existingImage);

        // Cascade will automatically save/update BlogImage
        return blogRepository.save(blog);
    }

    // ✅ Delete Blog (Cascade removes image)
    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "blogs", key = "#result.slug"),
        @CacheEvict(value = "blogList", allEntries = true)
    })
    @Override
    public Blog deleteBlog(Integer id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found with id: " + id));
        blogRepository.delete(blog);
        return blog;
    }
}
