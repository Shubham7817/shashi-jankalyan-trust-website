import SEO from "../components/common/SEO";
import PageHero from "../components/common/PageHero";
import SectionTitle from "../components/ui/SectionTitle";
import TransparencySection from "../components/sections/TransparencySection";
import govtLiaison from "../assets/image/gallery/govt-liaison-01.jpg.avif";

export default function About() {
  const values = [
    "Integrity",
    "Compassion",
    "Inclusion",
    "Accountability",
    "Sustainability",
    "Community Collaboration",
  ];

  const governingBoard = [
    {
      initials: "VD",
      name: "Vinita Devi",
      role: "SECRETARY",
      description: "Authorized signatory · leads operations",
      highlight: true,
    },
    {
      initials: "SB",
      name: "Shashi Bhushan Kumar",
      role: "PRESIDENT",
      description: "Founding trustee",
      highlight: false,
    },
    {
      initials: "GK",
      name: "Govinda Kumar",
      role: "TREASURER",
      description: "Accounts & compliance",
      highlight: false,
    },
    {
      initials: "MD",
      name: "Manorama Devi",
      role: "MEMBER",
      description: "Governing council",
      highlight: false,
    },
    {
      initials: "PD",
      name: "Priyanka Devi",
      role: "MEMBER",
      description: "Governing council",
      highlight: false,
    },
  ];

  return (
    <>
      {/* SEO */}
      <SEO
        title="About Us"
        description="Learn about Shashi Jan Kalyan Trust, our mission, vision, values and commitment to community development."
      />

      {/* Page Hero */}
      <PageHero
        title="About Us"
        subtitle="Shashi Jan Kalyan Trust began in Barbigha, Sheikhpura district, with a simple observation: too many families in the villages around Dinkar Nagar were making impossible choices — pulling a daughter out of school, borrowing at ruinous rates to marry her off, or planting a season's crop on guesswork because no one could tell them what their own soil needed.

In January 2020, the trust was formally registered to answer those problems directly, one household at a time. What started with a handful of women learning to stitch and embroider for income grew, over the years since, into four connected programmes — skill training, household support at the time of a daughter's marriage, a village soil-testing laboratory, and community awareness work — each run by people from the villages they serve.

The trust is still young, and this story is still being written. As more of it is documented and verified, this page will grow with it."
      />

      {/* Who We Are / Mission */}
      <section className="section">
        <div className="container grid gap-8 md:grid-cols-2">
          {/* Who We Are */}
          <div>
            <SectionTitle
              eyebrow="Who we are"
              title="Working alongside communities"
            />

            <p>
              None of this is complicated work. It is done by people who live
              here, for neighbours they know by name, in places that rarely
              appear on anyone's map. What we can promise is that the child
              stays in school, the training is real, the support reaches the
              household it was meant for, and the soil report is accurate. We
              have kept our registrations current since 2020 because the
              families we work with deserve an organisation that can be
              checked.
            </p>
          </div>

          {/* Mission */}
          <div className="card p-7">
            <h2 className="text-2xl font-bold">Our Mission</h2>

            <p className="mt-3">
              We are a registered charitable trust working in rural Bihar, out
              of Barbigha. Our work starts with women, girls, and children, and
              it has grown outward from there: keeping children in school when
              the money runs short, skill training that leads to real earning,
              support for families at the time of a daughter's marriage, and
              soil testing for farmers who were guessing at what their land
              needed.
            </p>

            {/* Our Vision */}
            {/* 
            <h2 className="mt-6 text-2xl font-bold">
              Our Vision
            </h2>

            <p className="mt-3">
              A future where every community can thrive with dignity,
              opportunity and a healthy environment.
            </p>
            */}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section bg-white">
        <div className="container">
          <SectionTitle
            eyebrow="Our values"
            title="The principles behind our work"
          />

          <div className="grid gap-4 md:grid-cols-3">
            {values.map((value) => (
              <div className="card p-6" key={value}>
                <h3 className="text-xl font-bold">{value}</h3>

                <p className="mt-2 text-gray-600">
                  A practical commitment that guides decisions, partnerships
                  and program delivery.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Message From Director */}
      <section className="section bg-white">
        <div className="container grid gap-8 md:grid-cols-2">
          {/* Director Image */}
          <img
            className="h-96 w-full rounded-3xl object-cover object-center"
            src={govtLiaison}
            alt="Placeholder director portrait"
            style={{
              objectPosition: "50% 25%",
              transform: "scale(1)"}}
          />

          {/* Director Message */}
          <div>
            <SectionTitle
              eyebrow="Leadership"
              title="Message from the Director"
            />

            <h3 className="font-bold">Shashi Kumar — Director</h3>

            <p className="mt-4 text-gray-700">
              “Real progress begins when communities are treated
              as partners. Our responsibility is to listen, act transparently
              and keep learning.”
            </p>
          </div>
        </div>
      </section>

      {/* Governing Board */}
      <section className="section bg-white">
        <div className="container">
          {/* Governing Board Heading */}
          <div className="mb-10">
            <div className="flex items-center gap-5">
              <h2 className="font-serif text-4xl font-bold text-gray-900">
                Governing Board
              </h2>

              {/* Orange Divider */}
              <div className="h-px flex-1 bg-linear-to-r from-orange-400 to-transparent" />
            </div>

            <p className="mt-4 text-base text-gray-500">
              A women-led board, per the April 2024 Memorandum of the Trust.
            </p>
          </div>

          {/* Board Members */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {governingBoard.map((member) => (
              <div
                key={member.name}
                className="group rounded-2xl border border-gray-200 bg-white px-5 py-7 text-center transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
              >
                {/* Initials Circle */}
                <div
                  className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full font-serif text-2xl font-bold ${
                    member.highlight
                      ? "bg-rose-50 text-rose-700"
                      : "bg-gray-50 text-gray-600"
                  }`}
                >
                  {member.initials}
                </div>

                {/* Name */}
                <h3 className="mt-5 font-serif text-lg font-bold leading-7 text-gray-900">
                  {member.name}
                </h3>

                {/* Role */}
                <p
                  className={`mt-1 text-xs font-bold tracking-wider ${
                    member.highlight ? "text-rose-600" : "text-gray-500"
                  }`}
                >
                  {member.role}
                </p>

                {/* Description */}
                <p className="mt-2 text-sm leading-5 text-gray-500">
                  {member.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Transparency */}
      <TransparencySection />
    </>
  );
}