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

import com.saif.portfolio.dto.BlogRequest;
import com.saif.portfolio.dto.BlogResponse;
import com.saif.portfolio.payload.ApiResponse;
import com.saif.portfolio.service.BlogService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/blogs")
@RequiredArgsConstructor
public class BlogController {
    
    private final BlogService blogService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BlogResponse>>> getAllBlogs() {
        List<BlogResponse> responses = blogService.getAllBlogs();
        return ResponseEntity.ok(new ApiResponse<>(200, "Blogs fetched successfully", responses));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BlogResponse>> getBlogById(@PathVariable Long id) {
        BlogResponse response = blogService.getBlogById(id);
        return ResponseEntity.ok(new ApiResponse<>(200, "Blog fetched successfully", response));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<BlogResponse>> getBlogBySlug(@PathVariable String slug) {
        BlogResponse response = blogService.getBlogBySlug(slug);
        return ResponseEntity.ok(new ApiResponse<>(200, "Blog fetched successfully", response));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<BlogResponse>>> getBlogsByCategory(@PathVariable String category) {
        List<BlogResponse> responses = blogService.getBlogsByCategory(category);
        if (responses.isEmpty()) {
            return ResponseEntity.status(404)
                .body(new ApiResponse<>(404, "No blogs found for category: " + category, null));
        }
        return ResponseEntity.ok(new ApiResponse<>(200, "Blogs fetched by category", responses));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BlogResponse>> createBlog(@Valid @RequestBody BlogRequest blogRequest) {
        BlogResponse response = blogService.createBlog(blogRequest);
        return ResponseEntity.status(201).body(new ApiResponse<>(201, "Blog created successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BlogResponse>> updateBlog(@PathVariable Long id, @Valid @RequestBody BlogRequest blogRequest) {
        BlogResponse response = blogService.updateBlog(id, blogRequest);
        return ResponseEntity.ok(new ApiResponse<>(200, "Blog updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<BlogResponse>> deleteBlog(@PathVariable Long id) {
        BlogResponse response = blogService.deleteBlog(id);
        return ResponseEntity.ok(new ApiResponse<>(200, "Blog deleted successfully", response));
    }
}
