package com.saif.portfolio.dto;

import java.time.Instant;
import java.util.List;

import lombok.Data;

@Data
@lombok.Builder
public class ProjectResponse {
    private Long id;
    private String title;
    private String slug;
    private String description;
    private String githubUrl;
    private String liveDemoUrl;
    private boolean live;
    private boolean published;
    private boolean featured;
    private String type;
    private Instant createdAt;
    private Instant updatedAt;
    private List<String> keyFeatures;
    private List<String> images;
    private List<String> technologies;
}
