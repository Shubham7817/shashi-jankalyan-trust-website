import React, { useState, useEffect } from "react";
import SEO from "../components/common/SEO";
import Hero from "../components/sections/Hero";
import ImpactCounter from "../components/common/ImpactCounter";
import SectionTitle from "../components/ui/SectionTitle";
import TestimonialCard from "../components/common/TestimonialCard";
import TransparencySection from "../components/sections/TransparencySection";
import Button from "../components/ui/Button";
import { homeStats } from "../data/impact";
import { testimonials } from "../data/testimonials";
import { Link } from "react-router-dom";


// Images
import agriculture from "../assets/image/agriculture/soil-testing-lab.avif";
import awareness from "../assets/image/awareness program/community-temple-01.avif"
import kanyavivah from "../assets/image/kanya-vivah indoor/kanya-vivah-indoor.avif"
import womenskill from "../assets/image/women-skill-empowerment/womenskill.avif"
import shg from "../assets/image/shg/shg.jpg"

export default function Home() {
  // 1. Setup state aligning perfectly with the 6 backend fields
  const [dynamicStats, setDynamicStats] = useState({
    education: "3+",
    health: "5+",
    awareness: "45+",
    livelihood: "48+",
    womenEmpowerment: "353+",
    shgCount: "11+",
    environment: "0+",
  });

  // 2. Fetch real-time numbers on load
  useEffect(() => {
    const fetchRealTimeStats = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/public/stats`);
        if (response.ok) {
          const data = await response.json();
          // Update state with fetched data, appending a '+' to show ongoing impact
          setDynamicStats({
            education: `${data.education || 0}+`,
            health: `${data.health || 0}+`,
            awareness: `${data.awareness || 0}+`,
            livelihood: `${data.kanyaVivah || 0}+`, // Mapped to Livelihood in the backend
            womenEmpowerment: `${data.womenTrained || 0}+`, // Mapped to Women Empowerment in the backend
            shgCount: `${data.shgCount || 0} Active`,
            environment: `${data.environment || 0}+`,
          });
        }
      } catch (error) {
        console.error("Failed to fetch live stats, using fallback defaults.", error);
      }
    };

    fetchRealTimeStats();
  }, []);

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
          <SectionTitle
            eyebrow="Our Programs"
            title="What we do"
          />
          <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-600">
            Six grassroots programs across Sheikhpura district designed to uplift and empower local communities through sustainable action.
          </p>

          {/* Grid updated to 3 columns on large screens to perfectly fit the 6 categories */}
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Education",
                description: "Empowering the next generation through quality education and learning support.",
                image: awareness, // Note: Swap with an education-specific image later
                stat: dynamicStats.education,
                statLabel: "students supported",
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
                title: "Health",
                description: "Providing essential healthcare access, medical camps, and nutritional support.",
                image: kanyavivah, // Note: Swap with a health-specific image later
                stat: dynamicStats.health,
                statLabel: "individuals treated",
              },
              {
                title: "Awareness",
                description: "Community meetings on rights, child marriage, and agricultural awareness.",
                image: awareness,
                stat: dynamicStats.awareness,
                statLabel: "outreach participants",
              },
              {
                title: "Livelihood",
                description: "Supporting families with sustainable income generation and agricultural guidance.",
                image: agriculture,
                stat: dynamicStats.livelihood,
                statLabel: "families supported",
              },
              {
                title: "Women Empowerment",
                description: "Vocational training that gives women in rural Bihar an income skill.",
                image: womenskill,
                stat: dynamicStats.womenEmpowerment,
                statLabel: "women trained",
              },
              {
                title: "Environment",
                description: "Promoting environmental conservation and sustainable practices in rural communities.",
                image: agriculture,
                stat: dynamicStats.environment,
                statLabel: "communities engaged",
              },
              {
                title: "Self-Help Group (SHG)",
                description: "Supporting women through savings, financial awareness, livelihood activities, and collective decision-making.",
                image: shg,
                stat: dynamicStats.shgCount, 
                statLabel: "SHG members registered",
              },
            ].map((program) => (
              <div
                key={program.title}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 flex flex-col h-[calc(100%-12rem)]">
                  <h3 className="font-serif text-xl font-bold leading-7 text-gray-900">
                    {program.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-gray-600 flex-grow">
                    {program.description}
                  </p>
                  <div className="my-5 h-px bg-gray-200 w-full" />
                  <div className="flex items-end justify-between gap-4">
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
                    <Link
                      to="/our-work"
                      className="group/link flex shrink-0 items-center gap-2 text-sm font-bold text-rose-600 transition-colors hover:text-rose-700"
                    >
                      <span className="flex flex-col leading-4">
                        Learn<br />more
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button to="/our-work" className="mt-10">
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