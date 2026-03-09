import Link from "next/link";

const pillars = [
  {
    icon: "🗣️",
    title: "Communicate",
    desc: "Share waste tips, ask questions, and connect with eco-conscious people in your area.",
    link: "#",
    dot: "bg-green-400",
    bar: "from-green-500 to-green-300",
    bg: "bg-green-50",
    text: "text-green-600",
  },
  {
    icon: "🤝",
    title: "Collaborate",
    desc: "Work together to identify local waste problems and find the best solutions as a team.",
    link: "#",
    dot: "bg-emerald-400",
    bar: "from-emerald-500 to-emerald-300",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  {
    icon: "⚡",
    title: "Activate",
    desc: "Turn knowledge into action. Use shared resources to drive real environmental change.",
    link: "#",
    dot: "bg-teal-400",
    bar: "from-teal-500 to-teal-300",
    bg: "bg-teal-50",
    text: "text-teal-600",
  },
];

const stats = [
  { label: "Active Members", value: "12,400+", icon: "👥" },
  { label: "Waste Sorted", value: "38 tons", icon: "♻️" },
  { label: "Tips Shared", value: "2,800+", icon: "💡" },
  { label: "Communities", value: "50+", icon: "🌍" },
];

const impacts = [
  { title: "Reduce Landfill Waste", desc: "Every sorted item keeps trash out of overflowing landfills and protects soil and water.", icon: "🗑️", dot: "bg-orange-400", bar: "from-orange-500 to-orange-300", bg: "bg-orange-50", text: "text-orange-600", tip: "Even 1kg less landfill waste per week makes a yearly difference." },
  { title: "Protect Local Nature", desc: "Proper disposal prevents chemicals from seeping into rivers, parks, and green spaces.", icon: "🌿", dot: "bg-green-400", bar: "from-green-500 to-green-300", bg: "bg-green-50", text: "text-green-600", tip: "Clean communities attract wildlife and healthier ecosystems." },
  { title: "Inspire Your Neighbours", desc: "When your community sees you act, they follow. One person sparks a movement.", icon: "🏘️", dot: "bg-emerald-400", bar: "from-emerald-500 to-emerald-300", bg: "bg-emerald-50", text: "text-emerald-600", tip: "Communities that act together reduce waste 3x faster." },
  { title: "Build a Green Legacy", desc: "The habits you build today shape the environment your children will inherit tomorrow.", icon: "🌱", dot: "bg-teal-400", bar: "from-teal-500 to-teal-300", bg: "bg-teal-50", text: "text-teal-600", tip: "Sustainable habits compound — the earlier you start, the bigger the impact." },
];

const roles = [
  { role: "Eco Starter", desc: "Learn the basics of waste sorting and recycling.", icon: "🌱", points: "0–200 pts" },
  { role: "Green Advocate", desc: "Share tips and help others in the community.", icon: "📢", points: "200–600 pts" },
  { role: "Recycling Pro", desc: "Complete challenges and lead local initiatives.", icon: "♻️", points: "600–1000 pts" },
  { role: "Eco Champion", desc: "Top contributor driving real community change.", icon: "🏆", points: "1000+ pts" },
];

export default function CommunityPage() {
  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim-fade-up {
          opacity: 0;
          animation: fadeUp 0.6s ease forwards;
        }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.25s; }
        .delay-3 { animation-delay: 0.4s; }
        .delay-4 { animation-delay: 0.5s; }
        .delay-5 { animation-delay: 0.6s; }
        .delay-6 { animation-delay: 0.7s; }
        .delay-7 { animation-delay: 0.8s; }
      `}</style>

      <section className="bg-white min-h-screen px-6 lg:px-16 py-20 max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="text-center mb-20">
          <div className="anim-fade-up delay-1 inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide">
            🌍 Collaborating for a cleaner planet
          </div>
          <h1 className="anim-fade-up delay-2 text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-5">
            Together We Make a{" "}
            <span className="text-green-600 relative inline-block">
              Difference
              <span className="absolute bottom-1 left-0 w-full h-2 bg-green-200/60 rounded-sm -z-10" />
            </span>
          </h1>
          <p className="anim-fade-up delay-3 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Join a growing movement of eco-conscious people communicating,
            collaborating, and activating change — one community at a time.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="anim-fade-up delay-3 grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {pillars.map((p) => (
            <div key={p.title} className="group p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:shadow-gray-100 hover:-translate-y-1 transition-all duration-200 relative overflow-hidden">
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${p.bar} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className={`w-14 h-14 ${p.bg} rounded-2xl flex items-center justify-center text-2xl mb-5`}>
                {p.icon}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">{p.title}</h2>
              <ul className="space-y-2.5 mb-5">
                <li className="flex items-center gap-2.5 text-sm text-gray-600">
                  <span className={`w-1.5 h-1.5 rounded-full ${p.dot} flex-shrink-0`} />
                  {p.desc}
                </li>
              </ul>
              <a href={p.link} className={`text-xs font-medium ${p.text} ${p.bg} px-3 py-2 rounded-lg inline-block`}>
                💡 Learn more details...
              </a>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="anim-fade-up delay-4 grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="group p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:shadow-gray-100 hover:-translate-y-1 transition-all duration-200 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-green-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-extrabold text-gray-900 tracking-tight">{stat.value}</div>
              <div className="text-xs text-gray-400 font-medium mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Why It Matters */}
        <div className="anim-fade-up delay-4 mb-10">
          <div className="text-center mb-8">
            <span className="text-xs font-bold tracking-widest uppercase text-green-600 block mb-2">Why It Matters</span>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Your Actions Create Real Impact
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {impacts.map((item) => (
              <div key={item.title} className="group p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:shadow-gray-100 hover:-translate-y-1 transition-all duration-200 relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${item.bar} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center text-2xl mb-5`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">{item.title}</h3>
                <ul className="space-y-2.5 mb-5">
                  <li className="flex items-center gap-2.5 text-sm text-gray-600">
                    <span className={`w-1.5 h-1.5 rounded-full ${item.dot} flex-shrink-0`} />
                    {item.desc}
                  </li>
                </ul>
                <p className={`text-xs font-medium ${item.text} ${item.bg} px-3 py-2 rounded-lg inline-block`}>
                  💡 {item.tip}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Play Your Role */}
        <div className="anim-fade-up delay-5 mb-10">
          <div className="text-center mb-8">
            <span className="text-xs font-bold tracking-widest uppercase text-green-600 block mb-2">Earn Your Place</span>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Play Your Role in the Community
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {roles.map((r, i) => (
              <div key={r.role} className="group p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:shadow-gray-100 hover:-translate-y-1 transition-all duration-200 relative overflow-hidden text-center">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto">
                  {r.icon}
                </div>
                <div className="text-xs font-bold text-green-600 mb-1">Level {i + 1}</div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">{r.role}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">{r.desc}</p>
                <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">{r.points}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="anim-fade-up delay-7 text-center mt-20 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-14">
          <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
            Set Up Your Community Today
          </h3>
          <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">
            Create your free account and start playing your role in building a cleaner, greener world.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-200 no-underline"
            >
              Join the Community →
            </Link>
            <Link
              href="/recycling-guide"
              className="inline-flex items-center gap-2 bg-white hover:bg-green-50 border border-gray-200 hover:border-green-400 text-gray-700 hover:text-green-700 font-medium px-8 py-3.5 rounded-xl text-base transition-all no-underline"
            >
              Explore Recycling Guide
            </Link>
          </div>
        </div>

      </section>
    </>
  );
}