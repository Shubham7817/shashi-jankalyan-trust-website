package com.ngo.foundation.controller;

import com.ngo.foundation.entity.DailyWorkReport;
import com.ngo.foundation.repository.DailyWorkReportRepository;
import com.ngo.foundation.repository.ShgMemberRepository; // Adjust this import to match your actual package
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "*")
public class PublicStatsController {

    @Autowired
    private DailyWorkReportRepository reportRepo;

    @Autowired
    private ShgMemberRepository shgRepo;

    @GetMapping("/stats")
    public ResponseEntity<?> getWebsiteStats() {
        // Fetch all work reports from the database
        List<DailyWorkReport> reports = reportRepo.findAll();

        // Calculate beneficiaries for each exact category from your frontend list
        long education = calculateBeneficiaries(reports, "Education");
        long health = calculateBeneficiaries(reports, "Health");
        long awareness = calculateBeneficiaries(reports, "Awareness");
        long livelihood = calculateBeneficiaries(reports, "Livelihood");
        long womenEmpowerment = calculateBeneficiaries(reports, "Women Empowerment");
        long environment = calculateBeneficiaries(reports, "environment");
        long shgActivities = calculateBeneficiaries(reports, "Self-Help Group(SHG)");

        // Count total SHG members specifically registered via the Join SHG form
        long totalShgMembers = shgRepo.count();

        // Map the results (Adding base/fallback values so the site never looks empty)
        Map<String, Object> stats = new HashMap<>();
        stats.put("education",  (education > 0 ? education : 0) + 39);
        stats.put("health",  (health > 0 ? health : 0) + 39);

        // Retaining your baseline numbers for the homepage impact counters
        stats.put("awareness", (awareness > 0 ? awareness : 0) + 39);
        stats.put("kanyaVivah", (livelihood > 0 ? livelihood : 0) + 45);
        stats.put("womenTrained", (womenEmpowerment > 0 ? womenEmpowerment : 0) + 200);

        stats.put("shgActivities", shgActivities); // Beneficiaries from SHG work reports
        stats.put("environment",(environment > 0 ? environment : 0) + 4); // Beneficiaries from SHG work reports
        stats.put("shgCount", (totalShgMembers > 0 ? totalShgMembers : 10)); // Actual registered SHG members

        return ResponseEntity.ok(stats);
    }

    // Helper method to keep the code clean and prevent repetition
    private long calculateBeneficiaries(List<DailyWorkReport> reports, String activityType) {
        return reports.stream()
                .filter(r -> activityType.equalsIgnoreCase(r.getActivityType()))
                .mapToLong(r -> r.getTotalBeneficiaries() != null ? r.getTotalBeneficiaries() : 0)
                .sum();
    }
}