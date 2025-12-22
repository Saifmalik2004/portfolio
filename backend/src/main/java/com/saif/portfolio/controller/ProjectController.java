package com.saif.portfolio.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.saif.portfolio.dto.ApiResponse;
import com.saif.portfolio.dto.PagedResponse;
import com.saif.portfolio.dto.ProjectRequest;
import com.saif.portfolio.dto.ProjectResponse;
import com.saif.portfolio.dto.SimpleProjectResponse;
import com.saif.portfolio.model.ProjectType;
import com.saif.portfolio.service.ProjectService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    // ✅ ALWAYS inject interface (not impl)
    private final ProjectService projectService;

    // -------------------------------------------------
    // GET ALL PROJECTS
    // -------------------------------------------------
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getAllProjects() {
        return ResponseEntity.ok(
                new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Projects fetched successfully",
                        projectService.getAllProjects()
                )
        );
    }

    // -------------------------------------------------
    // GET SIMPLE PROJECTS (PAGINATED)
    // -------------------------------------------------
    @GetMapping("/simple")
    public ResponseEntity<ApiResponse<PagedResponse<SimpleProjectResponse>>> getSimpleProjects(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {

        Page<SimpleProjectResponse> pageData =
                projectService.getAllSimpleProjectResponses(page, size);

        PagedResponse<SimpleProjectResponse> response =
                new PagedResponse<>(
                        pageData.getContent(),
                        pageData.getNumber(),
                        pageData.getSize(),
                        pageData.getTotalElements(),
                        pageData.getTotalPages(),
                        pageData.isLast()
                );

        return ResponseEntity.ok(
                new ApiResponse<>(HttpStatus.OK.value(),
                        "Projects fetched successfully",
                        response)
        );
    }

    // -------------------------------------------------
    // GET FEATURED PROJECTS
    // -------------------------------------------------
    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getFeaturedProjects() {
        return ResponseEntity.ok(
                new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Featured projects fetched successfully",
                        projectService.getFeaturedProjects()
                )
        );
    }

    // -------------------------------------------------
    // GET PROJECT BY ID
    // -------------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectResponse>> getProjectById(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Project fetched successfully",
                        projectService.getProjectById(id)
                )
        );
    }

    // -------------------------------------------------
    // GET PROJECT BY SLUG
    // -------------------------------------------------
    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<ProjectResponse>> getProjectBySlug(
            @PathVariable String slug) {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Project fetched successfully",
                        projectService.getProjectBySlug(slug)
                )
        );
    }

    // -------------------------------------------------
    // GET PROJECTS BY TYPE
    // -------------------------------------------------
    @GetMapping("/type/{type}")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getProjectsByType(
            @PathVariable String type) {

        ProjectType projectType;
        try {
            projectType = ProjectType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(400, "Invalid project type", null));
        }

        return ResponseEntity.ok(
                new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Projects fetched by type",
                        projectService.getProjectsByType(projectType.name())
                )
        );
    }

    // -------------------------------------------------
    // CREATE PROJECT
    // -------------------------------------------------
    @PostMapping
    public ResponseEntity<ApiResponse<ProjectResponse>> createProject(
            @Valid @RequestBody ProjectRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(
                        HttpStatus.CREATED.value(),
                        "Project created successfully",
                        projectService.createProject(request)
                ));
    }

    // -------------------------------------------------
    // UPDATE PROJECT
    // -------------------------------------------------
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectResponse>> updateProject(
            @PathVariable Integer id,
            @Valid @RequestBody ProjectRequest request) {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Project updated successfully",
                        projectService.updateProject(id, request)
                )
        );
    }

    // -------------------------------------------------
    // DELETE PROJECT  ✅ FIXED & CONFIRMED
    // -------------------------------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectResponse>> deleteProject(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Project deleted successfully",
                        projectService.deleteProject(id)
                )
        );
    }

    // -------------------------------------------------
    // TOGGLES
    // -------------------------------------------------
    @PatchMapping("/{id}/live")
    public ResponseEntity<ApiResponse<ProjectResponse>> toggleLive(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Project live status toggled",
                        projectService.toggleLive(id)
                )
        );
    }

    @PatchMapping("/{id}/published")
    public ResponseEntity<ApiResponse<ProjectResponse>> togglePublished(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Project published status toggled",
                        projectService.togglePublished(id)
                )
        );
    }

    @PatchMapping("/{id}/featured")
    public ResponseEntity<ApiResponse<ProjectResponse>> toggleFeatured(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                new ApiResponse<>(
                        HttpStatus.OK.value(),
                        "Project featured status toggled",
                        projectService.toggleFeatured(id)
                )
        );
    }
}
