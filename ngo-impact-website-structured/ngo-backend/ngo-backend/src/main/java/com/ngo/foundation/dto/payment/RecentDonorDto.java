package com.ngo.foundation.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RecentDonorDto {
    private String name;
    private String city;
    private String state;
}