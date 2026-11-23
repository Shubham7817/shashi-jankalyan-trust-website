package com.ngo.foundation.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    private final RestClient restClient;

    @Value("${brevo.api-key:}")
    private String apiKey;

    @Value("${mail.from-email:}")
    private String fromEmail;

    @Value("${mail.from-name:Shashi Jan Kalyan Trust}")
    private String fromName;

    public EmailService() {
        this.restClient = RestClient.builder()
                .baseUrl("https://api.brevo.com/v3")
                .build();
    }

    @Async
    public void sendWelcomeEmail(
            String toEmail,
            String name,
            String username,
            String password
    ) {

        try {

            String firstName = name != null && !name.isBlank()
                    ? name.trim().split("\\s+")[0]
                    : "Volunteer";

            String emailBody =
                    "Dear " + firstName + ",\n\n" +

                            "Thank you for joining Shashi Jan Kalyan Trust! " +
                            "We are thrilled to have you onboard as a volunteer. " +
                            "Your passion and dedication will help us make a real " +
                            "difference in the community.\n\n" +

                            "Here are your login credentials to access your Volunteer Dashboard:\n\n" +

                            "Username: " + username + "\n" +
                            "Password: " + password + "\n\n" +

                            "Please keep these details secure.\n\n" +

                            "You can log in at:\n" +
                            "https://shashijankalyantrust.com\n\n" +

                            "Warm Regards,\n" +
                            "Shashi Jan Kalyan Trust Team";

            Map<String, Object> body = Map.of(
                    "sender", Map.of("name", fromName, "email", fromEmail),
                    "to", List.of(Map.of("email", toEmail, "name", firstName)),
                    "subject", "Welcome to Shashi Jan Kalyan Trust - Your Login Details",
                    "textContent", emailBody
            );

            restClient.post()
                    .uri("/smtp/email")
                    .header("api-key", apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .toBodilessEntity();

            System.out.println(
                    "Welcome email successfully sent to: " + toEmail
            );

        } catch (Exception e) {

            System.err.println(
                    "Failed to send welcome email: " + e.getMessage()
            );
        }
    }
}