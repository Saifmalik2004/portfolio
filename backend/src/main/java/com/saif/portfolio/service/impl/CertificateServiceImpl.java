package com.saif.portfolio.service.impl;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.saif.portfolio.dto.CertificateRequest;
import com.saif.portfolio.exception.ResourceNotFoundException;
import com.saif.portfolio.model.Certificate;
import com.saif.portfolio.repository.CertificateRepository;
import com.saif.portfolio.service.CertificateService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CertificateServiceImpl implements CertificateService {

    private final CertificateRepository certificateRepository;

    // -------------------------------------------------
    // READ
    // -------------------------------------------------


    @Override
    @Cacheable(value = "certificatesPaged", key = "#page + '-' + #size")
    @Transactional(readOnly = true)
    public Page<Certificate> getAllCertificates(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return certificateRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Certificate getCertificateById(Integer id) {
        return certificateRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Certificate not found with id: " + id));
    }

    // -------------------------------------------------
    // CREATE
    // -------------------------------------------------

    @Override
    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "certificatesPaged", allEntries = true)
    })
    public Certificate createCertificate(CertificateRequest request) {

        String title = request.getTitle().trim();
        String org = request.getIssuedOrganisation().trim();

        if (certificateRepository
                .existsByTitleIgnoreCaseAndIssuedOrganisationIgnoreCase(title, org)) {
            throw new IllegalArgumentException(
                    "Certificate already exists for title '" + title +
                    "' and organisation '" + org + "'"
            );
        }

        Certificate certificate = Certificate.builder()
                .title(title)
                .issuedOrganisation(org)
                .issueDate(request.getIssueDate())
                .credentialId(request.getCredentialId())
                .credentialUrl(request.getCredentialUrl())
                .mediaUrl(request.getMediaUrl())
                .build();

        return certificateRepository.save(certificate);
    }

    // -------------------------------------------------
    // UPDATE
    // -------------------------------------------------

    @Override
    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "certificatesPaged", allEntries = true)
    })
    public Certificate updateCertificate(Integer id, CertificateRequest request) {

        Certificate existing = certificateRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Certificate not found with id: " + id));

        String newTitle = request.getTitle().trim();
        String newOrg = request.getIssuedOrganisation().trim();

        boolean changed =
                !existing.getTitle().equalsIgnoreCase(newTitle)
                || !existing.getIssuedOrganisation().equalsIgnoreCase(newOrg);

        if (changed && certificateRepository
                .existsByTitleIgnoreCaseAndIssuedOrganisationIgnoreCase(newTitle, newOrg)) {
            throw new IllegalArgumentException(
                    "Certificate already exists for title '" + newTitle +
                    "' and organisation '" + newOrg + "'"
            );
        }

        existing.setTitle(newTitle);
        existing.setIssuedOrganisation(newOrg);
        existing.setIssueDate(request.getIssueDate());
        existing.setCredentialId(request.getCredentialId());
        existing.setCredentialUrl(request.getCredentialUrl());
        existing.setMediaUrl(request.getMediaUrl());

        return certificateRepository.save(existing);
    }

    // -------------------------------------------------
    // DELETE
    // -------------------------------------------------

    @Override
    @Transactional
    @Caching(evict = {
        @CacheEvict(value = "certificatesPaged", allEntries = true)
    })
    public Certificate deleteCertificate(Integer id) {

        Certificate certificate = certificateRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Certificate not found with id: " + id));

        certificateRepository.delete(certificate);
        return certificate;
    }
}
