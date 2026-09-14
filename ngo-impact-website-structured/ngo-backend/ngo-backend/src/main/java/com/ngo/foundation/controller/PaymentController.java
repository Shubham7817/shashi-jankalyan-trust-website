package com.ngo.foundation.controller;
import com.ngo.foundation.dto.payment.CreateOrderRequest;
import com.ngo.foundation.dto.payment.PaymentVerificationRequest;
import com.ngo.foundation.dto.payment.RecentDonorDto;
import com.ngo.foundation.entity.Donation;
import com.ngo.foundation.repository.ActualVolunteerRepository;
import com.ngo.foundation.repository.DonationRepository;
import com.ngo.foundation.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class PaymentController {
    private final PaymentService paymentService;

    @Autowired
    private ActualVolunteerRepository volunteerRepository;

    @Autowired
    private DonationRepository donationRepository;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
    /*
     * CREATE PAYMENT ORDER
     * POST:/api/payment/create-order
     */
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        try {
            return ResponseEntity.ok(paymentService.createOrder(request));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Unable to create payment order."));
        }
    }
    /*
     * VERIFY PAYMENT
     *
     * POST:
     * /api/payment/verify-payment
     */
    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(@Valid @RequestBody PaymentVerificationRequest request) {
        try {
            Map<String, Object> response = paymentService.verifyPayment(request);
            return Boolean.TRUE.equals(response.get("success"))
                    ? ResponseEntity.ok(response)
                    : ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Payment verification failed."));
        }
    }

    @GetMapping("/volunteers")
    public ResponseEntity<?> getActiveVolunteers() {
        return ResponseEntity.ok(volunteerRepository.findAll());
    }

    @GetMapping("/recent-donors")
    public ResponseEntity<List<RecentDonorDto>> getRecentDonors() {
        // Only fetch donations where the payment actually succeeded
        List<Donation> recentDonations = donationRepository
                .findTop10ByPaymentStatusOrderByCompletedAtDesc("COMPLETED");

        // Convert the Entities into safe DTOs (hiding email, phone, and amount)
        List<RecentDonorDto> safeDonorData = recentDonations.stream()
                .map(d -> new RecentDonorDto(d.getName(), d.getCity(), d.getState()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(safeDonorData);
    }
}