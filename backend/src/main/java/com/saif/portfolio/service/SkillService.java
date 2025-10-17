package com.saif.portfolio.service;

import com.saif.portfolio.model.Skill;
import java.util.List;

public interface SkillService {
    List<Skill> getSkillsByCategorySorted(String category);
    List<Skill> getAllSkills();
    Skill getSkillById(Long id);
    Skill createSkill(Skill skill);
    Skill updateSkill(Long id, Skill skillData);
    Skill deleteSkill(Long id);
}
