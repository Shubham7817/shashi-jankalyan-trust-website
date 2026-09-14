import React from 'react'
import SEO from "../components/common/SEO";
import SectionTitle from "../components/ui/SectionTitle";
import Button from "../components/ui/Button";
import PageHero from "../components/common/PageHero";

import {
  Check,
  ArrowRight,
  Megaphone,
  Globe,
} from "lucide-react";

// Swap these out with your actual awareness-related image paths
import awareness01 from "../assets/image/awareness program/community-temple-01.avif";
import awareness02 from "../assets/image/awareness program/img1.jpg";
import awareness03 from "../assets/image/awareness program/img2.jpg";

const Awareness = () => {
  const benefits = [
    "Educating individuals within their locality about their rights, hygiene, and civic duties",
    "Connecting marginalized communities with vital government schemes and benefits",
    "Mobilizing collective action to tackle local social and environmental issues",
    "Empowering local leaders to sustain grassroots awareness campaigns independently",
  ];

  const stats = [
    {
      value: "10,000+",
      label: "Community members reached in FY 2023-24",
    },
    {
      value: "50+",
      label: "Awareness drives conducted",
    },
    {
      value: "₹1,000",
      label: "Funds a neighborhood awareness campaign",
    },
    {
      value: "2018",
      label: "Running since inception",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Locality Focus",
      description:
        "We identify specific issues affecting a local community—whether it's sanitation, child marriage, or lack of financial literacy.",
    },
    {
      number: "2",
      title: "Spread Awareness",
      description:
        "Through street plays, workshops, and door-to-door campaigns, we educate the public and break down complex information.",
    },
    {
      number: "3",
      title: "Drive Action",
      description:
        "Awareness is just the beginning. We guide the community to take actionable steps, like applying for schemes or organizing clean-ups.",
    },
  ];

  return (
    <>
      <SEO title="Awareness" description="Community awareness and action initiatives." />
      
      <PageHero
        title="Our Work"
        subtitle="Five connected focus areas designed around community priorities."
      />

      <section className="section bg-white">
        <div className="container">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
              Programme · Community Awareness
            </p>

            <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
              Grassroots Awareness & Action
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600 md:text-xl">
              Sparking meaningful change by educating communities, raising voices against social issues, and turning localized awareness into collective action.
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
                title="Change begins with a conversation."
              />

              <p className="mt-6 text-base leading-7 text-gray-600">
                A community cannot fix a problem it does not understand, nor can it utilize resources it does not know exist. Our awareness initiatives are designed to bring critical information directly to the people who need it most.
              </p>

              <p className="mt-5 text-base leading-7 text-gray-600">
                From public health and sanitation to women's rights and government welfare schemes, we deploy engaging, culturally relevant methods like street plays and localized workshops. Our ultimate goal is not just to inform, but to inspire communities to take decisive action to improve their own neighborhoods.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
                  <Megaphone className="h-4 w-4" />
                  Public Campaigns
                </div>

                <div className="flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700">
                  <Globe className="h-4 w-4" />
                  Civic Education
                </div>
              </div>
            </div>

            {/* Main Image */}
            <div className="overflow-hidden rounded-3xl shadow-xl">
              <img
                src={awareness01}
                alt="Volunteers conducting a community awareness session"
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
                title="The impact of awareness"
              />

              <div className="mt-7 space-y-5">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-50">
                      <Check className="h-4 w-4 text-indigo-600" />
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
                  <p className="font-serif text-3xl font-bold text-indigo-600">
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

            <div className="h-px flex-1 bg-linear-to-r from-indigo-400 to-transparent" />
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {/* Image 1 */}
            <div className="group overflow-hidden rounded-2xl">
              <img
                src={awareness02}
                alt="Community members gathering for a street play about social rights"
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Image 2 */}
            <div className="group overflow-hidden rounded-2xl">
              <img
                src={awareness01}
                alt="A local leader discussing civic duties with neighborhood residents"
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Image 3 */}
            <div className="group overflow-hidden rounded-2xl">
              <img
                src={awareness03}
                alt="Locals taking collective action to clean their environment"
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}
      <section className="section bg-indigo-50">
        <div className="container">
          <SectionTitle
            eyebrow="Our approach"
            title="From locality to action"
          />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Number */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-serif text-lg font-bold text-white">
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
            ₹1,000 funds a targeted neighborhood awareness drive.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/90 md:text-lg">
            Your 80G-eligible gift equips our volunteers with the materials and resources needed to mobilize communities and drive grassroots change.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              to="/donate" variant="accent"
            >
              Fund a Campaign
              <ArrowRight className="ml-2 inline-block h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

export default Awareness;