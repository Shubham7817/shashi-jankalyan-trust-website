package com.ngo.foundation.service;

import com.ngo.foundation.entity.DailyWorkReport;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.io.ByteArrayOutputStream;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Update WATERMARK_LOGO_URL with your Supabase public logo URL if needed
    private static final String WATERMARK_LOGO_URL =
            "https://rtbnjiptdnlqupmkator.supabase.co/storage/v1/object/public/avatars/logoo.png";
    private static final String SIGNATURE_URL =
            "https://rtbnjiptdnlqupmkator.supabase.co/storage/v1/object/public/avatars/signature.png";

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

            System.out.println("Welcome email successfully sent to: " + toEmail);

        } catch (Exception e) {
            System.err.println("Failed to send welcome email: " + e.getMessage());
        }
    }

    private byte[] generateReceiptPdf(String htmlBodyContent) {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            String completeHtml = """
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="UTF-8"/>
                  <style>
                    @page {
                      size: A4;
                      margin: 12mm;
                    }
                    body {
                      font-family: 'NotoSansDevanagari', sans-serif;
                      color: #111827;
                      margin: 0;
                      padding: 0;
                    }
                    .watermark {
                      position: fixed;
                      top: 28%%;
                      left: 20%%;
                      width: 60%%;
                      opacity: 0.08;
                      z-index: -1;
                      text-align: center;
                    }
                    table {
                      width: 100%%;
                      border-collapse: collapse;
                    }
                    tr {
                      page-break-inside: avoid;
                    }
                  </style>
                </head>
                <body>
                  <div class="watermark">
                    <img src="%s" style="width: 100%%;" />
                  </div>
                  %s
                </body>
                </html>
                """.formatted(WATERMARK_LOGO_URL, htmlBodyContent);

            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();

            ClassPathResource fontResource = new ClassPathResource("fonts/NotoSansDevanagari-Regular.ttf");
            builder.useFont(() -> {
                try {
                    return fontResource.getInputStream();
                } catch (Exception e) {
                    throw new RuntimeException("Hindi font not found in resources/fonts/", e);
                }
            }, "NotoSansDevanagari");

            builder.withHtmlContent(completeHtml, null);
            builder.toStream(outputStream);
            builder.run();

            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate receipt PDF", e);
        }
    }

    @Async
    public void sendShgAndPaymentReceipts(DailyWorkReport report, String volunteerName, String volunteerEmail) {
        try {
            // 1. Parse SHG Members & extract First Member's Address
            StringBuilder membersRowsHtml = new StringBuilder();
            String firstMemberAddress = "";

            if (report.getAdditionalMembersDetails() != null && !report.getAdditionalMembersDetails().isBlank()) {
                JsonNode members = objectMapper.readTree(report.getAdditionalMembersDetails());
                int index = 1;
                for (JsonNode m : members) {
                    if (index == 1) {
                        firstMemberAddress = safe(m.path("address").asText());
                    }
                    membersRowsHtml.append("<tr>")
                            .append("<td style='border:1px solid #d1d5db; padding:6px; text-align:center;'>").append(index++).append("</td>")
                            .append("<td style='border:1px solid #d1d5db; padding:6px;'>").append(safe(m.path("name").asText())).append("</td>")
                            .append("<td style='border:1px solid #d1d5db; padding:6px;'>").append(safe(m.path("position").asText())).append("</td>")
                            .append("<td style='border:1px solid #d1d5db; padding:6px;'>").append(safe(m.path("husbandName").asText())).append("</td>")
                            .append("<td style='border:1px solid #d1d5db; padding:6px;'>").append(safe(m.path("mobile").asText())).append("</td>")
                            .append("<td style='border:1px solid #d1d5db; padding:6px;'>").append(safe(m.path("address").asText())).append("</td>")
                            .append("</tr>");
                }
            }

            if (firstMemberAddress.isBlank() || "-".equals(firstMemberAddress)) {
                firstMemberAddress = String.format("%s, %s, %s, %s",
                        safe(report.getPanchayat()), safe(report.getBlock()),
                        safe(report.getDistrict()), safe(report.getState()));
            }

            // 2. Prepare Common Values
            String groupId = safe(report.getShgGroupId());
            String shgName = safe(report.getShgName());
            String presidentName = safe(report.getBeneficiaryName());
            String presidentEmail = safe(report.getPresidentEmail());
            String date = report.getActivityDate() != null ? report.getActivityDate().toString() : "N/A";
            String txnId = safe(report.getPaymentId());
            String amount = report.getAmount() != null ? String.valueOf(report.getAmount()) : "0";
            String totalMembers = report.getTotalMembers() != null ? String.valueOf(report.getTotalMembers()) : "0";
            String volName = safe(volunteerName);

            // 3. Build SHG Creation Receipt HTML
            String shgReceiptHtml = """
<div style="max-width: 750px; margin: 0 auto; padding: 24px;
            border: 4px double #14532d; color: #111827;
            position: relative; overflow: hidden;">

    <!-- ================= WATERMARK LAYER ================= -->
    <div style="position: absolute; top: 0; left: 0;
                width: 100%%; height: 100%%;
                z-index: 0; overflow: hidden;">

        <!-- Top Left Watermark -->
        <img src="%s"
             style="position: absolute; top: 5%%; left: 3%%;
                    width: 125px; opacity: 0.05;" />

        <!-- Top Right Watermark -->
        <img src="%s"
             style="position: absolute; top: 5%%; right: 3%%;
                    width: 125px; opacity: 0.05;" />

        <!-- Center Watermark -->
        <img src="%s"
             style="position: absolute; top: 35%%; left: 35%%;
                    width: 180px; opacity: 0.05;" />

        <!-- Bottom Left Watermark -->
        <img src="%s"
             style="position: absolute; bottom: 5%%; left: 3%%;
                    width: 125px; opacity: 0.05;" />

        <!-- Bottom Right Watermark -->
        <img src="%s"
             style="position: absolute; bottom: 5%%; right: 3%%;
                    width: 125px; opacity: 0.05;" />

    </div>

    <!-- ================= RECEIPT CONTENT ================= -->
    <div style="position: relative; z-index: 1;">

        <!-- NGO HEADER -->
        <div style="text-align: center;
                    border-bottom: 2px solid #14532d;
                    padding-bottom: 12px;
                    margin-bottom: 18px;">

            <p style="font-size: 12px; font-weight: bold; margin: 0;">
                Registered under Bihar Government 90/2020 | 80G: AAZTS4557P25PT02
            </p>

            <h1 style="font-size: 26px; font-weight: 800;
                       color: #0d4a30; margin: 6px 0;">
                Shashi Jan Kalyan Trust(NGO)
            </h1>

            <p style="font-size: 14px; font-weight: 600; margin: 0;">
                Dikar Nagar, Barbigha, Shiekpura , KishanGanj, Bihar 811101
            </p>

            <p style="font-size: 12px; margin: 4px 0 0 0;">
                Email: shashijankalyantrast012345@gmail.com
            </p>

        </div>

        <!-- RECEIPT TITLE -->
        <div style="font-size: 18px; font-weight: bold;
                    text-align: center; margin-bottom: 18px;
                    text-decoration: underline;">
            स्वयं सहायता समूह पंजीकरण रसीद (SHG Creation Receipt)
        </div>

        <!-- TRANSACTION DETAILS -->
        <table style="width: 100%%; margin-bottom: 14px;
                      font-size: 13px;">
            <tr>
                <td style="text-align: left;">
                    <strong>Group ID:</strong> %s
                </td>

                <td style="text-align: center;">
                    <strong>Transaction ID:</strong> %s
                </td>

                <td style="text-align: right;">
                    <strong>Date (दिनांक):</strong> %s
                </td>
            </tr>
        </table>

        <!-- SHG INFORMATION -->
        <table style="width: 100%%; font-size: 14px;
                      border-collapse: collapse; margin-bottom: 16px;">

            <tr>
                <td style="padding: 6px 0;
                           border-bottom: 1px solid #9ca3af;">
                    <strong>SHG समूह का नाम (SHG Group Name):</strong>
                    <em>%s</em>
                </td>
            </tr>

            <tr>
                <td style="padding: 6px 0;
                           border-bottom: 1px solid #9ca3af;">
                    <strong>अध्यक्ष का नाम (President Name):</strong>
                    <em>%s</em>
                </td>
            </tr>

            <tr>
                <td style="padding: 6px 0;
                           border-bottom: 1px solid #9ca3af;">
                    <strong>अध्यक्ष का ईमेल (President Email):</strong>
                    <em>%s</em>
                </td>
            </tr>

            <tr>
                <td style="padding: 6px 0;
                           border-bottom: 1px solid #9ca3af;">
                    <strong>पता (Location):</strong>
                    <em>%s</em>
                </td>
            </tr>

            <tr>
                <td style="padding: 6px 0;
                           border-bottom: 1px solid #9ca3af;">
                    <strong>वॉलंटियर का नाम (Updated By Volunteer):</strong>
                    <em>%s</em>
                </td>
            </tr>

            <tr>
                <td style="padding: 6px 0;
                           border-bottom: 1px solid #9ca3af;">

                    <strong>कुल सदस्य (Total Members):</strong>
                    <em>%s</em>

                    &#160;&#160;|&#160;&#160;

                    <strong>राशि (Amount Collected):</strong>
                    <strong>Rs. %s/-</strong>

                </td>
            </tr>

        </table>

        <!-- GROUP MEMBERS -->
        <h3 style="font-size: 15px; color: #0d4a30;
                    margin-bottom: 8px;">
            समूह के सदस्यों का विवरण (Group Members Details):
        </h3>

        <table style="width: 100%%; border-collapse: collapse;
                      font-size: 12px; margin-bottom: 18px;">

            <thead>
                <tr style="background-color: #ecfdf5; color: #0d4a30;">

                    <th style="border: 1px solid #d1d5db; padding: 6px;">
                        #
                    </th>

                    <th style="border: 1px solid #d1d5db; padding: 6px;
                               text-align: left;">
                        Name
                    </th>

                    <th style="border: 1px solid #d1d5db; padding: 6px;
                               text-align: left;">
                        Position
                    </th>

                    <th style="border: 1px solid #d1d5db; padding: 6px;
                               text-align: left;">
                        Husband Name
                    </th>

                    <th style="border: 1px solid #d1d5db; padding: 6px;
                               text-align: left;">
                        Mobile
                    </th>

                    <th style="border: 1px solid #d1d5db; padding: 6px;
                               text-align: left;">
                        Address
                    </th>

                </tr>
            </thead>

            <tbody>
                %s
            </tbody>

        </table>

        <!-- SUCCESS MESSAGE -->
        <p style="font-size: 12px; color: #374151; margin-top: 10px;">
            बधाई हो! आपका स्वयं सहायता समूह (SHG) शशि जन कल्याण ट्रस्ट
            के साथ सफलतापूर्वक पंजीकृत हो गया है।
        </p>

        <!-- ================= SIGNATURE ================= -->
        <table style="width: 100%%; margin-top: 40px;
                      font-size: 13px;">
            <tr>
                <td style="width: 100%%; text-align: center;">

                    <div style="width: 200px; margin: 0 auto 6px auto;
                                border-bottom: 1px solid #1f2937;
                                padding-bottom: 4px; text-align: center;">

                        <img src="%s"
                             alt="Authorized Signature"
                             style="height: 55px; max-width: 160px;
                                    display: inline-block;" />

                    </div>

                    <strong>स्टाफ का हस्ताक्षर</strong>
                    <br/>
                    (Shashi Jan Kalyan Trust)

                </td>
            </tr>
        </table>

    </div>
</div>
""".formatted(
                    WATERMARK_LOGO_URL,  // Top Left Watermark
                    WATERMARK_LOGO_URL,  // Top Right Watermark
                    WATERMARK_LOGO_URL,  // Center Watermark
                    WATERMARK_LOGO_URL,  // Bottom Left Watermark
                    WATERMARK_LOGO_URL,  // Bottom Right Watermark

                    groupId,
                    txnId,
                    date,
                    shgName,
                    presidentName,
                    presidentEmail,
                    firstMemberAddress,
                    volName,
                    totalMembers,
                    amount,
                    membersRowsHtml.toString(),

                    SIGNATURE_URL
            );

            // 4. Build Payment Receipt HTML
            String paymentReceiptHtml = buildPaymentReceiptHtml(
                    txnId, date, presidentName, presidentEmail,
                    safe(report.getMobileNumber()), firstMemberAddress,
                    volName, amount, "SHG Registration (" + shgName + " - " + groupId + ")"
            );

            // 5. Generate Both PDFs
            String base64ShgPdf = Base64.getEncoder().encodeToString(generateReceiptPdf(shgReceiptHtml));
            String base64PayPdf = Base64.getEncoder().encodeToString(generateReceiptPdf(paymentReceiptHtml));

            Map<String, String> shgAttachment = Map.of(
                    "name", "SHG_Registration_Receipt_" + groupId + ".pdf",
                    "content", base64ShgPdf
            );
            Map<String, String> payAttachment = Map.of(
                    "name", "Payment_Receipt_" + txnId + ".pdf",
                    "content", base64PayPdf
            );

            // 6. Send BOTH PDFs to President
            if (report.getPresidentEmail() != null && !report.getPresidentEmail().isBlank()) {
                sendBrevoEmail(
                        report.getPresidentEmail(),
                        presidentName,
                        "SHG Registration & Payment Receipt - " + shgName + " (" + groupId + ")",
                        "<p>Dear " + presidentName + ",</p>"
                                + "<p>Congratulations! Your Self-Help Group <strong>" + shgName + "</strong> (Group ID: <strong>" + groupId + "</strong>) has been registered with Shashi Jan Kalyan Trust.</p>"
                                + "<p>Both your <strong>SHG Registration Receipt</strong> and <strong>Payment Receipt</strong> are attached to this email.</p>"
                                + "<p>Regards,<br/><strong>Shashi Jan Kalyan Trust</strong></p>",
                        List.of(shgAttachment, payAttachment)
                );
            }

            // 7. Send Payment Receipt PDF to Volunteer
            if (volunteerEmail != null && !volunteerEmail.isBlank()) {
                sendBrevoEmail(
                        volunteerEmail,
                        volName,
                        "Payment Receipt - SHG " + shgName + " (" + txnId + ")",
                        "<p>Dear " + volName + ",</p>"
                                + "<p>Your payment of <strong>Rs. " + amount + "/-</strong> for SHG <strong>" + shgName + "</strong> (Group ID: " + groupId + ") has been verified.</p>"
                                + "<p>Please find your official Payment Receipt attached.</p>"
                                + "<p>Regards,<br/><strong>Shashi Jan Kalyan Trust</strong></p>",
                        List.of(payAttachment)
                );
            }

        } catch (Exception e) {
            System.err.println("Failed to send SHG/Payment receipts: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Async
    public void sendPaymentReceiptOnly(DailyWorkReport report, String volunteerName, String volunteerEmail) {
        try {
            String date = report.getActivityDate() != null ? report.getActivityDate().toString() : "N/A";
            String txnId = safe(report.getPaymentId());
            String amount = report.getAmount() != null ? String.valueOf(report.getAmount()) : "0";
            String location = String.format("%s, %s, %s",
                    safe(report.getBlock()), safe(report.getDistrict()), safe(report.getState()));

            String paymentHtml = buildPaymentReceiptHtml(
                    txnId, date, safe(report.getBeneficiaryName()), volunteerEmail,
                    safe(report.getMobileNumber()), location,
                    safe(volunteerName), amount, safe(report.getActivityType())
            );

            String base64PayPdf = Base64.getEncoder().encodeToString(generateReceiptPdf(paymentHtml));
            Map<String, String> payAttachment = Map.of(
                    "name", "Payment_Receipt_" + txnId + ".pdf",
                    "content", base64PayPdf
            );

            sendBrevoEmail(
                    volunteerEmail,
                    safe(volunteerName),
                    "Payment Receipt - " + safe(report.getActivityType()) + " (" + txnId + ")",
                    "<p>Dear " + safe(volunteerName) + ",</p><p>Please find your attached Payment Receipt for Rs. " + amount + "/-.</p><p>Regards,<br/><strong>Shashi Jan Kalyan Trust</strong></p>",
                    List.of(payAttachment)
            );
        } catch (Exception e) {
            System.err.println("Failed to send payment receipt: " + e.getMessage());
        }
    }

    private String buildPaymentReceiptHtml(String txnId, String date, String name, String email,
                                           String phone, String address, String volunteerName,
                                           String amount, String purpose) {
        return """
<div style="max-width: 750px; margin: 0 auto; padding: 24px;
            border: 4px double #14532d; color: #111827;
            position: relative; overflow: hidden;">

    <!-- ================= WATERMARK LAYER ================= -->
    <div style="position: absolute; top: 0; left: 0;
                width: 100%%; height: 100%%;
                z-index: 0; overflow: hidden;">

        <!-- Top Left Watermark -->
        <img src="%s"
             style="position: absolute; top: 5%%; left: 3%%;
                    width: 125px; opacity: 0.05;" />

        <!-- Top Right Watermark -->
        <img src="%s"
             style="position: absolute; top: 5%%; right: 3%%;
                    width: 125px; opacity: 0.05;" />

        <!-- Center Watermark -->
        <img src="%s"
             style="position: absolute; top: 35%%; left: 35%%;
                    width: 180px; opacity: 0.05;" />

        <!-- Bottom Left Watermark -->
        <img src="%s"
             style="position: absolute; bottom: 5%%; left: 3%%;
                    width: 125px; opacity: 0.05;" />

        <!-- Bottom Right Watermark -->
        <img src="%s"
             style="position: absolute; bottom: 5%%; right: 3%%;
                    width: 125px; opacity: 0.05;" />

    </div>

    <!-- ================= RECEIPT CONTENT ================= -->
    <div style="position: relative; z-index: 1;">

        <!-- NGO HEADER -->
        <div style="text-align: center;
                    border-bottom: 2px solid #14532d;
                    padding-bottom: 12px;
                    margin-bottom: 18px;">

            <p style="font-size: 12px; font-weight: bold; margin: 0;">
                Registered under Bihar Government 90/2020 | 80G: AAZTS4557P25PT02
            </p>

            <h1 style="font-size: 26px; font-weight: 800;
                       color: #0d4a30; margin: 6px 0;">
                Shashi Jan Kalyan Trust(NGO)
            </h1>

            <p style="font-size: 14px; font-weight: 600; margin: 0;">
                Dikar Nagar, Barbigha, Shiekpura , KishanGanj, Bihar 811101
            </p>
            <p style="font-size: 12px; margin: 4px 0 0 0;">Email: shashijankalyantrast012345@gmail.com</p>

        </div>

        <!-- RECEIPT TITLE -->
        <div style="font-size: 18px; font-weight: bold;
                    text-align: center; margin-bottom: 20px;
                    text-decoration: underline;">
            भुगतान रसीद (Payment Receipt)
        </div>

        <!-- TRANSACTION DETAILS -->
        <table style="width: 100%%; margin-bottom: 16px;
                      font-size: 14px;">
            <tr>
                <td style="text-align: left;">
                    <strong>Transaction ID:</strong> %s
                </td>

                <td style="text-align: right;">
                    <strong>Date (दिनांक):</strong> %s
                </td>
            </tr>
        </table>

        <!-- RECEIPT INFORMATION -->
        <table style="width: 100%%; font-size: 14px;
                      border-collapse: collapse; margin-bottom: 20px;">

            <tr>
                <td style="padding: 8px 0;
                           border-bottom: 1px solid #9ca3af;">
                    <strong>नाम (Name):</strong> <em>%s</em>
                </td>
            </tr>

            <tr>
                <td style="padding: 8px 0;
                           border-bottom: 1px solid #9ca3af;">
                    <strong>ईमेल (Email):</strong> <em>%s</em>
                </td>
            </tr>

            <tr>
                <td style="padding: 8px 0;
                           border-bottom: 1px solid #9ca3af;">
                    <strong>मोबाइल (Mobile):</strong> <em>%s</em>
                </td>
            </tr>

            <tr>
                <td style="padding: 8px 0;
                           border-bottom: 1px solid #9ca3af;">
                    <strong>पता (Address):</strong> <em>%s</em>
                </td>
            </tr>

            <tr>
                <td style="padding: 8px 0;
                           border-bottom: 1px solid #9ca3af;">
                    <strong>उद्देश्य (Purpose):</strong> <em>%s</em>
                </td>
            </tr>

            <tr>
                <td style="padding: 8px 0;
                           border-bottom: 1px solid #9ca3af;">
                    <strong>वॉलंटियर (Collected By):</strong>
                    <em>%s</em>
                </td>
            </tr>

            <tr>
                <td style="padding: 8px 0;
                           border-bottom: 1px solid #9ca3af;">
                    <strong>राशि (Amount Paid):</strong>
                    <strong>Rs. %s/-</strong>
                </td>
            </tr>

        </table>

        <!-- SIGNATURE -->
        <table style="width: 100%%; margin-top: 50px;
                      font-size: 13px;">
            <tr>
                <td style="width: 100%%; text-align: center;">

                    <div style="width: 200px; margin: 0 auto 6px auto;
                                border-bottom: 1px solid #1f2937;
                                padding-bottom: 4px; text-align: center;">

                        <img src="%s"
                             alt="Authorized Signature"
                             style="height: 55px; max-width: 160px;
                                    display: inline-block;" />

                    </div>

                    <strong>स्टाफ का हस्ताक्षर</strong>
                    <br/>
                    (Shashi Jan Kalyan Trust)

                </td>
            </tr>
        </table>

    </div>
</div>
""".formatted(
                WATERMARK_LOGO_URL,  // Top Left
                WATERMARK_LOGO_URL,  // Top Right
                WATERMARK_LOGO_URL,  // Center
                WATERMARK_LOGO_URL,  // Bottom Left
                WATERMARK_LOGO_URL,  // Bottom Right
                txnId,
                date,
                name,
                email,
                phone,
                address,
                purpose,
                volunteerName,
                amount,
                SIGNATURE_URL
        );    }

    private void sendBrevoEmail(
            String toEmail,
            String toName,
            String subject,
            String htmlBody,
            List<Map<String, String>> attachments
    ) {
        Map<String, Object> body = Map.of(
                "sender", Map.of(
                        "name", fromName,
                        "email", fromEmail
                ),
                "to", List.of(
                        Map.of(
                                "email", toEmail,
                                "name", toName
                        )
                ),
                "subject", subject,
                "htmlContent", htmlBody,
                "attachment", attachments
        );

        restClient.post()
                .uri("/smtp/email")
                .header("api-key", apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .toBodilessEntity();
    }

    private String safe(String val) {
        return (val == null || val.isBlank()) ? "-" : val;
    }
}