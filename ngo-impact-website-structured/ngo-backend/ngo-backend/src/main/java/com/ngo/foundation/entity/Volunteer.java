package com.ngo.foundation.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Setter
@Getter
@Table(name = "volunteers")
public class Volunteer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Personal Info
    private String name;
    private String fatherName;
    private String dob;
    private String email;
    private String phone;
    private String whatsapp;
    private String ageGroup;

    // Location & Address
    private String country;
    private String state;
    private String district;
    private String block;
    private String panchayat;
    private String address;
    private String pincode;

    // Education & Skills
    private String highestEducation;
    private String otherEducation;
    private String educationDocUrl;
    private String languagesKnown;
    private String otherLanguage;
    private String englishProficiency;
    private String hindiProficiency;

    @Column(columnDefinition = "TEXT")
    private String motivation;

    // Payment Tracking
    private String paymentId;
    private Double amountPaid;
    private String paymentStatus;

    private LocalDateTime createdAt = LocalDateTime.now();
}