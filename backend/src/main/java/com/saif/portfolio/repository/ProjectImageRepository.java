package com.saif.portfolio.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.saif.portfolio.model.ProjectImage;

public interface ProjectImageRepository extends JpaRepository<ProjectImage, Integer> {
    List<ProjectImage> findByProjectId(Integer projectId);
}
