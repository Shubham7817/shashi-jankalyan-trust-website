package com.ngo.foundation.controller;

import com.ngo.foundation.dto.Volunteer.VolunteerRequest;
import com.ngo.foundation.service.VolunteerService;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/volunteers")
@CrossOrigin(origins = "*")
public class VolunteerController {

    private final VolunteerService volunteerService;

    public VolunteerController(VolunteerService volunteerService) {
        this.volunteerService = volunteerService;
    }

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
}