package com.saif.portfolio.service.assistantService.api;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.saif.portfolio.config.OpenRouterConfig;
import com.saif.portfolio.service.assistantService.utils.FallbackResponse;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ApiCalling {

    private static final Logger log = LoggerFactory.getLogger(ApiCalling.class);

    private static final int DEFAULT_MAX_TOKENS = 500;

    private final RestTemplate restTemplate;
    private final OpenRouterConfig config;

    /**
     * Calls the OpenRouter API with a user and system prompt.
     *
     * @param prompt       User message
     * @param systemPrompt System instructions
     * @param language     Response language
     * @return Parsed response or fallback message
     */
    public String call(final String prompt, final String systemPrompt, final String language) {
        if (prompt == null || prompt.isBlank()) {
            log.warn("Prompt is empty. Returning fallback response.");
            return FallbackResponse.generic(language, "No prompt provided.");
        }

        try {
            final HttpHeaders headers = buildHeaders();
            final Map<String, Object> body = buildRequestBody(prompt, systemPrompt);

            final HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            log.debug("Calling OpenRouter API [{}] with model [{}]", config.getApiUrl(), config.getModel());

            @SuppressWarnings("unchecked")
            final Map<String, Object> response =
                    restTemplate.postForObject(config.getApiUrl(), entity, Map.class);

            if (response == null) {
                log.error("OpenRouter API returned null response");
                return FallbackResponse.generic(language, "No response from API.");
            }

            return ApiResponseParser.parse(response, language);

        } catch (HttpClientErrorException e) {
            log.error("OpenRouter API error [{}]: {}", e.getStatusCode(), e.getResponseBodyAsString());
            return FallbackResponse.fromHttpError(e, language);
        } catch (RestClientException e) {
            log.error("Unexpected error while calling OpenRouter API", e);
            return FallbackResponse.generic(language, "Technical issue occurred.");
        }
    }

    /**
     * Builds request headers with authentication and metadata.
     */
    private HttpHeaders buildHeaders() {
        final HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(config.getApiKey());
        headers.setContentType(MediaType.APPLICATION_JSON);

        if (config.getSiteUrl() != null && !config.getSiteUrl().isBlank()) {
            headers.set("HTTP-Referer", config.getSiteUrl());
        }
        if (config.getSiteName() != null && !config.getSiteName().isBlank()) {
            headers.set("X-Title", config.getSiteName());
        }
        return headers;
    }

    /**
     * Builds request body for OpenRouter API.
     */
    private Map<String, Object> buildRequestBody(final String prompt, final String systemPrompt) {
        return Map.of(
                "model", config.getModel(),
                "messages", List.of(
                        Map.of("role", "system", "content", systemPrompt != null ? systemPrompt : ""),
                        Map.of("role", "user", "content", prompt)
                ),
                "temperature", config.getTemperature(),
                "max_tokens", DEFAULT_MAX_TOKENS,
                "stream", false
        );
    }
}
