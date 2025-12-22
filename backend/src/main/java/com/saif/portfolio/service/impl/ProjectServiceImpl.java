package com.saif.portfolio.service.impl;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.function.Consumer;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.saif.portfolio.dto.ImageUploadResponse;
import com.saif.portfolio.dto.ProjectRequest;
import com.saif.portfolio.dto.ProjectResponse;
import com.saif.portfolio.dto.SimpleProjectResponse;
import com.saif.portfolio.exception.ResourceNotFoundException;
import com.saif.portfolio.model.Project;
import com.saif.portfolio.model.ProjectImage;
import com.saif.portfolio.model.ProjectKeyFeature;
import com.saif.portfolio.model.ProjectKeyFeatureId;
import com.saif.portfolio.model.ProjectType;
import com.saif.portfolio.model.Skill;
import com.saif.portfolio.repository.ProjectRepository;
import com.saif.portfolio.repository.SkillRepository;
import com.saif.portfolio.service.ProjectService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;

    // -------------------------------------------------
    // READ
    // -------------------------------------------------
    @Override
    @Cacheable("allProjects")
    @Transactional(readOnly = true)
    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Cacheable(value = "simpleProjects", key = "#page + '-' + #size", sync = true)
    @Transactional(readOnly = true)
    public Page<SimpleProjectResponse> getAllSimpleProjectResponses(int page, int size) {

        Pageable pageable = PageRequest.of(page, size);
        return projectRepository.findAllSimpleProjectsNative(pageable)
                .map(this::mapSimpleProject);
    }

    @Override
    @Cacheable("featuredProjects")
    @Transactional(readOnly = true)
    public List<ProjectResponse> getFeaturedProjects() {
        return projectRepository.findByFeaturedTrue()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(int id) {
        return toResponse(findProject(id));
    }

    @Override
    @Cacheable(value = "projectBySlug", key = "#slug.toLowerCase()")
    @Transactional(readOnly = true)
    public ProjectResponse getProjectBySlug(String slug) {
        return toResponse(
                projectRepository.findBySlugIgnoreCase(slug)
                        .orElseThrow(()
                                -> new ResourceNotFoundException("Project not found with slug: " + slug))
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> getProjectsByType(String type) {
        ProjectType projectType = ProjectType.valueOf(type.toUpperCase());
        return projectRepository.findByType(projectType)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // -------------------------------------------------
    // CREATE
    // -------------------------------------------------
    @Override
    @Transactional
    @CacheEvict(allEntries = true, value = {
        "allProjects", "projectBySlug", "featuredProjects", "simpleProjects"
    })
    public ProjectResponse createProject(ProjectRequest request) {

        String slug = request.getSlug().toLowerCase();

        if (projectRepository.existsBySlugIgnoreCase(slug)) {
            throw new IllegalArgumentException("Project with slug already exists: " + slug);
        }

        Project project = new Project();
        applyBasicFields(project, request, slug);
        project.setCreatedAt(Instant.now());

        attachKeyFeatures(project, request);
        attachImages(project, request);
        attachTechnologies(project, request);

        return toResponse(projectRepository.save(project));
    }

    // -------------------------------------------------
    // UPDATE
    // -------------------------------------------------
    @Override
    @Transactional
    @CacheEvict(allEntries = true, value = {
        "allProjects", "projectBySlug", "featuredProjects", "simpleProjects"
    })
    public ProjectResponse updateProject(Integer id, ProjectRequest request) {

        Project project = findProject(id);
        String slug = request.getSlug().toLowerCase();

        if (!project.getSlug().equals(slug)
                && projectRepository.existsBySlugIgnoreCase(slug)) {
            throw new IllegalArgumentException("Project with slug already exists: " + slug);
        }

        applyBasicFields(project, request, slug);
        project.setUpdatedAt(Instant.now());

        syncKeyFeatures(project, request);
        syncImages(project, request);
        attachTechnologies(project, request);

        return toResponse(projectRepository.save(project));
    }

    // -------------------------------------------------
    // DELETE AND TOGGLES
    // -------------------------------------------------
    @Override
    @Transactional
    @CacheEvict(
            allEntries = true,
            value = {
                "allProjects",
                "projectBySlug",
                "featuredProjects",
                "simpleProjects"
            }
    )
    public ProjectResponse deleteProject(Integer id) {

        Project project = projectRepository.findById(id)
                .orElseThrow(()
                        -> new ResourceNotFoundException("Project not found with id: " + id));

        projectRepository.delete(project);

        
        return toResponse(project);
    }

    @Override
    public ProjectResponse toggleLive(Integer id) {
        return toggle(id, p -> p.setLive(!p.isLive()));
    }

    @Override
    public ProjectResponse togglePublished(Integer id) {
        return toggle(id, p -> p.setPublished(!p.isPublished()));
    }

    @Override
    public ProjectResponse toggleFeatured(Integer id) {
        return toggle(id, p -> p.setFeatured(!p.isFeatured()));
    }

    // -------------------------------------------------
    // INTERNAL HELPERS
    // -------------------------------------------------
    private Project findProject(Integer id) {
        return projectRepository.findById(id)
                .orElseThrow(()
                        -> new ResourceNotFoundException("Project not found with id: " + id));
    }

    private ProjectResponse toggle(Integer id, Consumer<Project> action) {
        Project project = findProject(id);
        action.accept(project);
        project.setUpdatedAt(Instant.now());
        return toResponse(projectRepository.save(project));
    }

    private SimpleProjectResponse mapSimpleProject(Object[] r) {

        List<String> techs = r[11] == null || ((String) r[11]).isBlank()
                ? List.of()
                : List.of(((String) r[11]).split(","))
                        .stream()
                        .map(String::trim)
                        .toList();

        return new SimpleProjectResponse(
                ((Number) r[0]).intValue(),
                (String) r[1],
                (String) r[2],
                (String) r[3],
                (String) r[4],
                (String) r[5],
                (Boolean) r[6],
                (Boolean) r[7],
                (Boolean) r[8],
                (String) r[9],
                (String) r[10],
                techs
        );
    }

    private ProjectResponse toResponse(Project p) {
        return ProjectResponse.builder()
                .id(p.getId())
                .title(p.getTitle())
                .slug(p.getSlug())
                .description(p.getDescription())
                .githubUrl(p.getGithubUrl())
                .liveDemoUrl(p.getLiveDemoUrl())
                .live(p.isLive())
                .published(p.isPublished())
                .featured(p.isFeatured())
                .type(p.getType() != null ? p.getType().name() : null)
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .keyFeatures(
                        p.getKeyFeatures() == null ? List.of()
                        : p.getKeyFeatures().stream()
                                .map(f -> f.getId().getKeyFeature())
                                .toList()
                )
                .images(
                        p.getImages() == null ? List.of()
                        : p.getImages().stream()
                                .map(i -> new ImageUploadResponse(i.getPublicId(), i.getUrl()))
                                .toList()
                )
                .technologies(
                        p.getTechnologies() == null ? List.of()
                        : p.getTechnologies().stream()
                                .map(Skill::getName)
                                .toList()
                )
                .build();
    }

    private void applyBasicFields(Project p, ProjectRequest r, String slug) {
        p.setTitle(r.getTitle());
        p.setSlug(slug);
        p.setDescription(r.getDescription());
        p.setGithubUrl(r.getGithubUrl());
        p.setLiveDemoUrl(r.getLiveDemoUrl());
        p.setLive(r.getLive());
        p.setPublished(r.getPublished());
        p.setFeatured(r.getFeatured());
        p.setType(r.getType());
    }

    // -------------------------------------------------
    // RELATION HELPERS
    // -------------------------------------------------
    private void attachKeyFeatures(Project project, ProjectRequest request) {
        if (request.getKeyFeatures() == null || request.getKeyFeatures().isEmpty()) {
            return;
        }

        Set<ProjectKeyFeature> features = request.getKeyFeatures().stream()
                .map(f -> new ProjectKeyFeature(
                new ProjectKeyFeatureId(null, f),
                project
        ))
                .collect(Collectors.toSet());

        project.setKeyFeatures(features);
    }

    private void syncKeyFeatures(Project project, ProjectRequest request) {
        if (request.getKeyFeatures() == null) {
            return;
        }

        if (project.getKeyFeatures() == null) {
            project.setKeyFeatures(new HashSet<>());
        }

        Set<String> incoming = new HashSet<>(request.getKeyFeatures());

        project.getKeyFeatures()
                .removeIf(existing
                        -> !incoming.contains(existing.getId().getKeyFeature()));

        Set<String> existingNames = project.getKeyFeatures()
                .stream()
                .map(f -> f.getId().getKeyFeature())
                .collect(Collectors.toSet());

        incoming.stream()
                .filter(name -> !existingNames.contains(name))
                .forEach(name
                        -> project.getKeyFeatures().add(
                        new ProjectKeyFeature(
                                new ProjectKeyFeatureId(project.getId(), name),
                                project
                        )
                )
                );
    }

    private void attachImages(Project project, ProjectRequest request) {
        if (request.getImages() == null || request.getImages().isEmpty()) {
            return;
        }

        List<ProjectImage> images = request.getImages().stream()
                .map(img -> {
                    ProjectImage pi = new ProjectImage();
                    pi.setPublicId(img.getPublicId());
                    pi.setUrl(img.getUrl());
                    pi.setProject(project);
                    return pi;
                })
                .toList();

        project.setImages(images);
    }

    private void syncImages(Project project, ProjectRequest request) {
        if (request.getImages() == null) {
            return;
        }

        if (project.getImages() == null) {
            project.setImages(new ArrayList<>());
        }

        Set<String> incomingIds = request.getImages().stream()
                .map(ImageUploadResponse::getPublicId)
                .collect(Collectors.toSet());

        project.getImages()
                .removeIf(img -> !incomingIds.contains(img.getPublicId()));

        Set<String> existingIds = project.getImages().stream()
                .map(ProjectImage::getPublicId)
                .collect(Collectors.toSet());

        request.getImages().stream()
                .filter(img -> !existingIds.contains(img.getPublicId()))
                .forEach(img -> {
                    ProjectImage pi = new ProjectImage();
                    pi.setPublicId(img.getPublicId());
                    pi.setUrl(img.getUrl());
                    pi.setProject(project);
                    project.getImages().add(pi);
                });
    }

    private void attachTechnologies(Project project, ProjectRequest request) {
        if (request.getTechnologies() == null || request.getTechnologies().isEmpty()) {
            return;
        }

        List<Skill> skills = skillRepository.findAllById(request.getTechnologies());

        if (skills.size() != request.getTechnologies().size()) {
            List<Long> foundIds = skills.stream().map(Skill::getId).toList();
            List<Long> invalid = request.getTechnologies().stream()
                    .filter(id -> !foundIds.contains(id))
                    .toList();
            throw new ResourceNotFoundException("Invalid technology IDs: " + invalid);
        }

        project.setTechnologies(skills);
    }
}
