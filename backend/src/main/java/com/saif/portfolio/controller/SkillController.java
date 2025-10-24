package com.saif.portfolio.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.saif.portfolio.dto.ApiResponse;
import com.saif.portfolio.model.Skill;
import com.saif.portfolio.service.impl.SkillServiceImpl;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
public class SkillController {
    
    private final SkillServiceImpl skillService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Skill>>> getAllSkills() {
        List<Skill> skills = skillService.getAllSkills();
        return ResponseEntity.status(org.springframework.http.HttpStatus.OK)
            .body(new ApiResponse<>(200, "Skills fetched successfully", skills));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Skill>> getSkillById(@PathVariable Long id) {
        Skill skill = skillService.getSkillById(id);
        return ResponseEntity.status(org.springframework.http.HttpStatus.OK)
            .body(new ApiResponse<>(200, "Skill fetched successfully", skill));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<Skill>>> getSkillsByCategorySorted(@Valid @PathVariable String category) {
        List<Skill> skills = skillService.getSkillsByCategorySorted(category);
        if (skills.isEmpty()) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.NOT_FOUND)
                .body(new ApiResponse<>(404, "No skills found for category: " + category, null));
        }
        return ResponseEntity.status(org.springframework.http.HttpStatus.OK)
            .body(new ApiResponse<>(200, "Skills fetched by category and sorted by priority", skills));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Skill>> createSkill(@RequestBody Skill skill) {
        Skill saved = skillService.createSkill(skill);
        return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED)
            .body(new ApiResponse<>(201, "Skill created successfully", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Skill>> updateSkill(@PathVariable Long id, @RequestBody Skill skill) {
        Skill updated = skillService.updateSkill(id, skill);
        return ResponseEntity.status(org.springframework.http.HttpStatus.OK)
            .body(new ApiResponse<>(200, "Skill updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Skill>> deleteSkill(@PathVariable Long id) {
        Skill deleted = skillService.deleteSkill(id);
        return ResponseEntity.status(org.springframework.http.HttpStatus.OK)
            .body(new ApiResponse<>(200, "Skill deleted successfully", deleted));
    }
}