import { Forward, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  return (
    <main>
      {/* Hero Section Container */}
      <div className="relative h-[calc(100vh-88px)] w-full">
        <Image
          src="/images/hero.png" // The path starts from the 'public' folder
          alt="A vibrant display of products available at the store."
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 " />

        <div className="relative z-10 flex h-full flex-col justify-center text-white container px-8 md:px-14">
          <div>
            <h1 className="text-5xl md:text-[80px] font-bold">
              Next-Gen <br />
              Mobility
            </h1>
            <p className="text-[14px] font-bold mt-4">
              Power, performance, and style - experience the future of
              smartphones today.
            </p>
          </div>
          <button className="mt-8 bg-white text-black font-semibold text-sm px-6 py-3  w-[150px] h-[47px] hover:bg-[#01589a] hover:text-white transition-colors flex items-center justify-center">
            Shop Now
            <ChevronRight className="inline-block mr-2 w-5 h-5" />
          </button>
        </div>
      </div>

      {/* You can add more page content below the hero section */}

      {/* Top trending product */}
      <div className="container mx-auto py-16 text-center">
        <h2 className="text-3xl font-bold">More Content Here</h2>
      </div>
    </main>
  );
}
