package com.saif.portfolio.service;

import com.saif.portfolio.dto.CertificateRequest;
import com.saif.portfolio.model.Certificate;

import java.util.List;

public interface CertificateService {
    List<Certificate> getAllCertificates();
    Certificate getCertificateById(Integer id);
    Certificate createCertificate(CertificateRequest request);
    Certificate updateCertificate(Integer id, CertificateRequest updated);
    Certificate deleteCertificate(Integer id);
}
