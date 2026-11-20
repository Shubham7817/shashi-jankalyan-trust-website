package com.ngo.foundation.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendWelcomeEmail(
            String toEmail,
            String name,
            String username,
            String password
    ) {

        try {

            SimpleMailMessage message = new SimpleMailMessage();

            message.setFrom(System.getenv("MAIL_USERNAME"));
            message.setTo(toEmail);

            message.setSubject(
                    "Welcome to Shashi Jan Kalyan Trust - Your Login Details"
            );

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

            message.setText(emailBody);

            mailSender.send(message);

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