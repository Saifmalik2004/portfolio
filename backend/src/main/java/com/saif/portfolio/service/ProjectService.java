package com.saif.portfolio.service;

import java.util.List;

import org.springframework.data.domain.Page;

import com.saif.portfolio.dto.ProjectRequest;
import com.saif.portfolio.dto.ProjectResponse;
import com.saif.portfolio.dto.SimpleProjectResponse;

public interface ProjectService {

    List<ProjectResponse> getAllProjects();

    Page<SimpleProjectResponse> getAllSimpleProjectResponses(int page, int size);

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
