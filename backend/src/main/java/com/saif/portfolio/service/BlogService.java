package com.saif.portfolio.service;

import com.saif.portfolio.dto.BlogRequest;
import com.saif.portfolio.dto.BlogResponse;
import com.saif.portfolio.model.Blog;
import com.saif.portfolio.model.BlogImage;
import com.saif.portfolio.repository.BlogRepository;
import com.saif.portfolio.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BlogService {
    
    private final BlogRepository blogRepository;

    @Transactional
    public List<BlogResponse> getAllBlogs() {
        return blogRepository.findAll().stream().map(this::toBlogResponse).toList();
    }

    @Transactional
    public BlogResponse getBlogById(Long id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found with id: " + id));
        return toBlogResponse(blog);
    }

    @Transactional
    public BlogResponse getBlogBySlug(String slug) {
        Blog blog = blogRepository.findBySlugIgnoreCase(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found with slug: " + slug));
        return toBlogResponse(blog);
    }

    @Transactional
    public List<BlogResponse> getBlogsByCategory(String category) {
        List<Blog> blogs = blogRepository.findByCategory(category);
        return blogs.stream().map(this::toBlogResponse).toList();
    }

    @Transactional
    public BlogResponse createBlog(BlogRequest blogRequest) {
        Blog blog = new Blog();
        blog.setTitle(blogRequest.getTitle());
        blog.setSlug(blogRequest.getSlug());
        blog.setSummary(blogRequest.getSummary());
        blog.setContent(blogRequest.getContent());
        blog.setCategory(blogRequest.getCategory());
        blog.setReadTime(blogRequest.getReadTime());
        blog.setAuthor(blogRequest.getAuthor());
        blog.setCreatedAt(Instant.now());
        blog.setUpdatedAt(Instant.now());
        // Images
        if (blogRequest.getImages() != null) {
            List<BlogImage> imageEntities = new java.util.ArrayList<>();
            for (String url : blogRequest.getImages()) {
                BlogImage img = new BlogImage();
                img.setImage(url);
                img.setBlog(blog);
                imageEntities.add(img);
            }
            blog.setImages(imageEntities);
        }
        Blog savedBlog = blogRepository.save(blog);
        return toBlogResponse(savedBlog);
    }

    @Transactional
    public BlogResponse updateBlog(Long id, BlogRequest blogRequest) {
        Blog b = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found with id: " + id));
        b.setTitle(blogRequest.getTitle());
        b.setSlug(blogRequest.getSlug());
        b.setCategory(blogRequest.getCategory());
        b.setReadTime(blogRequest.getReadTime());
        b.setAuthor(blogRequest.getAuthor());
        b.setSummary(blogRequest.getSummary());
        b.setContent(blogRequest.getContent());
        b.setUpdatedAt(Instant.now());
        // Images
        b.getImages().clear();
        if (blogRequest.getImages() != null) {
            for (String url : blogRequest.getImages()) {
                BlogImage img = new BlogImage();
                img.setImage(url);
                img.setBlog(b);
                b.getImages().add(img);
            }
        }
        Blog updatedBlog = blogRepository.save(b);
        return toBlogResponse(updatedBlog);
    }

    @Transactional
    public BlogResponse deleteBlog(Long id) {
        Blog blog = blogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blog not found with id: " + id));
        blogRepository.deleteById(id);
        return toBlogResponse(blog);
    }

    private BlogResponse toBlogResponse(Blog blog) {
        BlogResponse dto = new BlogResponse();
        dto.setId(blog.getId());
        dto.setTitle(blog.getTitle());
        dto.setSlug(blog.getSlug());
        dto.setSummary(blog.getSummary());
        dto.setContent(blog.getContent());
        dto.setCategory(blog.getCategory());
        dto.setReadTime(blog.getReadTime());
        dto.setAuthor(blog.getAuthor());
        dto.setCreatedAt(blog.getCreatedAt());
        dto.setUpdatedAt(blog.getUpdatedAt());
        if (blog.getImages() != null && !blog.getImages().isEmpty()) {
            List<String> urls = new java.util.ArrayList<>(blog.getImages().size());
            for (BlogImage img : blog.getImages()) {
                urls.add(img.getImage());
            }
            dto.setImages(urls);
        } else {
            dto.setImages(java.util.Collections.emptyList());
        }
        return dto;
    }
}
