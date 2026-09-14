import React from 'react'
import SEO from "../components/common/SEO";
import SectionTitle from "../components/ui/SectionTitle";
import Button from "../components/ui/Button";
import PageHero from "../components/common/PageHero";

import {
  Check,
  ArrowRight,
  Activity,
  Heart,
} from "lucide-react";

// Swap these out with your actual healthcare-related image paths
import healthcareCamp01 from "../assets/image/healthcare/healthcare.jpg";
import healthcareCamp02 from "../assets/image/healthcare/img1.jpg";
import healthcareCamp03 from "../assets/image/healthcare/img2.jpg";
const HealthCare = () => {
  const benefits = [
    "Access to free consultations and checkups through community medical camps",
    "Provision of essential medicines and basic healthcare support for families",
    "Awareness sessions on hygiene, sanitation, and disease prevention",
    "Early detection of illnesses and guidance for further medical treatment",
  ];

  const stats = [
    {
      value: "5,200+",
      label: "Patients treated in FY 2023-24",
    },
    {
      value: "24",
      label: "Medical camps organized locally",
    },
    {
      value: "₹500",
      label: "Provides essential medicines for a family",
    },
    {
      value: "2018",
      label: "Running since inception",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Assess & Plan",
      description:
        "We identify areas with limited access to clinics and coordinate with volunteer doctors to set up local medical camps.",
    },
    {
      number: "2",
      title: "Provide Care",
      description:
        "Patients receive free health checkups, diagnoses, and basic medical support right in their own neighborhoods.",
    },
    {
      number: "3",
      title: "Awareness & Follow-up",
      description:
        "Alongside treatment, we distribute free medicines and educate the community on hygiene to prevent future illnesses.",
    },
  ];

  return (
    <>
      <SEO title="Healthcare" description="Awareness and basic healthcare support." />
      
      <PageHero
        title="Our Work"
        subtitle="Five connected focus areas designed around community priorities."
      />

      <section className="section bg-white">
        <div className="container">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-600">
              Programme · Healthcare
            </p>

            <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
              Community Health & Wellness
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600 md:text-xl">
              Delivering vital healthcare services directly to underserved communities through medical camps, health awareness drives, and basic medical support.
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
                title="Bringing care to their doorstep."
              />

              <p className="mt-6 text-base leading-7 text-gray-600">
                For many families in rural and underserved areas, a trip to the doctor means losing a day's wage. Our healthcare initiatives are designed to bridge this gap by bringing medical professionals directly to the community.
              </p>

              <p className="mt-5 text-base leading-7 text-gray-600">
                We regularly organize free medical camps offering basic checkups, maternal health advice, and distribution of essential medicines. Beyond immediate relief, we focus heavily on preventative care—teaching families about sanitation, nutrition, and hygiene to foster long-term well-being.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700">
                  <Heart className="h-4 w-4" />
                  Medical camps
                </div>

                <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                  <Activity className="h-4 w-4" />
                  Health awareness
                </div>
              </div>
            </div>

            {/* Main Image */}
            <div className="overflow-hidden rounded-3xl shadow-xl">
              <img
                src={healthcareCamp01}
                alt="A doctor examining a patient at a free community medical camp"
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
                eyebrow="Community outcomes"
                title="The impact of our care"
              />

              <div className="mt-7 space-y-5">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-50">
                      <Check className="h-4 w-4 text-teal-600" />
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
                  <p className="font-serif text-3xl font-bold text-teal-600">
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

            <div className="h-px flex-1 bg-linear-to-r from-teal-400 to-transparent" />
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {/* Image 1 */}
            <div className="group overflow-hidden rounded-2xl">
              <img
                src={healthcareCamp02}
                alt="Volunteers organizing medicines at a health drive"
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Image 2 */}
            <div className="group overflow-hidden rounded-2xl">
              <img
                src={healthcareCamp01}
                alt="A local resident receiving a free health consultation"
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Image 3 */}
            <div className="group overflow-hidden rounded-2xl">
              <img
                src={healthcareCamp03}
                alt="Community members attending a health and hygiene awareness session"
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}
      <section className="section bg-teal-50">
        <div className="container">
          <SectionTitle
            eyebrow="Our approach"
            title="How we deploy medical camps"
          />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Number */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 font-serif text-lg font-bold text-white">
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
            ₹500 secures essential medicines for a family.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/90 md:text-lg">
            Your 80G-eligible gift helps us run medical camps, distribute vital prescriptions, and catch severe illnesses before it's too late.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              to="/donate" variant="accent"
            >
              Support our Medical Camps
              <ArrowRight className="ml-2 inline-block h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

export default HealthCare;