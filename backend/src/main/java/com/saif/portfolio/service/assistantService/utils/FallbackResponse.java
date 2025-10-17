package com.saif.portfolio.service.assistantService.utils;

import org.springframework.web.client.HttpClientErrorException;

public class FallbackResponse {

    public static String generic(String language, String errorMessage) {
        return language.equalsIgnoreCase("hi")
                ? "Namaste! Main Saif ka AI assistant hoon. " + errorMessage
                : "Hello! I'm Saif's AI assistant. " + errorMessage;
    }

    public static String fromHttpError(HttpClientErrorException e, String language) {
        int status = e.getStatusCode().value();
        return switch (status) {
            case 401 -> generic(language, "Invalid API key.");
            case 429 -> generic(language, "Rate limit exceeded.");
            case 400 -> generic(language, "Invalid request.");
            case 404 -> generic(language, "API endpoint not found.");
            default -> generic(language, "Error: " + e.getMessage());
        };
    }
}
