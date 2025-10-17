package com.saif.portfolio.dto;

import lombok.Data;

@Data
public class VerifyEmailRequest {
    private String email;
    private String otp;
}