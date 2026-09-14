import SEO from "../components/common/SEO";
import Hero from "../components/sections/Hero";
import ImpactCounter from "../components/common/ImpactCounter";
import SectionTitle from "../components/ui/SectionTitle";
import TestimonialCard from "../components/common/TestimonialCard";
import TransparencySection from "../components/sections/TransparencySection";
import Button from "../components/ui/Button";
import { homeStats } from "../data/impact";
import { testimonials } from "../data/testimonials";
import { focusAreas } from "../data/focusAreas";
import { Link } from "react-router-dom";
import agriculture from "../assets/image/agriculture/soil-testing-lab.avif";
import awareness from "../assets/image/awareness program/community-temple-01.avif"
import kanyavivah from "../assets/image/kanya-vivah indoor/kanya-vivah-indoor.avif"
import womenskill from "../assets/image/women-skill-empowerment/womenskill.avif"
export default function Home() {
  return (
    <>
      <SEO title="Home" description="NGO social impact website." />
      <Hero />
      <section className="section">
        <div className="container grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {homeStats.map(([value, label]) => (
            <ImpactCounter key={label} value={value} label={label} />
          ))}
        </div>
      </section>


<section className="section bg-white">
  <div className="container">

    {/* Section Heading */}
    <SectionTitle
      eyebrow="Our Programs"
      title="What we do"
    />

    <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-600">
      Four grassroots programs across Sheikhpura district — training women,
      supporting families, testing soil, and building an informed community.
    </p>

    {/* Program Cards */}
    <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

      {[
        {
          title: "Women's Skill Development",
          description:
            "Vocational training that gives women in rural Bihar an income skill.",
          image: womenskill,
          stat: "352+",
          statLabel: "women trained, FY 2023-24",
        },
        {
          title: "Kanya Vivah Support",
          description:
            "Household essentials support for families, alongside anti-dowry awareness.",
          image: kanyavivah,
          stat: "50+",
          statLabel: "families supported since 2022",
        },
        {
          title: "Agriculture & Soil Health",
          description:
            "A village soil-testing laboratory giving farmers science-based crop guidance.",
          image: agriculture,
          stat: "1",
          statLabel: "soil lab · Sheikhpura district",
        },
        {
          title: "Awareness Campaigns",
          description:
            "Community meetings on rights, child marriage, and agricultural awareness.",
          image: awareness,
          stat: "District-wide",
          statLabel: "outreach across Sheikhpura",
        },
      ].map((program) => (
        <div
          key={program.title}
          className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >

          {/* Image */}
          <div className="h-48 overflow-hidden">
            <img
              src={program.image}
              alt={program.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Card Content */}
          <div className="p-6">

            {/* Title */}
            <h3 className="font-serif text-xl font-bold leading-7 text-gray-900">
              {program.title}
            </h3>

            {/* Description */}
            <p className="mt-3 min-h-18 text-base leading-7 text-gray-600">
              {program.description}
            </p>

            {/* Divider */}
            <div className="my-5 h-px bg-gray-200" />

            {/* Bottom Information */}
            <div className="flex items-end justify-between gap-4">

              {/* Statistic */}
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-serif text-2xl font-bold text-rose-600">
                    {program.stat}
                  </span>

                  <span className="text-sm text-gray-500">
                    {program.statLabel}
                  </span>
                </div>
              </div>

              {/* Learn More */}
              <a
                href="/our-work"
                className="group/link flex shrink-0 items-center gap-2 text-sm font-bold text-rose-600 transition-colors hover:text-rose-700"
              >
                <span>
                  Learn
                  <br />
                  more
                </span>

                <span className="text-xl transition-transform duration-300 group-hover/link:translate-x-1">
                  →
                </span>
              </a>

            </div>
          </div>
        </div>
      ))}

    </div>

    {/* Explore Button */}
    <Button to="/our-work" className="mt-8">
      Explore Our Work
    </Button>

  </div>
</section>


      <section className="section">
        <div className="container">
          <SectionTitle eyebrow="Stories" title="Voices from communities" />
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((x) => (
              <TestimonialCard key={x.id} item={x} />
            ))}
          </div>
        </div>
      </section>
      <TransparencySection />
        <section className="section bg-green-800 text-white">
        <div className="container flex flex-col text-black justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl text-white font-extrabold">
              A small contribution can support lasting change.
            </h2>
            <p className="mt-2 text-white">
              Choose how you want to stand with communities.
            </p>
          </div>
          <Button to="/donate" variant="accent">
            Support The Mission
          </Button>
        </div>
      </section>
    </>
  );
}
