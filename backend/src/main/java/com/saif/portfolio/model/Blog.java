package com.saif.portfolio.model;

import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "blogs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Blog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank(message = "Title must not be blank")
    @Column(nullable = false)
    private String title;
    @NotBlank(message = "Slug must not be blank")
    @Column(nullable = false, unique = true)
    private String slug;
    @NotBlank(message = "Category must not be blank")
    @Column(nullable = false)
    private String category;
    @NotBlank(message = "Read time must not be blank")
    @Column(nullable = false)
    private String readTime;
    private Instant createdAt;
    private Instant updatedAt;
    @NotBlank(message = "Author must not be blank")
    @Column(nullable = false)
    private String author;
    @NotBlank(message = "Summary must not be blank")
    @Size(max = 1000, message = "Summary must be at most 1000 characters")
    @Column(length = 1000)
    private String summary;

    @NotBlank(message = "Content must not be blank")
    @Lob
    @Column(columnDefinition = "TEXT")
    private String content;

    @OneToMany(mappedBy = "blog", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<BlogImage> images;
}
