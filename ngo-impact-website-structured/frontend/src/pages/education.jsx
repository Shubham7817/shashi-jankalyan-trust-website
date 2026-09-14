import React from 'react'
import SEO from "../components/common/SEO";
import SectionTitle from "../components/ui/SectionTitle";
import Button from "../components/ui/Button";
import PageHero from "../components/common/PageHero";

import {
  Check,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Award,
  Users,
} from "lucide-react";

// Swap these out with your actual education-related image paths
import educationSession01 from "../assets/image/education/education.jpg";
import educationSession02 from "../assets/image/education/img1.jpg";
import educationSession03 from "../assets/image/education/img2.jpg";

const Education = () => {
  const benefits = [
    "Access to structured learning programs and after-school tuition",
    "Scholarships for deserving students to prevent school dropouts",
    "Provision of essential resources like books, stationery, and bags",
    "A safe, encouraging environment that fosters a lifelong love for learning",
  ];

  const stats = [
    {
      value: "450+",
      label: "Children supported in FY 2023-24",
    },
    {
      value: "12",
      label: "Active community learning centers",
    },
    {
      value: "₹1,500",
      label: "Funds one child's education per month",
    },
    {
      value: "2019",
      label: "Running since inception",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Identify & Enrol",
      description:
        "We identify underserved children in local communities and enroll them in our foundational learning programs.",
    },
    {
      number: "2",
      title: "Provide Resources",
      description:
        "Students receive necessary materials like textbooks, notebooks, and stationery to remove financial barriers.",
    },
    {
      number: "3",
      title: "Continuous Support",
      description:
        "Through daily classes, scholarships, and mentorship, we ensure they stay in school and thrive academically.",
    },
  ];

  return (
    <>
      <SEO title="Education" description="Providing learning opportunities for underserved children." />
      
      <PageHero
        title="Our Work"
        subtitle="Five connected focus areas designed around community priorities."
      />

      <section className="section bg-white">
        <div className="container">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              Programme · Education
            </p>

            <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
              Child Education Initiatives
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600 md:text-xl">
              Providing learning opportunities, scholarships, and essential resources to underserved children, ensuring every child has the chance to build a brighter future.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          THE PROGRAMME
      ========================================================= */}
      <section className="section bg-[#faf9f7]">
        <div className="container">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

            {/* Text */}
            <div>
              <SectionTitle
                eyebrow="The programme"
                title="Education changes everything."
              />

              <p className="mt-6 text-base leading-7 text-gray-600">
                Our education program focuses on bridging the learning gap for children who lack access to quality schooling. We run community-based learning centers that offer after-school support, homework help, and foundational education.
              </p>

              <p className="mt-5 text-base leading-7 text-gray-600">
                Beyond just daily classes, we provide critical resources so financial hardship never stands in the way of a child's learning journey. For higher-performing or highly vulnerable students, our scholarship programs ensure they can complete their schooling without the pressure of dropping out.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                  <BookOpen className="h-4 w-4" />
                  Learning programs
                </div>

                <div className="flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
                  <GraduationCap className="h-4 w-4" />
                  Scholarships
                </div>
              </div>
            </div>

            {/* Main Image */}
            <div className="overflow-hidden rounded-3xl shadow-xl">
              <img
                src={educationSession01}
                alt="Children studying together in a community learning center"
                className="h-80 w-full object-cover transition-transform duration-500 hover:scale-105 md:h-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          WHAT PARTICIPANTS GAIN
      ========================================================= */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">

            {/* Benefits */}
            <div>
              <SectionTitle
                eyebrow="Participant outcomes"
                title="What the children gain"
              />

              <div className="mt-7 space-y-5">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50">
                      <Check className="h-4 w-4 text-blue-600" />
                    </div>

                    <p className="text-base leading-6 text-gray-600">
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div className="grid gap-4 sm:grid-cols-2">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <p className="font-serif text-3xl font-bold text-blue-600">
                    {stat.value}
                  </p>

                  <p className="mt-2 text-sm leading-5 text-gray-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          IN ACTION
      ========================================================= */}
      <section className="section bg-[#faf9f7]">
        <div className="container">
          <div className="flex items-center gap-5">
            <h2 className="font-serif text-3xl font-bold text-gray-900 md:text-4xl">
              In action
            </h2>

            <div className="h-px flex-1 bg-linear-to-r from-blue-400 to-transparent" />
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {/* Image 1 */}
            <div className="group overflow-hidden rounded-2xl">
              <img
                src={educationSession02}
                alt="Students reading books provided by the trust"
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Image 2 */}
            <div className="group overflow-hidden rounded-2xl">
              <img
                src={educationSession01}
                alt="A teacher helping young students with their coursework"
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Image 3 */}
            <div className="group overflow-hidden rounded-2xl">
              <img
                src={educationSession03}
                alt="Children receiving their scholarship and resource kits"
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}
      <section className="section bg-blue-50">
        <div className="container">
          <SectionTitle
            eyebrow="Our approach"
            title="How we support their journey"
          />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Number */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-serif text-lg font-bold text-white">
                  {step.number}
                </div>

                <h3 className="mt-5 font-serif text-xl font-bold text-gray-900">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          DONATION CTA
      ========================================================= */}
      <section className="bg-green-900 p-4">
        <div className="container py-16 text-center md:py-20">
          <h2 className="mx-auto max-w-4xl font-serif text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            ₹1,500 keeps a child in school for a month.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/90 md:text-lg">
            Your 80G-eligible gift funds learning materials, teacher support, and a safe space for a child to learn and grow.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              to="/donate" variant="accent"
            >
              Sponsor a Child
              <ArrowRight className="ml-2 inline-block h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

export default Education;