package com.saif.portfolio.controller;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.saif.portfolio.dto.ApiResponse;
import com.saif.portfolio.dto.CertificateRequest;
import com.saif.portfolio.dto.PagedResponse;
import com.saif.portfolio.model.Certificate;
import com.saif.portfolio.service.CertificateService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService certificateService;


    // -------------------------------------------------
    // GET ALL (PAGED)
    // -------------------------------------------------
    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<Certificate>>> getAllCertificatesPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "6") int size) {

        Page<Certificate> result =
                certificateService.getAllCertificates(page, size);

        PagedResponse<Certificate> response = new PagedResponse<>(
                result.getContent(),
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages(),
                result.isLast()
        );

        return ResponseEntity.ok(
                new ApiResponse<>(HttpStatus.OK.value(),
                        "Certificates fetched successfully",
                        response)
        );
    }

    // -------------------------------------------------
    // GET BY ID
    // -------------------------------------------------
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Certificate>> getCertificateById(
            @PathVariable Integer id) {

        Certificate certificate = certificateService.getCertificateById(id);

        return ResponseEntity.ok(
                new ApiResponse<>(HttpStatus.OK.value(),
                        "Certificate fetched successfully",
                        certificate)
        );
    }

    // -------------------------------------------------
    // CREATE
    // -------------------------------------------------
    @PostMapping
    public ResponseEntity<ApiResponse<Certificate>> createCertificate(
            @Valid @RequestBody CertificateRequest request) {

        Certificate certificate =
                certificateService.createCertificate(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(HttpStatus.CREATED.value(),
                        "Certificate created successfully",
                        certificate));
    }

    // -------------------------------------------------
    // UPDATE
    // -------------------------------------------------
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Certificate>> updateCertificate(
            @PathVariable Integer id,
            @Valid @RequestBody CertificateRequest request) {

        Certificate certificate =
                certificateService.updateCertificate(id, request);

        return ResponseEntity.ok(
                new ApiResponse<>(HttpStatus.OK.value(),
                        "Certificate updated successfully",
                        certificate)
        );
    }

    // -------------------------------------------------
    // DELETE
    // -------------------------------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Certificate>> deleteCertificate(
            @PathVariable Integer id) {

        Certificate certificate =
                certificateService.deleteCertificate(id);

        return ResponseEntity.ok(
                new ApiResponse<>(HttpStatus.OK.value(),
                        "Certificate deleted successfully",
                        certificate)
        );
    }
}
