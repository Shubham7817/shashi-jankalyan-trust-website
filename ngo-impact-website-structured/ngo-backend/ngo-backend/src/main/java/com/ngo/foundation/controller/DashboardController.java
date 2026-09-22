package com.ngo.foundation.controller;

import com.ngo.foundation.entity.DailyWorkReport;
import com.ngo.foundation.entity.UserCredential;
import com.ngo.foundation.entity.VolunteerProfile;
import com.ngo.foundation.repository.DailyWorkReportRepository;
import com.ngo.foundation.repository.UserCredentialRepository;
import com.ngo.foundation.repository.VolunteerProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Update with your Vercel URL in production
public class DashboardController {

    @Autowired
    private UserCredentialRepository userRepo;
    @Autowired
    private VolunteerProfileRepository profileRepo;
    @Autowired
    private DailyWorkReportRepository reportRepo;

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        Optional<UserCredential> user = userRepo.findByUsername(username);

        if (user.isPresent() && user.get().getPasswordHash().equals(password)) {
            // Include the ROLE in the response map
            return ResponseEntity.ok(Map.of(
                    "userId", user.get().getId(),
//                    "role", user.get().getRole(),
                    "status", "success"
            ));
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    // 2. ADD THIS NEW METHOD
    @GetMapping("/admin/reports")
    public ResponseEntity<?> getAllAdminReports() {
        // Fetches every report from every volunteer in the database
        List<DailyWorkReport> allReports = reportRepo.findAllByOrderByActivityDateDesc();
        return ResponseEntity.ok(allReports);
    }

    @GetMapping("/dashboard/{userId}")
    public ResponseEntity<?> getDashboardData(@PathVariable Long userId) {
        Optional<VolunteerProfile> profile = profileRepo.findByUser_Id(userId);
        List<DailyWorkReport> recentReports = reportRepo.findByUser_IdOrderByActivityDateDesc(userId);

        if (profile.isEmpty()) return ResponseEntity.notFound().build();

        // Calculate Work Summary stats dynamically from reports
        long activitiesCompleted = recentReports.size();
        double hoursContributed = recentReports.stream().mapToDouble(DailyWorkReport::getTotalHours).sum();
        long beneficiaries = recentReports.stream().mapToLong(DailyWorkReport::getTotalBeneficiaries).sum();

        // Package all data required by the frontend dashboard
        Map<String, Object> dashboardData = new HashMap<>();
        dashboardData.put("profile", profile.get());
        dashboardData.put("workSummary", Map.of(
                "activitiesCompleted", activitiesCompleted,
                "hoursContributed", hoursContributed,
                "beneficiariesReached", beneficiaries,
                "reportsSubmitted", activitiesCompleted
        ));
        dashboardData.put("recentActivity", recentReports.stream().limit(5)); // Top 5 recent

        return ResponseEntity.ok(dashboardData);
    }

    @PostMapping(value = "/reports/{userId}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> submitWorkReport(
            @PathVariable Long userId,
            @RequestPart("report") DailyWorkReport report,
            @RequestPart(value = "file", required = false) MultipartFile file) {

        Optional<UserCredential> user = userRepo.findById(userId);

        if (user.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        // Link the report to the specific user
        report.setUser(user.get());

        // Ensure status is set
//        if (report.getApprovalStatus() == null) {
//            report.setApprovalStatus("Under Review");
//        }

        // Handle File Upload if a file was attached
        if (file != null && !file.isEmpty()) {
            try {
                String uploadDir = "uploads/evidence/";
                Path uploadPath = Paths.get(uploadDir);

                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                // Generate a unique file name
                String originalFileName = file.getOriginalFilename();
                String uniqueFileName = UUID.randomUUID().toString() + "_" + originalFileName;
                Path filePath = uploadPath.resolve(uniqueFileName);

                // Save file to local folder
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

                // Save the generated file name into the database entity
                report.setEvidenceFile(uniqueFileName);

            } catch (Exception e) {
                return ResponseEntity.status(500).body("Could not upload the file: " + e.getMessage());
            }
        }

        DailyWorkReport savedReport = reportRepo.save(report);
        return ResponseEntity.ok(savedReport);
    }


    @GetMapping("/reports/user/{userId}")
    public ResponseEntity<?> getAllUserReports(@PathVariable Long userId) {
        // Fetch all reports for the user, ordered by date descending
        List<DailyWorkReport> allReports = reportRepo.findByUser_IdOrderByActivityDateDesc(userId);
        return ResponseEntity.ok(allReports);
    }
}
