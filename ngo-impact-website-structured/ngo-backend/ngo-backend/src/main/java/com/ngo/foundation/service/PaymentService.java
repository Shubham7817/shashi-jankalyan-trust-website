package com.ngo.foundation.service;

import java.util.concurrent.CompletableFuture;
import com.ngo.foundation.dto.payment.CreateOrderRequest;
import com.ngo.foundation.dto.payment.PaymentVerificationRequest;
import com.ngo.foundation.entity.Donation;
import com.ngo.foundation.repository.DonationRepository;
import com.razorpay.Order;
import com.razorpay.Payment;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
public class PaymentService {

    private final RazorpayClient razorpayClient;
    private final DonationRepository donationRepository;
    private final JavaMailSender mailSender;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    public PaymentService(RazorpayClient razorpayClient, DonationRepository donationRepository, JavaMailSender mailSender) {
        this.razorpayClient = razorpayClient;
        this.donationRepository = donationRepository;
        this.mailSender = mailSender;
    }

    public Map<String, Object> createOrder(CreateOrderRequest request) throws Exception {
        JSONObject options = new JSONObject();
        options.put("amount", request.getAmount() * 100);
        options.put("currency", "INR");
        options.put("receipt", "txn_" + System.currentTimeMillis());

        Order order = razorpayClient.orders.create(options);

        // 1. Save Pending Transaction to Database
        Donation donation = new Donation();
        donation.setOrderId(order.get("id"));
        donation.setAmount(request.getAmount());
        donation.setName(request.getName());
        donation.setEmail(request.getEmail());
        donation.setPhone(request.getPhone());
        donation.setReferredBy(request.getReferredBy());
        donation.setPaymentStatus("PENDING");
        donationRepository.save(donation);

        return Map.of(
                "success", true,
                "orderId", order.get("id"),
                "amount", order.get("amount"),
                "currency", order.get("currency")
        );
    }

    public Map<String, Object> verifyPayment(PaymentVerificationRequest request) {
        try {
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", request.getRazorpayOrderId());
            attributes.put("razorpay_payment_id", request.getRazorpayPaymentId());
            attributes.put("razorpay_signature", request.getRazorpaySignature());

            boolean isValid = Utils.verifyPaymentSignature(attributes, razorpayKeySecret);
            Donation donation = donationRepository.findByOrderId(request.getRazorpayOrderId());

            if (isValid && donation != null) {
                // Fetch Exact Payment Method from Razorpay
                Payment paymentData = razorpayClient.payments.fetch(request.getRazorpayPaymentId());

                // Update Database with Success Details
                donation.setGatewayTransactionId(request.getRazorpayPaymentId());
                donation.setPaymentStatus("COMPLETED");
                donation.setPaymentMethod(paymentData.get("method"));
                donation.setCompletedAt(LocalDateTime.now());
                donationRepository.save(donation);

                // ==========================================
                // THE FIX: Run Notifications in the Background
                // ==========================================
                CompletableFuture.runAsync(() -> {
                    sendDonationEmail(donation);
                    sendDonationSms(donation);
                });

                // Immediately return success to React so it redirects instantly
                return Map.of("success", true, "message", "Payment verified.");

            } else if (donation != null) {
                donation.setPaymentStatus("FAILED");
                donationRepository.save(donation);
            }
            return Map.of("success", false, "message", "Verification failed.");
        } catch (Exception e) {
            return Map.of("success", false, "message", "Error verifying payment.");
        }
    }

    private void sendDonationEmail(Donation donation) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(donation.getEmail());
            message.setSubject("Thank you for your donation!");
            message.setText("Dear " + donation.getName() + ",\n\n" +
                    "Thank you for your generous donation of ₹" + donation.getAmount() + ".\n" +
                    "Transaction ID: " + donation.getGatewayTransactionId() + "\n" +
                    "Payment Method: " + donation.getPaymentMethod().toUpperCase() + "\n\n" +
                    "Your support makes a huge difference.\n\nShashi Jan Kalyan Trust");
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    private void sendDonationSms(Donation donation) {
        // SMS integration requires a 3rd party provider (like Twilio, MSG91, AWS SNS).
        // You will place their API call here using WebClient or RestTemplate.
        System.out.println("Triggering SMS to " + donation.getPhone() + ": Thank you for donating ₹" + donation.getAmount());
    }
}