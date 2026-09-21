package com.ngo.foundation.repository;

import com.ngo.foundation.entity.VolunteerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VolunteerProfileRepository extends JpaRepository<VolunteerProfile, Long> {
    Optional<VolunteerProfile> findByUser_Id(Long userId);
}