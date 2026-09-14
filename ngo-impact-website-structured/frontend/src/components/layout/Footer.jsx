import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16  pt-4 bg-green-900 text-white">
      <div className="container grid gap-8 py-14  md:grid-cols-4">
        <div className="mb-4">
          <h2 className="font-bold">Shashi Jan Kalyan Trust<br />
                                    शशि जन कल्याण ट्रस्ट</h2>
          <p className="mt-3">A registered charitable trust empowering women, farmers, and families in Sheikhpura, Bihar since 2020.<br/>
          Reg. No. 90/2020 · Bihar, India</p>
        </div>
        <div>
          <b>Quick Links</b>
          <Link className="mt-2 block" to="/about">
            About
          </Link>
          <Link className="mt-2 block" to="/our-work">
            Our Work
          </Link>
          <Link className="mt-2 block" to="/projects">
            Projects
          </Link>
        </div>
        <div>
          <b>Get Involved</b>
          <Link className="mt-2 block" to="/donate">
            Donate
          </Link>
          <Link className="mt-2 block" to="/get-involved">
            Volunteer
          </Link>
          <Link className="mt-2 block" to="/contact">
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
                className="text-sm  font-bold text-white/90 transition-colors hover:text-green-300"
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
                info@shashijankalyantrust.org
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
<div className="border-t border-green-800 py-4 w-full">
  {/* Added max-w-5xl, mx-auto, and px-4 here */}
  <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8 text-sm text-center md:text-left text-green-100">
    <span>© 2026 Shashi Jan Kalyan Trust. All rights reserved.</span>
    <span>80G: AAZTS4557P25PT02    CSR: CSR00013783</span>
  </div>
</div>
    </footer>
  );
}
