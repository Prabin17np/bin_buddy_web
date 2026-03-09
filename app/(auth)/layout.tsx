import { Playfair_Display, Inter } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
});

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} min-h-screen bg-[#FCEEEE] flex items-center justify-center px-6`}>
      
      {/* Background Blobs */}
      <div className="absolute top-10 left-10 w-60 h-60 bg-green-200 opacity-30 blur-3xl rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-60 h-60 bg-green-300 opacity-30 blur-3xl rounded-full"></div>

      <div className="relative w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
