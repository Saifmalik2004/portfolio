package com.saif.portfolio.dto;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlogListResponse {
    private Integer id;
    private String title;
    private String slug;
    private String summary;
    private String category;
    private String readTime;
    private String author;
    private Instant createdAt;
    private Instant updatedAt;
    private ImageUploadResponse image;
}
