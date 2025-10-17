package com.saif.portfolio.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "certificates")
@Data                   // Getters + Setters + toString + equals + hashCode
@NoArgsConstructor      // Default constructor
@AllArgsConstructor     // All args constructor
@Builder                // Builder pattern
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(name = "issued_organisation", nullable = false)
    private String issuedOrganisation;

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;

    @Column(name = "media_url", nullable = false, columnDefinition = "TEXT")
    private String mediaUrl;

    @Column(name = "credential_id", nullable = false)
    private String credentialId;

    @Column(name = "credential_url", nullable = false)
    private String credentialUrl;
}
