package com.saif.portfolio.dto;

public record SimpleProjectResponse(
    Integer id,
    String title,
    String slug,
    String description,
    String githubUrl,
    String liveDemoUrl,
    boolean live,
    boolean published,
    boolean featured,
    String type,
    String imageUrl
) {}
