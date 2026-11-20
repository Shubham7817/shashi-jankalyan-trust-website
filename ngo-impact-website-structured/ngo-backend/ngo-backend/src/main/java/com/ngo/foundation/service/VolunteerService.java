package com.ngo.foundation.service;

import com.ngo.foundation.dto.Volunteer.VolunteerRequest;
import com.ngo.foundation.entity.ActualVolunteer;
import com.ngo.foundation.entity.UserCredential;
import com.ngo.foundation.entity.Volunteer;
import com.ngo.foundation.repository.ActualVolunteerRepository;
import com.ngo.foundation.repository.UserCredentialRepository;
import com.ngo.foundation.repository.VolunteerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ngo.foundation.service.EmailService;
import com.ngo.foundation.entity.VolunteerProfile;
import com.ngo.foundation.repository.VolunteerProfileRepository;

import java.util.Map;

@Service
public class VolunteerService {

    private final VolunteerRepository volunteerRepository;
    private final ActualVolunteerRepository actualVolunteerRepository;
    private final UserCredentialRepository userCredentialRepository;
    private final EmailService emailService;
    private final VolunteerProfileRepository volunteerProfileRepository;

    public VolunteerService(
            VolunteerRepository volunteerRepository,
            ActualVolunteerRepository actualVolunteerRepository,
            UserCredentialRepository userCredentialRepository,
            VolunteerProfileRepository volunteerProfileRepository,
            EmailService emailService
    ) {

        this.volunteerRepository = volunteerRepository;
        this.actualVolunteerRepository = actualVolunteerRepository;
        this.userCredentialRepository = userCredentialRepository;
        this.volunteerProfileRepository = volunteerProfileRepository;
        this.emailService = emailService;
    }

    @Transactional // Ensures all 3 tables save successfully, or none do
    public Map<String, Object> saveVolunteer(VolunteerRequest request) {
        try {
            // 1. Check for existing user
            if (volunteerRepository.existsByNameAndEmailAndPhone(request.getEmail(), request.getPhone(), request.getName())) {
                return Map.of("success", false, "message", "This person has already registered.");
            }

            // 2. Generate Username and Password (firstname@ + digits)
            String firstName = request.getName().trim().split("\\s+")[0].toLowerCase();
            String phone = request.getPhone() != null ? request.getPhone().trim() : "0000";
            String last4Phone = phone.length() >= 4 ? phone.substring(phone.length() - 4) : "0000";

            String generatedUsername = firstName + "." + last4Phone;
            String generatedPassword = firstName + "@" + (int)((Math.random() * 9000) + 1000); // 4 random digits

            // 3. Save to UserCredentials Table
            UserCredential credentials = new UserCredential();
            credentials.setUsername(generatedUsername);
            credentials.setPasswordHash(generatedPassword);
            credentials.setAccountStatus("ACTIVE");
            userCredentialRepository.save(credentials);

            //save to vounteerprofile table
            // 3A. Save Volunteer Profile
            VolunteerProfile profile = new VolunteerProfile();

// Link profile to the newly created login account
            profile.setUser(credentials);

            profile.setFullName(request.getName());
            profile.setVolunteerRole("Volunteer");
            profile.setJoiningDate(java.time.LocalDate.now());

            profile.setState(request.getState());
            profile.setDistrict(request.getDistrict());
            profile.setBlock(request.getBlock());
            profile.setPanchayat(request.getPanchayat());

// Temporary unique member ID to allow initial insert
            profile.setMemberId("TEMP-" + java.util.UUID.randomUUID());

            volunteerProfileRepository.save(profile);

// Generate final Member ID using profile's generated database ID
            String monthYear = java.time.LocalDate.now()
                    .format(java.time.format.DateTimeFormatter.ofPattern("MMyy"));

            String serialNumber = String.format("%22d", profile.getId());

            String memberId = "SJKT-" + monthYear + "-" + serialNumber;

            profile.setMemberId(memberId);

// Update with final member ID
            volunteerProfileRepository.save(profile);

            // 4. Save to ActualVolunteer Table
            ActualVolunteer actualVolunteer = new ActualVolunteer();
            actualVolunteer.setName(request.getName());
            actualVolunteer.setPhone(request.getPhone());
            actualVolunteer.setEmail(request.getEmail());
            actualVolunteer.setCountry(request.getCountry());
            actualVolunteer.setState(request.getState());
            actualVolunteer.setCity(request.getDistrict()); // Mapping District to City
            actualVolunteerRepository.save(actualVolunteer);

            // 5. Save to main Volunteer Table
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
            emailService.sendWelcomeEmail(
                    request.getEmail(),
                    request.getName(),
                    generatedUsername,
                    generatedPassword
            );

            // 6. Return the raw credentials so React can display them to the user ONCE
            return Map.of(
                    "success", true,
                    "message", "Volunteer saved successfully.",
                    "username", generatedUsername,
                    "password", generatedPassword
            );

        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("success", false, "message", "Database error occurred: " + e.getMessage());
        }
    }
}