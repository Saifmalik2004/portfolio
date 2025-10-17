package com.saif.portfolio.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CertificateRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;

    @NotBlank(message = "Issued organisation is required")
    @Size(max = 255, message = "Issued organisation must not exceed 255 characters")
    private String issuedOrganisation;

    @NotNull(message = "Issue date is required")
    private LocalDate issueDate;

    @NotBlank(message = "Media URL is required")
    private String mediaUrl;

    @NotBlank(message = "Credential ID is required")
    @Size(max = 255, message = "Credential ID must not exceed 255 characters")
    private String credentialId;

    @NotBlank(message = "Credential URL is required")
    private String credentialUrl;
}
