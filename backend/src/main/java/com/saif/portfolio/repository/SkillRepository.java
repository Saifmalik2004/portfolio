package com.saif.portfolio.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.saif.portfolio.model.Skill;

public interface SkillRepository extends JpaRepository<Skill, Long> {

    List<Skill> findByCategoryIgnoreCaseOrderByPriorityAsc(String category);

    boolean existsByNameIgnoreCase(String name);

    // ✅ Category-wise count
    @Query("SELECT s.category, COUNT(s) FROM Skill s GROUP BY s.category")
    List<Object[]> countSkillsByCategory();
}
