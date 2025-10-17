package com.saif.portfolio.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserProfileDto {
    private Long id;
    private String email;
    private String username;
    private String fullName;
    private boolean isEmailVerified;
    private boolean isActive;
    private List<String> roles;

}