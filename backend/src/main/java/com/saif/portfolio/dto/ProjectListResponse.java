package com.saif.portfolio.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectListResponse {
    private Integer id;
    private String title;
    private String slug;
    private String description;
    private String githubUrl;
    private String liveDemoUrl;
    private boolean live;
    private boolean published;
    private String type;
    private String image;
    private List<String> technologies;
}
