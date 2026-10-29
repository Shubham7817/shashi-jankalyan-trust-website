//package com.ngo.foundation.controller;
//
//import com.ngo.foundation.dto.report.WorkReportRequest;
//import com.ngo.foundation.service.WorkReportService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/reports")
//public class WorkReportController {
//
//    @Autowired
//    private WorkReportService workReportService;
//
//    /**
//     * POST: Save a brand new daily work report (and handle payment fields if present)
//     * Matches the frontend endpoint: /api/reports/{volunteerId}
//     */
//    @PostMapping("/{volunteerId}")
//    public ResponseEntity<?> submitReport(
//            @PathVariable Long volunteerId,
//            @RequestBody WorkReportRequest request) {
//        try {
//            workReportService.createReport(volunteerId, request);
//            return ResponseEntity.ok(Map.of(
//                    "success", true,
//                    "message", "Work report submitted successfully."
//            ));
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
//                    "success", false,
//                    "message", "Failed to submit report: " + e.getMessage()
//            ));
//        }
//    }
//
//    /**
//     * PUT: Edit an existing daily work report
//     * Matches the frontend endpoint: /api/reports/edit/{reportId}
//     */
//    @PutMapping("/edit/{reportId}")
//    public ResponseEntity<?> updateReport(
//            @PathVariable Long reportId,
//            @RequestBody WorkReportRequest request) {
//        try {
//            workReportService.updateReport(reportId, request);
//            return ResponseEntity.ok(Map.of(
//                    "success", true,
//                    "message", "Work report updated successfully."
//            ));
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
//                    "success", false,
//                    "message", "Failed to update report: " + e.getMessage()
//            ));
//        }
//    }
//}