import React from "react";

export default function RefundPolicy() {
  return (
    <div className="mx-auto max-w-4xl p-6 lg:p-8 bg-white rounded-xl shadow-sm border border-gray-200 my-10">
      <h1 className="text-3xl font-bold text-green-900 mb-6">Cancellations & Refund Policy</h1>
      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>As a non-profit organization, Shashi Jan Kalyan Trust handles contributions as charitable donations. Please review our policy regarding cancellations and refunds.</p>

        <h2 className="text-xl font-bold text-gray-900 mt-6">1. General Donations</h2>
        <p>Donations made to Shashi Jan Kalyan Trust are strictly non-refundable. Once a transaction is completed, it is immediately allocated to our active welfare and education programs.</p>

        <h2 className="text-xl font-bold text-gray-900 mt-6">2. Erroneous or Duplicate Transactions</h2>
        <p>In the event of a technical error (e.g., your card was charged twice for a single intended donation) or an incorrect amount being deducted, we will process a refund for the erroneous amount.</p>
        <p>To request a refund for a duplicate transaction, you must contact us within <strong>7 days</strong> of the transaction date.</p>

        <h2 className="text-xl font-bold text-gray-900 mt-6">3. Refund Process</h2>
        <p>Please email us at <strong>info@shashijankalyantrust.org</strong> with your transaction ID, date, and reason for the request. Approved refunds will be credited back to the original payment method within 5-7 business days, subject to Razorpay and bank processing times.</p>

        <h2 className="text-xl font-bold text-gray-900 mt-6">4. Returns</h2>
        <p>As we accept charitable donations and do not sell physical goods, a traditional "Return Policy" is not applicable.</p>
      </div>
    </div>
  );
}