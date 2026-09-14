package com.ngo.foundation.service;

import com.ngo.foundation.dto.Volunteer.VolunteerRequest;
import com.ngo.foundation.entity.Volunteer;
import com.ngo.foundation.repository.VolunteerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class VolunteerService {

    private final VolunteerRepository volunteerRepository;

    public VolunteerService(VolunteerRepository volunteerRepository) {
        this.volunteerRepository = volunteerRepository;
    }

    public Map<String, Object> saveVolunteer(VolunteerRequest request) {
        try {
            // Check for existing user
            if (volunteerRepository.existsByEmailOrPhoneOrName(request.getEmail(), request.getPhone(),request.getName())) {
                return Map.of(
                        "success", false,
                        "message", "This person has already filled the form."
                );
            }

            Volunteer volunteer = new Volunteer();
            volunteer.setName(request.getName());
            volunteer.setEmail(request.getEmail());
            volunteer.setPhone(request.getPhone());
            volunteer.setCountry(request.getCountry());
            volunteer.setState(request.getState());
            volunteer.setCity(request.getCity());
            volunteer.setMessage(request.getMessage());

            volunteerRepository.save(volunteer);

            return Map.of("success", true, "message", "Volunteer saved successfully.");
        } catch (Exception e) {
            return Map.of("success", false, "message", "Database error occurred.");
        }
    }
}