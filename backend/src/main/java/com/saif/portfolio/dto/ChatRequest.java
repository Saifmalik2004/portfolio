package com.saif.portfolio.dto;

public class ChatRequest {
    private String message;
    private String language; // "en" for English, "hi" for Hindi

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }
}
