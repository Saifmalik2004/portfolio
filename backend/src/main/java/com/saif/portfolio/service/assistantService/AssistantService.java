package com.saif.portfolio.service.assistantService;

import com.saif.portfolio.dto.ChatRequest;
import com.saif.portfolio.dto.ChatResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.saif.portfolio.service.assistantService.api.ApiCalling;
import com.saif.portfolio.service.assistantService.context.ContextBuilder;
import com.saif.portfolio.service.assistantService.context.PromptBuilder;

@Service
public class AssistantService {

    @Autowired private ContextBuilder contextBuilder;
    @Autowired private PromptBuilder promptBuilder;
    @Autowired private ApiCalling apicallingclient;

    @Cacheable(value = "chatResponses", key = "#request.message + #request.language")
    public ChatResponse processChat(ChatRequest request) {
        String context = contextBuilder.build(request.getMessage().toLowerCase());
        String prompt = promptBuilder.build(context, request.getMessage(), request.getLanguage());

        String apiResponse = apicallingclient.call(prompt, promptBuilder.getSystemPrompt(), request.getLanguage());

        ChatResponse response = new ChatResponse();
        response.setMessage(apiResponse);
        response.setSource(contextBuilder.determineSource(request.getMessage().toLowerCase()));
        return response;
    }
}
