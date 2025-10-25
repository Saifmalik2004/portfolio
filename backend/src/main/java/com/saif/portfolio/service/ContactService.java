package com.saif.portfolio.service;

import java.util.List;

import com.saif.portfolio.dto.ContactRequest;
import com.saif.portfolio.model.Contact;

public interface ContactService {
    List<Contact> getUnreadContacts();
    List<Contact> getAllContacts();
    Contact getContactById(Long id);
    void createContact(ContactRequest request);
    Contact markAsRead(Long id);
    String markAllAsRead();
    Contact deleteContact(Long id);
    long getUnreadMsgCount();
}
