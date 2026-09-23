import React from "react";

export default function SubscriptionTerms() {
  return (
    <div className="mx-auto max-w-4xl p-6 lg:p-8 bg-white rounded-xl shadow-sm border border-gray-200 my-10">
      <h1 className="text-3xl font-bold text-green-900 mb-6">Recurring Donation (Subscription) Terms</h1>
      <div className="space-y-4 text-gray-700 leading-relaxed">
        
        <p>By opting into a recurring donation (Subscription) to support Shashi Jan Kalyan Trust, you agree to the following terms:</p>

        <h2 className="text-xl font-bold text-gray-900 mt-6">1. Authorization</h2>
        <p>You authorize Razorpay and your bank/card issuer to automatically deduct the agreed-upon donation amount from your account on a regular billing cycle (e.g., monthly or annually).</p>

        <h2 className="text-xl font-bold text-gray-900 mt-6">2. Billing Cycle</h2>
        <p>Your first deduction will occur on the day you set up the recurring donation. Subsequent deductions will occur automatically on the same calendar day of the subsequent billing periods.</p>

        <h2 className="text-xl font-bold text-gray-900 mt-6">3. Cancellations</h2>
        <p>You may cancel your recurring donation at any time. To avoid the next scheduled deduction, you must cancel your subscription at least <strong>5 business days</strong> before your next billing date.</p>
        <p>Cancellations can be made by contacting us at <strong>info@shashijankalyantrust.org</strong> or by managing your mandate directly through your banking application.</p>

        <h2 className="text-xl font-bold text-gray-900 mt-6">4. Refunds on Subscriptions</h2>
        <p>As per our general refund policy, successfully processed recurring donations are non-refundable. If you forget to cancel before the billing date, that month's donation cannot be reversed.</p>
      </div>
    </div>
  );
}