package com.saif.portfolio.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;

@Configuration
@Getter
public class OpenRouterConfig {

    @Value("${openrouter.api.key}")
    private String apiKey;

    @Value("${openrouter.api.url:https://openrouter.ai/api/v1/chat/completions}")
    private String apiUrl;

    @Value("${openrouter.api.model:deepseek/deepseek-r1:free}")
    private String model;

    @Value("${openrouter.api.temperature:0.7}")
    private double temperature;

    @Value("${openrouter.api.site.url:}")
    private String siteUrl;

    @Value("${openrouter.api.site.name:}")
    private String siteName;
}
