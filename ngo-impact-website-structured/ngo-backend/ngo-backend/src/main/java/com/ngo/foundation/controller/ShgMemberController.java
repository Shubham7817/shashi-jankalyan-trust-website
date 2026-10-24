package com.ngo.foundation.controller;

import com.ngo.foundation.entity.ShgMember;
import com.ngo.foundation.repository.ShgMemberRepository;
import com.ngo.foundation.service.ShgMemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/shg")
@CrossOrigin(origins = "*")
public class ShgMemberController {

    @Autowired
    private ShgMemberRepository shgMemberRepository;

    // 1. New Endpoint to check if user already paid 1st installment
    @GetMapping("/check")
    public ResponseEntity<?> checkStatus(@RequestParam String mobile, @RequestParam String email) {
        Optional<ShgMember> member = shgMemberRepository.findByMobileNumberAndEmail(mobile, email);
        if (member.isPresent()) {
            return ResponseEntity.ok(member.get());
        }
        return ResponseEntity.notFound().build();
    }

    // 2. Updated Join Endpoint to handle the 2nd installment update
    @PostMapping("/join")
    public ResponseEntity<ShgMember> joinShg(@RequestBody ShgMember member) {
        Optional<ShgMember> existing = shgMemberRepository.findByMobileNumberAndEmail(member.getMobileNumber(), member.getEmail());

        // If they exist and are paying the remaining amount
        if (existing.isPresent() && "PARTIAL".equals(existing.get().getPaymentStatus())) {
            ShgMember updated = existing.get();
            updated.setAmountPaid(350.0); // Total is now 350
            updated.setPaymentStatus("COMPLETED");
            updated.setPaymentId(member.getPaymentId()); // Save new Razorpay ID
            return ResponseEntity.ok(shgMemberRepository.save(updated));
        }

        // Otherwise, this is a brand new application
        return ResponseEntity.ok(shgMemberRepository.save(member));
    }

    @GetMapping("/all")
    public ResponseEntity<List<ShgMember>> getAllShgMembers() {
        return ResponseEntity.ok(shgMemberRepository.findAll());
    }
}