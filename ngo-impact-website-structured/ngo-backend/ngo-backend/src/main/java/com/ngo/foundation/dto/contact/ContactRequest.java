package com.ngo.foundation.dto.contact;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ContactRequest {
    private String name;
    private String email;
    private String phone;
    private String subject;
    private String message;
}
