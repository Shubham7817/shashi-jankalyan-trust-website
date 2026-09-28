import React from "react";
import bihar_gov from "../assets/image2/bihar_gov_agri.jpg";
import sbi_logo from "../assets/image2/sbi_logo.png";
import ic_logo from "../assets/image2/ic_logo.svg";

export default function Partners() {
  const partners = [
    {
      name: "Srishti Development Pvt. Ltd.",
      role: "CSR & Funding Partner",
      description: "Providing vital CSR funds to drive our grassroots initiatives. Special thanks to HR Mr. Maya Shankar.",
      logo: ic_logo 
    },
    {
      name: "Govt. of Bihar (Agriculture)",
      role: "Government Partner",
      description: "Supporting rural development and agricultural empowerment in the region.",
      logo: bihar_gov 
    },
    {
      name: "State Bank of India (SBI)",
      role: "SHG Linkage Partner",
      description: "Our financial partner for linking and empowering Women's Self Help Groups (SHGs).",
      logo: sbi_logo 
    }
  ];

  return (
    <section className="bg-white py-12 sm:py-16 border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Our Partners & Supporters</h2>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            We are proud to collaborate with esteemed organizations to bring positive change to society.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {partners.map((partner, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="h-20 sm:h-24 flex items-center justify-center mb-4 w-full">
                <img 
                  src={partner.logo} 
                  alt={`${partner.name} Logo`} 
                  className="max-h-full max-w-full object-contain drop-shadow-sm"
                />
              </div>
              <h3 className="text-lg font-bold text-[#0d4a30] mb-1">{partner.name}</h3>
              <span className="text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full mb-3">
                {partner.role}
              </span>
              <p className="text-sm text-gray-600">
                {partner.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}