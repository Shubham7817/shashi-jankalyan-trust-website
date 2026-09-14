import React from 'react'
import SEO from "../components/common/SEO";
import SectionTitle from "../components/ui/SectionTitle";
import Button from "../components/ui/Button";
import PageHero from "../components/common/PageHero";

import {
  Check,
  ArrowRight,
  Gift,
  Users,
} from "lucide-react";

// Swap these out with your actual Kanya Vivah-related image paths
import kanyaVivah01 from "../assets/image/kanya-vivah indoor/img1.jpg";
import kanyaVivah02 from "../assets/image/kanya-vivah indoor/img2.jpg";
import kanyaVivah03 from "../assets/image/kanya-vivah indoor/img3.jpg";
import kanyaVivah04 from "../assets/image/kanya-vivah indoor/img4.jpg";

const KanyaVivah = () => {
  const benefits = [
    "Financial assistance for marriage expenses to alleviate the burden on economically weaker families",
    "Provision of essential household items, utensils, and clothing to help couples start their new life",
    "Organization of community mass marriages to significantly reduce individual family expenditures",
    "Protection of families from falling into high-interest debt traps caused by traditional marriage costs",
  ];

  const stats = [
    {
      value: "50+",
      label: "Marriages supported in FY 2023-24",
    },
    {
      value: "15",
      label: "Community mass weddings organized",
    },
    {
      value: "₹11,000",
      label: "Provides a basic household starter kit",
    },
    {
      value: "2019",
      label: "Running since inception",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Application & Verification",
      description:
        "Families apply for the Kanya Vivah support program. Our volunteers conduct ground-level verification to ensure the family meets the economic eligibility criteria.",
    },
    {
      number: "2",
      title: "Material & Financial Aid",
      description:
        "Eligible families are provided with essential support, including bridal attire, basic household items, and direct financial assistance for the ceremony.",
    },
    {
      number: "3",
      title: "The Celebration",
      description:
        "Whether supporting an individual wedding or organizing a mass community marriage, we ensure the daughters are sent off with dignity, respect, and joy.",
    },
  ];

  return (
    <>
      <SEO title="Kanya Vivah Support" description="Kanya Vivah support initiatives for economically weaker families." />
      
      <PageHero
        title="Our Work"
        subtitle="Five connected focus areas designed around community priorities."
      />

      <section className="section bg-white">
        <div className="container">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-purple-600">
              Programme · Social Support
            </p>

            <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
              Kanya Vivah Support
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600 md:text-xl">
              Ensuring that every daughter from an underprivileged background can celebrate her marriage with dignity, without forcing her family into a cycle of debt.
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
                title="A dignified start to a new life."
              />

              <p className="mt-6 text-base leading-7 text-gray-600">
                In many underserved communities, the financial expectation of a daughter's marriage can be a source of immense stress, often pushing families into generational debt. Our Kanya Vivah initiative is designed to lift this heavy burden from parents' shoulders.
              </p>

              <p className="mt-5 text-base leading-7 text-gray-600">
                By carefully verifying eligibility and focusing on women from the most vulnerable economic backgrounds, we provide comprehensive benefits. This includes basic household starter kits, bridal necessities, and support for community weddings to ensure the occasion remains joyous rather than stressful.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700">
                  <Gift className="h-4 w-4" />
                  Essential Benefits
                </div>

                <div className="flex items-center gap-2 rounded-full bg-fuchsia-50 px-4 py-2 text-sm font-semibold text-fuchsia-700">
                  <Users className="h-4 w-4" />
                  Community Support
                </div>
              </div>
            </div>

            {/* Main Image */}
            <div className="overflow-hidden rounded-3xl shadow-xl">
              <img
                src={kanyaVivah04}
                alt="Families gathered for a supported Kanya Vivah ceremony"
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
                eyebrow="Family outcomes"
                title="The impact of your support"
              />

              <div className="mt-7 space-y-5">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-50">
                      <Check className="h-4 w-4 text-purple-600" />
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
                  <p className="font-serif text-3xl font-bold text-purple-600">
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

            <div className="h-px flex-1 bg-linear-to-r from-purple-400 to-transparent" />
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {/* Image 1 */}
            <div className="group overflow-hidden rounded-2xl">
              <img
                src={kanyaVivah02}
                alt="Volunteers distributing household starter kits to families"
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Image 2 */}
            <div className="group overflow-hidden rounded-2xl">
              <img
                src={kanyaVivah01}
                alt="A beautiful community wedding ceremony supported by the trust"
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Image 3 */}
            <div className="group overflow-hidden rounded-2xl">
              <img
                src={kanyaVivah03}
                alt="Parents expressing gratitude after receiving marriage support"
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}
      <section className="section bg-purple-50">
        <div className="container">
          <SectionTitle
            eyebrow="Our approach"
            title="From eligibility to celebration"
          />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Number */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 font-serif text-lg font-bold text-white">
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
            ₹11,000 helps a family send off their daughter with dignity.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/90 md:text-lg">
            Your 80G-eligible gift funds essential household items, clothing, and ceremony support, protecting vulnerable families from crushing debt.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              to="/donate" variant="accent"
            >
              Support a Family
              <ArrowRight className="ml-2 inline-block h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

export default KanyaVivah;