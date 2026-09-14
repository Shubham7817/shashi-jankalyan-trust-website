import { Link, useLocation } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function DonationSuccess() {
  const location = useLocation();

  const amount =
    location.state?.amount;

  const paymentId =
    location.state?.paymentId;

  return (
    <main className="container section">
      <div className="mx-auto max-w-2xl text-center">
        <CheckCircle
          className="mx-auto text-green-600"
          size={70}
        />

        <h1 className="mt-6 text-3xl font-bold">
          Thank You for Your Support
        </h1>

        <p className="mt-4 text-gray-600">
          Your payment has been verified successfully.
        </p>

        {amount && (
          <p className="mt-4 text-xl font-semibold">
            Donation Amount: ₹
            {Number(amount).toLocaleString()}
          </p>
        )}

        {paymentId && (
          <p className="mt-2 text-sm text-gray-500">
            Payment ID: {paymentId}
          </p>
        )}

        <Link
          to="/"
          className="mt-6 inline-block rounded-xl bg-green-700 px-6 py-3 text-white"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}