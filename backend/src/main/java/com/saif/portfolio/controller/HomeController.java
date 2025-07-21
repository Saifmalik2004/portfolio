package com.saif.portfolio.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController // 👈 This marks it as a REST API controller
@RequestMapping("/api") // 👈 This sets the base path
public class HomeController {

    @GetMapping("/about")
    public String getAboutSection() {
        return "Hi, I’m Saif Malik — a passionate developer who builds full stack applications using Java, Spring Boot, and PostgreSQL."; // Replace with actual dynamic data later
    }
}
