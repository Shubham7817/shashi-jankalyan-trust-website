package com.ngo.foundation.dto.payment;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class PaymentVerificationRequest {

    private String razorpayPaymentId;
    private String razorpayOrderId;
    private String razorpaySignature;

}