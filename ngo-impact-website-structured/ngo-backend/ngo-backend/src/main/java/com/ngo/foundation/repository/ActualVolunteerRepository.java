package com.ngo.foundation.repository;

import com.ngo.foundation.entity.ActualVolunteer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActualVolunteerRepository extends JpaRepository<ActualVolunteer, Long> {}