package com.saif.portfolio.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.saif.portfolio.model.Skill;

public interface SkillRepository extends JpaRepository<Skill, Long> {
    List<Skill> findByCategoryIgnoreCaseOrderByPriorityAsc(String category);
    boolean existsByNameIgnoreCase(String name);
}
