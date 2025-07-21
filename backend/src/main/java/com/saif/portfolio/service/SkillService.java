
package com.saif.portfolio.service;

import com.saif.portfolio.model.Skill;
import com.saif.portfolio.repository.SkillRepository;
import com.saif.portfolio.exception.ResourceNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository skillRepository;

    public List<Skill> getSkillsByCategorySorted(String category) {
        if (category == null || category.trim().isEmpty()) {
            throw new IllegalArgumentException("Category must not be null or empty");
        }
        return skillRepository.findByCategoryIgnoreCaseOrderByPriorityAsc(category);
    }

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

    @Transactional
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
    public Skill updateSkill(Long id, Skill skillData) {
        if (id == null) {
            throw new IllegalArgumentException("Skill id must not be null");
        }
        if (skillData == null) {
            throw new IllegalArgumentException("Skill data must not be null");
        }
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + id));
        // Only check for duplicate if name is changing
        if (!skill.getName().equalsIgnoreCase(skillData.getName()) && skillRepository.existsByNameIgnoreCase(skillData.getName())) {
            throw new IllegalArgumentException("Skill with name '" + skillData.getName() + "' already exists");
        }
        skill.setName(skillData.getName());
        skill.setCategory(skillData.getCategory());
        skill.setPriority(skillData.getPriority());
        return skillRepository.save(skill);
    }

    @Transactional
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
