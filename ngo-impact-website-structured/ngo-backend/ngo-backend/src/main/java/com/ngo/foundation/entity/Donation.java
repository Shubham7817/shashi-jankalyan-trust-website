package com.ngo.foundation.entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Setter
@Getter
@Table(name = "donations")
public class Donation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String orderId; // Local transaction ID
    private String gatewayTransactionId; // Razorpay Payment ID
    private String paymentStatus; // PENDING, COMPLETED, FAILED
    private String paymentMethod; // UPI, Card, Netbanking

    private String name;
    private String email;
    private String phone;
    private String city;
    private String state;
    private Integer amount;
    private String referredBy;

    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    private LocalDateTime completedAt;

}