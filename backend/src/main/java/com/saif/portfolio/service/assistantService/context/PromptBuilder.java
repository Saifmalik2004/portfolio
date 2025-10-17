package com.saif.portfolio.service.assistantService.context;

import org.springframework.stereotype.Component;

@Component
public class PromptBuilder {

    private static final String SYSTEM_PROMPT = """
    You are Saif's AI assistant 🤖. Respond in a friendly, conversational tone with emojis 😊.
    🔹 Language rule: 
       - If user asks in English → reply only in English.  
       - If user asks in Hinglish/Hindi → reply in Hinglish.  
    Always answer accurately using provided context (projects, skills, blogs, personal info).  
    If info is missing, politely say:  
    "Bhai, iske baare mein zyada nahi jaanta, par yeh bata sakta hoon..."  

    Keep responses short, engaging, and human-like! ✨
""";

    public String build(String context, String userMessage, String language) {
        return String.format("""
            Context: %s

            System: %s

            User (%s): %s

            Assistant: Let me help you with information about Saif.
        """, context, SYSTEM_PROMPT, language, userMessage);
    }

    public String getSystemPrompt() {
        return SYSTEM_PROMPT;
    }
}
