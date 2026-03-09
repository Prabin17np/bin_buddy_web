import Link from "next/link";

const members = [
  { name: "Prabin Giri", role: "Eco Champion", points: 1240, avatar: "🧑‍🌿", joined: "Jan 2024" },
  { name: "Sita Rai", role: "Recycling Pro", points: 980, avatar: "👩‍🌾", joined: "Feb 2024" },
  { name: "Aman Thapa", role: "Green Starter", points: 760, avatar: "🧑‍💻", joined: "Mar 2024" },
  { name: "Nisha Karki", role: "Compost Expert", points: 650, avatar: "👩‍🔬", joined: "Apr 2024" },
];

const activities = [
  { user: "Prabin Giri", action: "sorted 3kg of recyclable waste", time: "2 hours ago", icon: "♻️" },
  { user: "Sita Rai", action: "shared a composting tip", time: "5 hours ago", icon: "🌱" },
  { user: "Aman Thapa", action: "completed Waste Sorting Guide", time: "Yesterday", icon: "✅" },
  { user: "Nisha Karki", action: "joined the community", time: "2 days ago", icon: "🎉" },
  { user: "Prabin Giri", action: "reported a hazardous waste site", time: "3 days ago", icon: "⚠️" },
];

const tips = [
  { title: "Always rinse before recycling", desc: "Food residue can contaminate an entire batch of recyclables.", icon: "♻️", color: "green" },
  { title: "Compost your food scraps", desc: "Up to 30% of household waste can be composted instead of landfilled.", icon: "🌱", color: "emerald" },
  { title: "Say no to single-use plastics", desc: "Bring reusable bags and bottles to cut down on plastic waste daily.", icon: "🌍", color: "teal" },
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
            🤝 Together we do more
          </div>
          <h1 className="anim-fade-up delay-2 text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-5">
            Our{" "}
            <span className="text-green-600 relative inline-block">
              Community
              <span className="absolute bottom-1 left-0 w-full h-2 bg-green-200/60 rounded-sm -z-10" />
            </span>
          </h1>
          <p className="anim-fade-up delay-3 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Join thousands of eco-conscious people sharing tips, tracking
            impact, and building a cleaner world — one action at a time.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="anim-fade-up delay-3 grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { label: "Active Members", value: "12,400+", icon: "👥" },
            { label: "Waste Sorted", value: "38 tons", icon: "♻️" },
            { label: "Tips Shared", value: "2,800+", icon: "💡" },
            { label: "Communities", value: "50+", icon: "🌍" },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-extrabold text-gray-900 tracking-tight">{stat.value}</div>
              <div className="text-xs text-gray-400 font-medium mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* Leaderboard */}
          <div className="anim-fade-up delay-4 lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl hover:shadow-gray-100 hover:-translate-y-1 transition-all duration-200 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-green-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h2 className="text-lg font-bold text-gray-900 mb-6 tracking-tight flex items-center gap-2">
              🏆 Top Contributors
            </h2>
            <div className="space-y-4">
              {members.map((member, i) => (
                <div key={member.name} className="flex items-center gap-4">
                  <span className={`text-sm font-bold w-6 text-center ${i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-orange-400" : "text-gray-300"}`}>
                    #{i + 1}
                  </span>
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                    {member.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900">{member.name}</div>
                    <div className="text-xs text-gray-400">{member.role}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-600">{member.points}</div>
                    <div className="text-xs text-gray-400">pts</div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-400 rounded-full"
                      style={{ width: `${(member.points / 1240) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="anim-fade-up delay-5 bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl hover:shadow-gray-100 hover:-translate-y-1 transition-all duration-200 relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            <h2 className="text-lg font-bold text-gray-900 mb-6 tracking-tight">
              🕐 Recent Activity
            </h2>
            <div className="space-y-5">
              {activities.map((activity, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                    {activity.icon}
                  </div>
                  <div>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      <span className="font-semibold text-gray-900">{activity.user}</span>{" "}
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Community Tips */}
        <div className="anim-fade-up delay-5 mb-6">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-5">
            💡 Community Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tips.map((tip) => (
              <div
                key={tip.title}
                className={`group p-7 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:shadow-gray-100 hover:-translate-y-1 transition-all duration-200 relative overflow-hidden`}
              >
                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${
                  tip.color === "green" ? "from-green-500 to-green-300" :
                  tip.color === "emerald" ? "from-emerald-500 to-emerald-300" :
                  "from-teal-500 to-teal-300"
                } opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4 ${
                  tip.color === "green" ? "bg-green-50" :
                  tip.color === "emerald" ? "bg-emerald-50" :
                  "bg-teal-50"
                }`}>
                  {tip.icon}
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">{tip.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="anim-fade-up delay-7 text-center mt-16 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-14">
          <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
            Ready to Join the Movement?
          </h3>
          <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">
            Create your free account and start contributing to a cleaner, greener community today.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-200 no-underline"
          >
            Join BinBuddy Community →
          </Link>
        </div>

      </section>
    </>
  );
}