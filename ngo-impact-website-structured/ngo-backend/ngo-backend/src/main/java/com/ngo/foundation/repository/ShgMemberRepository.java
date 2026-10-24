package com.ngo.foundation.repository;

import com.ngo.foundation.entity.ShgMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShgMemberRepository extends JpaRepository<ShgMember, Long> {
    Optional<ShgMember> findByMobileNumberAndEmail(String mobileNumber, String email);
}