import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 pt-4 bg-green-900 text-white">
      <div className="container grid gap-8 py-14 md:grid-cols-4">
        <div className="mb-4">
          <h2 className="font-bold">
            Shashi Jan Kalyan Trust<br />
            शशि जन कल्याण ट्रस्ट
          </h2>
          <p className="mt-3">
            A registered charitable trust empowering women, farmers, and families in Sheikhpura, Bihar since 2020.<br/>
            Reg. No. 90/2020 · Bihar, India
          </p>
        </div>
        
        <div>
          <b>Quick Links</b>
          <Link className="mt-2 block hover:text-green-300 transition-colors" to="/about">
            About
          </Link>
          <Link className="mt-2 block hover:text-green-300 transition-colors" to="/our-work">
            Our Work
          </Link>
          {/* <Link className="mt-2 block hover:text-green-300 transition-colors" to="/projects">
            Projects
          </Link> */}
        </div>
        
        <div>
          <b>Get Involved</b>
          <Link className="mt-2 block hover:text-green-300 transition-colors" to="/donate">
            Donate
          </Link>
          <Link className="mt-2 block hover:text-green-300 transition-colors" to="/get-involved">
            Volunteer
          </Link>
          <Link className="mt-2 block hover:text-green-300 transition-colors" to="/contact">
            Partner
          </Link>
        </div>
        
        <div>
          <b className="text-lg">Contact</b>
          <div className="mt-4 space-y-4">
            {/* Phone */}
            <div className="flex items-start gap-3">
              <Phone
                className="mt-0.5 h-5 w-5 shrink-0 text-green-300"
                strokeWidth={1.8}
              />
              <a
                href="tel:+916203766882"
                className="text-sm font-bold text-white/90 transition-colors hover:text-green-300"
              >
                +91-6203766882
              </a>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <Mail
                className="mt-0.5 h-5 w-5 shrink-0 text-green-300"
                strokeWidth={1.8}
              />
              <a
                href="mailto:info@shashijankalyantrust.org"
                className="break-all font-bold text-sm text-white/90 transition-colors hover:text-green-300"
              >
                shashijankalyantrast012345@gmail.com
              </a>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3">
              <MapPin
                className="mt-0.5 h-5 w-5 shrink-0 text-green-300"
                strokeWidth={1.8}
              />
              <p className="text-sm font-bold leading-6 text-white/90">
                Dinkar Nagar, PO + PS: Barbigha,
                <br />
                Sheikhpura, Bihar 811101
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Section */}
      <div className="border-t border-green-800 py-6 w-full">
        <div className="max-w-5xl mx-auto px-4">
          
          {/* Razorpay Compliance Legal Links */}
          <div className="mb-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm font-medium text-green-200">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span className="hidden md:inline text-green-700">|</span>
            <Link to="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <span className="hidden md:inline text-green-700">|</span>
            <Link to="/refund-policy" className="hover:text-white transition-colors">Cancellations & Refunds</Link>
            <span className="hidden md:inline text-green-700">|</span>
            <Link to="/subscription-terms" className="hover:text-white transition-colors">Subscription Terms</Link>
            <span className="hidden md:inline text-green-700">|</span>
            <Link to="/referral-terms" className="hover:text-white transition-colors">Referral Terms</Link>
          </div>

          {/* Copyright & Tax Info */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-center md:text-left text-green-100/80">
            <span>© 2026 Shashi Jan Kalyan Trust. All rights reserved.</span>
            <span>80G: AAZTS4557P25PT02 &nbsp;&nbsp;|&nbsp;&nbsp; CSR: CSR00013783</span>
          </div>
          
        </div>
      </div>
    </footer>
  );
}