package com.saif.portfolio.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.saif.portfolio.dto.ApiResponse;
import com.saif.portfolio.dto.BlogListResponse;
import com.saif.portfolio.dto.BlogRequest;
import com.saif.portfolio.model.Blog;
import com.saif.portfolio.service.impl.BlogServiceImpl;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/blogs")
@RequiredArgsConstructor
public class BlogController {
    
    private final BlogServiceImpl blogService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BlogListResponse>>> getAllBlogs() {
        List<BlogListResponse> responses = blogService.getAllBlogs();
        return ResponseEntity.ok(new ApiResponse<>(200, "Blogs fetched successfully", responses));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Blog>> getBlogById(@PathVariable int id) {
        Blog response = blogService.getBlogById(id);
        return ResponseEntity.ok(new ApiResponse<>(200, "Blog fetched successfully", response));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<Blog>> getBlogBySlug(@PathVariable String slug) {
        Blog response = blogService.getBlogBySlug(slug);
        return ResponseEntity.ok(new ApiResponse<>(200, "Blog fetched successfully", response));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<BlogListResponse>>> getBlogsByCategory(@PathVariable String category) {
        List<BlogListResponse> responses = blogService.getBlogsByCategory(category);
        if (responses.isEmpty()) {
            return ResponseEntity.status(404)
                .body(new ApiResponse<>(404, "No blogs found for category: " + category, null));
        }
        return ResponseEntity.ok(new ApiResponse<>(200, "Blogs fetched by category", responses));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Blog>> createBlog(@Valid @RequestBody BlogRequest blogRequest) {
        Blog response = blogService.createBlog(blogRequest);
        return ResponseEntity.status(201).body(new ApiResponse<>(201, "Blog created successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Blog>> updateBlog(@PathVariable int id, @Valid @RequestBody BlogRequest blogRequest) {
        Blog response = blogService.updateBlog(id, blogRequest);
        return ResponseEntity.ok(new ApiResponse<>(200, "Blog updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Blog>> deleteBlog(@PathVariable int id) {
        Blog response = blogService.deleteBlog(id);
        return ResponseEntity.ok(new ApiResponse<>(200, "Blog deleted successfully", response));
    }
}
