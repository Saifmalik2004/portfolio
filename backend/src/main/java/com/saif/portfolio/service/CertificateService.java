package com.saif.portfolio.service;

import org.springframework.data.domain.Page;

import com.saif.portfolio.dto.CertificateRequest;
import com.saif.portfolio.model.Certificate;

public interface CertificateService {
    Page<Certificate> getAllCertificates(int page, int size);
    Certificate getCertificateById(Integer id);
    Certificate createCertificate(CertificateRequest request);
    Certificate updateCertificate(Integer id, CertificateRequest updated);
    Certificate deleteCertificate(Integer id);
}
