import React from 'react'
import SEO from "../components/common/SEO";
import SectionTitle from "../components/ui/SectionTitle";
import Button from "../components/ui/Button";
import PageHero from "../components/common/PageHero";

import {
  Check,
  ArrowRight,
  Users,
  Wallet,
} from "lucide-react";

// Swap these out with your actual SHG-related image paths
import shg01 from "../assets/image/shg/shg.jpg";
import shg02 from "../assets/image/shg/shg.jpg";
import shg03 from "../assets/image/shg/shg.jpg";

const SelfHelpGroups = () => {
  const benefits = [
    "Empowering rural women through financial literacy and micro-savings habits",
    "Facilitating direct bank linkages (via SBI) for secure, low-interest micro-loans",
    "Providing vocational training in tailoring, handicrafts, and local trades",
    "Fostering a supportive community network for social upliftment and leadership",
  ];

  const stats = [
    {
      value: "50+",
      label: "Active Self Help Groups formed",
    },
    {
      value: "500+",
      label: "Rural women financially empowered",
    },
    {
      value: "₹500",
      label: "Funds a month of vocational training",
    },
    {
      value: "100%",
      label: "Financial inclusion for members",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Mobilize & Form",
      description:
        "We identify marginalized women in rural Bihar and organize them into cooperative groups of 10-20 members based on shared socio-economic backgrounds.",
    },
    {
      number: "2",
      title: "Train & Save",
      description:
        "Members undergo financial literacy training and begin weekly micro-savings. We also impart practical vocational skills to help them generate independent income.",
    },
    {
      number: "3",
      title: "Bank Linkage & Credit",
      description:
        "Once a group demonstrates financial discipline, we link them with our banking partners (like SBI) to secure larger micro-loans for starting or expanding small enterprises.",
    },
  ];

  return (
    <>
      <SEO title="Self Help Groups" description="Women empowerment, microfinance, and Self Help Group (SHG) initiatives." />
      
      <PageHero
        title="Our Work"
        subtitle="Five connected focus areas designed around community priorities."
      />

      <section className="section bg-white">
        <div className="container">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">
              Programme · Women Empowerment
            </p>

            <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
              Self Help Groups (SHG)
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600 md:text-xl">
              Building financial independence and social confidence in rural women through micro-savings, skill development, and community-based enterprises.
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
                title="Empower a woman, uplift a village."
              />

              <p className="mt-6 text-base leading-7 text-gray-600">
                True community upliftment begins when women are financially independent and socially empowered. Our SHG program focuses on organizing rural women in Bihar into self-sustained financial groups where they can save, borrow, and grow together.
              </p>

              <p className="mt-5 text-base leading-7 text-gray-600">
                By partnering with established institutions like the State Bank of India, we facilitate crucial micro-savings and credit linkages. We go beyond basic finance by providing hands-on vocational training, enabling these women to start small businesses, support their children's education, and become influential decision-makers in their households.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                  <Wallet className="h-4 w-4" />
                  Financial Inclusion
                </div>

                <div className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
                  <Users className="h-4 w-4" />
                  Skill Development
                </div>
              </div>
            </div>

            {/* Main Image */}
            <div className="overflow-hidden rounded-3xl shadow-xl">
              <img
                src={shg01}
                alt="Rural women participating in a Self Help Group meeting"
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
                eyebrow="Socio-economic outcomes"
                title="The impact of financial independence"
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
                src={shg02}
                alt="Women receiving vocational training in tailoring"
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Image 2 */}
            <div className="group overflow-hidden rounded-2xl">
              <img
                src={shg01}
                alt="A weekly micro-savings collection meeting"
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Image 3 */}
            <div className="group overflow-hidden rounded-2xl">
              <img
                src={shg03}
                alt="SHG members opening bank accounts for their group"
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
            title="From savings to self-reliance"
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
            ₹500 sponsors a rural woman's vocational training for one month.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/90 md:text-lg">
            Your 80G-eligible contribution helps provide the training materials, expert instructors, and resources needed to help a woman start her own micro-enterprise.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              to="/donate" variant="accent"
            >
              Empower a Woman
              <ArrowRight className="ml-2 inline-block h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

export default SelfHelpGroups;