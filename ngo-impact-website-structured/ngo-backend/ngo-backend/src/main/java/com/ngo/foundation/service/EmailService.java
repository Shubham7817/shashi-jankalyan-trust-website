package com.ngo.foundation.service;

//import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.JsonNode;
import com.ngo.foundation.entity.DailyWorkReport;
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
    private final ObjectMapper objectMapper = new ObjectMapper();

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

    @Async
    public void sendShgReceiptEmail(DailyWorkReport report) {
        if (report.getPresidentEmail() == null || report.getPresidentEmail().isBlank()) {
            return;
        }

        try {
            // 1. Parse SHG Members JSON into HTML table rows
            StringBuilder membersRowsHtml = new StringBuilder();
            if (report.getAdditionalMembersDetails() != null && !report.getAdditionalMembersDetails().isBlank()) {
                JsonNode members = objectMapper.readTree(report.getAdditionalMembersDetails());

                int index = 1;
                for (JsonNode m : members) {
                    membersRowsHtml.append("<tr>")
                            .append("<td style='border:1px solid #d1d5db; padding:8px; text-align:center;'>").append(index++).append("</td>")
                            .append("<td style='border:1px solid #d1d5db; padding:8px;'>").append(safe(m.path("name").asText())).append("</td>")
                            .append("<td style='border:1px solid #d1d5db; padding:8px;'>").append(safe(m.path("position").asText())).append("</td>")
                            .append("<td style='border:1px solid #d1d5db; padding:8px;'>").append(safe(m.path("husbandName").asText())).append("</td>")
                            .append("<td style='border:1px solid #d1d5db; padding:8px;'>").append(safe(m.path("mobile").asText())).append("</td>")
                            .append("<td style='border:1px solid #d1d5db; padding:8px;'>").append(safe(m.path("address").asText())).append("</td>")
                            .append("</tr>");
                }
            }

            // 2. Prepare Receipt Values
            String shgName = safe(report.getShgName());
            String presidentName = safe(report.getBeneficiaryName());
            String date = report.getActivityDate() != null ? report.getActivityDate().toString() : "N/A";
            String txnId = safe(report.getPaymentId());
            String amount = report.getAmount() != null ? String.valueOf(report.getAmount()) : "0";
            String totalMembers = report.getTotalMembers() != null ? String.valueOf(report.getTotalMembers()) : "0";
            String location = String.format("%s, %s, %s, %s",
                    safe(report.getPanchayat()), safe(report.getBlock()),
                    safe(report.getDistrict()), safe(report.getState()));

            // 3. Build HTML Receipt
            String htmlReceipt = """
                <div style="font-family: Georgia, serif; max-width: 750px; margin: 0 auto; padding: 30px; background-color: #ffffff; border: 4px double #14532d; color: #111827;">
                  
                  <!-- Header -->
                  <div style="text-align: center; border-bottom: 2px solid #14532d; padding-bottom: 14px; margin-bottom: 20px;">
                    <p style="font-size: 13px; font-weight: bold; margin: 0;">बिहार सरकार से पंजीकृत 90/2020 | 80G: AAZTS4557P25PT02</p>
                    <h1 style="font-size: 30px; font-weight: 800; color: #0d4a30; margin: 8px 0;">शशि जन कल्याण ट्रस्ट (NGO)</h1>
                    <p style="font-size: 16px; font-weight: 600; margin: 0;">दिनकर नगर, बरबीघा, शेखपुरा, बिहार 811101</p>
                    <p style="font-size: 13px; margin: 4px 0 0 0;">Email: shashijankalyantrast012345@gmail.com | Helpline: 6203766882</p>
                  </div>

                  <!-- Title -->
                  <div style="font-size: 20px; font-weight: bold; text-align: center; margin-bottom: 24px; text-decoration: underline;">
                    स्वयं सहायता समूह पंजीकरण रसीद (SHG Creation Receipt)
                  </div>

                  <!-- Transaction & Date -->
                  <table style="width: 100%%; margin-bottom: 20px; font-size: 15px;">
                    <tr>
                      <td style="text-align: left;"><strong>Transaction ID:</strong> %s</td>
                      <td style="text-align: right;"><strong>Date (दिनांक):</strong> %s</td>
                    </tr>
                  </table>

                  <!-- SHG Core Details -->
                  <table style="width: 100%%; font-size: 15px; border-collapse: collapse; margin-bottom: 20px;">
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 1px solid #9ca3af;"><strong>SHG समूह का नाम (SHG Group Name):</strong> <em>%s</em></td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 1px solid #9ca3af;"><strong>अध्यक्ष का नाम (President Name):</strong> <em>%s</em></td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 1px solid #9ca3af;"><strong>अध्यक्ष का ईमेल (President Email):</strong> <em>%s</em></td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 1px solid #9ca3af;"><strong>पता (Location):</strong> <em>%s</em></td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 1px solid #9ca3af;">
                        <strong>कुल सदस्य (Total Members):</strong> <em>%s</em> &nbsp;&nbsp;|&nbsp;&nbsp;
                        <strong>राशि (Amount Collected):</strong> <strong>Rs. %s/-</strong>
                      </td>
                    </tr>
                  </table>

                  <!-- Members List Table -->
                  <h3 style="font-size: 16px; color: #0d4a30; margin-bottom: 8px;">समूह के सदस्यों का विवरण (Group Members Details):</h3>
                  <table style="width: 100%%; border-collapse: collapse; font-size: 13px; margin-bottom: 24px;">
                    <thead>
                      <tr style="background-color: #ecfdf5; color: #0d4a30;">
                        <th style="border: 1px solid #d1d5db; padding: 8px;">#</th>
                        <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Name</th>
                        <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Position</th>
                        <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Husband Name</th>
                        <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Mobile</th>
                        <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      %s
                    </tbody>
                  </table>

                  <p style="font-size: 13px; color: #374151; margin-top: 12px;">
                    बधाई हो! आपका स्वयं सहायता समूह (SHG) शशि जन कल्याण ट्रस्ट के साथ सफलतापूर्वक पंजीकृत हो गया है।
                  </p>

                  <!-- Signatures -->
                  <table style="width: 100%%; margin-top: 50px; font-size: 14px;">
                    <tr>
                        <td style="width: 50%%; text-align: center; vertical-align: bottom;">
                        <div style="width: 180px; margin: 0 auto 6px auto; border-bottom: 1px solid #1f2937; padding-bottom: 4px;">
                          <img src="https://rtbnjiptdnlqupmkator.supabase.co/storage/v1/object/public/avatars/signature.png" alt="Authorized Signature" style="height: 55px; max-width: 160px; object-fit: contain; display: block; margin: 0 auto;" />
                        </div>
                        <strong>स्टाफ का हस्ताक्षर</strong><br/>(Shashi Jan Kalyan Trust)
                      </td>
                    </tr>
                  </table>
                </div>
                """.formatted(
                    txnId, date, shgName, presidentName,
                    safe(report.getPresidentEmail()), location,
                    totalMembers, amount, membersRowsHtml.toString(), presidentName
            );

            // 4. Send via Brevo REST API using htmlContent
            Map<String, Object> body = Map.of(
                    "sender", Map.of("name", fromName, "email", fromEmail),
                    "to", List.of(Map.of("email", report.getPresidentEmail(), "name", presidentName)),
                    "subject", "SHG Registration Receipt - " + shgName + " | Shashi Jan Kalyan Trust",
                    "htmlContent", htmlReceipt
            );

            restClient.post()
                    .uri("/smtp/email")
                    .header("api-key", apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .toBodilessEntity();

            System.out.println("SHG receipt email sent to: " + report.getPresidentEmail());

        } catch (Exception e) {
            System.err.println("Failed to send SHG receipt email: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private String safe(String val) {
        return (val == null || val.isBlank()) ? "-" : val;
    }
}