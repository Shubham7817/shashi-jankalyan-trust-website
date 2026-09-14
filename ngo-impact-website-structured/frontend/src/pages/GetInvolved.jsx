import SEO from "../components/common/SEO";
import PageHero from "../components/common/PageHero";
import VolunteerForm from "../components/forms/VolunteerForm";
import SectionTitle from "../components/ui/SectionTitle";
import Button from "../components/ui/Button";
export default function GetInvolved() {
  return (
    <>
      <SEO
        title="Get Involved"
        description="Volunteer partner and fundraise."
      />
      <PageHero
        title="Get Involved"
        subtitle="Give your time, skills and support."
      />
      <section className="section">
        <div className="container grid gap-10 lg:grid-cols-2">

          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center gap-3 bg-green-800 px-7 py-6 text-white">

              <h2 className="text-2xl font-bold">
                Become a Volunteer
              </h2>
            </div>
            <VolunteerForm />
          </div>
          <div>
            <SectionTitle title="Partner With Us" />
            {[
              "Corporate partnerships",
              "Institutional partnerships",
              "Community partnerships",
              "Fundraise for us",
            ].map((x) => (
              <div className="card mb-4 p-5" key={x}>
                <h2 className="font-bold">{x}</h2>
                <p className="mt-2">
                  Explore meaningful collaboration.
                </p>
                <Button to="/contact"  className="mt-3">
                  Contact Us
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
