package com.saif.portfolio.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.saif.portfolio.dto.ApiResponse;
import com.saif.portfolio.dto.CertificateRequest;
import com.saif.portfolio.model.Certificate;
import com.saif.portfolio.service.impl.CertificateServiceImpl;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateServiceImpl certificateService;

    // ----------------- READ -----------------

    @GetMapping
    public ResponseEntity<ApiResponse<List<Certificate>>> getAllCertificates() {
        List<Certificate> responses = certificateService.getAllCertificates();
        return ResponseEntity.ok(new ApiResponse<>(200, "Certificates fetched successfully", responses));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Certificate>> getCertificateById(@PathVariable Integer id) {
        Certificate response = certificateService.getCertificateById(id);
        return ResponseEntity.ok(new ApiResponse<>(200, "Certificate fetched successfully", response));
    }

    // ----------------- CREATE -----------------

    @PostMapping
    public ResponseEntity<ApiResponse<Certificate>> createCertificate(
            @Valid @RequestBody CertificateRequest request) {
        Certificate response = certificateService.createCertificate(request);
        return ResponseEntity.status(201).body(new ApiResponse<>(201, "Certificate created successfully", response));
    }

    // ----------------- UPDATE -----------------

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Certificate>> updateCertificate(
            @PathVariable Integer id,
            @Valid @RequestBody CertificateRequest request) {
        Certificate response = certificateService.updateCertificate(id, request);
        return ResponseEntity.ok(new ApiResponse<>(200, "Certificate updated successfully", response));
    }

    // ----------------- DELETE -----------------

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Certificate>> deleteCertificate(@PathVariable Integer id) {
        Certificate response = certificateService.deleteCertificate(id);
        return ResponseEntity.ok(new ApiResponse<>(200, "Certificate deleted successfully", response));
    }
}
