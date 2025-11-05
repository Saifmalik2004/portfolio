
package com.saif.portfolio.service.impl;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.saif.portfolio.exception.ResourceNotFoundException;
import com.saif.portfolio.model.Skill;
import com.saif.portfolio.repository.SkillRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class SkillServiceImpl {

    private final SkillRepository skillRepository;

    // ----------------- READ METHODS WITH CACHE -----------------

    @Cacheable(value = "skillsByCategory", key = "#category")
    public List<Skill> getSkillsByCategorySorted(String category) {
        if (category == null || category.trim().isEmpty()) {
            throw new IllegalArgumentException("Category must not be null or empty");
        }
        return skillRepository.findByCategoryIgnoreCaseOrderByPriorityAsc(category);
    }

    @Cacheable(value = "allSkills")
    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    public Skill getSkillById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Skill id must not be null");
        }
        return skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + id));
    }

    // ----------------- CREATE / UPDATE -----------------

    @Transactional
    @CacheEvict(value = {"allSkills", "skillsByCategory"}, allEntries = true)
    public Skill createSkill(Skill skill) {
        if (skill == null) {
            throw new IllegalArgumentException("Skill must not be null");
        }
        if (skillRepository.existsByNameIgnoreCase(skill.getName())) {
            throw new IllegalArgumentException("Skill with name '" + skill.getName() + "' already exists");
        }
        return skillRepository.save(skill);
    }

    @Transactional
    @CacheEvict(value = {"allSkills", "skillsByCategory"}, allEntries = true)
    public Skill updateSkill(Long id, Skill skillData) {
        System.out.println(skillData);
        if (id == null) {
            throw new IllegalArgumentException("Skill id must not be null");
        }
        if (skillData == null) {
            throw new IllegalArgumentException("Skill data must not be null");
        }
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + id));

        if (!skill.getName().equalsIgnoreCase(skillData.getName()) && skillRepository.existsByNameIgnoreCase(skillData.getName())) {
            throw new IllegalArgumentException("Skill with name '" + skillData.getName() + "' already exists");
        }

        skill.setName(skillData.getName());
        skill.setCategory(skillData.getCategory());
        skill.setPriority(skillData.getPriority());
        skill.setIconUrl(skillData.getIconUrl());
        return skillRepository.save(skill);
    }

    // ----------------- DELETE -----------------

    @Transactional
    @CacheEvict(value = {"allSkills", "skillsByCategory"}, allEntries = true)
    public Skill deleteSkill(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Skill id must not be null");
        }
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + id));
        skillRepository.deleteById(id);
        return skill;
    }
}
