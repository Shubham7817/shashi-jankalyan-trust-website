package com.ngo.foundation.dto.Volunteer;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VolunteerRequest {
    private String name;
    private String email;
    private String phone;
    private String country;
    private String state;
    private String city;
    private String message;

}
