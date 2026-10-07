package com.ngo.foundation.repository;

import com.ngo.foundation.entity.ShgMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShgMemberRepository extends JpaRepository<ShgMember, Long> {
}