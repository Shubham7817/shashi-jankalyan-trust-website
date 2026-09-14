import React from 'react'
import SEO from "../components/common/SEO";
import SectionTitle from "../components/ui/SectionTitle";
import Button from "../components/ui/Button";
import PageHero from "../components/common/PageHero";

import {
  Check,
  ArrowRight,
  Briefcase,
  TrendingUp,
} from "lucide-react";

// Swap these out with your actual livelihood-related image paths
import livelihood01 from "../assets/image/livelihood/livelihood.jpg";
import livelihood02 from "../assets/image/livelihood/img1.jpg";
import livelihood03 from "../assets/image/livelihood/img2.jpg";

const Livelihood = () => {
  const benefits = [
    "Access to market-relevant vocational training and specialized skill development",
    "Seed support and continuous mentorship for starting small-scale community enterprises",
    "Financial literacy and basic business management workshops",
    "A sustainable, long-term pathway to financial independence and steady income",
  ];

  const stats = [
    {
      value: "210+",
      label: "Individuals trained in FY 2023-24",
    },
    {
      value: "45",
      label: "Micro-enterprises supported",
    },
    {
      value: "₹5,000",
      label: "Provides seed support for a small business",
    },
    {
      value: "2021",
      label: "Running since inception",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Skill Mapping & Training",
      description:
        "We identify local market needs and train individuals in relevant vocational skills, ensuring they learn trades that are actually in demand.",
    },
    {
      number: "2",
      title: "Enterprise Development",
      description:
        "Beyond just training, we provide mentorship, financial literacy, and initial resources to help graduates start their own small businesses.",
    },
    {
      number: "3",
      title: "Sustainable Income",
      description:
        "We connect these new entrepreneurs with local markets and provide ongoing support to ensure their businesses grow and sustain steady income.",
    },
  ];

  return (
    <>
      <SEO title="Livelihood" description="Sustainable income opportunities and enterprise training." />
      
      <PageHero
        title="Our Work"
        subtitle="Five connected focus areas designed around community priorities."
      />

      <section className="section bg-white">
        <div className="container">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">
              Programme · Livelihood
            </p>

            <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
              Sustainable Income & Enterprise
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600 md:text-xl">
              Empowering individuals with vocational training, enterprise support, and the resources they need to break the cycle of poverty and build a sustainable future.
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
                title="Building businesses, building futures."
              />

              <p className="mt-6 text-base leading-7 text-gray-600">
                Charity provides temporary relief, but a steady livelihood provides permanent independence. Our livelihood programs are focused on equipping individuals in underserved communities with the skills they need to earn a living on their own terms.
              </p>

              <p className="mt-5 text-base leading-7 text-gray-600">
                We go beyond standard vocational training by focusing on enterprise. Whether it is teaching a new trade, providing seed funding for a small shop, or teaching basic accounting, our goal is to help individuals become self-sufficient entrepreneurs who can support their families for a lifetime.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
                  <Briefcase className="h-4 w-4" />
                  Vocational Training
                </div>

                <div className="flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
                  <TrendingUp className="h-4 w-4" />
                  Enterprise Support
                </div>
              </div>
            </div>

            {/* Main Image */}
            <div className="overflow-hidden rounded-3xl shadow-xl">
              <img
                src={livelihood01}
                alt="Individuals learning a new vocational trade"
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
                title="The impact of independence"
              />

              <div className="mt-7 space-y-5">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-50">
                      <Check className="h-4 w-4 text-orange-600" />
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
                  <p className="font-serif text-3xl font-bold text-orange-600">
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

            <div className="h-px flex-1 bg-linear-to-r from-orange-400 to-transparent" />
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {/* Image 1 */}
            <div className="group overflow-hidden rounded-2xl">
              <img
                src={livelihood02}
                alt="A local entrepreneur managing their newly launched small business"
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Image 2 */}
            <div className="group overflow-hidden rounded-2xl">
              <img
                src={livelihood01}
                alt="Vocational training session in progress"
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Image 3 */}
            <div className="group overflow-hidden rounded-2xl">
              <img
                src={livelihood03}
                alt="Community members participating in a financial literacy workshop"
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}
      <section className="section bg-orange-50">
        <div className="container">
          <SectionTitle
            eyebrow="Our approach"
            title="From training to enterprise"
          />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Number */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 font-serif text-lg font-bold text-white">
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
            ₹5,000 helps launch a small community enterprise.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/90 md:text-lg">
            Your 80G-eligible gift provides seed funding, tools, and crucial mentorship for an individual striving to build a business and support their family.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              to="/donate" variant="accent"
            >
              Empower an Entrepreneur
              <ArrowRight className="ml-2 inline-block h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

export default Livelihood;