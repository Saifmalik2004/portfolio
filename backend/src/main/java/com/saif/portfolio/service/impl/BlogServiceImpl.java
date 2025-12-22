package com.saif.portfolio.service.impl;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.saif.portfolio.dto.BlogListResponse;
import com.saif.portfolio.dto.BlogRequest;
import com.saif.portfolio.exception.ResourceNotFoundException;
import com.saif.portfolio.model.Blog;
import com.saif.portfolio.model.BlogImage;
import com.saif.portfolio.repository.BlogRepository;
import com.saif.portfolio.service.BlogService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BlogServiceImpl implements BlogService {

    private final BlogRepository blogRepository;

    // ----------------------------------------------------------------
    // READ OPERATIONS (CACHED)
    // ----------------------------------------------------------------

    @Override
    @Cacheable(value = "blogList", key = "#page + '-' + #size")
    @Transactional(readOnly = true)
    public Page<BlogListResponse> getAllBlogs(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return blogRepository.findAllSummaries(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Blog getBlogById(Integer id) {
        return blogRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Blog not found with id: " + id));
    }

    @Override
    @Cacheable(value = "blogs", key = "#slug.toLowerCase()")
    @Transactional(readOnly = true)
    public Blog getBlogBySlug(String slug) {
        String normalizedSlug = slug.toLowerCase();
        return blogRepository.findBySlug(normalizedSlug)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Blog not found with slug: " + normalizedSlug));
    }

    @Override
    @Cacheable(
        value = "blogListByCategory",
        key = "#category.toLowerCase() + '-' + #page + '-' + #size"
    )
    @Transactional(readOnly = true)
    public Page<BlogListResponse> getBlogsByCategory(String category, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return blogRepository.findSummariesByCategory(category.toLowerCase(), pageable);
    }

    // ----------------------------------------------------------------
    // CREATE
    // ----------------------------------------------------------------

    @Override
    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "blogs", allEntries = true),
        @CacheEvict(value = "blogList", allEntries = true),
        @CacheEvict(value = "blogListByCategory", allEntries = true)
    })
    public Blog createBlog(BlogRequest request) {

        String slug = request.getSlug().toLowerCase();

        // ✅ Slug uniqueness check
        if (blogRepository.existsBySlugIgnoreCase(slug)) {
            throw new IllegalArgumentException("Blog with slug '" + slug + "' already exists");
        }

        Blog blog = new Blog();
        blog.setTitle(request.getTitle());
        blog.setSlug(slug);
        blog.setSummary(request.getSummary());
        blog.setContent(request.getContent());
        blog.setCategory(request.getCategory().toLowerCase());
        blog.setReadTime(request.getReadTime());
        blog.setAuthor(request.getAuthor());

        BlogImage image = new BlogImage();
        image.setPublicId(request.getImage().getPublicId());
        image.setUrl(request.getImage().getUrl());
        image.setBlog(blog);

        blog.setImage(image);

        return blogRepository.save(blog);
    }

    // ----------------------------------------------------------------
    // UPDATE
    // ----------------------------------------------------------------

    @Override
    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "blogs", allEntries = true),
        @CacheEvict(value = "blogList", allEntries = true),
        @CacheEvict(value = "blogListByCategory", allEntries = true)
    })
    public Blog updateBlog(Integer id, BlogRequest request) {

        Blog blog = blogRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Blog not found with id: " + id));

        String newSlug = request.getSlug().toLowerCase();

        // ✅ Slug change hone par duplicate check
        if (!blog.getSlug().equalsIgnoreCase(newSlug)
                && blogRepository.existsBySlugIgnoreCase(newSlug)) {
            throw new IllegalArgumentException("Blog with slug '" + newSlug + "' already exists");
        }

        blog.setTitle(request.getTitle());
        blog.setSlug(newSlug);
        blog.setCategory(request.getCategory().toLowerCase());
        blog.setReadTime(request.getReadTime());
        blog.setAuthor(request.getAuthor());
        blog.setSummary(request.getSummary());
        blog.setContent(request.getContent());

        BlogImage image = blog.getImage();
        if (image == null) {
            image = new BlogImage();
            image.setBlog(blog);
        }

        image.setPublicId(request.getImage().getPublicId());
        image.setUrl(request.getImage().getUrl());
        blog.setImage(image);

        return blogRepository.save(blog);
    }

    // ----------------------------------------------------------------
    // DELETE
    // ----------------------------------------------------------------

    @Override
    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "blogs", allEntries = true, beforeInvocation = true),
        @CacheEvict(value = "blogList", allEntries = true, beforeInvocation = true),
        @CacheEvict(value = "blogListByCategory", allEntries = true, beforeInvocation = true)
    })
    public Blog deleteBlog(Integer id) {

        Blog blog = blogRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Blog not found with id: " + id));

        blogRepository.delete(blog);
        return blog;
    }
}
