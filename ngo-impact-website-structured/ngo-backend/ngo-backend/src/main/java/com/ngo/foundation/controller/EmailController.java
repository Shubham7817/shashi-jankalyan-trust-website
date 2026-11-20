//package com.ngo.foundation.controller;
//
//import com.ngo.foundation.dto.EmailRequest;
//import com.ngo.foundation.service.EmailService;
//
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/email")
//public class EmailController {
//
//    private final EmailService emailService;
//
//    public EmailController(EmailService emailService) {
//        this.emailService = emailService;
//    }
//
//    @PostMapping("/send")
//    public ResponseEntity<?> sendEmail(@RequestBody EmailRequest request) {
//
//        try {
//            emailService.sendEmail(
//                    request.getTo(),
//                    request.getSubject(),
//                    request.getMessage()
//            );
//
//            return ResponseEntity.ok("Email sent successfully!");
//
//        } catch (Exception e) {
//
//            return ResponseEntity.internalServerError()
//                    .body("Failed to send email.");
//        }
//    }
//}