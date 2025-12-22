package com.saif.portfolio.controller;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.saif.portfolio.dto.ApiResponse;
import com.saif.portfolio.dto.BlogListResponse;
import com.saif.portfolio.dto.BlogRequest;
import com.saif.portfolio.dto.PagedResponse;
import com.saif.portfolio.model.Blog;
import com.saif.portfolio.service.BlogService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/blogs")
@RequiredArgsConstructor
public class BlogController {

    // ✅ Always depend on interface (not impl)
    private final BlogService blogService;

    // ----------------------------------------------------------------
    // GET ALL BLOGS (PAGINATED)
    // ----------------------------------------------------------------
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<BlogListResponse>>> getAllBlogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {

        Page<BlogListResponse> result = blogService.getAllBlogs(page, size);

        PagedResponse<BlogListResponse> response = new PagedResponse<>(
                result.getContent(),
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages(),
                result.isLast()
        );

        return ResponseEntity.ok(
                new ApiResponse<>(HttpStatus.OK.value(), "Blogs fetched successfully", response)
        );
    }

    // ----------------------------------------------------------------
    // GET BLOG BY ID
    // ----------------------------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Blog>> getBlogById(@PathVariable Integer id) {
        Blog blog = blogService.getBlogById(id);
        return ResponseEntity.ok(
                new ApiResponse<>(HttpStatus.OK.value(), "Blog fetched successfully", blog)
        );
    }

    // ----------------------------------------------------------------
    // GET BLOG BY SLUG (SEO FRIENDLY)
    // ----------------------------------------------------------------
    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<Blog>> getBlogBySlug(@PathVariable String slug) {
        Blog blog = blogService.getBlogBySlug(slug);
        return ResponseEntity.ok(
                new ApiResponse<>(HttpStatus.OK.value(), "Blog fetched successfully", blog)
        );
    }

    // ----------------------------------------------------------------
    // GET BLOGS BY CATEGORY (PAGINATED)
    // ----------------------------------------------------------------
    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<PagedResponse<BlogListResponse>>> getBlogsByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {

        Page<BlogListResponse> result =
                blogService.getBlogsByCategory(category, page, size);

        PagedResponse<BlogListResponse> response = new PagedResponse<>(
                result.getContent(),
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages(),
                result.isLast()
        );

        return ResponseEntity.ok(
                new ApiResponse<>(HttpStatus.OK.value(), "Blogs fetched by category", response)
        );
    }

    // ----------------------------------------------------------------
    // CREATE BLOG
    // ----------------------------------------------------------------
    @PostMapping
    public ResponseEntity<ApiResponse<Blog>> createBlog(
            @Valid @RequestBody BlogRequest blogRequest) {

        Blog blog = blogService.createBlog(blogRequest);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(
                        HttpStatus.CREATED.value(),
                        "Blog created successfully",
                        blog
                ));
    }

    // ----------------------------------------------------------------
    // UPDATE BLOG
    // ----------------------------------------------------------------
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Blog>> updateBlog(
            @PathVariable Integer id,
            @Valid @RequestBody BlogRequest blogRequest) {

        Blog blog = blogService.updateBlog(id, blogRequest);

        return ResponseEntity.ok(
                new ApiResponse<>(HttpStatus.OK.value(), "Blog updated successfully", blog)
        );
    }

    // ----------------------------------------------------------------
    // DELETE BLOG
    // ----------------------------------------------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Blog>> deleteBlog(@PathVariable Integer id) {

        Blog blog = blogService.deleteBlog(id);

        return ResponseEntity.ok(
                new ApiResponse<>(HttpStatus.OK.value(), "Blog deleted successfully", blog)
        );
    }
}
