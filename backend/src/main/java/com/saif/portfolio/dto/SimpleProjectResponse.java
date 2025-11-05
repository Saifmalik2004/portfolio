package com.saif.portfolio.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SimpleProjectResponse {
    private Integer id;
    private String title;
    private String slug;
    private String description;
    private String githubUrl;
    private String liveDemoUrl;
    private boolean live;
    private boolean published;
    private boolean featured;
    private String type;
    private String imageUrl;
    private List<String> technologies; // ✅ ab array of strings
}
