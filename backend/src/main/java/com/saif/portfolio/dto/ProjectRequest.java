package com.saif.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import com.saif.portfolio.model.ProjectType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectRequest {

    @NotBlank(message = "Title must not be blank")
    @Size(max = 255, message = "Title must be at most 255 characters")
    private String title;

    @NotBlank(message = "Slug must not be blank")
    @Size(max = 255, message = "Slug must be at most 255 characters")
    private String slug;

    @NotBlank(message = "Description must not be blank")
    @Size(max = 2000, message = "Description must be at most 2000 characters")
    private String description;

    @NotNull(message = "Key features must not be null")
    @Size(min = 1, message = "At least one key feature is required")
    private List<@NotBlank(message = "Key feature must not be blank") String> keyFeatures;

    @NotBlank(message = "GitHub URL must not be blank")
    @Size(max = 255, message = "GitHub URL must be at most 255 characters")
    private String githubUrl;

    @NotBlank(message = "Live demo URL must not be blank")
    @Size(max = 255, message = "Live demo URL must be at most 255 characters")
    private String liveDemoUrl;

    @NotNull(message = "Live status must not be null")
    private Boolean live;

    @NotNull(message = "Published status must not be null")
    private Boolean published;

    @NotNull(message = "Featured status must not be null")
    private Boolean featured;

    @NotNull(message = "Project type must not be null")
    private ProjectType type;

    @NotNull(message = "Images must not be null")
    @Size(min = 1, message = "At least one image is required")
    private List<@NotBlank(message = "Image URL must not be blank") String> images;

    @NotNull(message = "Technologies must not be null")
    @Size(min = 1, message = "At least one technology is required")
    private List<@NotNull(message = "Technology ID must not be null") Long> technologies;
}
