package com.saif.portfolio.service;

import com.saif.portfolio.dto.ProjectRequest;
import com.saif.portfolio.dto.ProjectResponse;

import java.util.List;

public interface ProjectService {
    List<ProjectResponse> getAllProjects();
    List<ProjectResponse> getFeaturedProjects();
    ProjectResponse getProjectById(int id);
    ProjectResponse getProjectBySlug(String slug);
    List<ProjectResponse> getProjectsByType(String type);
    ProjectResponse createProject(ProjectRequest request);
    ProjectResponse updateProject(Integer id, ProjectRequest request);
    ProjectResponse deleteProject(Integer id);
    ProjectResponse toggleLive(Integer id);
    ProjectResponse togglePublished(Integer id);
    ProjectResponse toggleFeatured(Integer id);
}
