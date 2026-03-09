import Link from "next/link";

export default function RecyclingGuide() {
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
            🌍 Sort smarter, live greener
          </div>
          <h1 className="anim-fade-up delay-2 text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-5">
            Recycling{" "}
            <span className="text-green-600 relative inline-block">
              Guide
              <span className="absolute bottom-1 left-0 w-full h-2 bg-green-200/60 rounded-sm -z-10" />
            </span>
          </h1>
          <p className="anim-fade-up delay-3 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Learn how to sort waste correctly and protect the environment.
            Small actions make a big difference when we all work together.
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Recyclables */}
          <div className="anim-fade-up delay-3 group p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:shadow-gray-100 hover:-translate-y-1 transition-all duration-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-green-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-2xl mb-5">♻️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">Recyclable Waste</h2>
            <ul className="space-y-2.5 mb-5">
              {["Paper & cardboard", "Plastic bottles & containers", "Glass bottles & jars", "Aluminum & metal cans"].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-xs font-medium text-green-600 bg-green-50 px-3 py-2 rounded-lg inline-block">
              💡 Rinse containers before placing them in the recycling bin.
            </p>
          </div>

          {/* Organic Waste */}
          <div className="anim-fade-up delay-4 group p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:shadow-gray-100 hover:-translate-y-1 transition-all duration-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl mb-5">🌱</div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">Organic Waste</h2>
            <ul className="space-y-2.5 mb-5">
              {["Fruit & vegetable scraps", "Coffee grounds & tea bags", "Eggshells", "Yard waste"].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg inline-block">
              💡 Compost organic waste to enrich soil naturally.
            </p>
          </div>

          {/* Hazardous Waste */}
          <div className="anim-fade-up delay-5 group p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:shadow-gray-100 hover:-translate-y-1 transition-all duration-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-2xl mb-5">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">Hazardous Waste</h2>
            <ul className="space-y-2.5 mb-5">
              {["Batteries", "Electronics", "Paint & chemicals", "Medical waste"].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-xs font-medium text-orange-600 bg-orange-50 px-3 py-2 rounded-lg inline-block">
              💡 Dispose at authorized collection centers only.
            </p>
          </div>

          {/* General Waste */}
          <div className="anim-fade-up delay-6 group p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:shadow-gray-100 hover:-translate-y-1 transition-all duration-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-400 to-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl mb-5">🗑️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">General Waste</h2>
            <ul className="space-y-2.5 mb-5">
              {["Food wrappers", "Broken ceramics", "Sanitary waste", "Non-recyclable plastics"].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-xs font-medium text-gray-600 bg-gray-50 px-3 py-2 rounded-lg inline-block">
              💡 Reduce general waste by reusing and recycling whenever possible.
            </p>
          </div>

        </div>

        {/* CTA Section */}
        <div className="anim-fade-up delay-7 text-center mt-20 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-14">
          <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
            Ready to Make an Impact?
          </h3>
          <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">
            Join thousands of people already building better waste habits with BinBuddy.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-200 no-underline"
          >
            Start Your BinBuddy Journey →
          </Link>
        </div>

      </section>
    </>
  );
}