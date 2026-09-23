import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-4xl p-6 lg:p-8 bg-white rounded-xl shadow-sm border border-gray-200 my-10">
      <h1 className="text-3xl font-bold text-green-900 mb-6">Privacy Policy</h1>
      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p><strong>Effective Date:</strong> [Insert Date]</p>
        
        <p>Shashi Jan Kalyan Trust ("we", "our", "us") is committed to protecting the privacy of our donors, volunteers, and website visitors. This policy explains how we collect, use, and safeguard your information.</p>

        <h2 className="text-xl font-bold text-gray-900 mt-6">1. Information We Collect</h2>
        <p>When you make a donation, register as a volunteer, or contact us, we may collect:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Personal identification data (Name, Email, Phone Number, Address, PAN for tax exemptions).</li>
          <li>Payment information (processed securely through Razorpay; we do not store your credit/debit card details).</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-6">2. How We Use Your Information</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>To process your donations and issue 80G tax exemption certificates.</li>
          <li>To send periodic updates regarding our initiatives in Sheikhpura, Bihar, and other operating regions.</li>
          <li>To comply with legal and regulatory obligations.</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900 mt-6">3. Data Sharing</h2>
        <p>We do not sell, trade, or rent your personal information to third parties. Data is only shared with trusted payment gateways (like Razorpay) strictly for processing transactions, or when required by Indian law.</p>

        <h2 className="text-xl font-bold text-gray-900 mt-6">4. Contact Us</h2>
        <p>If you have questions about this Privacy Policy, please contact us at: <strong>info@shashijankalyantrust.org</strong> or visit us at our registered office in Sheikhpura, Bihar.</p>
      </div>
    </div>
  );
}