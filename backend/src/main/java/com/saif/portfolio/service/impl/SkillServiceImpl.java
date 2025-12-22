package com.saif.portfolio.service.impl;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.saif.portfolio.exception.ResourceNotFoundException;
import com.saif.portfolio.model.Skill;
import com.saif.portfolio.repository.SkillRepository;
import com.saif.portfolio.service.SkillService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SkillServiceImpl implements SkillService {

    private final SkillRepository skillRepository;

    // ----------------- READ METHODS WITH CACHE -----------------

    @Cacheable(value = "skillsByCategory", key = "#category")
    @Transactional(readOnly = true)
    @Override
    public List<Skill> getSkillsByCategorySorted(String category) {
        if (category == null || category.trim().isEmpty()) {
            throw new IllegalArgumentException("Category must not be null or empty");
        }
        String normalized = category.trim().toLowerCase();
        return skillRepository.findByCategoryIgnoreCaseOrderByPriorityAsc(normalized);
    }

    @Cacheable(value = "allSkills")
    @Transactional(readOnly = true)
    @Override
    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    @Transactional(readOnly = true)
    @Override
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
    @Override
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
    @Override
    public Skill updateSkill(Long id, Skill skillData) {
        if (id == null) {
            throw new IllegalArgumentException("Skill id must not be null");
        }
        if (skillData == null) {
            throw new IllegalArgumentException("Skill data must not be null");
        }

        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + id));

        // Name change hone par unique check
        if (!skill.getName().equalsIgnoreCase(skillData.getName())
                && skillRepository.existsByNameIgnoreCase(skillData.getName())) {
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
    @Override
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
