package com.ngo.foundation.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class ShgPaymentController {

    @Value("${razorpay.key.id}")
    private String razorpayKey;

    @Value("${razorpay.key.secret}")
    private String razorpaySecret;

    @PostMapping("/create-shg-order")
    public ResponseEntity<?> createShgOrder(@RequestBody Map<String, Object> payload) {
        try {
            // Extract the dynamic amount sent from React
            int amount = Integer.parseInt(payload.get("amount").toString());

            RazorpayClient client = new RazorpayClient(razorpayKey, razorpaySecret);

            JSONObject options = new JSONObject();
            options.put("amount", amount * 100); // Convert to paise
            options.put("currency", "INR");
            options.put("receipt", "shg_txn_" + System.currentTimeMillis());

            Order order = client.orders.create(options);
            return ResponseEntity.ok(order.toString());

        } catch (RazorpayException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error creating Razorpay order");
        }
    }
}
