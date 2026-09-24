package com.ngo.foundation.dto.payment;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CreateOrderRequest {
    @NotNull @Positive private Integer amount;
    @NotBlank private String name;
    @NotBlank @Email private String email;
    @NotBlank private String phone;
    private String state;
    private String city;
    private String message;
    private String referredBy; // Replaced PAN
}