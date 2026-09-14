package com.ngo.foundation.repository;

import com.ngo.foundation.entity.Volunteer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VolunteerRepository extends JpaRepository<Volunteer, Long> {
    // This tells Spring to automatically write a SQL query to check for duplicates
    boolean existsByEmailOrPhoneOrName(String email, String phone,String name);
}
