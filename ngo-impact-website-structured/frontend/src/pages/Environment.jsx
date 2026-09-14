import React from 'react'
import SEO from "../components/common/SEO";
import SectionTitle from "../components/ui/SectionTitle";
import Button from "../components/ui/Button";
import PageHero from "../components/common/PageHero";

import {
  Check,
  ArrowRight,
  Leaf,
  Sprout,
} from "lucide-react";

// Swap these out with your actual environment-related image paths
import environment01 from "../assets/image/agriculture/soil-testing-lab.avif";
import environment02 from "../assets/image/agriculture/img1.jpg";
import environment03 from "../assets/image/agriculture/img2.jpg";

const Environment = () => {
  const benefits = [
    "Planting native trees to restore local green cover and improve air quality",
    "Organizing community clean-up drives to safely remove plastic and hazardous waste",
    "Educating households and schools on proper waste segregation and composting",
    "Promoting sustainable, eco-friendly daily habits among the youth",
  ];

  const stats = [
    {
      value: "5,000+",
      label: "Saplings planted in FY 2023-24",
    },
    {
      value: "20+",
      label: "Neighborhood clean-up drives",
    },
    {
      value: "₹300",
      label: "Funds a sapling and its initial care",
    },
    {
      value: "2020",
      label: "Running since inception",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Survey & Plan",
      description:
        "We identify barren public spaces, polluted neighborhoods, and local schools that need environmental intervention and planning.",
    },
    {
      number: "2",
      title: "Community Action",
      description:
        "Volunteers and local residents come together for mass plantation drives and targeted waste-clearing initiatives.",
    },
    {
      number: "3",
      title: "Nurture & Maintain",
      description:
        "Planting is just step one. We assign local caretakers to water and protect the saplings to ensure high survival rates.",
    },
  ];

  return (
    <>
      <SEO title="Environment" description="Environmental conservation and sustainability initiatives." />
      
      <PageHero
        title="Our Work"
        subtitle="Five connected focus areas designed around community priorities."
      />

      <section className="section bg-white">
        <div className="container">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
              Programme · Environmental Conservation
            </p>

            <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
              Sustainability & Greening
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600 md:text-xl">
              Protecting our planet starting at the local level through mass tree plantation, waste management education, and community clean-up drives.
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
                title="Healing the earth, locally."
              />

              <p className="mt-6 text-base leading-7 text-gray-600">
                Global climate change is a massive challenge, but the most effective solutions begin in our own neighborhoods. Our environmental initiatives focus on practical, hands-on activities that directly improve local living conditions.
              </p>

              <p className="mt-5 text-base leading-7 text-gray-600">
                From organizing weekend clean-up drives in cluttered streets to planting and nurturing native fruit and shade trees in public spaces, we empower citizens to take ownership of their surroundings. We also focus on education, teaching the next generation about waste segregation, recycling, and sustainable living.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                  <Sprout className="h-4 w-4" />
                  Tree Plantation
                </div>

                <div className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
                  <Leaf className="h-4 w-4" />
                  Waste Management
                </div>
              </div>
            </div>

            {/* Main Image */}
            <div className="overflow-hidden rounded-3xl shadow-xl">
              <img
                src={environment01}
                alt="Volunteers planting saplings in a community park"
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
                eyebrow="Environmental outcomes"
                title="The impact of going green"
              />

              <div className="mt-7 space-y-5">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50">
                      <Check className="h-4 w-4 text-emerald-600" />
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
                  <p className="font-serif text-3xl font-bold text-emerald-600">
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

            <div className="h-px flex-1 bg-linear-to-r from-emerald-400 to-transparent" />
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {/* Image 1 */}
            <div className="group overflow-hidden rounded-2xl">
              <img
                src={environment02}
                alt="School children participating in a local waste collection drive"
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Image 2 */}
            <div className="group overflow-hidden rounded-2xl">
              <img
                src={environment01}
                alt="A newly planted native sapling being watered"
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Image 3 */}
            <div className="group overflow-hidden rounded-2xl">
              <img
                src={environment03}
                alt="Community members learning about compost and recycling"
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}
      <section className="section bg-emerald-50">
        <div className="container">
          <SectionTitle
            eyebrow="Our approach"
            title="From seed to shade"
          />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Number */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 font-serif text-lg font-bold text-white">
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
            ₹300 plants a tree and guarantees its first year of care.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/90 md:text-lg">
            Your 80G-eligible gift funds the sapling, organic manure, tools, and the dedicated community care required to ensure the tree thrives.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              to="/donate" variant="accent"
            >
              Plant a Tree
              <ArrowRight className="ml-2 inline-block h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

export default Environment;