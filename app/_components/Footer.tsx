export default function Footer() {
  return (
    <footer className="bg-green-900 pt-20 pb-8 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-14 border-b border-green-800 mb-8">

          {/* Brand — wide col */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-green-950">
                ♻️
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">BinBuddy</span>
            </div>
            <p className="text-sm text-green-300 leading-relaxed mb-8 max-w-sm">
              Empowering communities to protect the planet through smart waste
              management, recycling education, and sustainable living habits.
              Every small action counts.
            </p>

            {/* Eco pledge badge */}
            <div className="inline-flex items-center gap-3 bg-green-800/60 border border-green-700 rounded-2xl px-5 py-3">
              <span className="text-2xl">🌍</span>
              <div>
                <div className="text-xs font-bold text-white">Our Eco Pledge</div>
                <div className="text-xs text-green-400">Carbon-neutral & community-driven</div>
              </div>
            </div>
          </div>

          {/* Spacer */}
          <div className="md:col-span-1" />

          {/* Explore */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold tracking-widest uppercase text-white mb-6">Explore</h4>
            <ul className="space-y-3.5">
              {[
                { label: "Home", href: "/" },
                { label: "Recycling Guide", href: "/recycling-guide" },
                { label: "Community", href: "/community" },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-sm text-green-300 hover:text-white transition-colors no-underline flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-green-600 group-hover:bg-green-400 transition-colors" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold tracking-widest uppercase text-white mb-6">Account</h4>
            <ul className="space-y-3.5">
              {[
                { label: "Sign In", href: "/login" },
                { label: "Register", href: "/register" },
                { label: "Dashboard", href: "/user/dashboard" },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-sm text-green-300 hover:text-white transition-colors no-underline flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-green-600 group-hover:bg-green-400 transition-colors" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Eco Facts */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold tracking-widest uppercase text-white mb-6">Eco Facts</h4>
            <div className="space-y-4">
              {[
                { fact: "Recycling 1 can saves energy to power a TV for 3 hours.", icon: "⚡" },
                { fact: "Only 9% of all plastic ever made has been recycled.", icon: "♻️" },
                { fact: "Composting cuts methane from landfills significantly.", icon: "🌱" },
              ].map((item) => (
                <div key={item.fact} className="flex gap-2.5">
                  <span className="text-sm flex-shrink-0">{item.icon}</span>
                  <p className="text-xs text-green-400 leading-relaxed">{item.fact}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Newsletter strip */}
        <div className="bg-green-800/50 border border-green-700 rounded-2xl px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div>
            <p className="text-sm font-bold text-white mb-0.5">Stay in the loop 🌿</p>
            <p className="text-xs text-green-400">Get weekly eco tips and community updates.</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-green-600">
          <p>© {new Date().getFullYear()} BinBuddy. All rights reserved.</p>
          <p>Built with 🌱 for a greener future.</p>
        </div>

      </div>
    </footer>
  );
}