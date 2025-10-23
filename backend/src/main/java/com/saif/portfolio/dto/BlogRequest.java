package com.saif.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // getter, setter, toString, equals, hashCode
@NoArgsConstructor
@AllArgsConstructor
public class BlogRequest {

    @NotBlank(message = "Title must not be blank")
    private String title;

    @NotBlank(message = "Slug must not be blank")
    private String slug;

    @NotBlank(message = "Summary must not be blank")
    @Size(max = 1000, message = "Summary must be at most 1000 characters")
    private String summary;

    @NotBlank(message = "Content must not be blank")
    private String content;

    @NotBlank(message = "Category must not be blank")
    private String category;

    @NotBlank(message = "Read time must not be blank")
    private String readTime;

    @NotBlank(message = "Author must not be blank")
    private String author;

    private ImageUploadResponse image;
    

}
