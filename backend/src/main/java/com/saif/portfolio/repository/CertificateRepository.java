package com.saif.portfolio.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.saif.portfolio.model.Certificate;

public interface CertificateRepository extends JpaRepository<Certificate, Integer> {
    
    boolean existsByTitleIgnoreCaseAndIssuedOrganisationIgnoreCase(String title, String issuedOrganisation);

       @Query("SELECT COUNT(b) FROM Certificate b")
       long countCertificate();
    
}
