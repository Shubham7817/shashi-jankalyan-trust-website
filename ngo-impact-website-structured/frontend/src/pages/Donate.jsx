import { useEffect, useState } from "react";
import SEO from "../components/common/SEO";
import PageHero from "../components/common/PageHero";
import DonationForm from "../components/forms/DonationForm";
import SectionTitle from "../components/ui/SectionTitle";
import { allocation } from "../data/impact";

export default function Donate() {
  const [recentDonors, setRecentDonors] = useState([]);

  // Fetch recent donors on component mount
  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/payment/recent-donors");
        if (response.ok) {
          const data = await response.json();
          setRecentDonors(data);
        }
      } catch (error) {
        console.error("Failed to fetch recent donors:", error);
      }
    };
    fetchDonors();
  }, []);

  // Helper function to show only the first name and last initial for privacy
  const formatName = (fullName) => {
    if (!fullName) return "Anonymous";
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return parts[0];
    return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
  };

  return (
    <div className="bg-gray-50/50 min-h-screen pb-16 md:pb-24">
      <SEO title="Donate" description="Support social impact." />
      
      <PageHero
        title="Your Support Can Change a Life"
        subtitle="A simple, secure, and transparent donation experience."
      />
      
      <section className="container mx-auto px-4 sm:px-6 pt-8 md:pt-12">
        {/* Asymmetrical Grid: Stacks on mobile, splits 7/5 on Desktop */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          
          {/* ========================================== */}
          {/* LEFT COLUMN: THE FORM */}
          {/* ========================================== */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8">
              <DonationForm />
            </div>
          </div>

          {/* ========================================== */}
          {/* RIGHT COLUMN: STICKY SIDEBAR */}
          {/* ========================================== */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-24 mt-4 lg:mt-0">
            
            {/* 1. SECURE PAYMENT CARD */}
            <div className="rounded-2xl bg-linear-to-br mt-2 from-green-900 to-green-800 p-5 sm:p-6 text-white shadow-md">
              <div className="flex items-center gap-3 mb-3">
                {/* Shield Icon */}
                <svg className="w-6 h-6 text-green-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                <h2 className="text-lg sm:text-xl font-bold leading-tight">100% Secure Payment</h2>
              </div>
              <p className="text-green-100 text-sm mb-5">
                Your transaction is protected with bank-grade 256-bit encryption.
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-medium text-green-900">
                <span className="bg-white/90 px-3 py-1.5 rounded-md">UPI</span>
                <span className="bg-white/90 px-3 py-1.5 rounded-md">Razorpay</span>
                <span className="bg-white/90 px-3 py-1.5 rounded-md">Credit/Debit</span>
                <span className="bg-white/90 px-3 py-1.5 rounded-md">Net Banking</span>
              </div>
            </div>

            {/* 2. RECENT SUPPORTERS */}
            <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-gray-100">
              <div className="mb-4 sm:mb-5 flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold text-gray-800">Recent Supporters</h2>
                {recentDonors.length > 0 && (
                  <span className="flex h-2.5 w-2.5 relative shrink-0" title="Live updates">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                )}
              </div>
              
              {recentDonors.length === 0 ? (
                <p className="text-sm text-gray-500 italic">Be the first to donate today!</p>
              ) : (
                <div className="flex flex-wrap content-start gap-2 sm:gap-2.5 max-h-32 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">
                  {recentDonors.map((donor, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 py-1 pl-1 pr-3 shadow-sm transition-all hover:border-green-300 hover:bg-white"
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700">
                        {donor.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold text-gray-700">{formatName(donor.name)}</span>
                        {(donor.city || donor.state) && (
                          <span className="ml-1 text-xs text-gray-500 hidden sm:inline">
                            from {donor.city || donor.state}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. ALLOCATION CARD */}
            <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-gray-100">
              <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-5 sm:mb-6">Where Your Donation Goes</h2>
              
              {/* Single Continuous Bar */}
              <div className="flex h-3 sm:h-4 w-full overflow-hidden rounded-full mb-5 sm:mb-6">
                {allocation.map(([name, value], index) => {
                  const colors = ["bg-green-800", "bg-green-600", "bg-green-400", "bg-emerald-300", "bg-teal-100"];
                  return (
                    <div
                      key={name}
                      className={`h-full ${colors[index % colors.length]} transition-all duration-1000`}
                      style={{ width: `${value}%` }}
                      title={`${name}: ${value}%`}
                    />
                  );
                })}
              </div>

              {/* Responsive Legend */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 sm:gap-y-4 gap-x-2">
                {allocation.map(([name, value], index) => {
                  const colors = ["bg-green-800", "bg-green-600", "bg-green-400", "bg-emerald-300", "bg-teal-100"];
                  return (
                    <div key={name} className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0 rounded-full ${colors[index % colors.length]}`}></span>
                      <span className="text-xs sm:text-sm text-gray-600 font-medium truncate">{name}</span>
                      <span className="text-xs sm:text-sm font-bold text-gray-800 ml-auto">{value}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}