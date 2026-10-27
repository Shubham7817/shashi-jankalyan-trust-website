package com.ngo.foundation.dto.Volunteer;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VolunteerRequest {
    private String name;
    private String fatherName;
    private String dob;
    private String email;
    private String phone;
    private String whatsapp;
    private String ageGroup;
    private String country;
    private String state;
    private String district;
    private String block;
    private String panchayat;
    private String address;
    private String pincode;
    private String highestEducation;
    private String otherEducation;
    private String educationDocUrl;
    private String languagesKnown;
    private String otherLanguage;
    private String englishProficiency;
    private String hindiProficiency;
    private String motivation;
    private String paymentId;
    private Double amountPaid;
    private String paymentStatus;
}