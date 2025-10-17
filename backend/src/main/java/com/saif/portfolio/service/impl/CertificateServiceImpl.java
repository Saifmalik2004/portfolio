package com.saif.portfolio.service.impl;


import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.saif.portfolio.dto.CertificateRequest;
import com.saif.portfolio.exception.ResourceNotFoundException;
import com.saif.portfolio.model.Certificate;
import com.saif.portfolio.repository.CertificateRepository;
import com.saif.portfolio.service.CertificateService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CertificateServiceImpl implements CertificateService {

    private final CertificateRepository certificateRepository;

    // ----------------- READ METHODS WITH CACHE -----------------

    @Cacheable(value = "allCertificates")
    @Override
    public List<Certificate> getAllCertificates() {
        return certificateRepository.findAll();
    }

    @Override
    public Certificate getCertificateById(Integer id) {
        if (id == null) {
            throw new IllegalArgumentException("Certificate id must not be null");
        }
        return certificateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found with id: " + id));
    }

    // ----------------- CREATE -----------------

   @Transactional
@CacheEvict(value = {"allCertificates"}, allEntries = true)
@Override
public Certificate createCertificate(CertificateRequest request) {
    if (request == null) {
        throw new IllegalArgumentException("Certificate must not be null");
    }

    // Business logic: Avoid duplicate title + organisation
    boolean exists = certificateRepository
            .existsByTitleIgnoreCaseAndIssuedOrganisationIgnoreCase(
                    request.getTitle(),
                    request.getIssuedOrganisation()
            );
    if (exists) {
        throw new IllegalArgumentException("Certificate already exists for title '"
                + request.getTitle() + "' and organisation '" + request.getIssuedOrganisation() + "'");
    }

    // DTO → Entity conversion
    Certificate certificate = Certificate.builder()
            .title(request.getTitle())
            .issuedOrganisation(request.getIssuedOrganisation())
            .issueDate(request.getIssueDate())
            .credentialId(request.getCredentialId())
            .mediaUrl(request.getMediaUrl())
            .credentialUrl(request.getCredentialUrl())
            .build();

    return certificateRepository.save(certificate);
}


    // ----------------- UPDATE -----------------

    @Transactional
    @CacheEvict(value = {"allCertificates"}, allEntries = true)
    @Override
    public Certificate updateCertificate(Integer id, CertificateRequest updated) {
        if (id == null) {
            throw new IllegalArgumentException("Certificate id must not be null");
        }
        if (updated == null) {
            throw new IllegalArgumentException("Certificate data must not be null");
        }

        Certificate existing = certificateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found with id: " + id));

        // If title/org changed, check duplicates
        boolean duplicate = !existing.getTitle().equalsIgnoreCase(updated.getTitle())
                || !existing.getIssuedOrganisation().equalsIgnoreCase(updated.getIssuedOrganisation());
        if (duplicate && certificateRepository
                .existsByTitleIgnoreCaseAndIssuedOrganisationIgnoreCase(updated.getTitle(), updated.getIssuedOrganisation())) {
            throw new IllegalArgumentException("Certificate already exists for title '"
                    + updated.getTitle() + "' and organisation '" + updated.getIssuedOrganisation() + "'");
        }

        existing.setTitle(updated.getTitle());
        existing.setIssuedOrganisation(updated.getIssuedOrganisation());
        existing.setIssueDate(updated.getIssueDate());
        existing.setMediaUrl(updated.getMediaUrl());
        existing.setCredentialId(updated.getCredentialId());
        existing.setCredentialUrl(updated.getCredentialUrl());

        return certificateRepository.save(existing);
    }

    // ----------------- DELETE -----------------

    @Transactional
    @CacheEvict(value = {"allCertificates"}, allEntries = true)
    @Override
    public Certificate deleteCertificate(Integer id) {
        if (id == null) {
            throw new IllegalArgumentException("Certificate id must not be null");
        }
        Certificate certificate = certificateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found with id: " + id));
        certificateRepository.deleteById(id);
        return certificate;
    }
}
