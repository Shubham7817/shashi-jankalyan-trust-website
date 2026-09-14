import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

export default function DonationFailed() {
  return (
    <main className="container section">
      <div className="mx-auto max-w-2xl text-center">
        <XCircle
          className="mx-auto text-red-600"
          size={70}
        />

        <h1 className="mt-6 text-3xl font-bold">
          Payment Could Not Be Verified
        </h1>

        <p className="mt-4 text-gray-600">
          No donation has been confirmed by our
          system. Please try again if necessary.
        </p>

        <Link
          to="/donate"
          className="mt-6 inline-block rounded-xl bg-green-700 px-6 py-3 text-white"
        >
          Try Again
        </Link>
      </div>
    </main>
  );
}