package com.ngo.foundation.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Getter
@Setter
@Table(name = "daily_work_reports")
public class DailyWorkReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Links this work report to the specific volunteer who submitted it
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private UserCredential user;

    @Column(nullable = false)
    private LocalDate activityDate;

    @Setter
    @Getter
    @Column(nullable = false)
    private String activityType;

    private String programName;
    private String objective;
    private String activityLocation;

    private LocalTime startTime;
    private LocalTime endTime;
    @Setter
    @Getter
    private Double totalHours;

    private Integer totalBeneficiaries;

    @Column(columnDefinition = "TEXT")
    private String outcome;

    private String projectName;
    private String projectId;

//    private String approvalStatus = "Under Review";

}