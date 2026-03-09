export default function LandingSecondary() {
  return (
    <section className="bg-gray-50 py-28 px-6 relative overflow-hidden">

      {/* Top border glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-green-300 to-transparent" />

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-green-600 mb-3 block">
            Why BinBuddy
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Learn. Act. Protect the Planet.
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed max-w-xl mx-auto">
            Our platform teaches responsible waste management and helps
            communities adopt sustainable habits for a cleaner, greener future.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

          {/* Card 1 */}
          <div className="group bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:shadow-gray-100 hover:-translate-y-1 transition-all duration-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-green-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-2xl mb-6">
              ♻️
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3 tracking-tight">
              Waste Sorting Guide
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              Learn how to separate recyclable, organic, and hazardous waste
              to dramatically reduce your environmental impact.
            </p>
            <a href="/recycling-guide" className="inline-flex items-center gap-1 text-sm font-semibold text-green-600 hover:gap-2 transition-all no-underline">
              Explore guide →
            </a>
          </div>

          {/* Card 2 */}
          <div className="group bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:shadow-gray-100 hover:-translate-y-1 transition-all duration-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500 to-teal-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-2xl mb-6">
              🌿
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3 tracking-tight">
              Smart Disposal Tips
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              Discover safe and responsible ways to dispose of different types
              of waste in your area with step-by-step guidance.
            </p>
            <a href="#" className="inline-flex items-center gap-1 text-sm font-semibold text-teal-600 hover:gap-2 transition-all no-underline">
              Learn more →
            </a>
          </div>

          {/* Card 3 */}
          <div className="group bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:shadow-gray-100 hover:-translate-y-1 transition-all duration-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl mb-6">
              🌍
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3 tracking-tight">
              Community Impact
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              Track your eco-friendly actions and see how small daily changes
              create a measurable environmental difference together.
            </p>
            <a href="#" className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:gap-2 transition-all no-underline">
              Join community →
            </a>
          </div>

        </div>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-10 text-center">
          <h3 className="text-2xl font-bold text-green-900 mb-2 tracking-tight">
            Ready to make a difference?
          </h3>
          <p className="text-green-700/70 text-sm mb-6">
            Join thousands of people already building better habits.
          </p>
          <a
            href="/register"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm px-7 py-3 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-200 no-underline"
          >
            Create Free Account →
          </a>
        </div>

      </div>
    </section>
  );
}