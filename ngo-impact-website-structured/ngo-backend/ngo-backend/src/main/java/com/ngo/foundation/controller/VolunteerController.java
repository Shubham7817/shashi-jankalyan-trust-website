package com.ngo.foundation.controller;

import com.ngo.foundation.dto.Volunteer.VolunteerRequest;
import com.ngo.foundation.entity.Volunteer;
import com.ngo.foundation.repository.VolunteerRepository;
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

    @PostMapping("/submit")
    public ResponseEntity<?> submitVolunteerForm(@RequestBody VolunteerRequest request) {
        Map<String, Object> response = volunteerService.saveVolunteer(request);

        if (Boolean.TRUE.equals(response.get("success"))) {
            return ResponseEntity.ok(response);
        } else if ("This person has already filled the form.".equals(response.get("message"))) {
            // Return 409 Conflict if duplicate is found
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        } else {
            // Return 500 for other database errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/check")
    public ResponseEntity<?> checkVolunteerExists(@RequestBody VolunteerRequest request) {
        // Uses your existing repository method to check for duplicates
        boolean exists = volunteerRepository.existsByNameAndEmailAndPhone(
                request.getEmail(),
                request.getPhone(),
                request.getName()
        );

        if (exists) {
            return ResponseEntity.ok(Map.of(
                    "exists", true,
                    "message", "You have already registered as a volunteer with these details."
            ));
        }

        return ResponseEntity.ok(Map.of("exists", false));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Volunteer>> getAllVolunteers() {
        // Fetches all volunteers, sorted by newest first
        List<Volunteer> volunteers = volunteerRepository.findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(volunteers);
    }
}