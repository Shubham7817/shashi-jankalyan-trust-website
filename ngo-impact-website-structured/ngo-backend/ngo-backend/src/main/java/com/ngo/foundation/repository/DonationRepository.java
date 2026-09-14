package com.ngo.foundation.repository;

import com.ngo.foundation.entity.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {
    Donation findByOrderId(String orderId);

    List<Donation> findTop10ByPaymentStatusOrderByCompletedAtDesc(String paymentStatus);
}