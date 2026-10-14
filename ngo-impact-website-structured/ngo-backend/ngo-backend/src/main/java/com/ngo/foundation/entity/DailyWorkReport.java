package com.ngo.foundation.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(name = "daily_work_reports")
public class DailyWorkReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private UserCredential user;

    @Column(nullable = false)
    private LocalDate activityDate;

    @Column(nullable = false)
    private String activityType;

    private String programName;
    private String objective;
    private String activityLocation;

    private Integer totalBeneficiaries;

    @Column(columnDefinition = "TEXT")
    private String outcome;

    private String projectName;
    private String projectId;

    // --- NEW FIELDS FOR FUNDRAISING & INFLUENCE ---
    private String contributorName;
    private String beneficiaryName;
    private String parentName; // Father/Mother Name
    private String address;
    private String mobileNumber;
    private String aadhaarNumber;
    private Integer age;
    private String category;
    private Double amount;
    private LocalDate dob;
    private LocalDate recordDate;

    // Supabase File URLs
    private String beneficiaryPhotoUrl;
    private String evidenceUrl;
}