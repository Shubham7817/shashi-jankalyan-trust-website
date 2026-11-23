package com.ngo.foundation.controller;

import com.ngo.foundation.dto.Volunteer.VolunteerRequest;
import com.ngo.foundation.entity.Volunteer;
import com.ngo.foundation.repository.VolunteerRepository;
import com.ngo.foundation.service.EmailService;
import com.ngo.foundation.service.VolunteerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/volunteers")
@CrossOrigin(origins = "*")
public class VolunteerController {

    @Autowired
    private VolunteerRepository volunteerRepository;

    // You likely also have your service injected here
    @Autowired
    private VolunteerService volunteerService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/submit")
    public ResponseEntity<?> submitVolunteerForm(@RequestBody VolunteerRequest request) {
        try {
            Map<String, Object> response = volunteerService.saveVolunteer(request);

            if (Boolean.TRUE.equals(response.get("success"))) {
                try {   // email AFTER the data is committed; a mail failure must not lose the registration
                    emailService.sendWelcomeEmail(request.getEmail(), request.getName(),
                            (String) response.get("username"), (String) response.get("password"));
                } catch (Exception mailEx) {
                    mailEx.printStackTrace();
                }
                return ResponseEntity.ok(response);
            }
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);   // duplicates

        } catch (Exception e) {
            e.printStackTrace();
            Throwable root = org.springframework.core.NestedExceptionUtils.getMostSpecificCause(e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Save failed: " + root.getMessage()));
        }
    }

    @PostMapping("/check")
    public ResponseEntity<?> checkVolunteerExists(@RequestBody VolunteerRequest request) {
        boolean exists = volunteerRepository.existsByEmailOrPhone(request.getEmail(), request.getPhone());
        return ResponseEntity.ok(exists
                ? Map.of("exists", true, "message", "You have already registered as a volunteer with these details.")
                : Map.of("exists", false));
    }
}