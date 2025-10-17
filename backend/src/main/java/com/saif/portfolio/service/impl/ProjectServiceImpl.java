package com.saif.portfolio.service.impl;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.saif.portfolio.dto.ProjectRequest;
import com.saif.portfolio.dto.ProjectResponse;
import com.saif.portfolio.exception.ResourceNotFoundException;
import com.saif.portfolio.model.Project;
import com.saif.portfolio.model.ProjectImage;
import com.saif.portfolio.model.ProjectImageId;
import com.saif.portfolio.model.ProjectKeyFeature;
import com.saif.portfolio.model.ProjectKeyFeatureId;
import com.saif.portfolio.model.ProjectType;
import com.saif.portfolio.model.Skill;
import com.saif.portfolio.repository.ProjectRepository;
import com.saif.portfolio.repository.SkillRepository;
import com.saif.portfolio.service.ProjectService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;

    // ----------------- READ METHODS WITH CACHE -----------------
    @Cacheable(value = "allProjects")
    @Override
    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findAll().stream().map(this::toProjectResponse).toList();
    }

    @Cacheable(value = "featuredProjects")
    @Override
    public List<ProjectResponse> getFeaturedProjects() {
        return projectRepository.findByFeaturedTrue()
                .stream()
                .map(this::toProjectResponse)
                .toList();
    }

    @Override
    public ProjectResponse getProjectById(int id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new com.saif.portfolio.exception.ResourceNotFoundException("Project not found with id: " + id));
        return toProjectResponse(project);
    }

    @Override
    @Cacheable(value = "projectBySlug", key = "#slug")
    public ProjectResponse getProjectBySlug(String slug) {
        Project project = projectRepository.findBySlug(slug)
                .orElseThrow(() -> new com.saif.portfolio.exception.ResourceNotFoundException("Project not found with slug: " + slug));
        return toProjectResponse(project);
    }

    @Override
    public List<ProjectResponse> getProjectsByType(String type) {
        ProjectType projectType = ProjectType.valueOf(type.toUpperCase());
        return projectRepository.findByType(projectType).stream().map(this::toProjectResponse).toList();
    }

    // ----------------- CREATE / UPDATE METHODS -----------------
    @CacheEvict(value = {"allProjects", "projectBySlug"}, allEntries = true)
    @Transactional
    @Override
    public ProjectResponse createProject(ProjectRequest request) {
        // Create and set basic project fields
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

        // Save project first to get its ID for composite keys
        Project saved = projectRepository.save(project);

        // Handle key features with composite key
        if (request.getKeyFeatures() != null) {
            List<ProjectKeyFeature> features = new ArrayList<>();
            for (String feature : request.getKeyFeatures()) {
                ProjectKeyFeatureId featureId = new ProjectKeyFeatureId(saved.getId(), feature);
                ProjectKeyFeature pkf = new ProjectKeyFeature();
                pkf.setId(featureId);
                pkf.setProject(saved);
                features.add(pkf);
            }
            saved.setKeyFeatures(features);
        }

        // Handle images with composite key
        if (request.getImages() != null) {
            List<ProjectImage> images = new ArrayList<>();
            for (String imageUrl : request.getImages()) {
                ProjectImageId imageId = new ProjectImageId(saved.getId(), imageUrl);
                ProjectImage img = new ProjectImage();
                img.setId(imageId);
                img.setProject(saved);
                images.add(img);
            }
            saved.setImages(images);
        }

        // Handle technologies
        if (request.getTechnologies() != null && !request.getTechnologies().isEmpty()) {
            List<Skill> skills = skillRepository.findAllById(request.getTechnologies());
            if (skills.isEmpty()) {
                throw new ResourceNotFoundException("No valid technologies found with the provided IDs");
            }
            if (skills.size() != request.getTechnologies().size()) {
                List<Long> foundIds = skills.stream().map(Skill::getId).toList();
                List<Long> invalidIds = request.getTechnologies().stream()
                        .filter(id -> !foundIds.contains(id))
                        .toList();
                throw new ResourceNotFoundException("Some technology IDs were not found: " + invalidIds);
            }
            saved.setTechnologies(skills);
        }

        // Save again with all relationships
        saved = projectRepository.save(saved);
        return toProjectResponse(saved);
    }

    @Transactional
    @CacheEvict(value = {"allProjects", "projectBySlug"}, allEntries = true)
    @Override
    public ProjectResponse updateProject(Integer id, ProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        // Update basic fields
        project.setTitle(request.getTitle());
        project.setSlug(request.getSlug());
        project.setDescription(request.getDescription());
        project.setGithubUrl(request.getGithubUrl());
        project.setLiveDemoUrl(request.getLiveDemoUrl());
        project.setLive(request.getLive());
        project.setPublished(request.getPublished());
        project.setFeatured(request.getFeatured());
        project.setType(request.getType());

        // ✅ Update Key Features
        if (request.getKeyFeatures() != null) {
            List<ProjectKeyFeature> existingFeatures = new ArrayList<>(project.getKeyFeatures() != null ? project.getKeyFeatures() : List.of());
            Set<String> newFeatureSet = new HashSet<>(request.getKeyFeatures());

            // 1. Remove key features not present in the new list
            List<ProjectKeyFeature> featuresToRemove = existingFeatures.stream()
                    .filter(f -> !newFeatureSet.contains(f.getId().getKeyFeature()))
                    .toList();
            featuresToRemove.forEach(f -> {
                project.getKeyFeatures().remove(f);
            });

            // 2. Add only the new ones (that are not already present)
            Set<String> existingFeatureNames = project.getKeyFeatures().stream()
                    .map(f -> f.getId().getKeyFeature()).collect(Collectors.toSet());

            request.getKeyFeatures().stream()
                    .filter(f -> !existingFeatureNames.contains(f))
                    .forEach(f -> {
                        ProjectKeyFeatureId newId = new ProjectKeyFeatureId(project.getId(), f);
                        ProjectKeyFeature newFeature = new ProjectKeyFeature(newId, project);
                        project.getKeyFeatures().add(newFeature);
                    });
        }

        // ✅ Update Images
        if (request.getImages() != null) {
            List<String> newImages = request.getImages().stream().distinct().toList();

            if (project.getImages() == null) {
                project.setImages(new ArrayList<>());
            }

            // Remove images not in the new list
            project.getImages().removeIf(img -> !newImages.contains(img.getId().getImage()));

            // Add new images
            Set<String> existingImageUrls = project.getImages().stream()
                    .map(img -> img.getId().getImage())
                    .collect(Collectors.toSet());

            // Add only new images
            newImages.stream()
                    .filter(imageUrl -> !existingImageUrls.contains(imageUrl))
                    .forEach(imageUrl -> {
                        ProjectImageId imageId = new ProjectImageId(project.getId(), imageUrl);
                        ProjectImage newImg = new ProjectImage();
                        newImg.setId(imageId);
                        newImg.setProject(project);
                        project.getImages().add(newImg);
                    });
        }

        // ✅ Update Technologies
        if (request.getTechnologies() != null && !request.getTechnologies().isEmpty()) {
            List<Skill> skills = skillRepository.findAllById(request.getTechnologies());
            if (skills.isEmpty()) {
                throw new ResourceNotFoundException("No valid technologies found with the provided IDs");
            }
            if (skills.size() != request.getTechnologies().size()) {
                List<Long> foundIds = skills.stream().map(Skill::getId).toList();
                List<Long> invalidIds = request.getTechnologies().stream()
                        .filter(techId -> !foundIds.contains(techId))
                        .toList();
                throw new ResourceNotFoundException("Some technology IDs were not found: " + invalidIds);
            }
            project.setTechnologies(skills);
        }

        Project updated = projectRepository.save(project);
        return toProjectResponse(updated);
    }

    @Transactional
    @CacheEvict(value = {"allProjects", "projectBySlug"}, allEntries = true)
    @Override
    public ProjectResponse deleteProject(Integer id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new com.saif.portfolio.exception.ResourceNotFoundException("Project not found with id: " + id));
        projectRepository.deleteById(id);
        return toProjectResponse(project);
    }

    @Transactional
    @CacheEvict(value = {"allProjects", "projectBySlug"}, allEntries = true)
    @Override
    public ProjectResponse toggleLive(Integer id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new com.saif.portfolio.exception.ResourceNotFoundException("Project not found with id: " + id));
        project.setLive(!project.isLive());
        Project updated = projectRepository.save(project);
        return toProjectResponse(updated);
    }

    @Transactional
    @CacheEvict(value = {"allProjects", "projectBySlug"}, allEntries = true)
    @Override
    public ProjectResponse togglePublished(Integer id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new com.saif.portfolio.exception.ResourceNotFoundException("Project not found with id: " + id));
        project.setPublished(!project.isPublished());
        project.setUpdatedAt(Instant.now());
        Project updated = projectRepository.save(project);
        return toProjectResponse(updated);
    }

    @Transactional
    @CacheEvict(value = {"allProjects", "projectBySlug"}, allEntries = true)
    @Override
    public ProjectResponse toggleFeatured(Integer id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new com.saif.portfolio.exception.ResourceNotFoundException("Project not found with id: " + id));
        project.setFeatured(!project.isFeatured());
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
                .images(project.getImages() != null ? project.getImages().stream().map(img -> img.getId().getImage()).toList() : null)
                .technologies(project.getTechnologies() != null ? project.getTechnologies().stream().map(Skill::getName).toList() : null)
                .build();
    }
}
