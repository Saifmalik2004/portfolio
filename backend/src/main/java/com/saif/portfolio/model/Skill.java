package com.saif.portfolio.model;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(
    name = "skills",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"name", "category"})
    }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Skill name must not be blank")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Category must not be blank")
    @Column(nullable = false, length = 50)
    private String category; // frontend, backend, tool

    @NotNull(message = "Priority must not be null")
    @Min(value = 1, message = "Priority must be at least 1")
    @Max(value = 3, message = "Priority must be at most 3")
    @Column(nullable = false)
    private Integer priority;

    @NotBlank(message = "Icon URL must not be blank")
    @Column(name = "icon_url", nullable = false, length = 255)
    private String iconUrl;

    @ManyToMany(mappedBy = "technologies")
    @JsonIgnore
    private Set<Project> projects;
}
