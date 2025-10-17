package com.saif.portfolio.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.saif.portfolio.model.ProjectKeyFeature;
import com.saif.portfolio.model.ProjectKeyFeatureId;

public interface ProjectKeyFeatureRepository extends JpaRepository<ProjectKeyFeature, ProjectKeyFeatureId> {
    List<ProjectKeyFeature> findByProjectId(Integer projectId);
}
