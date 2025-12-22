package com.saif.portfolio.model;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(
    name = "projects",
    indexes = {
        @Index(name = "idx_projects_published_created_at", columnList = "published, created_at"),
        @Index(name = "idx_projects_featured_published", columnList = "featured, published"),
        @Index(name = "idx_projects_type", columnList = "type")
    }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "github_url")
    private String githubUrl;

    @Column(name = "live_demo_url")
    private String liveDemoUrl;

    @Column(nullable = false)
    private boolean live = false;

    @Column(nullable = false)
    private boolean published = false;

    @Column(nullable = false)
    private boolean featured = false;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProjectKeyFeature> keyFeatures = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "project_technologies",
        joinColumns = @JoinColumn(name = "project_id"),
        inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    private List<Skill> technologies;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectType type;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProjectImage> images;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;
}
