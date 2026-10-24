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
    @Column(nullable = false)
    private LocalDate recordDate;

    // Standard Project & Location Fields
    private String programName;
    private String objective;
    private String activityLocation;
    private String projectName;
    private String projectId;
    private String state;
    private String district;
    private String block;
    private String panchayat;
    private String village;
    private String address;

    // Common Beneficiary Details
    private String beneficiaryName;
    private String parentName;
    private String fatherName;
    private String motherName;
    private String husbandName;
    private String mobileNumber;
    private String aadhaarNumber;
    private Integer age;
    private LocalDate dob;
    private String category;
    private Double amount;
    private Integer totalBeneficiaries;
    private String contributorName;

    // Specific to Healthcare
    private String diseaseType;
    private Double loanAmount;
    private String companyName;

    // Specific to Women Empowerment
    private String trainingType;

    // Specific to SHG
    private String shgName;
    private Integer totalMembers;
    @Column(columnDefinition = "TEXT")
    private String additionalMembersDetails;

    // Specific to Education
    private String classOrGrade;
    private String schoolName;

    // Supabase File URLs & Outcome
    private String beneficiaryPhotoUrl;
    private String evidenceUrl;

    @Column(columnDefinition = "TEXT")
    private String outcome;
}