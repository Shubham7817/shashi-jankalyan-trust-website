import SEO from "../components/common/SEO";
import PageHero from "../components/common/PageHero";
import ImpactCounter from "../components/common/ImpactCounter";
import SectionTitle from "../components/ui/SectionTitle";
import TestimonialCard from "../components/common/TestimonialCard";
import { impactStats, allocation } from "../data/impact";
import { testimonials } from "../data/testimonials";
export default function Impact() {
  return (
    <>
      <SEO title="Impact" description="Measurable NGO impact." />
      <PageHero
        title="Our Impact"
        subtitle="People, communities and measurable progress."
      />
      <section className="section">
        <div className="container grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {impactStats.map(([value, label]) => (
            <ImpactCounter key={label} value={value} label={label} />
          ))}
        </div>
      </section>
      <section className="section bg-white">
        <div className="container">
          <SectionTitle title="Impact Distribution" />
          {allocation.map(([n, v]) => (
            <div className="mb-4" key={n}>
              <div className="flex justify-between">
                <span>{n}</span>
                <b>{v}%</b>
              </div>
              <div className="mt-1 h-4 rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-green-700"
                  style={{ width: v + "%" }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionTitle title="Beneficiary Testimonials" />
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((x) => (
              <TestimonialCard key={x.id} item={x} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
