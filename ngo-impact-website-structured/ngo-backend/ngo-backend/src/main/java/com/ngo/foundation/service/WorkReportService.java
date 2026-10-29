package com.ngo.foundation.service;

import com.ngo.foundation.dto.report.WorkReportRequest;
import com.ngo.foundation.entity.DailyWorkReport;
import com.ngo.foundation.entity.UserCredential;
import com.ngo.foundation.repository.DailyWorkReportRepository;
import com.ngo.foundation.repository.UserCredentialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WorkReportService {

    @Autowired
    private DailyWorkReportRepository reportRepository;

    @Autowired
    private UserCredentialRepository userRepository;

    // 1. Save a new report
    public DailyWorkReport createReport(Long volunteerId, WorkReportRequest request) {
        UserCredential user = userRepository.findById(volunteerId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + volunteerId));

        DailyWorkReport report = new DailyWorkReport();
        report.setUser(user); // Links the report to the logged-in volunteer

        mapDtoToEntity(request, report);

        return reportRepository.save(report);
    }

    // 2. Update an existing report
    public DailyWorkReport updateReport(Long reportId, WorkReportRequest request) {
        DailyWorkReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found with ID: " + reportId));

        mapDtoToEntity(request, report);

        return reportRepository.save(report);
    }

    // Helper: Maps all incoming data into the database entity
    private void mapDtoToEntity(WorkReportRequest request, DailyWorkReport report) {
        // Core
        report.setActivityDate(request.getActivityDate());
        report.setActivityType(request.getActivityType());
        report.setRecordDate(request.getRecordDate());

        // Project & Location
        report.setProgramName(request.getProgramName());
        report.setObjective(request.getObjective());
        report.setActivityLocation(request.getActivityLocation());
        report.setProjectName(request.getProjectName());
        report.setProjectId(request.getProjectId());
        report.setState(request.getState());
        report.setDistrict(request.getDistrict());
        report.setBlock(request.getBlock());
        report.setPanchayat(request.getPanchayat());
        report.setVillage(request.getVillage());
        report.setAddress(request.getAddress());

        // Beneficiary Details
        report.setBeneficiaryName(request.getBeneficiaryName());
        report.setParentName(request.getParentName());
        report.setFatherName(request.getFatherName());
        report.setMotherName(request.getMotherName());
        report.setHusbandName(request.getHusbandName());
        report.setMobileNumber(request.getMobileNumber());
        report.setAadhaarNumber(request.getAadhaarNumber());
        report.setAge(request.getAge());
        report.setDob(request.getDob());
        report.setCategory(request.getCategory());

        // Financial & Payment
        report.setAmount(request.getAmount());
        report.setPaymentId(request.getPaymentId());
        report.setPaymentStatus(request.getPaymentStatus());
        report.setTotalBeneficiaries(request.getTotalBeneficiaries());
        report.setContributorName(request.getContributorName());

        // Specifics
        report.setDiseaseType(request.getDiseaseType());
        report.setLoanAmount(request.getLoanAmount());
        report.setCompanyName(request.getCompanyName());
        report.setTrainingType(request.getTrainingType());
        report.setShgName(request.getShgName());
        report.setTotalMembers(request.getTotalMembers());
        report.setAdditionalMembersDetails(request.getAdditionalMembersDetails());
        report.setClassOrGrade(request.getClassOrGrade());
        report.setSchoolName(request.getSchoolName());

        // Media & Outcome
        report.setBeneficiaryPhotoUrl(request.getBeneficiaryPhotoUrl());
        report.setEvidenceUrl(request.getEvidenceUrl());
        report.setOutcome(request.getOutcome());
    }
}