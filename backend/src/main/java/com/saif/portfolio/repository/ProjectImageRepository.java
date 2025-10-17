package com.saif.portfolio.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.saif.portfolio.model.ProjectImage;
import com.saif.portfolio.model.ProjectImageId;

public interface ProjectImageRepository extends JpaRepository<ProjectImage, ProjectImageId> {
    List<ProjectImage> findByProjectId(Integer projectId);
}
