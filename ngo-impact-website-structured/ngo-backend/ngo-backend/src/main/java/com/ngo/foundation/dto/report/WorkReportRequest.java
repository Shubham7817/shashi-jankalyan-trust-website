package com.ngo.foundation.dto.report;

import lombok.Data;
import java.time.LocalDate;

@Data // Generates all getters and setters automatically
public class WorkReportRequest {

    // Core
    private LocalDate activityDate;
    private String activityType;
    private LocalDate recordDate;

    // Project & Location
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

    // Beneficiary Details
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

    // Financial & Payment
    private Double amount;
    private String paymentId;
    private String paymentStatus;
    private Integer totalBeneficiaries;
    private String contributorName;

    // Specifics (Healthcare, Edu, SHG, etc.)
    private String diseaseType;
    private Double loanAmount;
    private String companyName;
    private String trainingType;
    private String shgName;
    private Integer totalMembers;
    private String additionalMembersDetails;
    private String classOrGrade;
    private String schoolName;

    // Supabase URLs & Outcome
    private String beneficiaryPhotoUrl;
    private String evidenceUrl;
    private String outcome;
}