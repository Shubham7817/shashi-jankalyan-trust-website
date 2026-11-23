package com.ngo.foundation.service;

import com.ngo.foundation.dto.Volunteer.VolunteerRequest;
import com.ngo.foundation.entity.ActualVolunteer;
import com.ngo.foundation.entity.UserCredential;
import com.ngo.foundation.entity.Volunteer;
import com.ngo.foundation.entity.VolunteerProfile;
import com.ngo.foundation.repository.ActualVolunteerRepository;
import com.ngo.foundation.repository.UserCredentialRepository;
import com.ngo.foundation.repository.VolunteerProfileRepository;
import com.ngo.foundation.repository.VolunteerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Service
public class VolunteerService {

    private final VolunteerRepository volunteerRepository;
    private final ActualVolunteerRepository actualVolunteerRepository;
    private final UserCredentialRepository userCredentialRepository;
    private final VolunteerProfileRepository volunteerProfileRepository;

    public VolunteerService(
            VolunteerRepository volunteerRepository,
            ActualVolunteerRepository actualVolunteerRepository,
            UserCredentialRepository userCredentialRepository,
            VolunteerProfileRepository volunteerProfileRepository
    ) {
        this.volunteerRepository = volunteerRepository;
        this.actualVolunteerRepository = actualVolunteerRepository;
        this.userCredentialRepository = userCredentialRepository;
        this.volunteerProfileRepository = volunteerProfileRepository;
    }

    // All 4 tables save together, or none do.
    // IMPORTANT: no try/catch in here. Exceptions must propagate so the
    // transaction rolls back cleanly and the controller can report the real cause.
    @Transactional
    public Map<String, Object> saveVolunteer(VolunteerRequest request) {

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
        credentials.setPasswordHash(rawPassword); // TODO: hash with BCrypt once your login code supports it
        credentials.setAccountStatus("ACTIVE");
        userCredentialRepository.save(credentials);

        // 4. Volunteer profile
        VolunteerProfile profile = new VolunteerProfile();
        profile.setUser(credentials);
        profile.setFullName(request.getName());
        profile.setVolunteerRole("Volunteer");
        profile.setJoiningDate(LocalDate.now());
        profile.setState(request.getState());
        profile.setDistrict(request.getDistrict());
        profile.setBlock(request.getBlock());
        profile.setPanchayat(request.getPanchayat());
        profile.setMemberId("T" + System.nanoTime());          // short, unique temporary value
        volunteerProfileRepository.saveAndFlush(profile);      // flush so the generated ID exists

        String monthYear = LocalDate.now().format(DateTimeFormatter.ofPattern("MMyy"));
        profile.setMemberId("SJKT-" + monthYear + "-" + String.format("%04d", profile.getId()));
        volunteerProfileRepository.save(profile);

        // 5. ActualVolunteer
        ActualVolunteer av = new ActualVolunteer();
        av.setName(request.getName());
        av.setPhone(request.getPhone());
        av.setEmail(request.getEmail());
        av.setCountry(request.getCountry());
        av.setState(request.getState());
        av.setCity(request.getDistrict()); // district mapped to city
        actualVolunteerRepository.save(av);

        // 6. Main Volunteer table
        Volunteer volunteer = new Volunteer();

        // Personal & identity
        volunteer.setName(request.getName());
        volunteer.setFatherName(request.getFatherName());
        volunteer.setDob(request.getDob());
        volunteer.setEmail(request.getEmail());
        volunteer.setPhone(request.getPhone());
        volunteer.setWhatsapp(request.getWhatsapp());
        volunteer.setAgeGroup(request.getAgeGroup());

        // Location
        volunteer.setCountry(request.getCountry());
        volunteer.setState(request.getState());
        volunteer.setDistrict(request.getDistrict());
        volunteer.setBlock(request.getBlock());
        volunteer.setPanchayat(request.getPanchayat());
        volunteer.setAddress(request.getAddress());
        volunteer.setPincode(request.getPincode());

        // Education & skills
        volunteer.setHighestEducation(request.getHighestEducation());
        volunteer.setOtherEducation(request.getOtherEducation());
        volunteer.setEducationDocUrl(request.getEducationDocUrl());
        volunteer.setLanguagesKnown(request.getLanguagesKnown());
        volunteer.setOtherLanguage(request.getOtherLanguage());
        volunteer.setEnglishProficiency(request.getEnglishProficiency());
        volunteer.setHindiProficiency(request.getHindiProficiency());
        volunteer.setMotivation(request.getMotivation());

        // Payment
        volunteer.setPaymentId(request.getPaymentId());
        volunteer.setAmountPaid(request.getAmountPaid());
        volunteer.setPaymentStatus(request.getPaymentStatus());

        volunteerRepository.saveAndFlush(volunteer); // flush so any DB error is thrown here

        // 7. Return credentials so React can show them once (email is sent by the controller)
        return Map.of(
                "success", true,
                "message", "Volunteer saved successfully.",
                "username", username,
                "password", rawPassword
        );
    }
}