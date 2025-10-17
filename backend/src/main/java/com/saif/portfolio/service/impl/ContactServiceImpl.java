package com.saif.portfolio.service.impl;

import java.util.List;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.saif.portfolio.dto.ContactRequest;
import com.saif.portfolio.exception.ResourceNotFoundException;
import com.saif.portfolio.model.Contact;
import com.saif.portfolio.repository.ContactRepository;
import com.saif.portfolio.service.ContactService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContactServiceImpl implements ContactService {

    private final ContactRepository contactRepository;

    // ----------------- READ METHODS WITH CACHE -----------------

    // ----------------- READ UNREAD CONTACTS -----------------
    @Cacheable(value = "unreadContactMessages")
    @Override
    public List<Contact> getUnreadContacts() {
        return contactRepository.findByReadFalse();
    }
    
    // ----------------- READ All CONTACTS -----------------

    @Cacheable(value = "allContactMessages")
    @Override
    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    @Override
    public Contact getContactById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Contact id must not be null");
        }
        return contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));
    }

    // ----------------- CREATE Method -----------------
@Transactional
@CacheEvict(value = {"allContactMessages", "unreadContactMessages"}, allEntries = true)
@Override
public void createContact(ContactRequest request) {
    if (request == null) {
        throw new IllegalArgumentException("Contact must not be null");
    }

    Contact contact = Contact.builder()
            .fullName(request.getFullName())
            .email(request.getEmail())
            .message(request.getMessage())
            .read(false) // default unread
            .build();

    contactRepository.save(contact); // sirf save ho jayega
}


    // ----------------- MARK AS READ -----------------
    
    @Transactional
    @CacheEvict(value = {"allContactMessages", "unreadContactMessages"}, allEntries = true)
    @Override
    public Contact markAsRead(Long id) {
        Contact contact = contactRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));
        
        contact.setRead(true);
        return contactRepository.save(contact);
    }

    // ----------------- MARK ALL AS READ -----------------
@Transactional
@CacheEvict(value = {"allContactMessages", "unreadContactMessages"}, allEntries = true)
@Override
public String markAllAsRead() {
    List<Contact> unreadContacts = contactRepository.findByReadFalse();
    
    if (unreadContacts.isEmpty()) {
        return "All contacts are already marked as read";
    }

    contactRepository.markAllAsReadBulk();
    return "Marked all unread contacts as read successfully";
}


    // ----------------- DELETE -----------------
    @Transactional
    @CacheEvict(value = {"allContactMessages", "unreadContactMessages"}, allEntries = true)
    @Override
    public Contact deleteContact(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Contact id must not be null");
        }
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));
        contactRepository.deleteById(id);
        return contact;
    }
}
