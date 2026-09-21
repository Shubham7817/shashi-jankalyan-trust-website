package com.ngo.foundation.service;

import com.ngo.foundation.dto.contact.ContactRequest;
import com.ngo.foundation.entity.ContactMessage;
import com.ngo.foundation.repository.ContactRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class ContactService {

    private final ContactRepository contactRepository;
//    private final JavaMailSender mailSender;

    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
//        this.mailSender = mailSender;
    }

    public Map<String, Object> processContactMessage(ContactRequest request) {
        try {
            // 1. Save to Database
            ContactMessage message = new ContactMessage();
            message.setName(request.getName());
            message.setEmail(request.getEmail());
            message.setPhone(request.getPhone());
            message.setSubject(request.getSubject());
            message.setMessage(request.getMessage());
            contactRepository.save(message);

            // 2. Send Email Notification
//            sendEmailNotification(request);

            return Map.of("success", true, "message", "Your message has been sent successfully.");
        } catch (Exception e) {
            return Map.of("success", false, "message", "Failed to process your request. Please try again.");
        }
    }

//    private void sendEmailNotification(ContactRequest request) {
//        SimpleMailMessage mailMessage = new SimpleMailMessage();
//        mailMessage.setTo("shashijankalyantrast012345@gmail.com"); // Organization Email
//        mailMessage.setSubject("New Contact Request: " + request.getSubject());
//
//        String emailBody = "You have received a new message from your website contact form.\n\n"
//                + "Name: " + request.getName() + "\n"
//                + "Email: " + request.getEmail() + "\n"
//                + "Phone: " + request.getPhone() + "\n"
//                + "Subject: " + request.getSubject() + "\n\n"
//                + "Message:\n" + request.getMessage();
//
//        mailMessage.setText(emailBody);
//        mailSender.send(mailMessage);
//    }
}