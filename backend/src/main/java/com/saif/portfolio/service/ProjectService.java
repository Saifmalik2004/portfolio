package com.saif.portfolio.service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.saif.portfolio.dto.ProjectRequest;
import com.saif.portfolio.dto.ProjectResponse;
import com.saif.portfolio.model.Project;
import com.saif.portfolio.model.ProjectImage;
import com.saif.portfolio.model.ProjectKeyFeature;
import com.saif.portfolio.model.ProjectKeyFeatureId;
import com.saif.portfolio.model.ProjectType;
import com.saif.portfolio.model.Skill;
import com.saif.portfolio.repository.ProjectRepository;
import com.saif.portfolio.repository.SkillRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProjectService {
    
    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;

    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findAll().stream().map(this::toProjectResponse).toList();
    }

    public ProjectResponse getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new com.saif.portfolio.exception.ResourceNotFoundException("Project not found with id: " + id));
        return toProjectResponse(project);
    }

    public ProjectResponse getProjectBySlug(String slug) {
        Project project = projectRepository.findBySlug(slug)
                .orElseThrow(() -> new com.saif.portfolio.exception.ResourceNotFoundException("Project not found with slug: " + slug));
        return toProjectResponse(project);
    }

    public List<ProjectResponse> getProjectsByType(String type) {
        ProjectType projectType = ProjectType.valueOf(type.toUpperCase());
        return projectRepository.findByType(projectType).stream().map(this::toProjectResponse).toList();
    }

    @Transactional
    public ProjectResponse createProject(ProjectRequest request) {
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
        if (request.getTechnologies() != null) {
            List<Skill> skills = skillRepository.findAllById(request.getTechnologies());
            project.setTechnologies(skills);
        }
        Project saved = projectRepository.save(project);
        return toProjectResponse(saved);
    }

    @Transactional
    public ProjectResponse updateProject(Long id, ProjectRequest request) {
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
        if (request.getImages() != null) {
            List<String> newImages = request.getImages().stream().distinct().toList();
            if (project.getImages() != null) {
                project.getImages().removeIf(img -> !newImages.contains(img.getImage()));
            }
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
        if (request.getTechnologies() != null) {
            List<Skill> skills = skillRepository.findAllById(request.getTechnologies());
            project.setTechnologies(skills);
        }
        Project updated = projectRepository.save(project);
        return toProjectResponse(updated);
    }

    @Transactional
    public ProjectResponse deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new com.saif.portfolio.exception.ResourceNotFoundException("Project not found with id: " + id));
        projectRepository.deleteById(id);
        return toProjectResponse(project);
    }

    @Transactional
    public ProjectResponse toggleLive(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new com.saif.portfolio.exception.ResourceNotFoundException("Project not found with id: " + id));
        project.setLive(!project.isLive());
        project.setUpdatedAt(Instant.now());
        Project updated = projectRepository.save(project);
        return toProjectResponse(updated);
    }

    @Transactional
    public ProjectResponse togglePublished(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new com.saif.portfolio.exception.ResourceNotFoundException("Project not found with id: " + id));
        project.setPublished(!project.isPublished());
        project.setUpdatedAt(Instant.now());
        Project updated = projectRepository.save(project);
        return toProjectResponse(updated);
    }

    @Transactional
    public ProjectResponse toggleFeatured(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new com.saif.portfolio.exception.ResourceNotFoundException("Project not found with id: " + id));
        project.setFeatured(!project.isFeatured());
        project.setUpdatedAt(Instant.now());
        Project updated = projectRepository.save(project);
        return toProjectResponse(updated);
    }

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
}
