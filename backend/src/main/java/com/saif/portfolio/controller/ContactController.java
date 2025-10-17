package com.saif.portfolio.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.saif.portfolio.dto.ContactRequest;
import com.saif.portfolio.model.Contact;
import com.saif.portfolio.payload.ApiResponse;
import com.saif.portfolio.service.impl.ContactServiceImpl;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactServiceImpl contactService;

    // ----------------- READ -----------------

    @GetMapping
    public ResponseEntity<ApiResponse<List<Contact>>> getContacts() {
        List<Contact> responses = contactService.getAllContacts();
        return ResponseEntity.ok(new ApiResponse<>(200, "All contacts fetched successfully", responses));
    }

    @GetMapping("/unread")
    public ResponseEntity<ApiResponse<List<Contact>>> getUnreadContacts() {
        List<Contact> responses = contactService.getUnreadContacts();
        return ResponseEntity.ok(new ApiResponse<>(200, "Unread contacts fetched successfully", responses));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Contact>> getContactById(@PathVariable Long id) {
        Contact response = contactService.getContactById(id);
        return ResponseEntity.ok(new ApiResponse<>(200, "Contact fetched successfully", response));
    }

    // ----------------- CREATE -----------------

    @PostMapping
    public ResponseEntity<ApiResponse<String>> createContact(
            @Valid @RequestBody ContactRequest request) {
             contactService.createContact(request);
        return ResponseEntity.status(201).body(new ApiResponse<>(201, "Message Sent successfully", "OK"));
    }

    // ----------------- UPDATE (Mark as Read) -----------------

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Contact>> markAsRead(@PathVariable Long id) {
        Contact response = contactService.markAsRead(id);
        return ResponseEntity.ok(new ApiResponse<>(200, "Contact marked as read successfully", response));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<String>> markAllAsRead() {
        String res=contactService.markAllAsRead();
        return ResponseEntity.ok(new ApiResponse<>(200, res, "OK"));
    }

    // ----------------- DELETE -----------------

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Contact>> deleteContact(@PathVariable Long id) {
        Contact response = contactService.deleteContact(id);
        return ResponseEntity.ok(new ApiResponse<>(200, "Contact deleted successfully", response));
    }
}
