package com.saif.portfolio.controller;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.saif.portfolio.dto.ProjectRequest;
import com.saif.portfolio.dto.ProjectResponse;
import com.saif.portfolio.model.Project;
import com.saif.portfolio.model.ProjectImage;
import com.saif.portfolio.model.ProjectKeyFeature;
import com.saif.portfolio.model.ProjectKeyFeatureId;
import com.saif.portfolio.model.ProjectType;
import com.saif.portfolio.model.Skill;
import com.saif.portfolio.payload.ApiResponse;
import com.saif.portfolio.repository.ProjectRepository;
import com.saif.portfolio.repository.SkillRepository;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getAllProjects() {
        List<Project> projects = projectRepository.findAll();
        List<ProjectResponse> responses = projects.stream().map(this::toProjectResponse).toList();
        return ResponseEntity.ok(new ApiResponse<>(200, "Projects fetched successfully", responses));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectResponse>> getProjectById(@PathVariable Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new com.saif.portfolio.exception.ResourceNotFoundException("Project not found with id: " + id));
        return ResponseEntity.ok(new ApiResponse<>(200, "Project fetched successfully", toProjectResponse(project)));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<ProjectResponse>> getProjectBySlug(@PathVariable String slug) {
        Project project = projectRepository.findBySlug(slug)
                .orElseThrow(() -> new com.saif.portfolio.exception.ResourceNotFoundException("Project not found with slug: " + slug));
        return ResponseEntity.ok(new ApiResponse<>(200, "Project fetched successfully", toProjectResponse(project)));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getProjectsByType(@PathVariable String type) {
        ProjectType projectType;
        try {
            projectType = ProjectType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(400, "Invalid project type", null));
        }
        List<Project> projects = projectRepository.findByType(projectType);
        List<ProjectResponse> responses = projects.stream().map(this::toProjectResponse).toList();
        return ResponseEntity.ok(new ApiResponse<>(200, "Projects fetched by type", responses));
    }

    @PostMapping
    @Transactional
    public ResponseEntity<ApiResponse<ProjectResponse>> createProject(@Valid @RequestBody ProjectRequest request) {
        if (projectRepository.findBySlug(request.getSlug()).isPresent()) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(400, "Slug already exists", null));
        }
        Project project = new Project();
        project.setTitle(request.getTitle());
        project.setSlug(request.getSlug());
        project.setDescription(request.getDescription());
        project.setGithubUrl(request.getGithubUrl());
        project.setLiveDemoUrl(request.getLiveDemoUrl());
        project.setLive(request.getLive());
        project.setPublished(request.getPublished());
        project.setFeatured(request.getFeatured());
        project.setType(request.getType());
        project.setCreatedAt(Instant.now());
        project.setUpdatedAt(Instant.now());

        // Key Features
        if (request.getKeyFeatures() != null) {
            List<ProjectKeyFeature> features = request.getKeyFeatures().stream()
                .map(f -> {
                    ProjectKeyFeature pkf = new ProjectKeyFeature();
                    ProjectKeyFeatureId id = new ProjectKeyFeatureId();
                    id.setKeyFeature(f);
                    pkf.setId(id);
                    pkf.setProject(project);
                    return pkf;
                }).collect(Collectors.toList());
            project.setKeyFeatures(features);
        }

        // Images
        if (request.getImages() != null) {
            List<ProjectImage> images = request.getImages().stream()
                .map(url -> {
                    ProjectImage img = new ProjectImage();
                    img.setImage(url);
                    img.setProject(project);
                    return img;
                }).collect(Collectors.toList());
            project.setImages(images);
        }

        // Technologies
        if (request.getTechnologies() != null) {
            List<Skill> skills = skillRepository.findAllById(request.getTechnologies());
            project.setTechnologies(skills);
        }

        Project saved = projectRepository.save(project);
        return ResponseEntity.status(201).body(new ApiResponse<>(201, "Project created successfully", toProjectResponse(saved)));
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<ApiResponse<ProjectResponse>> updateProject(@PathVariable Long id, @Valid @RequestBody ProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new com.saif.portfolio.exception.ResourceNotFoundException("Project not found with id: " + id));
        project.setTitle(request.getTitle());
        project.setSlug(request.getSlug());
        project.setDescription(request.getDescription());
        project.setGithubUrl(request.getGithubUrl());
        project.setLiveDemoUrl(request.getLiveDemoUrl());
        project.setLive(request.getLive());
        project.setPublished(request.getPublished());
        project.setFeatured(request.getFeatured());
        project.setType(request.getType());
        project.setUpdatedAt(Instant.now());

        // Key Features
        project.getKeyFeatures().clear();
        if (request.getKeyFeatures() != null) {
            List<ProjectKeyFeature> features = request.getKeyFeatures().stream()
                .map(f -> {
                    ProjectKeyFeature pkf = new ProjectKeyFeature();
                    ProjectKeyFeatureId featureId = new ProjectKeyFeatureId();
                    featureId.setKeyFeature(f);
                    pkf.setId(featureId);
                    pkf.setProject(project);
                    return pkf;
                }).collect(Collectors.toList());
            project.getKeyFeatures().addAll(features);
        }

        // Images
        if (request.getImages() != null) {
            List<String> newImages = request.getImages().stream().distinct().toList();
            // Remove images not in the new list
            if (project.getImages() != null) {
                project.getImages().removeIf(img -> !newImages.contains(img.getImage()));
            }
            // Add new images that don't already exist
            List<String> existingImages = project.getImages() != null ? project.getImages().stream().map(ProjectImage::getImage).toList() : List.of();
            newImages.stream()
                .filter(url -> !existingImages.contains(url))
                .forEach(url -> {
                    ProjectImage img = new ProjectImage();
                    img.setImage(url);
                    img.setProject(project);
                    project.getImages().add(img);
                });
        }

        // Technologies
        if (request.getTechnologies() != null) {
            List<Skill> skills = skillRepository.findAllById(request.getTechnologies());
            project.setTechnologies(skills);
        }

        Project updated = projectRepository.save(project);
        return ResponseEntity.ok(new ApiResponse<>(200, "Project updated successfully", toProjectResponse(updated)));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<ApiResponse<ProjectResponse>> deleteProject(@PathVariable Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new com.saif.portfolio.exception.ResourceNotFoundException("Project not found with id: " + id));
        projectRepository.deleteById(id);
        return ResponseEntity.ok(new ApiResponse<>(200, "Project deleted successfully", toProjectResponse(project)));
    }

    // Helper to map Project to ProjectResponse
    private ProjectResponse toProjectResponse(Project project) {
        return ProjectResponse.builder()
            .id(project.getId())
            .title(project.getTitle())
            .slug(project.getSlug())
            .description(project.getDescription())
            .githubUrl(project.getGithubUrl())
            .liveDemoUrl(project.getLiveDemoUrl())
            .live(project.isLive())
            .published(project.isPublished())
            .featured(project.isFeatured())
            .type(project.getType() != null ? project.getType().name() : null)
            .createdAt(project.getCreatedAt())
            .updatedAt(project.getUpdatedAt())
            .keyFeatures(project.getKeyFeatures() != null ? project.getKeyFeatures().stream().map(f -> f.getId().getKeyFeature()).toList() : null)
            .images(project.getImages() != null ? project.getImages().stream().map(ProjectImage::getImage).toList() : null)
            .technologies(project.getTechnologies() != null ? project.getTechnologies().stream().map(Skill::getName).toList() : null)
            .build();
    }

    // PATCH endpoint to toggle 'live' field (no body)
    @PatchMapping("/{id}/live")
    @Transactional
    public ResponseEntity<ApiResponse<ProjectResponse>> toggleProjectLive(@PathVariable Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new com.saif.portfolio.exception.ResourceNotFoundException("Project not found with id: " + id));
        project.setLive(!project.isLive());
        project.setUpdatedAt(Instant.now());
        Project updated = projectRepository.save(project);
        return ResponseEntity.ok(new ApiResponse<>(200, "Project 'live' field toggled", toProjectResponse(updated)));
    }

    // PATCH endpoint to toggle 'published' field (no body)
    @PatchMapping("/{id}/published")
    @Transactional
    public ResponseEntity<ApiResponse<ProjectResponse>> toggleProjectPublished(@PathVariable Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new com.saif.portfolio.exception.ResourceNotFoundException("Project not found with id: " + id));
        project.setPublished(!project.isPublished());
        project.setUpdatedAt(Instant.now());
        Project updated = projectRepository.save(project);
        return ResponseEntity.ok(new ApiResponse<>(200, "Project 'published' field toggled", toProjectResponse(updated)));
    }

    // PATCH endpoint to toggle 'featured' field (no body)
    @PatchMapping("/{id}/featured")
    @Transactional
    public ResponseEntity<ApiResponse<ProjectResponse>> toggleProjectFeatured(@PathVariable Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new com.saif.portfolio.exception.ResourceNotFoundException("Project not found with id: " + id));
        project.setFeatured(!project.isFeatured());
        project.setUpdatedAt(Instant.now());
        Project updated = projectRepository.save(project);
        return ResponseEntity.ok(new ApiResponse<>(200, "Project 'featured' field toggled", toProjectResponse(updated)));
    }

}
