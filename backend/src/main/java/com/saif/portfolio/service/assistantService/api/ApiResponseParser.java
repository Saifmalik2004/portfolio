package com.saif.portfolio.service.assistantService.api;



import java.util.List;
import java.util.Map;

import com.saif.portfolio.service.assistantService.utils.FallbackResponse;

public class ApiResponseParser {

    @SuppressWarnings("unchecked")
    public static String parse(Map<String, Object> response, String language) {
        if (response == null || !response.containsKey("choices")) {
            return FallbackResponse.generic(language, "Empty response from API.");
        }

        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
        if (choices.isEmpty()) return FallbackResponse.generic(language, "No choices found in API response.");

        Map<String, Object> choice = choices.get(0);
        Map<String, Object> message = (Map<String, Object>) choice.get("message");
        String content = (String) message.get("content");

        return (content == null || content.isBlank())
                ? FallbackResponse.generic(language, "API returned empty content.")
                : content;
    }
}
