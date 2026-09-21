package com.ngo.foundation.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(name = "volunteer_profiles")
public class VolunteerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Links this profile to the specific login credential
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private UserCredential user;

    @Column(nullable = false)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String memberId;

    private String volunteerRole;
    private LocalDate joiningDate;

    private String state;
    private String district;
    private String block;
    private String panchayat;

}