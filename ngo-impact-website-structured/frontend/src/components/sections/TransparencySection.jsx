import SectionTitle from "../ui/SectionTitle";
import DocumentCard from "../common/DocumentCard";
import img1 from "../../assets/image2/80g-certificate.pdf";
import img2 from "../../assets/image2/csr-certificate.pdf";
import img3 from "../../assets/image2/niti-aayog.pdf";
import img4 from "../../assets/image2/12ab-certificate.pdf";
import img5 from "../../assets/image2/msme-certificate.pdf";
import img6 from "../../assets/image2/auditors-report.pdf";



const docs = [
  {
    title: "Trust Registration",
    value: "90/2020",
    description: "District Registry Office, Sheikhpura, Government of Bihar · 6 January 2020",
    documentUrl: "",
    status: "Available",
  },
  {
    title: "PAN",
    value: "AAZTS4557P",
    description: "Permanent Account Number of the organization.",
    documentUrl: "",
    status: "Available",
  },
  {
    title: "80G Registration",
    value: "AAZTS4557P25PT02",
    description: "CIT Exemption, Patna (Shiv Swaroop Singh) · 25 June 2026",
    documentUrl: img1,
    status: "Available",
  },
  {
    title: "CSR Registration",
    value: "CSR00013783",
    description: "Ministry of Corporate Affairs,26 Aug 2021",
    documentUrl: img2,
    status: "Available",
  },
  {
    title: "NGO Darpan NITI Aayog",
    value: "32456789",
    description: "Official registration details of the organization.",
    documentUrl: img3,
    status: "Available",
  },
  {
    title: "12AB Income Tax Registration",
    value: "AAZTS4557P25PT01",
    description: "CIT Exemption, Patna · 3 September 2025",
    documentUrl: img4,
    status: "Available",
  },

  // {
  //   title: "Financial Reports",
  //   value: "[sdfasdfas]",
  //   description: "Financial reports will be uploaded here.",
  //   documentUrl: "/documents/uan_card.pdf",
  //   status: "Unavailable",
  // },
  {
    title: "Udyam MSME Registration",
    value: "UDYAM-BR-32-0002779",
    description: "Ministry of MSME, Govt. of India · 16 September 2022",
    documentUrl: img5,
    status: "Available",
  },  
    {
    title: "Auditor's Report",
    value: "UDIN - : 26454374IAIVKG2841",
    description: "SANJAY KUMAR JHA & ASSOCIATES Chartered Accountants · Date: 31st March 2026",
    documentUrl: img6,
    status: "Available",
  }
];
export default function TransparencySection() {
  return (
    <section className="section">
      <div className="container">
        <SectionTitle
          eyebrow="Trust"
          title="Transparency & Accountability"
          text="Placeholder documents are clearly marked until verified information is added."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {docs.map((document) => (
            <DocumentCard
              key={document.title}
              document={document}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
