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
            // 1. Duplicate checks
            if (volunteerRepository.existsByEmailOrPhone(request.getEmail(), request.getPhone())) {
                return Map.of("success", false, "duplicate", true,
                        "message", "This person has already registered.");
            }
            if (request.getPaymentId() != null && volunteerRepository.existsByPaymentId(request.getPaymentId())) {
                return Map.of("success", false, "duplicate", true,
                        "message", "This payment is already used for a registration.");
            }

            // 2. Generate credentials
            String firstName = request.getName().trim().split("\\s+")[0].toLowerCase();
            String phone = request.getPhone() != null ? request.getPhone().trim() : "0000";
            String last4 = phone.length() >= 4 ? phone.substring(phone.length() - 4) : "0000";

            String username = firstName + "." + last4;
            while (userCredentialRepository.existsByUsername(username)) {
                username = firstName + "." + last4 + (int) (Math.random() * 90 + 10);
            }
            String rawPassword = firstName + "@" + (int) ((Math.random() * 9000) + 1000);


            // 3. User credentials
            UserCredential credentials = new UserCredential();
            credentials.setUsername(username);
            credentials.setPasswordHash(rawPassword); // inject BCryptPasswordEncoder
            credentials.setAccountStatus("ACTIVE");
            userCredentialRepository.save(credentials);

            // 4. Profile
            VolunteerProfile profile = new VolunteerProfile();
            profile.setUser(credentials);
            profile.setFullName(request.getName());
            profile.setVolunteerRole("Volunteer");
            profile.setJoiningDate(java.time.LocalDate.now());
            profile.setState(request.getState());
            profile.setDistrict(request.getDistrict());
            profile.setBlock(request.getBlock());
            profile.setPanchayat(request.getPanchayat());
            profile.setMemberId("T" + System.nanoTime());          // short, unique temp value
            volunteerProfileRepository.saveAndFlush(profile);      // flush so the ID exists

            String monthYear = java.time.LocalDate.now()
                    .format(java.time.format.DateTimeFormatter.ofPattern("MMyy"));
            profile.setMemberId("SJKT-" + monthYear + "-" + String.format("%04d", profile.getId()));
            volunteerProfileRepository.save(profile);

            // 5. ActualVolunteer (same as yours)
            ActualVolunteer av = new ActualVolunteer();
            av.setName(request.getName());
            av.setPhone(request.getPhone());
            av.setEmail(request.getEmail());
            av.setCountry(request.getCountry());
            av.setState(request.getState());
            av.setCity(request.getDistrict());
            actualVolunteerRepository.save(av);

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

            volunteerRepository.saveAndFlush(volunteer);
            emailService.sendWelcomeEmail(
                    request.getEmail(),
                    request.getName(),
                    username,
                    rawPassword
            );

            // 6. Return the raw credentials so React can display them to the user ONCE
            return Map.of(
                    "success", true,
                    "message", "Volunteer saved successfully.",
                    "username", username,
                    "password", rawPassword
            );

        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("success", false, "message", "Database error occurred: " + e.getMessage());
        }
    }
}