package com.ngo.foundation.controller;

import com.ngo.foundation.dto.contact.ContactRequest;
import com.ngo.foundation.service.ContactService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitContactForm(@RequestBody ContactRequest request) {
        Map<String, Object> response = contactService.processContactMessage(request);

        return Boolean.TRUE.equals(response.get("success"))
                ? ResponseEntity.ok(response)
                : ResponseEntity.internalServerError().body(response);
    }
}