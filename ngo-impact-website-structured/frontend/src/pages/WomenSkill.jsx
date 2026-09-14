import React from 'react'
import SEO from "../components/common/SEO";
import SectionTitle from "../components/ui/SectionTitle";
import Button from "../components/ui/Button";
import PageHero from "../components/common/PageHero";

import {
  Check,
  ArrowRight,
  Scissors,
  Award,
  Home,
  Users,
} from "lucide-react";

import trainingSession03 from "../assets/image/women-skill-empowerment/img1.jpg";
import trainingSession05 from "../assets/image/women-skill-empowerment/img2.jpg";
import communityTemple from "../assets/image/women-skill-empowerment/img3.jpg";

const WomenSkill = () => {
     const benefits = [
    "Garment cutting, machine stitching, embroidery & finishing techniques",
    "A completion certificate recognising the skill acquired",
    "A path to home-based income and financial independence",
    "A supportive peer network of women from the same community",
  ];

  const stats = [
    {
      value: "352+",
      label: "Women trained in FY 2023-24",
    },
    {
      value: "5",
      label: "Batches of ~25 participants",
    },
    {
      value: "₹2,500",
      label: "Funds one woman's place",
    },
    {
      value: "2020",
      label: "Running since inception",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Enrol locally",
      description:
        "Women from nearby villages register through community referrals. No fees, no prerequisites.",
    },
    {
      number: "2",
      title: "Learn by doing",
      description:
        "Hands-on sessions on real machines and fabric, guided by experienced trainers over the batch.",
    },
    {
      number: "3",
      title: "Earn from home",
      description:
        "Graduates receive a certificate and begin taking in stitching work, building steady income.",
    },
  ];

  return (
    <>
    <SEO title="Our Work" description="NGO focus areas." />
    <PageHero
    title="Our Work"
    subtitle="Five connected focus areas designed around community priorities."
    />

     <section className="section bg-white">
        <div className="container">
          <div className="max-w-4xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-rose-600">
              Programme · Women's Empowerment
            </p>

            <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
              Women's Skill Development
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-600 md:text-xl">
              Teaching sewing, embroidery, tailoring and weaving to women in
              Sheikhpura — practical skills that convert directly into
              household income and independence.
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
                title="Skills that pay for themselves."
              />

              <p className="mt-6 text-base leading-7 text-gray-600">
                In batches of 20–25, women gather in our training room to learn
                garment cutting, machine stitching, and finishing. Sessions
                are hands-on and community-led — women teaching women, on the
                floor, at their own pace.
              </p>

              <p className="mt-5 text-base leading-7 text-gray-600">
                By the end of a batch, a participant can stitch and sell from
                home. Many go on to take in local orders, contributing real
                income to their families for the first time.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">
                  <Scissors className="h-4 w-4" />
                  Practical training
                </div>

                <div className="flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
                  <Home className="h-4 w-4" />
                  Home-based income
                </div>
              </div>
            </div>

            {/* Main Image */}
            <div className="overflow-hidden rounded-3xl shadow-xl">
              <img
                src={trainingSession03}
                alt="Women participating in a tailoring and skill development training session"
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
                title="What participants gain"
              />

              <div className="mt-7 space-y-5">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-50">
                      <Check className="h-4 w-4 text-rose-600" />
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
                  <p className="font-serif text-3xl font-bold text-rose-600">
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
                src={trainingSession05}
                alt="Women participating in a group skill training session"
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Image 2 */}
            <div className="group overflow-hidden rounded-2xl">
              <img
                src={communityTemple}
                alt="Community members participating in an awareness activity"
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            {/* Image 3 */}
            <div className="group overflow-hidden rounded-2xl">
              <img
                src={trainingSession03}
                alt="Women learning practical tailoring skills"
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>


          </div>
        </div>
      </section>

      {/* =========================================================
          HOW A BATCH WORKS
      ========================================================= */}
      <section className="section bg-rose-50">
        <div className="container">
          <SectionTitle
            eyebrow="From enrolment to income"
            title="How a batch works"
          />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Number */}
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-600 font-serif text-lg font-bold text-white">
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
            ₹2,500 puts one woman through a full batch.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/90 md:text-lg">
            Your 80G-eligible gift funds materials, a trainer's time, and a
            place for a woman who wants to earn her own income.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              to="/donate" variant="accent"
            >
              Fund a place
              <ArrowRight className="ml-2 inline-block h-4 w-4" />
            </Button>

          </div>
        </div>
      </section>
    </>
  )
}

export default WomenSkill
