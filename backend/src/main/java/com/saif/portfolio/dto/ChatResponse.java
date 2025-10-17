package com.saif.portfolio.dto;

public class ChatResponse {
    private String message;
    private String source; // "projects", "skills", "blogs", "info"

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }
}
