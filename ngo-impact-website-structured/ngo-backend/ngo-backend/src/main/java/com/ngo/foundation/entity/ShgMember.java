package com.ngo.foundation.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "shg_members")
@Data
public class ShgMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Personal Info
    private String name;
    private String mobileNumber;
    private String email; // <-- NEW: Added Email
    private String address;
    private String aadhaarNumber;
    private String panNumber;
    // Add this in the Personal Info / Beneficiary section
    private String husbandName;

    // Bank Info
    private String bankAccountNumber;
    private String ifscCode;
    private String accountHolderName;
    private String bankName;

    // Reference
    private String referredBy;

    // Supabase Document URLs
    private String aadhaarPhotoUrl;
    private String panPhotoUrl;
    private String selfPhotoUrl;
    private String passbookPhotoUrl;

    // Add these fields to your ShgMember.java Entity
    private Double amountPaid;
    private String paymentStatus; // e.g., "PARTIAL" or "COMPLETED"
    private String paymentId;     // To store the Razorpay Transaction ID// <-- NEW: Added Passbook Photo URL

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}