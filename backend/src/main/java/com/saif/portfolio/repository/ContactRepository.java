package com.saif.portfolio.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.saif.portfolio.model.Contact;

public interface ContactRepository extends JpaRepository<Contact, Long> {
    List<Contact> findByReadFalse();

    @Modifying
@Query("UPDATE Contact c SET c.read = true WHERE c.read = false")
void markAllAsReadBulk();

 @Query("SELECT COUNT(b) FROM Contact b")
       long countContact();

    @Query("SELECT COUNT(c) FROM Contact c WHERE c.read = false")
long countUnreadMessages();


}
