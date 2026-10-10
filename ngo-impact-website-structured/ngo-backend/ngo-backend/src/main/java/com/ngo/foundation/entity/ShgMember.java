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
    private String address;
    private String aadhaarNumber;
    private String panNumber;

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

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}