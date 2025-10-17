package com.saif.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResetPasswordRequest {
    @NotBlank(message = "token is required")
    private String token;

    @NotBlank(message = "newPassword is required")
    private String newPassword;
}