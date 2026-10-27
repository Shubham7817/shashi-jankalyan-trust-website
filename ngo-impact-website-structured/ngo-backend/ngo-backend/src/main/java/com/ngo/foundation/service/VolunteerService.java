package com.ngo.foundation.service;

import com.ngo.foundation.dto.Volunteer.VolunteerRequest;
import com.ngo.foundation.entity.Volunteer;
import com.ngo.foundation.repository.VolunteerRepository;
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
            if (volunteerRepository.existsByNameAndEmailAndPhone(request.getEmail(), request.getPhone(), request.getName())) {
                return Map.of("success", false, "message", "This person has already registered.");
            }

            Volunteer volunteer = new Volunteer();

            // Map Personal & Identity Info
            volunteer.setName(request.getName());
            volunteer.setFatherName(request.getFatherName());
            volunteer.setDob(request.getDob());
            volunteer.setEmail(request.getEmail());
            volunteer.setPhone(request.getPhone());
            volunteer.setWhatsapp(request.getWhatsapp());
            volunteer.setAgeGroup(request.getAgeGroup());

            // Map Location
            volunteer.setCountry(request.getCountry());
            volunteer.setState(request.getState());
            volunteer.setDistrict(request.getDistrict());
            volunteer.setBlock(request.getBlock());
            volunteer.setPanchayat(request.getPanchayat());
            volunteer.setAddress(request.getAddress());
            volunteer.setPincode(request.getPincode());

            // Map Education & Skills
            volunteer.setHighestEducation(request.getHighestEducation());
            volunteer.setOtherEducation(request.getOtherEducation());
            volunteer.setEducationDocUrl(request.getEducationDocUrl());
            volunteer.setLanguagesKnown(request.getLanguagesKnown());
            volunteer.setOtherLanguage(request.getOtherLanguage());
            volunteer.setEnglishProficiency(request.getEnglishProficiency());
            volunteer.setHindiProficiency(request.getHindiProficiency());
            volunteer.setMotivation(request.getMotivation());

            // Map Payment
            volunteer.setPaymentId(request.getPaymentId());
            volunteer.setAmountPaid(request.getAmountPaid());
            volunteer.setPaymentStatus(request.getPaymentStatus());

            volunteerRepository.save(volunteer);
            return Map.of("success", true, "message", "Volunteer saved successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("success", false, "message", "Database error occurred.");
        }
    }
}
