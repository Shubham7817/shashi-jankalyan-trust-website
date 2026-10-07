package com.ngo.foundation.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "shg_members")
@Data // Lombok generates getters/setters automatically
@Getter
@Setter
public class ShgMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String address;
    private String mobileNumber;

    // These will store the public URLs returned by Supabase
    private String aadhaarPhotoUrl;
    private String panPhotoUrl;
    private String selfPhotoUrl;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}