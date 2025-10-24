package com.saif.portfolio.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.saif.portfolio.dto.ApiResponse;
import com.saif.portfolio.dto.ProjectRequest;
import com.saif.portfolio.dto.ProjectResponse;
import com.saif.portfolio.model.ProjectType;
import com.saif.portfolio.service.impl.ProjectServiceImpl;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectServiceImpl projectService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getAllProjects() {
        List<ProjectResponse> responses = projectService.getAllProjects();
        return ResponseEntity.ok(new ApiResponse<>(200, "Projects fetched successfully", responses));
    }

     @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getAllFeaturedProjects() {
        List<ProjectResponse> responses = projectService.getFeaturedProjects();
        return ResponseEntity.ok(new ApiResponse<>(200, "Featured Projects fetched successfully", responses));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectResponse>> getProjectById(@PathVariable Integer id) {
        ProjectResponse response = projectService.getProjectById(id);
        return ResponseEntity.ok(new ApiResponse<>(200, "Project fetched successfully", response));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<ProjectResponse>> getProjectBySlug(@PathVariable String slug) {
        ProjectResponse response = projectService.getProjectBySlug(slug);
        return ResponseEntity.ok(new ApiResponse<>(200, "Project fetched successfully", response));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getProjectsByType(@PathVariable String type) {
        try {
            ProjectType projectType = ProjectType.valueOf(type.toUpperCase());
            List<ProjectResponse> responses = projectService.getProjectsByType(projectType.name());
            return ResponseEntity.ok(new ApiResponse<>(200, "Projects fetched by type", responses));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(400, "Invalid project type", null));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProjectResponse>> createProject(@Valid @RequestBody ProjectRequest request) {
        ProjectResponse response = projectService.createProject(request);
        return ResponseEntity.status(201).body(new ApiResponse<>(201, "Project created successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectResponse>> updateProject(@PathVariable Integer id, @Valid @RequestBody ProjectRequest request) {
        ProjectResponse response = projectService.updateProject(id, request);
        return ResponseEntity.ok(new ApiResponse<>(200, "Project updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectResponse>> deleteProject(@PathVariable Integer id) {
        ProjectResponse response = projectService.deleteProject(id);
        return ResponseEntity.ok(new ApiResponse<>(200, "Project deleted successfully", response));
    }

    @PatchMapping("/{id}/live")
    public ResponseEntity<ApiResponse<ProjectResponse>> toggleProjectLive(@PathVariable Integer id) {
        ProjectResponse response = projectService.toggleLive(id);
        return ResponseEntity.ok(new ApiResponse<>(200, "Project 'live' field toggled", response));
    }

    @PatchMapping("/{id}/published")
    public ResponseEntity<ApiResponse<ProjectResponse>> toggleProjectPublished(@PathVariable Integer id) {
        ProjectResponse response = projectService.togglePublished(id);
        return ResponseEntity.ok(new ApiResponse<>(200, "Project 'published' field toggled", response));
    }

    @PatchMapping("/{id}/featured")
    public ResponseEntity<ApiResponse<ProjectResponse>> toggleProjectFeatured(@PathVariable Integer id) {
        ProjectResponse response = projectService.toggleFeatured(id);
        return ResponseEntity.ok(new ApiResponse<>(200, "Project 'featured' field toggled", response));
    }

}
