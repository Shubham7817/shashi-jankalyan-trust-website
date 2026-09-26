import SEO from "../components/common/SEO";
import PageHero from "../components/common/PageHero";
import ContactForm from "../components/forms/ContactForm";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
export default function Contact() {
  return (
    <>
      <SEO title="Contact" description="Contact the NGO." />
      <PageHero
        title="Contact Us"
        subtitle="Questions, partnerships and community conversations are welcome."
      />
      <section className="section">
        <div className="container grid gap-8 lg:grid-cols-2">
          <div>
            <div className="space-y-4">

              {/* Phone */}
              <div className="card p-5 flex items-center gap-4">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-green-100 flex items-center justify-center">
                  <Phone className="w-6 h-6 bg-green-100" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                    Phone
                  </p>
                  <p className="mt-1 text-base font-medium text-gray-900">
                    +91-6203766882
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="card p-5 flex items-center gap-4">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-green-100 flex items-center justify-center">
                  <Mail className="w-6 h-6 bg-green-100" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                    Email
                  </p>
                  <p className="mt-1 text-base font-medium text-gray-900">
                    shashijankalyantrast012345@gmail.com
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="card p-5 flex items-start gap-4">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-green-100 flex items-center justify-center">
                  <MapPin className="w-6 h-6 bg-green-100" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                    Address
                  </p>
                  <p className="mt-1 text-base font-medium text-gray-900 leading-6">
                    Dinkar Nagar, PO + PS: Barbigha, Sheikhpura, Bihar
                    <br />
                    811101
                  </p>
                </div>
              </div>

              {/* Office Hours */}
              <div className="card p-5 flex items-center gap-4">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-green-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 bg-green-100" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                    Office Hours
                  </p>
                  <p className="mt-1 text-base font-medium text-gray-900">
                    Monday – Saturday
                  </p>
                  <p className="text-sm text-gray-600">
                    10:00 AM – 6:00 PM
                  </p>
                </div>
              </div>

            </div>
<div className="mt-5 overflow-hidden rounded-2xl border border-gray-200 bg-white">
  <iframe
    title="Shashi Jan Kalyan Trust Location"
    src="https://www.google.com/maps?q=Dinkar+Nagar,+Barbigha,+Sheikhpura,+Bihar+811101&output=embed"
    className="h-64 w-full border-0"
    loading="lazy"
    allowFullScreen
    referrerPolicy="no-referrer-when-downgrade"
  ></iframe>

      <div className="p-4">
        <a
          href="https://www.google.com/maps/search/?api=1&query=Dinkar+Nagar%2C+Barbigha%2C+Sheikhpura%2C+Bihar+811101"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800"
        >
          Open in Google Maps
        </a>
      </div>
    </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
