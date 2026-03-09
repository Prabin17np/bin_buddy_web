import Image from "next/image";
import Link from "next/link";

export default function LandingMain() {
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
        .delay-4 { animation-delay: 0.55s; }
        .delay-5 { animation-delay: 0.7s; }
      `}</style>

      <section className="relative bg-white min-h-[calc(100vh-72px)] flex items-center overflow-hidden">

        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-100/50 rounded-full blur-3xl -translate-y-1/4 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-50/60 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 py-16 w-full flex flex-col lg:flex-row items-center justify-between gap-16">

          {/* Text */}
          <div className="flex-1 max-w-xl">

            {/* Badge */}
            <div className="anim-fade-up delay-1 inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-7 tracking-wide">
              🌱 Eco-smart waste management
            </div>

            {/* Heading */}
            <h1 className="anim-fade-up delay-2 text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-gray-900 mb-6">
              Protect our planet by managing{" "}
              <span className="text-green-600 relative inline-block">
                waste wisely
                <span className="absolute bottom-1 left-0 w-full h-2 bg-green-200/60 rounded-sm -z-10" />
              </span>
              .
            </h1>

            {/* Description */}
            <p className="anim-fade-up delay-3 text-gray-500 text-lg leading-relaxed mb-10 max-w-lg">
              Learn how to sort waste correctly, reduce pollution, and adopt
              sustainable habits. BinBuddy empowers communities with knowledge
              and smart tools to create a cleaner, greener future.
            </p>

            {/* Buttons */}
            <div className="anim-fade-up delay-4 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold text-base px-7 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-green-200 no-underline"
              >
                Start Learning →
              </Link>
              <Link
                href="/recycling-guide"
                className="bg-white hover:bg-green-50 border border-gray-200 hover:border-green-400 text-gray-700 hover:text-green-700 font-medium text-base px-7 py-3.5 rounded-xl transition-all no-underline"
              >
                Recycling Guide
              </Link>
            </div>

            {/* Stats */}
            <div className="anim-fade-up delay-5 flex gap-8 mt-10 pt-8 border-t border-gray-100">
              <div>
                <div className="text-2xl font-bold text-gray-900 tracking-tight">12k+</div>
                <div className="text-xs text-gray-400 font-medium mt-0.5">Active Users</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 tracking-tight">98%</div>
                <div className="text-xs text-gray-400 font-medium mt-0.5">Sort Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 tracking-tight">40+</div>
                <div className="text-xs text-gray-400 font-medium mt-0.5">Waste Categories</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="anim-fade-up delay-3 relative flex-shrink-0">
            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/80">
              <Image
                src="/assets/images/waste.jpg"
                width={480}
                height={480}
                alt="Waste Management Illustration"
                className="object-cover w-[480px] h-[480px]"
              />
            </div>

            {/* Floating tag bottom-left */}
            <div className="absolute -bottom-4 -left-8 bg-white rounded-2xl px-4 py-2.5 shadow-lg flex items-center gap-2.5 text-sm font-semibold text-gray-800 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
              ♻️ 2.4 tons recycled today
            </div>

            {/* Floating tag top-right */}
            <div className="absolute -top-4 -right-8 bg-white rounded-2xl px-4 py-2.5 shadow-lg flex items-center gap-2.5 text-sm font-semibold text-gray-800 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
              🌍 50+ communities joined
            </div>
          </div>

        </div>
      </section>
    </>
  );
}